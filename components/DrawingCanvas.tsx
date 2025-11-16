
import React, { useRef, useState, useEffect, useCallback } from 'react';

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  className?: string;
  penColor?: string;
  lineWidth?: number;
  onDrawEnd?: (dataUrl: string) => void;
  // A ref to allow parent component to call methods on the canvas (e.g., clear)
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  width = 500,
  height = 500,
  className = '',
  penColor = '#333333',
  lineWidth = 5,
  onDrawEnd,
  canvasRef,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

  const getCanvasContext = useCallback(() => {
    const canvas = canvasRef.current;
    return canvas ? canvas.getContext('2d') : null;
  }, [canvasRef]);

  const clearCanvas = useCallback(() => {
    const ctx = getCanvasContext();
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      if (onDrawEnd) {
        onDrawEnd(''); // Clear parent's stored image data
      }
    }
  }, [getCanvasContext, canvasRef, onDrawEnd]);

  // Expose clearCanvas via ref for parent component
  useEffect(() => {
    if (canvasRef && 'current' in canvasRef && canvasRef.current) {
      // @ts-ignore - This is a common pattern to expose imperative methods
      canvasRef.current.clear = clearCanvas;
      // Initialize canvas dimensions
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }
  }, [canvasRef, clearCanvas, width, height]);

  const getCoordinates = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      return { x: 0, y: 0 };
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, [canvasRef]);

  const startDrawing = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    const ctx = getCanvasContext();
    if (ctx) {
      setIsDrawing(true);
      const { x, y } = getCoordinates(event);
      setLastPoint({ x, y });
      ctx.beginPath();
      ctx.moveTo(x, y);
      event.preventDefault(); // Prevent scrolling on touch devices
    }
  }, [getCoordinates, getCanvasContext]);

  const draw = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const ctx = getCanvasContext();
    if (ctx && lastPoint) {
      const { x, y } = getCoordinates(event);

      ctx.strokeStyle = penColor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineTo(x, y);
      ctx.stroke();

      setLastPoint({ x, y });
      event.preventDefault(); // Prevent scrolling on touch devices
    }
  }, [isDrawing, getCoordinates, getCanvasContext, lastPoint, penColor, lineWidth]);

  const finishDrawing = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      setLastPoint(null);
      const ctx = getCanvasContext();
      if (ctx) {
        ctx.closePath();
      }
      if (onDrawEnd && canvasRef.current) {
        onDrawEnd(canvasRef.current.toDataURL());
      }
    }
  }, [isDrawing, onDrawEnd, canvasRef, getCanvasContext]);


  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseLeave={finishDrawing}
      onMouseMove={draw}
      onTouchStart={startDrawing}
      onTouchEnd={finishDrawing}
      onTouchCancel={finishDrawing}
      onTouchMove={draw}
      className={`${className} border-2 border-dashed border-blue-400 dark:border-blue-600 rounded-md bg-white dark:bg-gray-700 cursor-crosshair touch-none`}
      aria-label="Khu vực vẽ chữ Hán"
    />
  );
};

export default DrawingCanvas;
