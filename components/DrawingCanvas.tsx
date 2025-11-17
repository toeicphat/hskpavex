import React, { useRef, useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';

interface StrokePart {
  x: number;
  y: number;
}

interface Stroke {
  parts: StrokePart[];
  color: string;
  lineWidth: number;
  isEraser: boolean;
}

// Define the API surface that the parent component will interact with
export interface DrawingCanvasApiRef {
  clear: () => void;
  undo: () => void;
  redo: () => void;
  setTool: (tool: 'pen' | 'eraser') => void;
}

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  className?: string;
  penColor?: string;
  lineWidth?: number;
  eraserWidth?: number;
  onDrawEnd?: (dataUrl: string) => void;
  initialTool?: 'pen' | 'eraser';
  fluid?: boolean; // New prop for fluid sizing
}

// Wrap the component with forwardRef
const DrawingCanvas = forwardRef<DrawingCanvasApiRef, DrawingCanvasProps>(({
  width: propWidth = 600, // Renamed to propWidth
  height: propHeight = 300, // Renamed to propHeight
  className = '',
  penColor = '#4299E1', // Default to blue-500
  lineWidth = 5,
  eraserWidth = 20, // Larger width for eraser
  onDrawEnd,
  initialTool = 'pen',
  fluid = false, // Default to false
}, ref) => { // `ref` here is the ref from the parent component
  const internalCanvasRef = useRef<HTMLCanvasElement>(null); // Internal ref for the DOM canvas element

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [tool, setTool] = useState<'pen' | 'eraser'>(initialTool);
  // State to track the active pointer (id and type) for better palm rejection and multi-input handling
  const [activePointer, setActivePointer] = useState<{ id: number; type: 'mouse' | 'pen' | 'touch' } | null>(null);

  // States to hold the actual canvas dimensions, especially for fluid mode
  // Initialize with propWidth/propHeight, will be updated by ResizeObserver in fluid mode
  const [canvasActualWidth, setCanvasActualWidth] = useState(propWidth);
  const [canvasActualHeight, setCanvasActualHeight] = useState(propHeight);

  // Ref to hold the requestAnimationFrame ID
  const animationFrameId = useRef<number | null>(null);

  const getCanvasContext = useCallback(() => {
    const canvas = internalCanvasRef.current; // Use internalCanvasRef here
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
    return ctx;
  }, []); // No external refs in dependencies

  const redrawAllStrokes = useCallback(() => {
    const ctx = getCanvasContext();
    const canvas = internalCanvasRef.current;
    if (ctx && canvas) {
      // Clear with actual canvas dimensions (which are updated via props or ResizeObserver)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const allStrokesToDraw = currentStroke ? [...strokes, currentStroke] : strokes;

      allStrokesToDraw.forEach(stroke => {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.lineWidth;
        // Use 'destination-out' for eraser to "erase" by drawing transparent
        ctx.globalCompositeOperation = stroke.isEraser ? 'destination-out' : 'source-over';
        
        ctx.beginPath();
        if (stroke.parts.length === 0) {
          // Nothing to draw
        } else if (stroke.parts.length === 1) {
          // A single point, draw a dot
          ctx.arc(stroke.parts[0].x, stroke.parts[0].y, stroke.lineWidth / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Draw smoothed line for 2 or more points using quadratic curves
          ctx.moveTo(stroke.parts[0].x, stroke.parts[0].y); // Start at the first point

          for (let i = 0; i < stroke.parts.length - 1; i++) {
            const p0 = stroke.parts[i];
            const p1 = stroke.parts[i + 1];

            const midX = (p0.x + p1.x) / 2;
            const midY = (p0.y + p1.y) / 2;

            // Draw a quadratic curve using p0 as the control point, ending at the midpoint
            ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
          }
          // After the loop, draw a straight line to the very last point
          // to ensure the stroke ends accurately where the pointer lifted.
          ctx.lineTo(stroke.parts[stroke.parts.length - 1].x, stroke.parts[stroke.parts.length - 1].y);
        }
        ctx.stroke();
      });
      // Reset to default for new drawings
      ctx.globalCompositeOperation = 'source-over';
    }
  }, [getCanvasContext, strokes, currentStroke]);

  // Effect to handle canvas dimensions and redraw when `fluid` prop or `propWidth`/`propHeight` changes
  useEffect(() => {
    const canvas = internalCanvasRef.current;
    if (!canvas) return;

    // Clear any pending animation frame before applying new dimensions
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    if (!fluid) {
      // In non-fluid mode, use props directly
      if (canvas.width !== propWidth || canvas.height !== propHeight) {
        canvas.width = propWidth;
        canvas.height = propHeight;
        setCanvasActualWidth(propWidth);
        setCanvasActualHeight(propHeight);
      }
      redrawAllStrokes();
    } else {
      // In fluid mode, initial render might set width/height to fill container via CSS
      // ResizeObserver will then set the actual attributes
      // Ensure initial redraw is called for current strokes on potential default CSS sizing.
      // The ResizeObserver will trigger the actual dimension updates later.
      redrawAllStrokes();
    }
  }, [propWidth, propHeight, fluid, redrawAllStrokes]);


  // ResizeObserver for fluid mode
  useEffect(() => {
    const canvas = internalCanvasRef.current;
    if (!canvas || !fluid) return;

    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === canvas) {
          const { width, height } = entry.contentRect;
          const roundedWidth = Math.round(width);
          const roundedHeight = Math.round(height);

          // Use requestAnimationFrame to defer DOM modifications and state updates
          // This helps prevent ResizeObserver loops.
          if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
          }

          animationFrameId.current = requestAnimationFrame(() => {
            // Only update canvas attributes if they have actually changed after rounding
            if (canvas.width !== roundedWidth || canvas.height !== roundedHeight) {
              canvas.width = roundedWidth;
              canvas.height = roundedHeight;
              setCanvasActualWidth(roundedWidth);
              setCanvasActualHeight(roundedHeight);
              redrawAllStrokes(); // Redraw after dimension change
            }
            animationFrameId.current = null; // Clear the ID once the frame is processed
          });
        }
      }
    });

    observer.observe(canvas);

    return () => {
      observer.unobserve(canvas);
      // Clean up any pending animation frame on unmount
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [fluid, redrawAllStrokes]); // Dependencies include `fluid` and `redrawAllStrokes`

  // Effect to call onDrawEnd when strokes change
  useEffect(() => {
    const canvas = internalCanvasRef.current; // Use internalCanvasRef
    if (onDrawEnd && canvas) {
      // Give a slight delay to ensure all drawing operations complete
      const timeout = setTimeout(() => {
        onDrawEnd(canvas.toDataURL());
      }, 50); // Small delay
      return () => clearTimeout(timeout);
    }
  }, [strokes, onDrawEnd]);


  // Function to fully reset drawing state (used internally and by imperative handle)
  const resetDrawingState = useCallback(() => {
    setIsDrawing(false);
    setLastPoint(null);
    setCurrentStroke(null);
    setActivePointer(null); // Clear active pointer
  }, []);

  // Expose methods to parent via the `ref` passed from `forwardRef`
  useImperativeHandle(ref, () => ({
    clear: () => {
      setStrokes([]);
      setRedoStack([]);
      const ctx = getCanvasContext();
      const canvas = internalCanvasRef.current; // Use internalCanvasRef
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvasActualWidth, canvasActualHeight); // Use actual dimensions
        if (onDrawEnd) onDrawEnd('');
      }
      resetDrawingState(); // Also reset drawing state
    },
    undo: () => {
      setStrokes(prevStrokes => {
        if (prevStrokes.length > 0) {
          const lastStroke = prevStrokes[prevStrokes.length - 1];
          setRedoStack(prevRedo => [...prevRedo, lastStroke]);
          return prevStrokes.slice(0, prevStrokes.length - 1);
        }
        return prevStrokes;
      });
    },
    redo: () => {
      setRedoStack(prevRedo => {
        if (prevRedo.length > 0) {
          const nextStroke = prevRedo[prevRedo.length - 1];
          setStrokes(prevStrokes => [...prevStrokes, nextStroke]);
          return prevRedo.slice(0, prevRedo.length - 1);
        }
        return prevRedo;
      });
    },
    setTool: (newTool: 'pen' | 'eraser') => {
      setTool(newTool);
    }
  }), [getCanvasContext, onDrawEnd, resetDrawingState, canvasActualWidth, canvasActualHeight]); // Dependencies for useImperativeHandle should be stable


  const getCoordinates = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = internalCanvasRef.current; // Use internalCanvasRef here
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = event.clientX;
    const clientY = event.clientY;

    // Scale coordinates to canvas resolution using *actual* canvas dimensions
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const finishDrawing = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    // Only finalize if the event corresponds to the active pointer
    if (activePointer !== null && activePointer.id === event.pointerId) {
      if (isDrawing && currentStroke) {
        setStrokes(prevStrokes => [...prevStrokes, currentStroke]);
        setRedoStack([]); // Clear redo stack on new stroke completion
      }
      resetDrawingState(); // Reset drawing state
    }
  }, [activePointer, isDrawing, currentStroke, resetDrawingState]);


  const startDrawing = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    // 1. Prevent right-click drawing
    if (event.button !== 0) { // 0 is left click, 2 is right click
      return;
    }

    // 2. Palm Rejection for Touch Events
    if (event.pointerType === 'touch') {
      const PALM_THRESHOLD_PX = 40; // Contact area width/height threshold for a palm
      const isLargeAreaTouch = (event.width > PALM_THRESHOLD_PX || event.height > PALM_THRESHOLD_PX);
      // For palm rejection, we primarily rely on the contact area size.
      // Pressure is less reliable for touch as many devices report a binary value (0 or 0.5/1).

      if (isLargeAreaTouch) {
        event.preventDefault(); // Prevent default browser actions like scrolling/zooming
        return; 
      }
    }

    // 3. Multi-pointer / Overlap Handling
    if (activePointer !== null) {
      // If a pen starts while another pointer is active, the pen takes precedence.
      // Otherwise, if any other pointer is active, ignore new pointers.
      // This prevents multiple fingers or a finger during active mouse/pen drawing.
      if (event.pointerType === 'pen' && activePointer.type !== 'pen') {
        // A pen is taking over. Finalize the previous stroke.
        finishDrawing(event); // Ensure previous stroke is finalized for the *old* pointer
      } else {
        // Another pointer is already active and not a pen overriding. Ignore this new event.
        event.preventDefault();
        return;
      }
    }

    // If we reach here, this pointer is allowed to start drawing
    setActivePointer({ id: event.pointerId, type: event.pointerType as 'mouse' | 'pen' | 'touch' });

    const ctx = getCanvasContext();
    if (ctx) {
      setIsDrawing(true);
      const { x, y } = getCoordinates(event);
      setLastPoint({ x, y });

      const newStroke: Stroke = {
        parts: [{ x, y }],
        color: tool === 'pen' ? penColor : 'rgba(0,0,0,1)', 
        lineWidth: tool === 'pen' ? lineWidth : eraserWidth,
        isEraser: tool === 'eraser',
      };
      setCurrentStroke(newStroke);
      
      // No need to beginPath and moveTo here, redrawAllStrokes will handle the initial rendering.
      // ctx.beginPath();
      // ctx.moveTo(x, y);
      
      event.preventDefault(); // Crucial for preventing scrolling/zooming on touch devices
    }
  }, [getCoordinates, getCanvasContext, tool, penColor, lineWidth, eraserWidth, activePointer, finishDrawing]);

  const draw = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    // Only draw if actively drawing and the event comes from the active pointer
    if (!isDrawing || !currentStroke || !lastPoint || activePointer?.id !== event.pointerId) return;

    const ctx = getCanvasContext();
    if (ctx) {
      const { x, y } = getCoordinates(event);

      // Add point to the current stroke data
      // redrawAllStrokes will be called due to setCurrentStroke state update
      setCurrentStroke(prev => prev ? { ...prev, parts: [...prev.parts, { x, y }] } : null);
      setLastPoint({ x, y });
      event.preventDefault();
    }
  }, [isDrawing, getCoordinates, getCanvasContext, currentStroke, lastPoint, activePointer]);


  return (
    <canvas
      ref={internalCanvasRef} // Use the internal ref here
      onPointerDown={startDrawing as React.PointerEventHandler<HTMLCanvasElement>} // Cast event handlers
      onPointerUp={finishDrawing as React.PointerEventHandler<HTMLCanvasElement>}
      onPointerLeave={finishDrawing as React.PointerEventHandler<HTMLCanvasElement>}
      onPointerMove={draw as React.PointerEventHandler<HTMLCanvasElement>}
      // Apply w-full h-full only if fluid is true, otherwise rely on external CSS/props for fixed size container.
      className={`${className} ${fluid ? 'w-full h-full' : ''} border-2 border-dashed border-blue-400 dark:border-blue-600 rounded-md bg-white dark:bg-gray-700 cursor-crosshair touch-none`}
      aria-label="Khu vực vẽ chữ Hán"
    />
  );
});

export default DrawingCanvas;