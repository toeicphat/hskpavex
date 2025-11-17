
import { HSKWord } from './types';

// Function to normalize pinyin for consistent sorting (e.g., remove tones)
const normalizePinyin = (pinyin: string): string => {
  // Simple normalization: remove tone numbers and diactritics (for basic alphabetical sort)
  return pinyin
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[0-9]/g, "")
    .toLowerCase()
    .trim();
};

const rawData = `1	哎	āi	thán từ
2	唉	āi	thán từ
3	爱护	ài hù	yêu thương, giữ gìn
4	爱惜	ài xī	quí trọng
5	爱心	ài xīn	lòng tốt
6	安装	ān zhuāng	lắp đặt
7	岸	àn	bờ
8	暗	àn	tối
9	熬夜	áo yè	thức đêm
10	把握	bǎ wò	nắm chắc
11	摆	bǎi	bày
12	办理	bàn lǐ	làm (thủ tục)
13	傍晚	bàng wǎn	chiều muộn
14	包裹	bāo guǒ	bưu kiện
15	包含	bāo hán	bao hàm
16	包括	bāo kuò	bao gồm
17	薄	báo	mỏng
18	宝贝	bǎo bèi	bảo bối
19	宝贵	bǎo guì	quí báu
20	保持	bǎo chí	duy trì
21	保留	bǎo liú	bảo lưu
22	保险	bǎo xiǎn	bảo hiểm
23	报到	bào dào	điểm danh
24	报道	bào dào	đưa tin, bản tin
25	报告	bào gào	báo cáo
26	报社	bào shè	tòa soạn báo
27	抱怨	bào yuàn	trách móc
28	背	bèi	học thuộc, cõng
29	悲观	bēi guān	bi quan
30	背景	bèi jǐng	bối cảnh
31	被子	bèi zi	chăn
32	本科	běn kē	trình độ đại học
33	本领	běn lǐng	bản lĩnh
34	本质	běn zhì	bản chất
35	比例	bǐ lì	tỉ lệ
36	彼此	bǐ cǐ	lẫn nhau, với nhau
37	必然	bì rán	tất yếu
38	必要	bì yào	cần thiết, cần
39	避免	bì miǎn	tránh
40	编辑	biān jí	biên tập
41	鞭炮	biān pào	pháo
42	便	biàn	liền
43	辩论	biàn lùn	biện luận
44	标点	biāo diǎn	dấu
45	标志	biāo zhì	đánh dấu, ký hiệu
46	表达	biǎo dá	diễn đạt
47	表面	biǎo miàn	bề mặt, bề ngoài
48	表明	biǎo míng	cho thấy
49	表情	biǎo qíng	biểu cảm
50	表现	biǎo xiàn	biểu hiện
51	冰淇淋	bīng qí lín	kem
52	病毒	bìng dú	vi rút
53	玻璃	bō lí	thủy tinh
54	播放	bō fàng	phát sóng
55	脖子	bó zi	cổ
56	博物馆	bó wù guǎn	bảo tàng
57	补充	bǔ chōng	bổ sung
58	不安	bú ān	bất an
59	不断	bú duàn	không ngừng
60	不见得	bú jiàn dé	chưa chắc
61	不耐烦	bú nài fán	chán nản, không kiên nhẫn
62	不然	bú rán	nếu không thì
63	不如	bú rú	không bằng
64	不要紧	bú yào jǐn	không quan trọng
65	不足	bú zú	không đủ
66	布	bù	vải
67	步骤	bù zhòu	bước
68	部门	bù mén	ban ngành, bộ phận
69	财产	cái chǎn	tài sản
70	采访	cǎi fǎng	phỏng vấn
71	采取	cǎi qǔ	chọn, dùng
72	彩虹	cǎi hóng	cầu vồng
73	踩	cǎi	giẫm
74	参考	cān kǎo	tham khảo
75	参与	cān yù	tham gia
76	惭愧	cán kuì	hổ thẹn
77	操场	cāo chǎng	sân vận động
78	操心	cāo xīn	lo lắng
79	册	cè	quyển, sổ
80	测验	cè yàn	thí nghiệm
81	曾经	céng jīng	đã từng
82	叉子	chā zi	cái dĩa, cái xiên, cái nĩa
83	差距	chā jù	sự khác biệt
84	插	chā	cắm, chèn
85	拆	chāi	gỡ, dỡ
86	产品	chǎn pǐn	sản phẩm
87	产生	chǎn shēng	sản sinh, nảy sinh
88	长途	cháng tú	đường dài
89	常识	cháng shí	kiến thức cơ bản
90	抄	chāo	chép
91	超级	chāo jí	siêu cấp, cực kỳ
92	朝	cháo	về hướng
93	潮湿	cháo shī	ẩm ướt
94	吵	chǎo	ồn ào
95	吵架	chǎo jià	cãi vã
96	炒	chǎo	xào
97	车库	chē kù	nhà xe
98	车厢	chē xiāng	toa tàu
99	彻底	chè dǐ	triệt để
100	沉默	chén mò	im lặng
101	趁	chèn	nhân
102	称	chēng	gọi là
103	称呼	chēng hū	xưng hô
104	称赞	chēng zàn	tán thưởng
105	成分	chéng fèn	thành phần
106	成果	chéng guǒ	thành quả
107	成就	chéng jiù	thành tựu
108	成立	chéng lì	thành lập
109	成人	chéng rén	người lớn
110	成熟	chéng shú	thành thục
111	成语	chéng yǔ	thành ngữ
112	成长	chéng zhǎng	trưởng thành
113	诚恳	chéng kěn	thành khẩn
114	承担	chéng dān	chịu trách nhiệm
115	承认	chéng rèn	thừa nhận
116	承受	chéng shòu	chịu đựng
117	程度	chéng dù	trình độ
118	程序	chéng xù	trình tự
119	吃亏	chī kuī	thiệt thòi
120	池塘	chí táng	ao hồ
121	迟早	chí zǎo	sớm muộn
122	持续	chí xù	kéo dài, tiêp tục
123	尺子	chǐ zi	thước đo
124	翅膀	chì bǎng	cánh
125	冲	chōng	xông, xô đẩy
126	充分	chōng fèn	đầy đủ
127	充满	chōng mǎn	tràn đầy
128	重复	chóng fù	lặp lại
129	宠物	chǒng wù	thú cưng
130	抽屉	chōu tì	ngăn kéo
131	抽象	chōu xiàng	trừu tượng
132	丑	chǒu	xấu
133	臭	chòu	thối
134	出版	chū bǎn	xuất bản
135	出口	chū kǒu	lối ra, cửa ra
136	出色	chū sè	xuất sắc
137	出示	chū shì	xuất trình
138	出席	chū xí	tham dự
139	初级	chū jí	sơ cấp
140	除非	chú fēi	trừ phi
141	除夕	chú xī	giao thừa
142	处理	chǔ lǐ	xử lý
143	传播	chuán bō	lan truyền, lây lan
144	传染	chuán rǎn	nhiễm
145	传说	chuán shuō	truyền thuyết
146	传统	chuán tǒng	truyền thống
147	窗帘	chuāng lián	rèm cửa
148	闯	chuǎng	xông vào, xông lên
149	创造	chuàng zào	sáng tạo
150	吹	chuī	thổi
151	词汇	cí huì	từ vựng
152	辞职	cí zhí	từ chức, bỏ việc
153	此外	cǐ wài	ngoài ra
154	次要	cì yào	thứ yếu
155	刺激	cì jī	kích thích
156	匆忙	cōng máng	vội vàng
157	从此	cóng cǐ	từ đó
158	从而	cóng ér	cho nên
159	从前	cóng qián	từ trước
160	从事	cóng shì	theo đuổi
161	粗糙	cū cāo	thô ráp
162	促进	cù jìn	xúc tiến
163	促使	cù shǐ	thúc đẩy
164	醋	cù	giấm
165	催	cuī	giục
166	存在	cún zài	tồn tại
167	措施	cuò shī	sách lược, chính sách
168	答应	dā yìng	hứa, đồng ý
169	达到	dá dào	đạt đến
170	打工	dǎ gōng	làm thêm
171	打交道	dǎ jiāo dào	kết bạn
172	打喷嚏	dǎ pēn tì	hắt xì
173	打听	dǎ tīng	hỏi thăm
174	大方	dà fāng	phóng khoáng
175	大厦	dà shà	tòa nhà
176	大象	dà xiàng	voi
177	大型	dà xíng	lớn (qui mô)
178	呆	dāi	ở lì, ở
179	代表	dài biǎo	đại diện
180	代替	dài tì	thay thế
181	贷款	dài kuǎn	vay tiền
182	待遇	dài yù	đãi ngộ
183	担任	dān rèn	đảm nhiệm
184	单纯	dān chún	đơn thuần,ngây thơ
185	单调	dān diào	đơn điệu
186	单独	dān dú	đơn độc
187	单位	dān wèi	đơn vị
188	单元	dān yuán	đơn nguyên, cụm
189	耽误	dān wù	bỏ lỡ
190	胆小鬼	dǎn xiǎo guǐ	kẻ nhát gan
191	淡	dàn	nhạt
192	当地	dāng dì	địa phương
193	当心	dāng xīn	để tâm, lưu tâm
194	挡	dǎng	chắn
195	导演	dǎo yǎn	đạo diễn
196	导致	dǎo zhì	gây ra
197	岛屿	dǎo yǔ	đảo
198	倒霉	dǎo méi	xui xẻo
199	到达	dào dá	đến
200	道德	dào dé	đạo đức
201	道理	dào lǐ	đạo lí, bài học
202	登记	dēng jì	đăng kí
203	等待	děng dài	đợi, chờ đợi
204	等于	děng yú	bằng
205	滴	dī	giọt
206	的确	dí què	đúng, thật (phó từ)
207	敌人	dí rén	kẻ địch
208	地道	dì dào	chuẩn bản địa (ngôn ngữ, món ăn)
209	地理	dì lǐ	địa lý
210	地区	dì qū	khu vực
211	地毯	dì tǎn	thảm
212	地位	dì wèi	địa vị
213	地震	dì zhèn	động đất
214	递	dì	truyền
215	点心	diǎn xīn	điểm tâm
216	电池	diàn chí	pin
217	电台	diàn tái	đài truyền hình
218	钓	diào	câu (cá)
219	顶	dǐng	đội, cái (lượng từ cho mũ)
220	动画片	dòng huà piàn	phim hoạt hình
221	冻	dòng	đông cứng
222	洞	dòng	hang động
223	豆腐	dòu fǔ	đậu phụ
224	逗	dòu	trêu
225	独立	dú lì	độc lập
226	独特	dú tè	độc đáo
227	度过	dù guò	trải qua (thời kì, thời gian)
228	断	duàn	đoạn, đứt
229	堆	duī	đống
230	对比	duì bǐ	đối chiếu
231	对待	duì dài	đối đãi
232	对方	duì fāng	đối phương
233	对手	duì shǒu	đối thủ
234	对象	duì xiàng	đối tượng
235	兑换	duì huàn	đổi
236	吨	dūn	tấn
237	蹲	dūn	ngồi xổm
238	顿	dùn	bữa
239	多亏	duō kuī	may mà
240	多余	duō yú	thừa thãi
241	朵	duǒ	bông
242	躲藏	duǒ cáng	trốn
243	恶劣	è liè	khắc nghiệt, hà khắc
244	耳环	ěr huán	khuyên tai
245	发表	fā biǎo	phát biểu, đăng, ra mắt (tác phẩm)
246	发愁	fā chóu	phát buồn, chán
247	发达	fā dá	phát đạt, phát triển
248	发抖	fā dǒu	run rẩy
249	发挥	fā huī	phát huy
250	发明	fā míng	phát minh
251	发票	fā piào	hóa đơn giá trị gia tăng
252	发言	fā yán	phát biểu (ý kiến)
253	罚款	fá kuǎn	phạt tiền
254	法院	fǎ yuàn	tòa án
255	翻	fān	lật, giở
256	繁荣	fán róng	phồn vinh
257	反而	fǎn ér	ngược lại
258	反复	fǎn fù	lặp đi lặp lại
259	反应	fǎn yìng	phản ứng
260	反映	fǎn yìng	phản ánh
261	反正	fǎn zhèng	dù sao thì
262	范围	fàn wéi	phạm vi
263	方	fāng	phương
264	方案	fāng àn	phương án
265	方式	fāng shì	phương thức
266	妨碍	fáng ài	trở ngại, cản trở
267	仿佛	fǎng fú	dường như
268	非	fēi	phi, không
269	肥皂	féi zào	bánh xà phòng
270	废话	fèi huà	lời nói thừa thãi
271	分别	fēn bié	phân biệt, lần lượt, xa nhau
272	分布	fēn bù	phân bố
273	分配	fēn pèi	chia sẻ, phân chia, phân công
274	分手	fēn shǒu	chia tay
275	分析	fēn xī	phân tích
276	纷纷	fēn fēn	lũ lượt
277	奋斗	fèn dòu	phấn đấu
278	风格	fēng gé	phong cách
279	风景	fēng jǐng	phong cảnh
280	风俗	fēng sú	phong tục
281	风险	fēng xiǎn	mạo hiểm, hiểm nguy
282	疯狂	fēng kuáng	điên rồ
283	讽刺	fěng cì	châm biếm
284	否定	fǒu dìng	phủ định
285	否认	fǒu rèn	phủ nhận
286	扶	fú	vịn
287	服装	fú zhuāng	phục trang, quần áo
288	幅	fú	bức (lượng từ cho tranh)
289	辅导	fǔ dǎo	phụ đạo, bổ trợ
290	妇女	fù nǚ	phụ nữ
291	复制	fù zhì	copy
292	改革	gǎi gé	cải cách
293	改进	gǎi jìn	cải tiến
294	改善	gǎi shàn	cải thiện
295	改正	gǎi zhèng	đính chính
296	盖	gài	đậy, bao phủ
297	概括	gài kuò	khái quát
298	概念	gài niàn	khái niệm
299	干脆	gān cuì	dứt khoát
300	干燥	gān zào	khô ráo, khô hanh
301	赶紧	gǎn jǐn	mau chóng
302	赶快	gǎn kuài	mau chóng
303	感激	gǎn jī	cảm kích, biết ơn
304	感受	gǎn shòu	cảm nhận
305	感想	gǎn xiǎng	cảm tưởng, suy nghĩ
306	干活儿	gàn huó ér	lao động
307	钢铁	gāng tiě	sắt thép
308	高档	gāo dàng	cao cấp, đẳng cấp
309	高级	gāo jí	cao cấp
310	搞	gǎo	làm
311	告别	gào bié	từ biệt
312	格外	gé wài	đặc biệt
313	隔壁	gé bì	sát vách, ngay cạnh
314	个别	gè bié	cá biệt
315	个人	gè rén	cá nhân
316	个性	gè xìng	cá tính
317	各自	gè zì	tự, mỗi
318	根	gēn	lượng từ: sợi, cành, khúc, ngón
319	根本	gēn běn	vốn
320	工厂	gōng chǎng	xưởng, xí nghiệp
321	工程师	gōng chéng shī	kỹ sư
322	工具	gōng jù	công cụ
323	工人	gōng rén	công nhân
324	工业	gōng yè	công nghiệp
325	公布	gōng bù	công bố
326	公开	gōng kāi	công khai
327	公平	gōng píng	công bằng
328	公寓	gōng yù	chung cư
329	公元	gōng yuán	công nguyên
330	公主	gōng zhǔ	công chúa
331	功能	gōng néng	công năng
332	恭喜	gōng xǐ	chúc mừng
333	贡献	gòng xiàn	cống hiến
334	沟通	gōu tōng	trao đổi, thấu hiểu
335	构成	gòu chéng	tạo thành, cấu thành
336	姑姑	gū gu	cô
337	姑娘	gū niang	cô gái
338	古代	gǔ dài	cổ đại
339	古典	gǔ diǎn	cổ điển
340	股票	gǔ piào	cổ phiếu
341	骨头	gǔ tou	xương
342	鼓舞	gǔ wǔ	cổ vũ
343	鼓掌	gǔ zhǎng	vỗ tay
344	固定	gù dìng	cố định
345	挂号	guà hào	xếp số
346	乖	guāi	ngoan
347	拐弯	guǎi wān	rẽ
348	怪不得	guài bù dé	chẳng trách
349	关闭	guān bì	đóng
350	观察	guān chá	quan sát
351	观点	guān diǎn	quan điểm
352	观念	guān niàn	quan niệm
353	官	guān	quan
354	管子	guǎn zi	cái ống
355	冠军	guàn jūn	quán quân
356	光滑	guāng huá	bóng mượt
357	光临	guāng lín	đến, có mặt
358	光明	guāng míng	quang minh, sáng sủa
359	光盘	guāng pán	đĩa CD, VCD,DVD
360	广场	guǎng chǎng	quảng trường
361	广大	guǎng dà	quảng đại, rộng lớn
362	广泛	guǎng fàn	rộng khắp
363	归纳	guī nà	tóm tắt
364	规矩	guī ju	qui tắc
365	规律	guī lǜ	qui luật
366	规模	guī mó	qui mô
367	规则	guī zé	nội qui
368	柜台	guì tái	quầy ba, quầy
369	滚	gǔn	cút, cuộn, lăn
370	锅	guō	nồi
371	国庆节	guó qìng jié	quốc khánh
372	国王	guó wáng	quốc vương
373	果然	guǒ rán	quả nhiên
374	果实	guǒ shí	quả thật
375	过分	guò fèn	quá đáng
376	过敏	guò mǐn	mẫn cảm, dị ứng
377	过期	guò qī	quá hạn
378	哈	hā	ha ha
379	海关	hǎi guān	hải quan
380	海鲜	hǎi xiān	hải sản
381	喊	hǎn	hét
382	行业	háng yè	ngành nghề
383	豪华	háo huá	sang trọng
384	好客	hào kè	hiếu khách
385	好奇	hào qí	hiếu kì
386	合法	hé fǎ	hợp pháp
387	合理	hé lǐ	hợp lý
388	合同	hé tóng	hợp đồng
389	合影	hé yǐng	chụp ảnh chung, chụp ảnh tập thể
390	合作	hé zuò	hợp tác
391	何必	hé bì	hà tất
392	何况	hé kuàng	huống hồ, hơn nữa
393	和平	hé píng	hòa bình
394	核心	hé xīn	trọng tâm
395	恨	hèn	hận
396	猴子	hóu zi	khỉ
397	后背	hòu bèi	phía sau
398	后果	hòu guǒ	hậu quả
399	呼吸	hū xī	hít thở
400	忽然	hū rán	bỗng nhiên
401	忽视	hū shì	không coi trọng (kinh tế, ngành nghề, vấn đề nhỏ, nghiên cứu)
402	胡说	hú shuō	nói nhăng quậy
403	胡同	hú tòng	ngõ, hẻm
404	壶	hú	bình, ấm
405	蝴蝶	hú dié	con bướm
406	糊涂	hú tú	hồ đồ
407	花生	huā shēng	lạc, đậu phộng
408	划	huá	chèo (thuyền)
409	华裔	huá yì	hoa kiều
410	滑	huá	trượt, trơn
411	化学	huà xué	hóa học
412	话题	huà tí	chủ đề
413	怀念	huái niàn	hoài niệm
414	怀孕	huái yùn	mang bầu
415	缓解	huǎn jiě	thả lỏng, giảm
416	幻想	huàn xiǎng	ảo tưởng, giả tưởng
417	慌张	huāng zhāng	hoảng sợ, rối rắm, rối
418	黄金	huáng jīn	vàng
419	灰	huī	màu xám
420	灰尘	huī chén	tro bụi
421	灰心	huī xīn	nản lòng
422	挥	huī	vẫy
423	恢复	huī fù	hồi phục, khôi phục
424	汇率	huì lǜ	tỷ giá
425	婚礼	hūn lǐ	hôn lễ
426	婚姻	hūn yīn	hôn nhân
427	活跃	huó yuè	sôi nổi
428	火柴	huǒ chái	diêm
429	伙伴	huǒ bàn	bạn đồng hành
430	或许	huò xǔ	có lẽ
431	机器	jī qì	máy móc
432	肌肉	jī ròu	cơ bắp
433	基本	jī běn	cơ bản, căn bản
434	激烈	jī liè	khốc liệt, kịch liệt
435	及格	jí gé	đạt điểm qua
436	极其	jí qí	cực kì
437	急忙	jí máng	vội vàng
438	急诊	jí zhěn	cấp cứu
439	集合	jí hé	tập hợp
440	集体	jí tǐ	tập thể
441	集中	jí zhōng	tập trung
442	计算	jì suàn	tính toán
443	记录	jì lù	ghi chép
444	记忆	jì yì	ký ức
445	纪录	jì lù	kỷ lục
446	纪律	jì lǜ	kỷ luật
447	纪念	jì niàn	kỉ niệm
448	系领带	jì lǐng dài	thắt cà vạt
449	寂寞	jì mò	cô đơn
450	夹子	jiā zi	cái kẹp
451	家庭	jiā tíng	gia đình
452	家务	jiā wù	việc nhà
453	家乡	jiā xiāng	quê hương
454	嘉宾	jiā bīn	khách mời
455	甲	jiǎ	giáp
456	假如	jiǎ rú	giả dụ
457	假设	jiǎ shè	giả thuyết
458	假装	jiǎ zhuāng	giả vờ
459	价值	jià zhí	giá trị
460	驾驶	jià shǐ	lái xe
461	嫁	jià	gả chồng
462	坚决	jiān jué	kiên quyết
463	坚强	jiān qiáng	kiên cường
464	肩膀	jiān bǎng	bờ vai
465	艰巨	jiān jù	khó khăn (công việc, nhiệm vụ)
466	艰苦	jiān kǔ	gian khổ, gian khóa
467	兼职	jiān zhí	kiêm nhiệm
468	捡	jiǎn	nhặt
469	剪刀	jiǎn dāo	cái kéo
470	简历	jiǎn lì	sơ yếu lý lịch
471	简直	jiǎn zhí	gần như
472	建立	jiàn lì	thành lập (tổ chức, trường học), thiết lập (quan hệ)
473	建设	jiàn shè	dựng xây, xây dựng
474	建筑	jiàn zhù	công trình xây dưng, (công ty) xây dựng, (ngành) xây dựng
475	健身	jiàn shēn	tập thể dục
476	键盘	jiàn pán	bàn phím
477	讲究	jiǎng jiū	coi trọng
478	讲座	jiǎng zuò	buổi diễn thuyết
479	酱油	jiàng yóu	xì dầu
480	交换	jiāo huàn	trao đổi
481	交际	jiāo jì	giao tiếp
482	交往	jiāo wǎng	đi lại, giao thiệp
483	浇	jiāo	tưới nước
484	胶水	jiāo shuǐ	keo dán
485	角度	jiǎo dù	góc độ
486	狡猾	jiǎo huá	giảo hoạt
487	教材	jiào cái	giao trình
488	教练	jiào liàn	huấn luyện viên
489	教训	jiào xùn	giáo huấn, bài học
490	阶段	jiē duàn	giai đoạn
491	结实	jiē shi	chắc chắn
492	接触	jiē chù	tiếp xúc
493	接待	jiē dài	tiếp đãi
494	接近	jiē jìn	tiếp cận
495	节省	jié shěng	tiết kiệm
496	结构	jié gòu	kết cấu
497	结合	jié hé	kết hợp
498	结论	jié lùn	kết luận
499	结账	jié zhàng	thanh toán
500	戒	jiè	cai (thuốc, rượu, nghiện)
501	戒指	jiè zhǐ	nhẫn
502	届	jiè	khóa
503	借口	jiè kǒu	cớ, lí do
504	金属	jīn shǔ	kim loại
505	尽快	jǐn kuài	mau chóng
506	尽量	jǐn liàng	cố gắng
507	紧急	jǐn jí	cấp bách
508	谨慎	jǐn shèn	cẩn thận, thận trọng
509	尽力	jìn lì	dốc hết sức
510	进步	jìn bù	tiến bộ
511	进口	jìn kǒu	nhập khẩu
512	近代	jìn dài	cận đại
513	经典	jīng diǎn	kinh điển
514	经商	jīng shāng	kinh doanh
515	经营	jīng yíng	kinh doanh (cửa hàng), vận hành (công ty)
516	精力	jīng lì	tinh lực
517	精神	jīng shén	tinh thần
518	酒吧	jiǔ bā	quán ba
519	救	jiù	cứu
520	救护车	jiù hù chē	xe cứu thương
521	舅舅	jiù jiù	cậu (em mẹ)
522	居然	jū rán	không ngờ lại
523	桔子	jú zi	quýt
524	巨大	jù dà	lớn (thành tựu, thay đổi, ảnh hưởng, tác hại)
525	具备	jù bèi	chuẩn bị đủ, có đủ (tư cách, điều kiện, tinh lực)
526	具体	jù tǐ	cụ thể
527	俱乐部	jù lè bù	câu lạc bộ
528	据说	jù shuō	nghe nói, nghe đồn
529	捐	juān	quyên góp
530	决赛	jué sài	trận chung kết
531	决心	jué xīn	quyết tâm
532	角色	jué sè	nhân vật
533	绝对	jué duì	tuyệt đối
534	军事	jūn shì	quân sự
535	均匀	jūn yún	bình quân, trung bình
536	卡车	kǎ chē	xe tải
537	开发	kāi fā	phát triển (hệ thống, ngành nghề, kĩ thuật, sản phẩm)
538	开放	kāi fàng	mở cửa
539	开幕式	kāi mù shì	lễ khai mạc
540	开水	kāi shuǐ	nước sôi
541	砍	kǎn	chặt, chém
542	看不起	kàn bù qǐ	coi khinh
543	看望	kàn wàng	đi thăm
544	靠	kào	dựa dẫm, dựa vào
545	颗	kē	quả (lượng từ)
546	可见	kě jiàn	cho thấy (đứng đầu vế câu thứ hai)
547	可靠	kě kào	đáng tin cậy
548	可怕	kě pà	đáng sợ
549	克	kè	gram
550	克服	kè fú	khắc phục
551	刻苦	kè kǔ	khắc khổ, chịu khó
552	客观	kè guān	khách quan
553	课程	kè chéng	môn học
554	空间	kōng jiān	không gian
555	空闲	kòng xián	rảnh rỗi (thời gian)
556	控制	kòng zhì	kiềm chế (cảm xúc, tình cảm), kiểm soát
557	口味	kǒu wèi	khẩu vị
558	夸	kuā	khen
559	夸张	kuā zhāng	phóng đại
560	会计	kuàì jì	kế toán
561	宽	kuān	rộng
562	昆虫	kūn chóng	côn trùng
563	扩大	kuò dà	mở rộng (phạm vi, khoảng cách, thị trường)
564	辣椒	là jiāo	ớt
565	拦	lán	ngăn, chặn
566	烂	làn	nát, loét, rách, thối rữa
567	朗读	lǎng dú	đọc to
568	劳动	láo dòng	lao động
569	劳驾	láo jià	làm ơn, xin phiền
570	老百姓	lǎo bǎi xìng	lão bách tính
571	老板	lǎo bǎn	ông chủ
572	老婆	lǎo pó	bà xã
573	老实	lǎo shí	thật thà
574	老鼠	lǎo shǔ	con chuột
575	姥姥	lǎo lǎo	bà ngoại
576	乐观	lè guān	lạc quan
577	雷	léi	sấm
578	类型	lèi xíng	loại hình
579	冷淡	lěng dàn	lãnh đạm, lạnh nhạt, lạnh lùng
580	厘米	lí mǐ	cm
581	离婚	lí hūn	li hôn
582	梨	lí	quả lê
583	理论	lǐ lùn	lý luận
584	理由	lǐ yóu	lí do
585	力量	lì liàng	sức mạnh
586	立即	lì jí	lập tức
587	立刻	lì kè	lập tức
588	利润	lì rùn	lợi nhuận
589	利息	lì xī	lợi tức
590	利益	lì yì	lợi ích
591	利用	lì yòng	tận dụng, lợi dụng
592	连忙	lián máng	vội vã
593	连续	lián xù	liên tục
594	联合	lián hé	liên hiệp
595	恋爱	liàn ài	yêu đương
596	良好	liáng hǎo	tốt đẹp
597	粮食	liáng shí	lương thực
598	亮	liàng	sáng
599	了不起	liǎo bù qǐ	giỏi giang
600	列车	liè chē	tàu hỏa
601	临时	lín shí	lâm thời, thời vụ, tạm thời
602	灵活	líng huó	linh hoạt
603	铃	líng	chuông
604	零件	líng jiàn	linh kiện
605	零食	líng shí	đồ ăn vặt
606	领导	lǐng dǎo	lãnh đạo
607	领域	lǐng yù	lĩnh vực
608	浏览	liú lǎn	đọc lướt
609	流传	liú chuán	lưu truyền, lan truyền
610	流泪	liú lèi	rơi lệ
611	龙	lóng	rồng
612	漏	lòu	dột
613	陆地	lù dì	lục địa, đất liền
614	陆续	lù xù	lục tục, liên tiếp
615	录取	lù qǔ	tuyển chọn
616	录音	lù yīn	ghi âm
617	轮流	lún liú	luân lưu, thay phiên
618	论文	lùn wén	luận văn
619	逻辑	luó jí	logic
620	落后	luò hòu	lạc hậu
621	骂	mà	mắng mỏ
622	麦克风	mài kè fēng	microphone
623	馒头	mán tóu	bánh bao không nhân, màn thầu
624	满足	mǎn zú	đáp ứng (yêu cầu, điều kiện, tính tò mò, lòng tham)
625	毛病	máo bìng	tật xấu, lỗi
626	矛盾	máo dùn	mâu thuẫn
627	冒险	mào xiǎn	mạo hiểm
628	贸易	mào yì	thương mại
629	眉毛	méi máo	lông mày
630	媒体	méi tǐ	truyền thông, báo chí
631	煤炭	méi tàn	than
632	美术	měi shù	mỹ thuật
633	魅力	mèi lì	sức hút
634	梦想	mèng xiǎng	ước mơ
635	秘密	mì mì	bí mật
636	秘书	mì shū	thư ký
637	密切	mì qiè	mật thiết
638	蜜蜂	mì fēng	con ong
639	面对	miàn duì	đối mặt (chứng cứ, tương lai, khủng hoảng, thách thức), đối diện
640	面积	miàn jī	diện tích
641	面临	miàn lín	đứng trước (khó khăn, nguy hiểm, thách thức)
642	苗条	miáo tiáo	thon thả
643	描写	miáo xiě	miêu tả
644	敏感	mǐn gǎn	nhạy cảm
645	名牌	míng pái	thương hiệu nổi tiếng
646	名片	míng piàn	danh thiếp
647	名胜古迹	míng shèng gǔ jì	danh lam thắng cảnh
648	明确	míng què	rõ ràng, rành mạch
649	明显	míng xiǎn	rõ ràng
650	明星	míng xīng	minh tinh
651	命令	mìng lìng	mệnh lệnh
652	命运	mìng yùn	vận mệnh
653	摸	mō	sờ
654	模仿	mó fǎng	bắt chước
655	模糊	mó hu	mơ hồ
656	模特	mó tè	người mẫu
657	摩托车	mó tuō chē	xe máy
658	陌生	mò shēng	lạ lẫm
659	某	mǒu	nào đó
660	木头	mù tóu	khúc gỗ
661	目标	mù biāo	mục tiêu
662	目录	mù lù	mục lục
663	目前	mù qián	trước mắt, hiện nay
664	哪怕	nǎ pà	cho dù
665	难怪	nán guài	chẳng trách
666	难免	nán miǎn	khó tránh
667	脑袋	nǎo dài	não
668	内部	nèi bù	nội bộ
669	内科	nèi kē	khoa nội
670	嫩	nèn	mềm, non
671	能干	néng gàn	được việc
672	能源	néng yuán	tài nguyên
673	嗯	ēn	ừ, ừm
674	年代	nián dài	thời đại
675	年纪	nián jì	tuổi tác
676	念	niàn	đọc
677	宁可	nìng kě	thà
678	牛仔裤	niú zǎi kù	quần bò
679	农村	nóng cūn	nông thôn
680	农民	nóng mín	nông dân
681	农业	nóng yè	nông nghiệp
682	浓	nóng	nồng, đậm
683	女士	nǚ shì	quý cô, quý bà
684	欧洲	ōu zhōu	châu Âu
685	偶然	ǒu rán	ngẫu nhiên
686	拍	pāi	vỗ
687	派	pài	cử, phái
688	盼望	pàn wàng	mong chờ
689	培训	péi xùn	bồi dưỡng, tập huấn
690	培养	péi yǎng	nuôi dưỡng, hình thành
691	赔偿	péi cháng	bồi thường
692	佩服	pèi fú	khâm phục
693	配合	pèi hé	phối hợp
694	盆	pén	chậu
695	碰	pèng	gặp phải, đụng phải
696	批	pī	loạt, lô (lượng từ)
697	批准	pī zhǔn	phê chuẩn, đồng ý
698	披	pī	khoác
699	疲劳	pí láo	mệt mỏi
700	匹	pǐ	con (lượng từ cho ngựa)
701	片	piàn	chiếc, lát, mảnh (lượng từ cho lá, bánh mì, đất đai )
702	片面	piàn miàn	phiến diện
703	飘	piāo	bay
704	拼音	pīn yīn	phiên âm
705	频道	pín dào	kênh
706	平	píng	bằng, đều
707	平安	píng ān	bình an
708	平常	píng cháng	bình thường
709	平等	píng děng	bình đẳng
710	平方	píng fāng	bình phương
711	平衡	píng héng	cân bằng
712	平静	píng jìng	bình tĩnh, tĩnh lặng, yên tĩnh
713	平均	píng jūn	trung bình, bình quân
714	评价	píng jià	đánh giá
715	凭	píng	dựa vào
716	迫切	pò qiè	cấp bách
717	破产	pò chǎn	phá sản
718	破坏	pò huài	phá hoại
719	期待	qī dài	kỳ vọng
720	期间	qī jiān	khoảng thời gian
721	其余	qí yú	còn lại
722	奇迹	qí jì	kỳ tích
723	企业	qǐ yè	nhà máy, xí nghiệp
724	启发	qǐ fā	gợi mở, gợi ý
725	气氛	qì fēn	không khí (cuộc họp, buổi tiệc)
726	汽油	qì yóu	xăng
727	谦虚	qiān xū	khiêm tốn
728	签	qiān	ký (tên)
729	前途	qián tú	tiền đồ
730	浅	qiǎn	nông
731	欠	qiàn	nợ
732	枪	qiāng	súng
733	强调	qiáng diào	nhấn mạnh
734	强烈	qiáng liè	mãnh liệt, mạnh mẽ
735	墙	qiáng	tường
736	抢	qiǎng	cướp
737	悄悄	qiāo qiāo	lặng lẽ
738	瞧	qiáo	liếc nhìn
739	巧妙	qiǎo miào	khéo léo
740	切	qiè	cắt
741	亲爱	qīn ài	thân yêu
742	亲切	qīn qiè	thân thiết
743	亲自	qīn zì	tự thân
744	勤奋	qín fèn	cần cù
745	青	qīng	màu xanh non
746	青春	qīng chūn	thanh xuân
747	青少年	qīng shào nián	thanh thiếu niên
748	轻视	qīng shì	coi khinh, khinh thường
749	轻易	qīng yì	dễ dàng (làm trạng ngữ), khinh suất
750	清淡	qīng dàn	thanh đạm
751	情景	qíng jǐng	cảnh tượng
752	情绪	qíng xù	tâm trạng
753	请求	qǐng qiú	thỉnh cầu
754	庆祝	qìng zhù	chúc mừng
755	球迷	qiú mí	người hâm mộ bóng
756	趋势	qū shì	xu thế
757	取消	qǔ xiāo	hủy bỏ
758	娶	qǔ	lấy (vợ)
759	去世	qù shì	tạ thế
760	圈	quān	vòng
761	权力	quán lì	quyền lực
762	权利	quán lì	quyền lợi
763	全面	quán miàn	toàn diện
764	劝	quàn	khuyên
765	缺乏	quē fá	thiếu
766	确定	què dìng	xác định
767	确认	què rèn	xác nhận
768	群	qún	đám, nhóm
769	燃烧	rán shāo	đốt cháy
770	绕	rào	vòng vèo
771	热爱	rè ài	yêu (cuộc sống, học sinh, thiên nhiên, âm nhạc, bạn bè, người thân)
772	热烈	rè liè	nhiệt liệt
773	热心	rè xīn	nhiệt tình (người, người bạn), nhiệt huyết
774	人才	rén cái	nhân tài
775	人口	rén kǒu	dân số
776	人类	rén lèi	loài người
777	人民币	rén mín bì	nhân dân tệ
778	人生	rén shēng	đời người
779	人事	rén shì	nhân sự
780	人物	rén wù	nhân vật
781	人员	rén yuán	nhân viên
782	忍不住	rěn bù zhù	không nhịn được
783	日常	rì cháng	thường ngày
784	日程	rì chéng	lịch trình
785	日历	rì lì	quyển lịch
786	日期	rì qī	ngày tháng
787	日用品	rì yòng pǐn	đồ dùng
788	日子	rì zi	ngày
789	如何	rú hé	như thế nào
790	如今	rú jīn	hiện nay
791	软	ruǎn	mềm
792	软件	ruǎn jiàn	phần mềm
793	弱	ruò	yếu ớt
794	洒	sǎ	vãi, vung
795	嗓子	sǎng zi	cổ họng
796	色彩	sè cǎi	màu sắc
797	杀	shā	giết
798	沙漠	shā mò	sa mạc
799	沙滩	shā tān	bãi cát
800	傻	shǎ	ngốc nghếch
801	晒	shài	phơi, tắm nắng
802	删除	shān chú	xóa bỏ
803	闪电	shǎn diàn	chớp
804	扇子	shàn zi	cái quạt
805	善良	shàn liáng	lương thiện, hiền lành
806	善于	shàn yú	giỏi về việc gì đó
807	伤害	shāng hài	làm hại
808	商品	shāng pǐn	sản phẩm
809	商务	shāng wù	thương gia (hạng, khoang),
810	商业	shāng yè	thương mại
811	上当	shàng dàng	mắc lừa
812	蛇	shé	rắn
813	舍不得	shě bù dé	không nỡ lòng
814	设备	shè bèi	thiết bị
815	设计	shè jì	thiết kế
816	设施	shè shī	cơ sở vật chất
817	射击	shè jī	bắn
818	摄影	shè yǐng	quay phim, chụp ảnh
819	伸	shēn	vươn, duỗi, kéo dài
820	身材	shēn cái	cơ thể, dáng
821	身份	shēn fèn	thân phận
822	深刻	shēn kè	sâu sắc
823	神话	shén huà	thần thoại
824	神秘	shén mì	thần bí
825	升	shēng	thăng, lên, lít (đơn vị đo thể tích)
826	生产	shēng chǎn	sản xuất
827	生动	shēng dòng	sinh động
828	生长	shēng zhǎng	sinh trưởng, lớn
829	声调	shēng diào	thanh điệu
830	绳子	shéng zi	dây thừng
831	省略	shěng lüè	tỉnh lược
832	胜利	shèng lì	thắng lợi
833	失眠	shī mián	mất ngủ
834	失去	shī qù	mất đi
835	失业	shī yè	thất nghiệp
836	诗	shī	thơ
837	狮子	shī zi	sư tử
838	湿润	shī rùn	ẩm ướt
839	石头	shí tou	hòn đá
840	时差	shí chā	lệch múi giờ
841	时代	shí dài	thời đại
842	时刻	shí kè	khoảnh khắc
843	时髦	shí máo	mốt
844	时期	shí qī	thời kì
845	时尚	shí shàng	thời thượng
846	实话	shí huà	lời nói thật
847	实践	shí jiàn	thực tiễn
848	实习	shí xí	thực tập
849	实现	shí xiàn	thực hiện (kế hoạch, nguyện vọng, ước mơ)
850	实验	shí yàn	thí nghiệm
851	实用	shí yòng	hữu ích
852	食物	shí wù	đồ ăn
853	使劲儿	shǐ jìn ér	ra sức, lấy sức
854	始终	shǐ zhōng	từ đầu đến cuối
855	士兵	shì bīng	binh sĩ
856	市场	shì chǎng	chợ
857	似的	shì de	giống như….
858	事实	shì shí	sự thật
859	事物	shì wù	sự vật
860	事先	shì xiān	trước khi việc xảy ra
861	试卷	shì juàn	bài thi
862	收获	shōu huò	thu hoạch
863	收据	shōu jù	giấy biên nhận
864	手工	shǒu gōng	thủ công
865	手术	shǒu shù	phẫu thuật
866	手套	shǒu tào	găng tay
867	手续	shǒu xù	thủ tục
868	手指	shǒu zhǐ	ngón tay
869	首	shǒu	đầu
870	寿命	shòu mìng	tuổi thọ
871	受伤	shòu shāng	bị thương
872	书架	shū jià	giá sách
873	梳子	shū zi	cái lược
874	舒适	shū shì	thoải mái
875	输入	shū rù	nhập
876	蔬菜	shū cài	rau xanh
877	熟练	shú liàn	thành thục
878	属于	shǔ yú	thuộc về
879	鼠标	shǔ biāo	chuột máy tính
880	数	shǔ	đếm
881	数据	shù jù	số liệu
882	数码	shù mǎ	kỹ thuật số
883	摔倒	shuāi dǎo	ngã nhào
884	甩	shuǎi	vung, hất, bỏ lại
885	双方	shuāng fāng	hai bên, song phương
886	税	shuì	thuế
887	说不定	shuō bù dìng	chưa biết chừng
888	说服	shuō fú	thuyết phục
889	丝绸	sī chóu	tơ lụa
890	丝毫	sī háo	một chút (dùng dạng phủ định)
891	私人	sī rén	tư nhân
892	思考	sī kǎo	suy nghĩ
893	思想	sī xiǎng	tư tưởng
894	撕	sī	xé
895	似乎	sì hū	dường như
896	搜索	sōu suǒ	tìm kiếm
897	宿舍	sù shè	ký túc xá
898	随身	suí shēn	mang theo người
899	随时	suí shí	bất cứ lúc nào
900	随手	suí shǒu	tiện tay
901	碎	suì	vỡ vụn
902	损失	sǔn shī	tổn thất
903	缩短	suō duǎn	thu hẹp (khoảng cách), rút ngắn (thời gian), cắt ngắn (câu chuyện)
904	所	suǒ	trợ từ
905	锁	suǒ	khóa
906	台阶	tái jiē	bậc thềm, bậc
907	太极拳	tài jí quán	thái cực quyền
908	太太	tài tai	vợ
909	谈判	tán pàn	đàm phán
910	坦率	tǎn shuài	thẳng thắn
911	烫	tàng	bỏng, là, ủi
912	逃	táo	chạy trốn
913	逃避	táo bì	trốn tránh
914	桃	táo	đào
915	淘气	táo qì	tinh nghịch
916	讨价还价	tǎo jià huán jià	mặc cả
917	套	tào	bộ (quần áo), căn (nhà)
918	特色	tè sè	đặc sắc, đặc điểm đặc sắc
919	特殊	tè shū	đặc biệt, đặc thù (quan hệ, nghi lễ, yêu cầu, đãi ngộ)
920	特征	tè zhēng	đặc trưng
921	疼爱	téng ài	chiều chuộng, yêu chiều
922	提倡	tí chàng	đề xướng
923	提纲	tí gāng	đề cương
924	提问	tí wèn	hỏi
925	题目	tí mù	đề mục
926	体会	tǐ huì	cảm nhận
927	体贴	tǐ tiē	sống tình cảm, chu đáo
928	体现	tǐ xiàn	thể hiện
929	体验	tǐ yàn	trải nghiệm
930	天空	tiān kōng	bầu trời
931	天真	tiān zhēn	hồn nhiên
932	调皮	tiáo pí	nghịch ngợm
933	调整	tiáo zhěng	điều chỉnh
934	挑战	tiǎo zhàn	thách thức, thử thách, thách
935	通常	tōng cháng	thông thường
936	统一	tǒng yī	thống nhất
937	痛苦	tòng kǔ	đau khổ
938	痛快	tòng kuài	sung sướng
939	偷	tōu	ăn trộm
940	投入	tóu rù	đút vào, đầu tư vào,
941	投资	tóu zī	đầu tư
942	透明	tòu míng	trong suốt
943	突出	tū chū	làm nổi bật
944	土地	tǔ dì	đất đai
945	土豆	tǔ dòu	khoai tây
946	吐	tǔ/tù	nhổ, nôn
947	兔子	tù zi	con thỏ
948	团	tuán	cuộn (danh từ)
949	推辞	tuī cí	từ chối
950	推广	tuī guǎng	quảng bá
951	推荐	tuī jiàn	tiến cử
952	退	tuì	lùi
953	退步	tuì bù	lùi bước
954	退休	tuì xiū	nghỉ hưu
955	歪	wāi	xiên (nghiêng)
956	外公	wài gōng	ông ngoại
957	外交	wài jiāo	ngoại giao
958	完美	wán měi	hoàn hảo
959	完善	wán shàn	hoàn thiện
960	完整	wán zhěng	hoàn chỉnh
961	玩具	wán jù	đồ chơi
962	万一	wàn yī	vạn nhất, nhỡ
963	王子	wáng zǐ	vua
964	网络	wǎng luò	mạng internet
965	往返	wǎng fǎn	khứ hồi
966	危害	wēi hài	nguy hại
967	威胁	wēi xié	uy hiếp
968	微笑	wēi xiào	mỉm cười
969	违反	wéi fǎn	vi phạm
970	围巾	wéi jīn	khăn
971	围绕	wéi rào	xoay quanh, bao quanh, quay quanh
972	唯一	wéi yī	duy nhất
973	维修	wéi xiū	sửa chữa
974	伟大	wěi dà	vĩ đại
975	尾巴	wěi bā	cái đuôi
976	委屈	wěi qu	tủi thân
977	未必	wèi bì	chưa chắc
978	未来	wèi lái	tương lai
979	位于	wèi yú	nằm ở (vị trí địa lý)
980	位置	wèi zhì	vị trí
981	胃	wèi	dạ dày
982	胃口	wèi kǒu	khẩu vị
983	温暖	wēn nuǎn	ấm áp
984	温柔	wēn róu	hiền dịu
985	文件	wén jiàn	tài liệu
986	文具	wén jù	đồ dùng học tập
987	文明	wén míng	văn minh
988	文学	wén xué	văn học
989	文字	wén zì	văn tự
990	闻	wén	ngửi
991	吻	wěn	hôn
992	稳定	wěn dìng	ổn định
993	问候	wèn hòu	hỏi thăm
994	卧室	wò shì	phòng ngủ
995	握手	wò shǒu	bắt tay
996	屋子	wū zi	căn nhà
997	无奈	wú nài	bó tay, không có cách nào, bất lực
998	无数	wú shù	vô số
999	无所谓	wú suǒ wèi	không quan tâm, không để ý
1000	武术	wǔ shù	võ thuật
1001	勿	wù	đừng
1002	物理	wù lǐ	vật lý
1003	物质	wù zhì	vật chất
1004	雾	wù	sương mù
1005	吸取	xī qǔ	hút, rút ra (bài học kinh nghiệm)
1006	吸收	xī shōu	thẩm thấu, ngấm
1007	戏剧	xì jù	kịch
1008	系	xì	thắt, buộc
1009	系统	xì tǒng	hệ thống
1010	细节	xì jié	tình tiết
1011	瞎	xiā	mù
1012	下载	xià zǎi	tải
1013	吓	xià	dọa
1014	夏令营	xià lìng yíng	trại
1015	鲜艳	xiān yàn	tươi tắn
1016	显得	xiǎn dé	lộ rõ
1017	显然	xiǎn rán	hiển nhiên, rõ ràng
1018	显示	xiǎn shì	hiển thị, cho thấy, tôn lên
1019	县	xiàn	huyện
1020	现代	xiàn dài	hiện đại
1021	现实	xiàn shí	hiện thực
1022	现象	xiàn xiàng	hiện tượng
1023	限制	xiàn zhì	hạn chế, giới hạn
1024	相处	xiāng chǔ	ở cùng nhau, tiếp xúc nhiều
1025	相当	xiāng dāng	tương đối
1026	相对	xiāng duì	tương đối
1027	相关	xiāng guān	liên quan
1028	相似	xiāng sì	giống
1029	香肠	xiāng cháng	xúc xích
1030	享受	xiǎng shòu	hưởng thụ
1031	想念	xiǎng niàn	nhớ nhung
1032	想象	xiǎng xiàng	tưởng tượng
1033	项	xiàng	hạng, môn (thể thao)
1034	项链	xiàng liàn	dây chuyền
1035	项目	xiàng mù	hạng mục
1036	象棋	xiàng qí	cờ tướng
1037	象征	xiàng zhēng	tượng trưng
1038	消费	xiāo fèi	tiêu dùng
1039	消化	xiāo huà	tiêu hóa
1040	消极	xiāo jí	tiêu cực
1041	消失	xiāo shī	biến mất
1042	销售	xiāo shòu	bán
1043	小麦	xiǎo mài	lúa mạch
1044	小气	xiǎo qì	keo kiệt
1045	孝顺	xiào shùn	hiếu thảo
1046	效率	xiào lǜ	hiệu suất
1047	歇	xiē	nghỉ ngơi
1048	斜	xié	nghiêng, chéo
1049	写作	xiě zuò	viết
1050	血	xiě	máu
1051	心理	xīn lǐ	tâm lý
1052	心脏	xīn zàng	tim
1053	欣赏	xīn shǎng	thưởng thức, đánh giá cao
1054	信号	xìn hào	tín hiệu
1055	信任	xìn rèn	tín nhiệm
1056	行动	xíng dòng	hành động
1057	行人	xíng rén	người đi đường
1058	行为	xíng wéi	hành vi
1059	形成	xíng chéng	hình thành
1060	形容	xíng róng	hình dung
1061	形式	xíng shì	hình thức
1062	形势	xíng shì	tình hình
1063	形象	xíng xiàng	hình tượng
1064	形状	xíng zhuàng	hình dáng, dáng
1065	幸亏	xìng kuī	may mà
1066	幸运	xìng yùn	may mắn
1067	性质	xìng zhì	tính chất
1068	兄弟	xiōng dì	huynh đệ
1069	胸	xiōng	ngực
1070	休闲	xiū xián	nhàn hạ, thoải mái
1071	修改	xiū gǎi	sửa lỗi (văn bản)
1072	虚心	xū xīn	khiêm tốn
1073	叙述	xù shù	kể, thuật
1074	宣布	xuān bù	tuyên bố
1075	宣传	xuān chuán	tuyên truyền
1076	学历	xué lì	trình độ
1077	学术	xué shù	học thuật
1078	学问	xué wèn	học vấn
1079	寻找	xún zhǎo	tìm kiếm
1080	询问	xún wèn	hỏi han
1081	训练	xùn liàn	huấn luyện
1082	迅速	xùn sù	nhanh chóng, nhanh
1083	押金	yā jīn	tiền cọc
1084	牙齿	yá chǐ	răng
1085	延长	yán cháng	kéo dài (thời gian)
1086	严肃	yán sù	nghiêm túc
1087	演讲	yǎn jiǎng	diễn thuyết
1088	宴会	yàn huì	yến tiệc
1089	阳台	yáng tái	ban công
1090	痒	yǎng	ngứa
1091	样式	yàng shì	kiểu dáng
1092	腰	yāo	lưng
1093	摇	yáo	lắc
1094	咬	yǎo	cắn
1095	要不	yào bù	nếu không thì
1096	业务	yè wù	nghiệp vụ
1097	业余	yè yú	nghiệp dư
1098	夜	yè	đêm
1099	一辈子	yí bèi zi	một đời người
1100	一旦	yí dàn	một khi
1101	一律	yí lǜ	nhất loạt
1102	一再	yí zài	nhiều lần
1103	一致	yí zhì	thống nhất
1104	依然	yī rán	vẫn như xưa
1105	移动	yí dòng	di động
1106	移民	yí mín	di dân
1107	遗憾	yí hàn	hối tiếc
1108	疑问	yí wèn	nghi vấn, nghi ngờ
1109	乙	yǐ	ất
1110	以及	yǐ jí	và
1111	以来	yǐ lái	trở lại đây (thời gian)
1112	亿	yì	trăm triệu
1113	义务	yì wù	nghĩa vụ
1114	议论	yì lùn	nghị luận
1115	意外	yì wài	ngoài ý muốn
1116	意义	yì yì	ý nghĩa
1117	因而	yīn ér	cho nên
1118	因素	yīn sù	nhân tố
1119	银	yín	bạc
1120	印刷	yìn shuā	in ấn
1121	英俊	yīng jùn	tuấn tú
1122	英雄	yīng xióng	anh hùng
1123	迎接	yíng jiē	nghênh đón
1124	营养	yíng yǎng	dinh dưỡng
1125	营业	yíng yè	kinh doanh
1126	影子	yǐng zi	cái bóng
1127	应付	yìng fù	ứng phó
1128	应用	yìng yòng	ứng dụng
1129	硬	yìng	cứng
1130	硬件	yìng jiàn	phần cứng
1131	拥抱	yōng bào	ôm, ôm ấp
1132	拥挤	yōng jǐ	chen chúc, đông đúc
1133	勇气	yǒng qì	dũng khí
1134	用功	yòng gōng	dụng công, công phu
1135	用途	yòng tú	cách dùng
1136	优惠	yōu huì	ưu đãi
1137	优美	yōu měi	trang nhã, thanh lịch, thanh nhã, đẹp, xinh xắn
1138	优势	yōu shì	ưu thế
1139	悠久	yōu jiǔ	lâu đời
1140	犹豫	yóu yù	do dự
1141	油炸	yóu zhá	chiên giòn
1142	游览	yóu lǎn	du ngoạn, thưởng ngoạn
1143	有利	yǒu lì	có lợi
1144	幼儿园	yòu ér yuán	nhà trẻ
1145	娱乐	yú lè	giải trí
1146	与其	yǔ qí	thay vì
1147	语气	yǔ qì	ngữ khí
1148	玉米	yù mǐ	ngô
1149	预报	yù bào	dự báo
1150	预订	yù dìng	đặt trước, dự định trước
1151	预防	yù fáng	phòng, phòng chống
1152	元旦	yuán dàn	nguyên đán
1153	员工	yuán gōng	nhân công
1154	原料	yuán liào	nguyên liệu
1155	原则	yuán zé	nguyên tắc
1156	圆	yuán	hình tròn
1157	愿 vọng	yuàn wàng	nguyện vọng
1158	乐器	yuè qì	nhạc cụ
1159	晕	yūn	say (xe)
1160	运气	yùn qì	vận may
1161	运输	yùn shū	vận tải
1162	运用	yùn yòng	vận dụng
1163	灾 hại	zāi hài	thiên tai
1164	再三	zài sān	hết lần này đến lần khác
1165	在乎	zài hū	để ý
1166	在于	zài yú	ở chỗ
1167	赞成	zàn chéng	tán thành
1168	赞美	zàn měi	ca tụng
1169	糟糕	zāo gāo	tồi tệ
1170	造成	zào chéng	gây nên
1171	则	zé	nhưng
1172	责备	zé bèi	trách cứ
1173	摘	zhāi	hái
1174	窄	zhǎi	hẹp
1175	粘贴	zhān tiē	dính, dán
1176	展开	zhǎn kāi	xòe ra, triển khai
1177	展览	zhǎn lǎn	triển lãm
1178	占	zhàn	chiếm
1179	战争	zhàn zhēng	chiến tranh
1180	长辈	zhǎng bèi	tiền bối
1181	涨	zhàng	tăng lên (giá cả, lương)
1182	掌握	zhǎng wò	nắm vững
1183	账户	zhàng hù	tài khoản
1184	招待	zhāo dài	chiêu đãi
1185	着火	zháo huǒ	bắt lửa, bén lửa
1186	着凉	zháo liáng	nhiễm lạnh
1187	召开	zhào kāi	triệu tập (cuộc họp)
1188	照常	zhào cháng	như thường lệ
1189	哲学	zhé xué	triết học
1190	针对	zhēn duì	nhằm (tổ chức, người, vấn đề)
1191	珍惜	zhēn xī	trân trọng
1192	真实	zhēn shí	chân thực
1193	诊断	zhěn duàn	chẩn đoán
1194	阵	zhèn	trận (chiến đấu, chiến tranh), khoảng thời gian, mùi hương
1195	振动	zhèn dòng	trấn động
1196	争论	zhēng lùn	tranh luận
1197	争取	zhēng qǔ	tranh thủ (ủng hộ, ý kiến)
1198	征求	zhēng qiú	trưng cầu (ý kiến, ý kiến phản hồi), xin (ý kiến lãnh đạo, đồng ý)
1199	睁	zhēng	mở to mắt, trợn mắt
1200	整个	zhěng gè	cả, toàn bộ
1201	整齐	zhěng qí	gọn gàng, ngăn nắp
1202	整体	zhěng tǐ	tổng thể
1203	正	zhèng	đứng (trái )
1204	证件	zhèng jiàn	giấy tờ
1205	证据	zhèng jù	chứng cứ
1206	政府	zhèng fǔ	chính phủ
1207	政治	zhèng zhì	chính trị
1208	挣	zhèng	tranh, giành
1209	支	zhī	chiếc (lượng từ cho bút…)
1210	支票	zhī piào	ngân phiếu
1211	执照	zhí zhào	giấy phép
1212	直	zhí	thẳng
1213	指导	zhǐ dǎo	chỉ đạo
1214	指挥	zhǐ huī	chỉ huy
1215	至今	zhì jīn	đến nay
1216	至于	zhì yú	còn như…..
1217	志愿者	zhì yuàn zhě	tình nguyện viên
1218	制定	zhì dìng	lập ra, thiết lập, xây dựng, lập (chính sách, qui định, kế hoạch, sách lược, phương án)
1219	制度	zhì dù	chế độ, chính sách
1220	制造	zhì zào	sản xuất
1221	制作	zhì zuò	làm, chế tạo
1222	治疗	zhì liáo	điều trị
1223	秩序	zhì xù	trật tự
1224	智慧	zhì huì	trí tuệ
1225	中介	zhōng jiè	môi giới, trung gian
1226	中心	zhōng xīn	trung tâm
1227	中旬	zhōng xún	trung tuần
1228	种类	zhǒng lèi	chủng loại
1229	重大	zhòng dà	trọng đại, lớn
1230	重量	zhòng liàng	trọng lượng
1231	周到	zhōu dào	chu đáo
1232	猪	zhū	con lợn
1233	竹子	zhú zi	cây trúc
1234	逐步	zhú bù	từng bước
1235	逐渐	zhú jiàn	dần dần
1236	主持	zhǔ chí	dẫn (chương trình),
1237	主动	zhǔ dòng	chủ động
1238	主观	zhǔ guān	chủ quan
1239	主人	zhǔ rén	chủ nhân
1240	主任	zhǔ rèn	chủ nhiệm
1241	主题	zhǔ tí	chủ đề
1242	主席	zhǔ xí	chủ tịch
1243	主张	zhǔ zhāng	ý tưởng, ý kiến
1244	煮	zhǔ	luộc, đun
1245	注册	zhù cè	đăng kí
1246	祝福	zhù fú	chúc phúc
1247	抓	zhuā	bắt, véo
1248	抓紧	zhuā jǐn	(tay) nắm chắc, tranh thủ (thời gian)
1249	专家	zhuān jiā	chuyên gia
1250	专心	zhuān xīn	chuyên tâm
1251	转变	zhuǎn biàn	chuyển biến
1252	转告	zhuǎn gào	chuyển lời
1253	装	zhuāng	đựng, chứa
1254	装饰	zhuāng shì	trang hoàng, trang trí
1255	装修	zhuāng xiū	sửa nội thất
1256	状况	zhuàng kuàng	tình trạng
1257	状态	zhuàng tài	trạng thái
1258	撞	zhuàng	va vào, đâm vào
1259	追	zhuī	đuổi theo
1260	追求	zhuī qiú	theo đuổi
1261	咨询	zī xún	tư vấn
1262	姿势	zī shì	tư thế
1263	资格	zī gé	tư cách
1264	资金	zī jīn	vốn (tiền)
1265	资料	zī liào	tư liệu
1266	资源	zī yuán	nguồn tài nguyên
1267	紫	zǐ	màu tím
1268	自从	zì cóng	từ khi….
1269	自动	zì dòng	tự động
1270	自豪	zì háo	tự hào, kiêu ngạo
1271	自觉	zì jué	tự giác
1272	自私	zì sī	ích kỉ
1273	自由	zì yóu	tự do
1274	自愿	zì yuàn	tình nguyện, tự nguyện
1275	字母	zì mǔ	chữ cái
1276	字幕	zì mù	phụ đề
1277	综合	zōng hé	tổng hợp
1278	总裁	zǒng cái	giám đốc
1279	总共	zǒng gòng	tổng cộng
1280	总理	zǒng lǐ	thủ tướng
1281	总算	zǒng suàn	rốt cuộc
1282	总统	zǒng tǒng	tổng thống
1283	总之	zǒng zhī	tóm lại
1284	阻止	zǔ zhī	ngăn chặn, ngăn cản
1285	组	zǔ	tổ, cụm, nhóm
1286	组成	zǔ chéng	tổ thành
1287	组合	zǔ hé	tổ hợp, tổ hợp thành, nhóm
1288	组织	zǔ zhī	tổ chức
1289	最初	zuì chū	ban đầu
1290	醉	zuì	say, say đắm
1291	尊敬	zūn jìng	tôn kính, kính trọng
1292	遵守	zūn shǒu	tuân thủ
1293	作品	zuò pǐn	tác phẩm
1294	作为	zuò wéi	coi là, làm, là
1295	作文	zuò wén	bài viết`;

const parseData = (data: string): HSKWord[] => {
  const lines = data.split('\n');
  const parsedWords: HSKWord[] = [];
  for (const line of lines) {
    const parts = line.split('\t');
    if (parts.length >= 4) {
      // Assuming format is [index]\t[mandarin]\t[pinyin]\t[vietnamese]
      const mandarin = parts[1].trim();
      const pinyin = parts[2].trim();
      const vietnamese = parts[3].trim();
      if (mandarin && pinyin && vietnamese) {
        parsedWords.push({ mandarin, pinyin, vietnamese });
      }
    }
  }
  return parsedWords;
};

// Parse the raw data
const HSK5_UNSORTED_VOCABULARY = parseData(rawData);

// Sort the HSK5 vocabulary alphabetically by pinyin for range generation
export const HSK5_VOCABULARY: HSKWord[] = [...HSK5_UNSORTED_VOCABULARY].sort((a, b) => {
  const pinyinA = normalizePinyin(a.pinyin);
  const pinyinB = normalizePinyin(b.pinyin);
  return pinyinA.localeCompare(pinyinB);
});
