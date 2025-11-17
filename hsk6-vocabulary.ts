
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

const rawData = `1	爱不释手	ài bù shì shǒu	yêu không rời tay
2	爱戴	ài dài	yêu mến, kính trọng
3	暧昧	ài mèi	mập mờ, không rõ ràng
4	安居乐业	ān jū lè yè	an cư lạc nghiệp
5	安宁	ān níng	yên bình
6	安详	ān xiáng	bình thản, điềm tĩnh
7	安置	ān zhì	sắp xếp, bố trí
8	案件	àn jiàn	vụ án
9	案例	àn lì	trường hợp, ví dụ
10	按摩	àn mó	mát xa
11	暗示	àn shì	ám hiệu, gợi ý
12	昂贵	áng guì	đắt đỏ
13	凹凸	āo tū	lồi lõm
14	熬	áo	nấu, chịu đựng
15	奥秘	ào mì	bí mật, huyền bí
16	扒	bā	cào, móc, kéo
17	疤	bā	vết sẹo
18	巴不得	bā bu de	nóng lòng, mong mỏi
19	巴结	bā jié	nịnh nọt, xu nịnh
20	拔苗助长	bá miáo zhù zhǎng	đốt cháy giai đoạn
21	把关	bǎ guān	trông coi, bảo vệ
22	把手	bǎ shǒu	tay cầm, tay nắm
23	把戏	bǎ xì	trò biểu diễn, trò ảo thuật
24	霸道	bà dào	bá đạo, hung hăng
25	罢工	bà gōng	đình công
26	掰	bāi	bẻ gãy
27	百分点	bǎi fēn diǎn	điểm phần trăm
28	摆脱	bǎi tuō	thoát khỏi
29	拜访	bài fǎng	thăm hỏi
30	败坏	bài huài	phá hoại, làm hỏng
31	拜年	bài nián	chúc Tết
32	拜托	bài tuō	nhờ vả
33	颁布	bān bù	ban hành
34	颁发	bān fā	trao tặng
35	斑纹	bān wén	hoa văn, vằn
36	版本	bǎn běn	phiên bản
37	伴侣	bàn lǚ	bạn đời
38	伴随	bàn suí	đi cùng, đi kèm
39	半途而废	bàn tú ér fèi	bỏ dở giữa chừng
40	扮演	bàn yǎn	đóng vai
41	绑架	bǎng jià	bắt cóc
42	榜样	bǎng yàng	tấm gương, mẫu mực
43	磅	bàng	pound (đơn vị đo lường)
44	包庇	bāo bì	che giấu, bao che
45	包袱	bāo fu	gánh nặng
46	包围	bāo wéi	bao vây
47	包装	bāo zhuāng	đóng gói
48	保管	bǎo guǎn	bảo quản
49	饱和	bǎo hé	bão hòa
50	饱经沧桑	bǎo jīng cāng sāng	trải qua nhiều thăng trầm
51	保密	bǎo mì	giữ bí mật
52	保姆	bǎo mǔ	bảo mẫu
53	保守	bǎo shǒu	bảo thủ
54	保卫	bǎo wèi	bảo vệ
55	保养	bǎo yǎng	bảo dưỡng
56	保障	bǎo zhàng	bảo đảm
57	保重	bǎo zhòng	bảo trọng
58	报仇	bào chóu	báo thù
59	报酬	bào chóu	thù lao
60	报答	bào dá	báo đáp
61	报到	bào dào	báo danh
62	爆发	bào fā	bùng phát
63	报复	bào fù	báo thù
64	抱负	bào fù	hoài bão
65	曝光	bào guāng	phơi bày, lộ diện
66	暴力	bào lì	bạo lực
67	暴露	bào lù	lộ ra
68	报社	bào shè	tòa soạn báo
69	报销	bào xiāo	thanh toán (chi phí)
70	抱怨	bào yuàn	phàn nàn
71	爆炸	bào zhà	nổ
72	悲哀	bēi āi	bi ai
73	卑鄙	bēi bǐ	đê tiện
74	悲惨	bēi cǎn	bi thảm
75	北极	běi jí	Bắc Cực
76	被动	bèi dòng	bị động
77	备份	bèi fèn	sao lưu
78	被告	bèi gào	bị cáo
79	贝壳	bèi ké	vỏ sò
80	背叛	bèi pàn	phản bội
81	背诵	bèi sòng	đọc thuộc lòng
82	备忘录	bèi wàng lù	sổ tay, sổ ghi nhớ
83	奔波	bēn bō	bôn ba, vất vả
84	奔驰	bēn chí	chạy nhanh
85	本能	běn néng	bản năng
86	本钱	běn qián	vốn
87	本人	běn rén	bản thân
88	本身	běn shēn	bản thân
89	本事	běn shì	tài năng
90	本着	běn zhe	căn cứ vào
91	笨拙	bèn zhuō	vụng về
92	崩溃	bēng kuì	sụp đổ
93	甭	béng	không cần
94	蹦	bèng	nhảy lên
95	迸发	bèng fā	bùng phát
96	逼迫	bī pò	ép buộc
97	鼻涕	bí tì	nước mũi
98	比方	bǐ fāng	ví dụ
99	比喻	bǐ yù	so sánh, ví von
100	比重	bǐ zhòng	tỷ trọng
101	臂	bì	cánh tay
102	弊病	bì bìng	tệ nạn, bệnh tật
103	必定	bì dìng	nhất định
104	弊端	bì duān	tệ nạn, sai sót
105	闭塞	bì sè	bế tắc
106	碧玉	bì yù	ngọc bích
107	鞭策	biān cè	khuyến khích
108	边疆	biān jiāng	biên cương
109	边界	biān jiè	biên giới
110	边境	biān jìng	biên giới
111	边缘	biān yuán	vùng rìa
112	编织	biān zhī	đan, dệt
113	扁	biǎn	dẹp, bẹp
114	贬低	biǎn dī	hạ thấp, đánh giá thấp
115	贬义	biǎn yì	nghĩa xấu
116	遍布	biàn bù	rải rác, phân bố khắp
117	变故	biàn gù	biến cố
118	辩护	biàn hù	biện hộ
119	辩解	biàn jiě	giải thích, biện giải
120	便利	biàn lì	tiện lợi
121	变迁	biàn qiān	biến đổi
122	辨认	biàn rèn	nhận diện
123	便条	biàn tiáo	ghi chú
124	便于	biàn yú	thuận tiện cho
125	辩证	biàn zhèng	biện chứng
126	变质	biàn zhì	biến chất
127	辫子	biàn zi	bím tóc
128	标本	biāo běn	mẫu vật
129	标记	biāo jì	ký hiệu
130	飙升	biāo shēng	tăng vọt
131	标题	biāo tí	tiêu đề
132	表决	biǎo jué	biểu quyết
133	表态	biǎo tài	bày tỏ thái độ
134	表彰	biǎo zhāng	khen ngợi
135	憋	biē	nén, nhịn
136	别人	bié rén	người khác
137	别墅	bié shù	biệt thự
138	别致	bié zhì	độc đáo
139	别扭	bié niu	khó chịu, gượng gạo
140	濒临	bīn lín	cận kề, gần kề
141	冰雹	bīng báo	mưa đá
142	并存	bìng cún	cùng tồn tại
143	并非	bìng fēi	không phải là
144	并列	bìng liè	đặt song song
145	拨打	bō dǎ	quay số điện thoại
146	播放	bō fàng	phát sóng
147	波浪	bō làng	sóng
148	波涛汹涌	bō tāo xiōng yǒng	sóng lớn cuồn cuộn
149	剥削	bō xuē	bóc lột
150	播种	bō zhǒng	gieo hạt
151	博大精深	bó dà jīng shēn	uyên thâm, sâu sắc
152	搏斗	bó dòu	đấu tranh, vật lộn
153	博览会	bó lǎn huì	triển lãm
154	伯母	bó mǔ	bác gái
155	薄弱	bó ruò	yếu ớt, mỏng manh
156	补偿	bǔ cháng	bù đắp, đền bù
157	补救	bǔ jiù	cứu chữa, bổ cứu
158	哺乳	bǔ rǔ	bú, nuôi bằng sữa mẹ
159	补贴	bǔ tiē	trợ cấp
160	捕捉	bǔ zhuō	bắt giữ
161	不得已	bù dé yǐ	bất đắc dĩ
162	步伐	bù fá	bước đi, nhịp đi
163	不妨	bù fáng	không ngại, có thể
164	不敢当	bù gǎn dāng	không dám nhận
165	布告	bù gào	thông báo
166	不顾	bù gù	không quan tâm
167	不禁	bù jīn	không nhịn được
168	布局	bù jú	bố trí
169	不堪	bù kān	không thể chịu nổi
170	不可思议	bù kě sī yì	không thể tưởng tượng
171	不愧	bù kuì	không hổ thẹn
172	不料	bù liào	không ngờ
173	不时	bù shí	thỉnh thoảng
174	部署	bù shǔ	bố trí
175	部位	bù wèi	bộ phận, vị trí
176	不惜	bù xī	không tiếc, không ngại
177	不相上下	bù xiāng shàng xià	không phân cao thấp
178	不像话	bù xiàng huà	không ra gì, kỳ cục
179	不屑一顾	bù xiè yí gù	không thèm ngó tới
180	不言而喻	bù yán ér yù	không cần nói cũng hiểu
181	不由得	bù yóu de	không kìm được
182	不择手段	bù zé shǒu duàn	không từ thủ đoạn
183	不止	bù zhǐ	không ngừng
184	布置	bù zhì	bố trí
185	裁缝	cái féng	thợ may
186	财富	cái fù	tài sản
187	才干	cái gàn	tài cán, năng lực
188	裁判	cái pàn	trọng tài
189	财务	cái wù	tài chính
190	裁员	cái yuán	cắt giảm nhân viên
191	财政	cái zhèng	tài chính
192	采购	cǎi gòu	mua sắm
193	采集	cǎi jí	thu thập, sưu tập
194	采纳	cǎi nà	chấp nhận
195	彩票	cǎi piào	vé số
196	参谋	cān móu	tham mưu, cố vấn
197	参照	cān zhào	tham khảo
198	残酷	cán kù	tàn khốc, tàn bạo
199	残留	cán liú	còn sót lại
200	残忍	cán rěn	tàn nhẫn
201	灿烂	càn làn	rực rỡ, sáng lạn
202	舱	cāng	khoang (tàu, máy bay)
203	苍白	cāng bái	xanh xao, tái nhợt
204	仓促	cāng cù	vội vàng, gấp gáp
205	仓库	cāng kù	kho, nhà kho
206	操劳	cāo láo	lao tâm khổ tứ
207	操练	cāo liàn	thao luyện, luyện tập
208	操纵	cāo zòng	điều khiển, thao túng
209	操作	cāo zuò	thao tác
210	嘈杂	cáo zá	ồn ào
211	草案	cǎo àn	bản thảo, dự thảo
212	草率	cǎo shuài	qua loa, đại khái
213	策划	cè huà	kế hoạch, lập kế hoạch
214	测量	cè liáng	đo lường
215	策略	cè lüè	chiến lược
216	侧面	cè miàn	mặt bên, khía cạnh
217	层出不穷	céng chū bù qióng	tầng tầng lớp lớp
218	层次	céng cì	tầng lớp, cấp bậc
219	差距	chā jù	chênh lệch
220	查获	chá huò	tra ra, bắt được
221	岔	chà	rẽ nhánh, rẽ đường
222	刹那	chà nà	chớp mắt, trong khoảnh khắc
223	诧异	chà yì	ngạc nhiên
224	柴油	chái yóu	dầu diesel
225	搀	chān	nâng đỡ, dìu
226	馋	chán	thèm thuồng
227	缠绕	chán rào	quấn quanh
228	阐述	chǎn shù	trình bày, giải thích
229	产业	chǎn yè	công nghiệp, sản nghiệp
230	颤抖	chàn dǒu	run rẩy
231	猖狂	chāng kuáng	điên cuồng
232	昌盛	chāng shèng	hưng thịnh
233	偿还	cháng huán	hoàn trả
234	常年	cháng nián	quanh năm
235	尝试	cháng shì	thử nghiệm
236	常务	cháng wù	thường vụ
237	场	chǎng	sân, bãi, nơi
238	场合	chǎng hé	trường hợp, hoàn cảnh
239	敞开	chǎng kāi	mở rộng, mở toang
240	场面	chǎng miàn	cảnh tượng, tình cảnh
241	场所	chǎng suǒ	nơi, chỗ
242	倡导	chàng dǎo	khởi xướng, đề xướng
243	畅通	chàng tōng	thông suốt, thông suốt
244	畅销	chàng xiāo	bán chạy
245	倡议	chàng yì	sáng kiến, đề nghị
246	超级	chāo jí	siêu cấp
247	钞票	chāo piào	tiền giấy
248	超越	chāo yuè	vượt qua, vượt trội
249	潮流	cháo liú	trào lưu, dòng nước
250	潮湿	cháo shī	ẩm ướt
251	嘲笑	cháo xiào	chế giễu, cười nhạo
252	撤退	chè tuì	rút lui, thoái lui
253	撤销	chè xiāo	hủy bỏ, bãi bỏ
254	沉淀	chén diàn	lắng đọng, kết tủa
255	陈旧	chén jiù	cũ kỹ, lỗi thời
256	陈列	chén liè	trưng bày, bày biện
257	沉闷	chén mèn	nặng nề, u ám
258	陈述	chén shù	trình bày, phát biểu
259	沉思	chén sī	suy tư, trầm ngâm
260	沉重	chén zhòng	nặng nề, trĩu nặng
261	沉着	chén zhuó	bình tĩnh, điềm tĩnh
262	称心如意	chèn xīn rú yì	vừa ý, hài lòng
263	称号	chēng hào	danh hiệu
264	橙	chéng	màu cam
265	盛	chéng	đựng, chứa, đầy đủ
266	承办	chéng bàn	đảm nhận, thụ lý
267	承包	chéng bāo	thầu, bao thầu
268	城堡	chéng bǎo	lâu đài, thành trì
269	成本	chéng běn	giá thành, chi phí
270	惩罚	chéng fá	trừng phạt
271	成交	chéng jiāo	giao dịch, thành giao
272	承诺	chéng nuò	cam kết, hứa hẹn
273	澄清	chéng qīng	làm sáng tỏ, giải thích
274	成天	chéng tiān	cả ngày
275	乘务员	chéng wù yuán	tiếp viên (tàu, máy bay)
276	呈现	chéng xiàn	trình bày, xuất hiện
277	成效	chéng xiào	hiệu quả, kết quả
278	成心	chéng xīn	cố ý, cố tình
279	成员	chéng yuán	thành viên
280	诚挚	chéng zhì	chân thành, tha thiết
281	秤	chèng	cái cân, cân
282	吃苦	chī kǔ	chịu khổ, chịu đựng
283	吃力	chī lì	tốn sức, mệt nhọc
284	迟缓	chí huǎn	chậm chạp, trì hoãn
285	持久	chí jiǔ	bền bỉ, lâu dài
286	池塘	chí táng	ao, hồ
287	迟疑	chí yí	do dự, lưỡng lự
288	赤道	chì dào	xích đạo
289	赤字	chì zì	thâm hụt, thiếu hụt
290	充当	chōng dāng	đảm nhiệm, đóng vai
291	冲动	chōng dòng	xung động, kích động
292	冲击	chōng jī	tấn công, xung kích
293	充沛	chōng pèi	dồi dào, đầy đủ
294	充实	chōng shí	làm phong phú, bổ sung
295	冲突	chōng tū	xung đột, va chạm
296	充足	chōng zú	đầy đủ, phong phú
297	崇拜	chóng bài	sùng bái, tôn thờ
298	重叠	chóng dié	chồng chéo, trùng điệp
299	崇高	chóng gāo	cao cả, cao quý
300	崇敬	chóng jìng	kính trọng, tôn kính
301	重阳节	Chóng yáng jié	lễ Trùng Cửu
302	抽空	chōu kòng	tranh thủ thời gian
303	筹备	chóu bèi	chuẩn bị, sắp xếp
304	踌躇	chóu chú	do dự, lưỡng lự
305	稠密	chóu mì	dày đặc, đông đúc
306	丑恶	chǒu è	xấu xa, đê tiện
307	初步	chū bù	sơ bộ, bước đầu
308	出路	chū lù	đường ra, lối thoát
309	出卖	chū mài	bán, phản bội
310	出身	chū shēn	xuất thân, gốc gác
311	出神	chū shén	mê mẩn, ngẩn ngơ
312	出息	chū xī	triển vọng, tiền đồ
313	出洋相	chū yáng xiàng	làm trò cười, bẽ mặt
314	储备	chǔ bèi	dự trữ, tích trữ
315	储存	chǔ cún	dự trữ, cất giữ
316	处分	chǔ fèn	xử phạt, xử lý
317	处境	chǔ jìng	tình cảnh, hoàn cảnh
318	储蓄	chǔ xù	tiết kiệm, để dành
319	处置	chǔ zhì	xử lý, xử trí
320	触犯	chù fàn	vi phạm, đụng chạm
321	川流不息	chuān liú bù xī	như nước chảy, không ngừng
322	穿越	chuān yuè	vượt qua, xuyên qua
323	船舶	chuán bó	tàu, thuyền
324	传达	chuán dá	truyền đạt, thông báo
325	传单	chuán dān	tờ rơi, truyền đơn
326	传授	chuán shòu	truyền thụ, dạy dỗ
327	喘气	chuǎn qì	thở dốc, thở hổn hển
328	串	chuàn	xâu, chuỗi
329	床单	chuáng dān	ga trải giường
330	创立	chuàng lì	sáng lập, thành lập
331	创新	chuàng xīn	đổi mới, sáng tạo
332	创业	chuàng yè	khởi nghiệp
333	创作	chuàng zuò	sáng tác
334	吹牛	chuī niú	khoác lác, nói phét
335	吹捧	chuī pěng	tán tụng, tâng bốc
336	锤	chuí	cái búa
337	垂直	chuí zhí	thẳng đứng
338	纯粹	chún cuì	thuần túy
339	纯洁	chún jié	trong sạch, thuần khiết
340	词汇	cí huì	từ vựng
341	慈祥	cí xiáng	từ bi, hiền hậu
342	雌雄	cí xióng	đực và cái
343	刺	cì	gai, đâm
344	伺候	cì hòu	phục vụ, chăm sóc
345	次品	cì pǐn	hàng lỗi
346	次序	cì xù	thứ tự
347	丛	cóng	bụi, lùm
348	从容不迫	cóng róng bù pò	ung dung, bình tĩnh
349	凑合	còu he	tạm bợ, tạm thời
350	粗鲁	cū lǔ	thô lỗ, cộc cằn
351	窜	cuàn	chạy trốn, trốn chạy
352	摧残	cuī cán	tàn phá, phá hoại
353	脆弱	cuì ruò	yếu ớt, dễ vỡ
354	搓	cuō	vò, chà
355	磋商	cuō shāng	đàm phán, thương lượng
356	挫折	cuò zhé	trở ngại, thất bại
357	搭	dā	lắp đặt, dựng lên
358	搭档	dā dàng	cộng tác, hợp tác
359	搭配	dā pèi	phối hợp, kết hợp
360	答辩	dá biàn	biện hộ, bào chữa
361	达成	dá chéng	đạt thành, đạt được
362	答复	dá fù	trả lời, đáp lại
363	打包	dǎ bāo	đóng gói, gói hàng
364	打官司	dǎ guān si	kiện tụng
365	打击	dǎ jī	đánh, đập
366	打架	dǎ jià	đánh nhau
367	打量	dǎ liang	quan sát, xem xét
368	打猎	dǎ liè	săn bắn
369	打仗	dǎ zhàng	đánh trận, chiến đấu
370	大不了	dà bù liǎo	cùng lắm, chẳng qua
371	大臣	dà chén	đại thần
372	大伙儿	dà huǒr	mọi người, tất cả
373	大厦	dà shà	tòa nhà lớn
374	大肆	dà sì	bừa bãi, tùy tiện
375	大体	dà tǐ	đại thể, nhìn chung
376	大意	dà yì	đại ý, sơ suất
377	大致	dà zhì	đại khái, chung chung
378	歹徒	dǎi tú	tên cướp, kẻ xấu
379	逮捕	dài bǔ	bắt giữ, bắt bớ
380	代价	dài jià	giá cả, chi phí
381	代理	dài lǐ	đại lý, đại diện
382	带领	dài lǐng	dẫn dắt, lãnh đạo
383	怠慢	dài màn	lơ là, không nhiệt tình
384	担保	dān bǎo	đảm bảo, bảo lãnh
385	胆怯	dǎn qiè	nhút nhát, sợ hãi
386	蛋白质	dàn bái zhì	chất đạm, protein
387	诞辰	dàn chén	sinh nhật
388	淡季	dàn jì	mùa thấp điểm
389	诞生	dàn shēng	ra đời, sinh ra
390	淡水	dàn shuǐ	nước ngọt
391	当场	dāng chǎng	tại chỗ, ngay tại nơi
392	当初	dāng chū	ban đầu, lúc đầu
393	当面	dāng miàn	trước mặt
394	当前	dāng qián	hiện nay, hiện tại
395	当事人	dāng shì rén	đương sự, người liên quan
396	当务之急	dāng wù zhī jí	việc cấp bách hiện tại
397	当心	dāng xīn	cẩn thận, chú ý
398	当选	dāng xuǎn	được bầu, trúng cử
399	党	dǎng	đảng
400	档案	dàng àn	hồ sơ, tài liệu
401	档次	dàng cì	đẳng cấp, mức độ
402	倒闭	dǎo bì	phá sản, đóng cửa
403	导弹	dǎo dàn	tên lửa
404	导航	dǎo háng	dẫn đường, điều hướng
405	捣乱	dǎo luàn	gây rối, phá rối
406	导向	dǎo xiàng	hướng dẫn, dẫn đường
407	岛屿	dǎo yǔ	đảo nhỏ, quần đảo
408	稻谷	dào gǔ	lúa
409	盗窃	dào qiè	trộm cắp
410	得不偿失	dé bù cháng shī	mất nhiều hơn được
411	得力	dé lì	có hiệu quả, hữu hiệu
412	得天独厚	dé tiān dú hòu	được trời phú, ưu đãi
413	得罪	dé zuì	gây tội, xúc phạm
414	蹬	dēng	đạp, giẫm
415	灯笼	dēng lóng	đèn lồng
416	登陆	dēng lù	đổ bộ, cập bến
417	登录	dēng lù	đăng nhập, ghi chép
418	等级	děng jí	cấp bậc, đẳng cấp
419	瞪	dèng	trừng mắt, nhìn trừng
420	堤坝	dī bà	đê, đập
421	敌视	dí shì	thù địch, địch thị
422	抵达	dǐ dá	đến, đạt đến
423	抵抗	dǐ kàng	kháng cự, chống lại
424	抵制	dǐ zhì	tẩy chay, ngăn chặn
425	地步	dì bù	tình trạng, tình hình
426	地道	dì dao	địa đạo, chính cống
427	地势	dì shì	địa thế, địa hình
428	递增	dì zēng	tăng dần, tăng lên
429	地质	dì zhì	địa chất
430	颠簸	diān bǒ	lắc lư, chao đảo
431	颠倒	diān dǎo	đảo lộn, lộn ngược
432	典礼	diǎn lǐ	lễ, buổi lễ
433	典型	diǎn xíng	điển hình, mẫu mực
434	点缀	diǎn zhuì	điểm xuyết, trang trí
435	垫	diàn	đệm, lót
436	奠定	diàn dìng	đặt nền móng
437	惦记	diàn jì	nhớ nhung, lo lắng
438	电源	diàn yuán	nguồn điện
439	叼	diāo	ngậm
440	雕刻	diāo kè	điêu khắc
441	雕塑	diāo sù	tượng điêu khắc
442	吊	diào	treo, móc
443	调动	diào dòng	điều động
444	跌	diē	ngã, rơi
445	盯	dīng	nhìn chăm chú
446	叮嘱	dīng zhǔ	dặn dò
447	定期	dìng qī	định kỳ
448	定义	dìng yì	định nghĩa
449	丢人	diū rén	mất mặt
450	丢三落四	diū sān là sì	quên trước quên sau
451	东道主	dōng dào zhǔ	chủ nhà, chủ tiệc
452	东张西望	dōng zhāng xī wàng	nhìn đông nhìn tây
453	董事长	dǒng shì zhǎng	chủ tịch hội đồng quản trị
454	栋	dòng	cây trụ, cây cột
455	动荡	dòng dàng	động loạn, bất ổn
456	动机	dòng jī	động cơ, lý do
457	冻结	dòng jié	đóng băng
458	动静	dòng jìng	động tĩnh, tình hình
459	动力	dòng lì	động lực
460	动脉	dòng mài	động mạch
461	动身	dòng shēn	khởi hành, lên đường
462	动手	dòng shǒu	ra tay, bắt tay
463	动态	dòng tài	tình trạng động
464	洞穴	dòng xué	hang động
465	动员	dòng yuán	động viên
466	兜	dōu	túi, bao
467	陡峭	dǒu qiào	dốc đứng, hiểm trở
468	斗争	dòu zhēng	đấu tranh
469	督促	dū cù	đốc thúc, thúc giục
470	都市	dū shì	đô thị, thành phố
471	独裁	dú cái	độc tài
472	毒品	dú pǐn	ma túy
473	赌博	dǔ bó	đánh bạc, cờ bạc
474	堵塞	dǔ sè	tắc nghẽn
475	杜绝	dù jué	ngăn chặn, dứt tuyệt
476	端	duān	đầu, điểm
477	端午节	duān wǔ jié	Tết Đoan Ngọ
478	端正	duān zhèng	chỉnh đốn, ngay thẳng
479	短促	duǎn cù	ngắn ngủi
480	断定	duàn dìng	phán đoán, kết luận
481	断断续续	duàn duàn xù xù	ngắt quãng, rời rạc
482	断绝	duàn jué	đoạn tuyệt
483	堆积	duī jī	chất đống, tích lũy
484	对策	duì cè	đối sách, phương án
485	对称	duì chèn	đối xứng
486	对付	duì fù	đối phó, xử lý
487	兑换	duì huàn	đổi (ngoại tệ)
488	对抗	duì kàng	đối kháng, chống lại
489	对立	duì lì	đối lập, đối kháng
490	对联	duì lián	câu đối
491	队伍	duì wǔ	đội ngũ
492	兑现	duì xiàn	đổi hiện, thực hiện
493	对应	duì yìng	đối ứng, tương ứng
494	对照	duì zhào	đối chiếu, so sánh
495	顿时	dùn shí	ngay lập tức
496	哆嗦	duō suo	run rẩy, run lên
497	多元化	duō yuán huà	đa dạng hóa
498	堕落	duò luò	sa đọa, đồi bại
499	额外	é wài	thêm, bổ sung
500	恶心	ě xīn	buồn nôn, ghê tởm
501	恶化	è huà	trở nên xấu hơn
502	遏制	è zhì	kiềm chế, ngăn chặn
503	恩怨	ēn yuàn	ân oán, thù hận
504	而已	ér yǐ	chỉ vậy thôi
505	耳环	ěr huán	khuyên tai
506	二氧化碳	èr yǎng huà tàn	khí CO2
507	发布	fā bù	phát hành, công bố
508	发财	fā cái	phát tài, làm giàu
509	发呆	fā dāi	ngẩn ngơ, ngây dại
510	发动	fā dòng	khởi động, phát động
511	发火	fā huǒ	nổi giận, bốc cháy
512	发觉	fā jué	phát hiện, nhận ra
513	发射	fā shè	phóng, bắn ra
514	发誓	fā shì	thề, tuyên thệ
515	发行	fā xíng	phát hành
516	发炎	fā yán	viêm, sưng tấy
517	发扬	fā yáng	phát huy
518	发育	fā yù	phát triển, trưởng thành
519	法人	fǎ rén	pháp nhân
520	番	fān	lượt, đợt
521	翻	fān	lật, đảo
522	繁华	fán huá	phồn hoa, sầm uất
523	繁忙	fán máng	bận rộn
524	繁体字	fán tǐ zì	chữ phồn thể
525	繁殖	fán zhí	sinh sản, nhân giống
526	反驳	fǎn bó	phản bác, bác bỏ
527	反常	fǎn cháng	bất thường
528	反倒	fǎn dào	ngược lại, trái lại
529	反动	fǎn dòng	phản động
530	反感	fǎn gǎn	phản cảm, ghét
531	反抗	fǎn kàng	phản kháng, chống cự
532	反馈	fǎn kuì	phản hồi
533	反面	fǎn miàn	mặt trái, mặt khác
534	反射	fǎn shè	phản xạ, phản chiếu
535	反思	fǎn sī	suy nghĩ lại, ngẫm lại
536	反问	fǎn wèn	hỏi ngược lại
537	反之	fǎn zhī	ngược lại
538	范畴	fàn chóu	phạm trù, lĩnh vực
539	泛滥	fàn làn	lan tràn, tràn lan
540	贩卖	fàn mài	buôn bán, buôn lậu
541	方位	fāng wèi	phương vị, vị trí
542	方言	fāng yán	phương ngữ
543	方针	fāng zhēn	phương châm, chính sách
544	防守	fáng shǒu	phòng thủ
545	防疫	fáng yì	phòng dịch
546	防御	fáng yù	phòng ngự, phòng vệ
547	防止	fáng zhǐ	ngăn ngừa, phòng chống
548	防治	fáng zhì	phòng trị
549	纺织	fǎng zhī	dệt, dệt may
550	放大	fàng dà	phóng to
551	放射	fàng shè	phát xạ, bức xạ
552	放手	fàng shǒu	buông tay, thả tay
553	非法	fēi fǎ	phi pháp, bất hợp pháp
554	飞禽走兽	fēi qín zǒu shòu	chim bay thú chạy
555	飞翔	fēi xiáng	bay lượn
556	飞跃	fēi yuè	bay vọt, nhảy vọt
557	肥沃	féi wò	màu mỡ, phì nhiêu
558	诽谤	fěi bàng	phỉ báng, vu khống
559	匪徒	fěi tú	kẻ cướp, kẻ xấu
560	废除	fèi chú	bãi bỏ, hủy bỏ
561	沸腾	fèi téng	sôi, sục sôi
562	废墟	fèi xū	tàn tích, đống đổ nát
563	分辨	fēn biàn	phân biệt
564	分寸	fēn cun	chừng mực, mức độ
565	吩咐	fēn fù	dặn dò, căn dặn
566	分红	fēn hóng	chia lãi, chia lợi tức
567	分解	fēn jiě	phân giải, phân tích
568	分裂	fēn liè	phân liệt, tách rời
569	分泌	fēn mì	tiết ra, bài tiết
570	分明	fēn míng	rõ ràng, phân minh
571	分歧	fēn qí	khác biệt, bất đồng
572	分散	fēn sàn	phân tán, tản ra
573	分手	fēn shǒu	chia tay, chia ly
574	坟墓	fén mù	mộ phần, phần mộ
575	粉末	fěn mò	bột, vụn
576	粉色	fěn sè	màu hồng
577	粉碎	fěn suì	nghiền nát, phá tan
578	分量	fèn liàng	trọng lượng, khối lượng
579	风暴	fēng bào	bão táp, cơn bão
580	封闭	fēng bì	phong bế, đóng kín
581	风度	fēng dù	phong độ, tư cách
582	风光	fēng guāng	phong cảnh, cảnh đẹp
583	封建	fēng jiàn	phong kiến
584	锋利	fēng lì	sắc bén, nhọn
585	丰满	fēng mǎn	đầy đặn, phong phú
586	风气	fēng qì	phong tục, tập quán
587	风趣	fēng qù	hài hước, dí dỏm
588	丰盛	fēng shèng	phong phú, thịnh soạn
589	丰收	fēng shōu	bội thu, mùa màng tốt
590	封锁	fēng suǒ	phong tỏa
591	风土人情	fēng tǔ rén qíng	phong tục tập quán
592	风味	fēng wèi	hương vị, phong vị
593	逢	féng	gặp gỡ, gặp phải
594	奉献	fèng xiàn	hiến dâng, cống hiến
595	否决	fǒu jué	phủ quyết, bác bỏ
596	夫妇	fū fù	vợ chồng
597	夫人	fū rén	phu nhân
598	敷衍	fū yǎn	qua loa, đại khái
599	幅度	fú dù	biên độ, phạm vi
600	符号	fú hào	ký hiệu
601	福利	fú lì	phúc lợi
602	俘虏	fú lǔ	bắt giữ, tù binh
603	服气	fú qì	phục tùng, chịu phục
604	福气	fú qì	may mắn, phúc đức
605	辐射	fú shè	bức xạ, tia phóng xạ
606	腐败	fǔ bài	tham nhũng, thối nát
607	腐烂	fǔ làn	thối rữa, mục nát
608	腐蚀	fǔ shí	ăn mòn, bào mòn
609	腐朽	fǔ xiǔ	mục nát, lạc hậu
610	抚养	fǔ yǎng	nuôi dưỡng
611	俯仰	fǔ yǎng	cúi ngửa, nhấp nhổm
612	辅助	fǔ zhù	hỗ trợ, trợ giúp
613	副	fù	phó, phụ
614	负担	fù dān	gánh nặng, chịu trách nhiệm
615	覆盖	fù gài	che phủ, bao phủ
616	附和	fù hè	phụ họa, theo
617	复活	fù huó	phục hồi, tái sinh
618	附件	fù jiàn	tệp đính kèm
619	附属	fù shǔ	phụ thuộc
620	腹泻	fù xiè	tiêu chảy
621	复兴	fù xīng	phục hưng
622	赋予	fù yǔ	trao cho, giao cho
623	富裕	fù yù	giàu có, phong phú
624	副作用	fù zuò yòng	tác dụng phụ
625	改良	gǎi liáng	cải tiến, cải tạo
626	盖章	gài zhāng	đóng dấu, ký tên
627	尴尬	gān gà	ngượng ngùng, khó xử
628	干旱	gān hàn	khô hạn, hạn hán
629	干扰	gān rǎo	can thiệp, quấy rầy
630	干涉	gān shè	can thiệp
631	甘心	gān xīn	cam tâm, vui lòng
632	干预	gān yù	can dự, can thiệp
633	感慨	gǎn kǎi	cảm khái, xúc động
634	感染	gǎn rǎn	lây nhiễm, truyền nhiễm
635	干劲	gàn jìn	nhiệt tình, hăng hái
636	扛	káng	vác, gánh
637	刚刚	gāng gāng	vừa mới, vừa lúc
638	纲领	gāng lǐng	cương lĩnh
639	港口	gǎng kǒu	cảng, bến cảng
640	港湾	gǎng wān	vịnh cảng
641	岗位	gǎng wèi	vị trí, cương vị
642	杠杆	gàng gǎn	đòn bẩy
643	高超	gāo chāo	cao siêu, xuất sắc
644	高潮	gāo cháo	cao trào, đỉnh cao
645	高峰	gāo fēng	đỉnh cao, cao điểm
646	高考	gāo kǎo	kỳ thi đại học
647	高明	gāo míng	cao minh, thông minh
648	高尚	gāo shàng	cao thượng, cao quý
649	高涨	gāo zhǎng	tăng cao, nổi lên
650	稿件	gǎo jiàn	bản thảo, tài liệu
651	告辞	gào cí	cáo từ, từ biệt
652	告诫	gào jiè	cảnh cáo, nhắc nhở
653	割	gē	cắt, gặt
654	搁	gē	đặt, để
655	疙瘩	gē da	mụn, cục
656	歌颂	gē sòng	ca ngợi, ca tụng
657	隔阂	gé hé	ngăn cách, trở ngại
658	格局	gé jú	cấu trúc, bố cục
659	隔离	gé lí	cách ly
660	格式	gé shì	kiểu mẫu, khuôn mẫu
661	各抒己见	gè shū jǐ jiàn	mỗi người một ý
662	个体	gè tǐ	cá thể, cá nhân
663	各自	gè zì	từng người, mỗi người
664	跟前	gēn qián	trước mặt, bên cạnh
665	根深蒂固	gēn shēn dì gù	ăn sâu bám rễ
666	跟随	gēn suí	theo đuôi, đi theo
667	根源	gēn yuán	căn nguyên, nguồn gốc
668	跟踪	gēn zōng	theo dõi, bám đuôi
669	耕地	gēng dì	canh tác, trồng trọt
670	更新	gēng xīn	đổi mới, cập nhật
671	更正	gēng zhèng	cải chính, sửa lại
672	公安局	gōng ān jú	công an
673	供不应求	gōng bù yìng qiú	cung không đủ cầu
674	公道	gōng dào	công bằng, hợp lý
675	宫殿	gōng diàn	cung điện
676	工夫	gōng fu	công phu, thời gian
677	公告	gōng gào	thông báo
678	公关	gōng guān	quan hệ công chúng
679	攻击	gōng jī	tấn công
680	供给	gōng jǐ	cung cấp
681	恭敬	gōng jìng	kính cẩn, cung kính
682	功课	gōng kè	bài tập, môn học
683	攻克	gōng kè	công phá, chinh phục
684	功劳	gōng láo	công lao
685	公民	gōng mín	công dân
686	公婆	gōng pó	cha mẹ chồng
687	公然	gōng rán	công khai
688	公认	gōng rèn	công nhận
689	公式	gōng shì	công thức
690	公务	gōng wù	công vụ, công tác
691	功效	gōng xiào	hiệu quả
692	工艺品	gōng yì pǐn	đồ thủ công mỹ nghệ
693	公正	gōng zhèng	công bằng, chính trực
694	公证	gōng zhèng	công chứng
695	巩固	gǒng gù	củng cố
696	共和国	gòng hé guó	nước cộng hòa
697	共计	gòng jì	tổng cộng
698	共鸣	gòng míng	cộng hưởng, đồng cảm
699	勾结	gōu jié	cấu kết, thông đồng
700	钩子	gōu zi	cái móc, cái lưỡi câu
701	构思	gòu sī	cấu tứ, suy nghĩ
702	孤独	gū dú	cô độc, cô đơn
703	辜负	gū fù	phụ lòng, phụ sự kỳ vọng
704	孤立	gū lì	cô lập, đơn độc
705	姑且	gū qiě	tạm thời, tạm thời cứ
706	股东	gǔ dōng	cổ đông
707	古董	gǔ dǒng	cổ vật, đồ cổ
708	鼓动	gǔ dòng	cổ động, kích động
709	股份	gǔ fèn	cổ phần
710	骨干	gǔ gàn	nòng cốt, trụ cột
711	古怪	gǔ guài	kỳ quái, kỳ lạ
712	顾虑	gù lǜ	lo ngại, e ngại
713	固然	gù rán	cố nhiên, dĩ nhiên
714	顾问	gù wèn	cố vấn
715	故乡	gù xiāng	cố hương, quê hương
716	固有	gù yǒu	vốn có, sẵn có
717	故障	gù zhàng	trục trặc, hỏng hóc
718	固执	gù zhí	cố chấp, bướng bỉnh
719	拐杖	guǎi zhàng	gậy chống, gậy chống đi
720	官方	guān fāng	chính thức, của chính phủ
721	观光	guān guāng	tham quan, du lịch
722	关照	guān zhào	quan tâm, chăm sóc
723	管辖	guǎn xiá	quản lý, cai quản
724	罐	guàn	bình, lọ, hũ
725	贯彻	guàn chè	quán triệt
726	灌溉	guàn gài	tưới tiêu, tưới
727	惯例	guàn lì	thói quen, thông lệ
728	光彩	guāng cǎi	rực rỡ, vẻ vang
729	光辉	guāng huī	hào quang, ánh sáng
730	光芒	guāng máng	tia sáng, ánh sáng
731	广阔	guǎng kuò	rộng lớn, bao la
732	规范	guī fàn	quy phạm, quy tắc
733	规格	guī gé	tiêu chuẩn, quy cách
734	归根到底	guī gēn dào dǐ	xét đến cùng, cuối cùng
735	规划	guī huà	quy hoạch, kế hoạch
736	归还	guī huán	hoàn trả, trả lại
737	归纳	guī nà	quy nạp, tóm lại
738	规章	guī zhāng	quy định, quy tắc
739	轨道	guǐ dào	quỹ đạo, đường ray
740	跪	guì	quỳ
741	贵族	guì zú	quý tộc
742	棍棒	gùn bàng	gậy, côn
743	国防	guó fáng	quốc phòng
744	国务院	guó wù yuàn	quốc vụ viện
745	果断	guǒ duàn	quyết đoán, quả quyết
746	过度	guò dù	quá mức, quá độ
747	过渡	guò dù	chuyển tiếp, quá độ
748	过奖	guò jiǎng	quá khen
749	过滤	guò lǜ	lọc, sàng lọc
750	过失	guò shī	lỗi lầm, sai lầm
751	过问	guò wèn	can thiệp, hỏi han
752	过瘾	guò yǐn	đã, sướng, thoả thích
753	过于	guò yú	quá, hơn
754	嗨	hāi	chào, này
755	海拔	hǎi bá	độ cao so với mặt biển
756	海滨	hǎi bīn	bờ biển
757	含糊	hán hu	mơ hồ, không rõ ràng
758	寒暄	hán xuān	hỏi han, trò chuyện
759	含义	hán yì	hàm ý, ý nghĩa
760	罕见	hǎn jiàn	hiếm thấy, hiếm gặp
761	捍卫	hàn wèi	bảo vệ, bảo hộ
762	航空	háng kōng	hàng không
763	行列	háng liè	hàng, dòng
764	航天	háng tiān	hàng không vũ trụ
765	航行	háng xíng	hàng hải, đi biển
766	豪迈	háo mài	hào hiệp, hào phóng
767	毫米	háo mǐ	milimét
768	毫无	háo wú	không hề, chẳng có
769	耗费	hào fèi	tiêu tốn, tiêu hao
770	好客	hào kè	hiếu khách
771	号召	hào zhào	kêu gọi
772	呵	hē	ha (tiếng kêu ngạc nhiên)
773	和蔼	hé ǎi	hòa nhã, dễ gần
774	合并	hé bìng	hợp nhất, sát nhập
775	合成	hé chéng	hợp thành, tổng hợp
776	合乎	hé hū	hợp với, phù hợp với
777	合伙	hé huǒ	hợp tác, cùng nhau
778	和解	hé jiě	hòa giải
779	和睦	hé mù	hòa thuận
780	和气	hé qì	hòa nhã, hòa thuận
781	合身	hé shēn	vừa người, vừa vặn
782	合算	hé suàn	đáng giá, có lợi
783	和谐	hé xié	hòa hợp, hài hòa
784	嘿	hēi	hì, này (tiếng gọi)
785	痕迹	hén jì	vết tích, dấu vết
786	狠心	hěn xīn	nhẫn tâm
787	恨不得	hèn bu de	hận không thể
788	哼	hēng	hừ, hừm
789	哄	hōng	dỗ, lừa
790	烘	hōng	nướng, sấy khô
791	轰动	hōng dòng	náo động, chấn động
792	红包	hóng bāo	bao lì xì, phong bì đỏ
793	宏观	hóng guān	vĩ mô
794	洪水	hóng shuǐ	lũ lụt
795	宏伟	hóng wěi	hùng vĩ, to lớn
796	喉咙	hóu lóng	cổ họng
797	吼	hǒu	gào thét, hét lên
798	后代	hòu dài	đời sau, hậu thế
799	后顾之忧	hòu gù zhī yōu	lo lắng về sau
800	后面	hòu miàn	phía sau, đằng sau
801	后勤	hòu qín	hậu cần
802	候选	hòu xuǎn	ứng cử, đề cử
803	忽略	hū lüè	lơ là, bỏ qua
804	呼啸	hū xiào	hú lên, rít lên
805	呼吁	hū yù	kêu gọi, hô hào
806	胡乱	hú luàn	lung tung, bừa bãi
807	湖泊	hú pō	hồ nước
808	互联网	hù lián wǎng	mạng internet
809	华丽	huá lì	lộng lẫy, hoa lệ
810	华侨	huá qiáo	Hoa kiều
811	化肥	huà féi	phân bón hóa học
812	划分	huà fēn	phân chia
813	画蛇添足	huà shé tiān zú	vẽ rắn thêm chân
814	化石	huà shí	hóa thạch
815	话筒	huà tǒng	micro, ống nói
816	化验	huà yàn	xét nghiệm, hóa nghiệm
817	化妆	huà zhuāng	hóa trang, trang điểm
818	怀孕	huái yùn	mang thai, có thai
819	欢乐	huān lè	vui vẻ, hoan lạc
820	环节	huán jié	phân đoạn, mắt xích
821	还原	huán yuán	hoàn nguyên, trở lại
822	缓和	huǎn hé	dịu lại, hoà dịu
823	患者	huàn zhě	bệnh nhân
824	荒凉	huāng liáng	hoang vắng
825	慌忙	huāng máng	vội vàng, hốt hoảng
826	荒谬	huāng miù	hoang đường, phi lý
827	荒唐	huāng táng	hoang đường, phi lý
828	黄昏	huáng hūn	hoàng hôn, chiều tối
829	恍然大悟	huǎng rán dà wù	bừng tỉnh hiểu ra
830	辉煌	huī huáng	huy hoàng, rực rỡ
831	挥霍	huī huò	hoang phí
832	回报	huí bào	đền đáp, báo đáp
833	回避	huí bì	tránh né, né tránh
834	回顾	huí gù	hồi tưởng, nhìn lại
835	回收	huí shōu	tái chế, thu hồi
836	悔恨	huǐ hèn	hối hận, ân hận
837	毁灭	huǐ miè	hủy diệt, tiêu diệt
838	汇报	huì bào	báo cáo, thông báo
839	贿赂	huì lù	hối lộ
840	会晤	huì wù	hội đàm, gặp gỡ
841	昏迷	hūn mí	hôn mê
842	浑身	hún shēn	toàn thân, khắp người
843	混合	hùn hé	pha trộn, hỗn hợp
844	混乱	hùn luàn	hỗn loạn
845	混淆	hùn xiáo	lẫn lộn, nhầm lẫn
846	混浊	hùn zhuó	đục, vẩn đục
847	活该	huó gāi	đáng đời
848	活力	huó lì	sinh lực, sức sống
849	火箭	huǒ jiàn	tên lửa
850	火焰	huǒ yàn	ngọn lửa, hỏa diễm
851	火药	huǒ yào	thuốc nổ
852	货币	huò bì	tiền tệ
853	或许	huò xǔ	có lẽ, có thể
854	基地	jī dì	căn cứ
855	机动	jī dòng	linh động, cơ động
856	饥饿	jī è	đói khát, đói
857	激发	jī fā	kích thích, khơi dậy
858	机构	jī gòu	cơ quan, tổ chức
859	机关	jī guān	cơ quan, bộ máy
860	基金	jī jīn	quỹ, ngân quỹ
861	激励	jī lì	khuyến khích, động viên
862	机灵	jī ling	lanh lợi, tinh nhanh
863	机密	jī mì	bí mật, cơ mật
864	激情	jī qíng	nhiệt tình, hăng hái
865	讥笑	jī xiào	châm chọc, chế giễu
866	机械	jī xiè	máy móc, cơ giới
867	基因	jī yīn	gen, di truyền
868	机遇	jī yù	cơ hội
869	机智	jī zhì	lanh trí, tinh khôn
870	即便	jí biàn	dù cho, cho dù
871	级别	jí bié	cấp bậc, cấp độ
872	疾病	jí bìng	bệnh tật, ốm đau
873	嫉妒	jí dù	đố kỵ, ghen tị
874	极端	jí duān	cực đoan
875	急功近利	jí gōng jìn lì	vội vàng, nôn nóng
876	籍贯	jí guàn	quê quán
877	即将	jí jiāng	sắp sửa, sắp tới
878	急剧	jí jù	nhanh chóng, mãnh liệt
879	急切	jí qiè	cấp thiết, khẩn cấp
880	集团	jí tuán	tập đoàn
881	极限	jí xiàn	cực hạn, giới hạn
882	吉祥	jí xiáng	cát tường, may mắn
883	急于求成	jí yú qiú chéng	nóng lòng, sốt ruột
884	及早	jí zǎo	sớm, trước
885	急躁	jí zào	nóng nảy, vội vàng
886	给予	jǐ yǔ	cho, tặng
887	继承	jì chéng	kế thừa
888	季度	jì dù	quý (3 tháng)
889	忌讳	jì huì	kiêng kỵ
890	计较	jì jiào	tính toán, so đo
891	寂静	jì jìng	yên tĩnh, tĩnh mịch
892	季军	jì jūn	hạng ba, giải ba
893	技能	jì néng	kỹ năng
894	技巧	jì qiǎo	kỹ xảo, khéo léo
895	寄托	jì tuō	gửi gắm, nhờ cậy
896	继往开来	jì wǎng kāi lái	tiếp nối phát triển
897	迹象	jì xiàng	dấu hiệu, dấu vết
898	记性	jì xìng	trí nhớ
899	纪要	jì yào	tóm tắt, ghi chép
900	记载	jì zǎi	ghi chép, ghi lại
901	家常	jiā cháng	thường ngày
902	加工	jiā gōng	gia công, chế biến
903	家伙	jiā huǒ	dụng cụ, khí cụ
904	加剧	jiā jù	trầm trọng thêm
905	家属	jiā shǔ	gia thuộc, người nhà
906	佳肴	jiā yáo	món ngon, món ngon miệng
907	家喻户晓	jiā yù hù xiǎo	ai cũng biết, khắp nơi đều biết
908	夹杂	jiā zá	xen lẫn, trộn lẫn
909	假设	jiǎ shè	giả thiết, giả dụ
910	假使	jiǎ shǐ	nếu, giả sử
911	坚定	jiān dìng	kiên định, vững chắc
912	监督	jiān dū	giám sát, quản lý
913	尖端	jiān duān	mũi nhọn, tiên tiến
914	坚固	jiān gù	kiên cố, vững chắc
915	艰难	jiān nán	gian nan, khó khăn
916	坚韧	jiān rèn	kiên cường, bền bỉ
917	坚实	jiān shí	chắc chắn, vững chắc
918	监视	jiān shì	giám sát, theo dõi
919	坚硬	jiān yìng	cứng rắn, kiên cố
920	监狱	jiān yù	nhà tù, trại giam
921	兼职	jiān zhí	việc làm thêm, bán thời gian
922	拣	jiǎn	chọn, nhặt
923	剪彩	jiǎn cǎi	cắt băng khánh thành
924	简化	jiǎn huà	giản hóa, đơn giản hóa
925	简陋	jiǎn lòu	sơ sài, thô sơ
926	检讨	jiǎn tǎo	kiểm điểm, xem xét lại
927	简体字	jiǎn tǐ zì	chữ giản thể
928	检验	jiǎn yàn	kiểm nghiệm, kiểm tra
929	简要	jiǎn yào	tóm tắt, ngắn gọn
930	溅	jiàn	bắn lên, văng ra
931	鉴别	jiàn bié	phân biệt, nhận định
932	间谍	jiàn dié	gián điệp
933	鉴定	jiàn dìng	giám định, xác định
934	见多识广	jiàn duō shí guǎng	hiểu biết rộng rãi
935	间隔	jiàn gé	khoảng cách, khoảng thời gian
936	间接	jiàn jiē	gián tiếp
937	见解	jiàn jiě	cách nhìn, quan điểm
938	健全	jiàn quán	kiện toàn, hoàn thiện
939	践踏	jiàn tà	dẫm đạp, đạp nát
940	舰艇	jiàn tǐng	tàu chiến
941	见闻	jiàn wén	hiểu biết, sự từng trải
942	见义勇为	jiàn yì yǒng wéi	thấy việc nghĩa thì làm
943	鉴于	jiàn yú	bởi vì, xét thấy
944	将近	jiāng jìn	gần, xấp xỉ
945	将军	jiāng jūn	tướng quân, tướng lĩnh
946	僵硬	jiāng yìng	cứng đờ, không linh hoạt
947	桨	jiǎng	mái chèo
948	奖励	jiǎng lì	khen thưởng, khuyến khích
949	奖赏	jiǎng shǎng	thưởng, phần thưởng
950	降临	jiàng lín	đến, xảy đến
951	交叉	jiāo chā	giao nhau, cắt ngang
952	交代	jiāo dài	giải thích, bàn giao
953	焦点	jiāo diǎn	tiêu điểm, điểm nóng
954	焦急	jiāo jí	lo lắng, sốt ruột
955	娇气	jiāo qì	mềm yếu, mỏng manh
956	交涉	jiāo shè	đàm phán, thương lượng
957	交往	jiāo wǎng	qua lại, giao lưu
958	交易	jiāo yì	giao dịch, buôn bán
959	搅拌	jiǎo bàn	khuấy, trộn
960	角落	jiǎo luò	góc, xó xỉnh
961	缴纳	jiǎo nà	nộp, đóng tiền
962	较量	jiào liàng	so tài, đấu
963	教养	jiào yǎng	giáo dục, nuôi dạy
964	皆	jiē	tất cả, đều
965	阶层	jiē céng	tầng lớp, giai tầng
966	揭发	jiē fā	vạch trần, phát giác
967	接连	jiē lián	liên tiếp, liên tục
968	揭露	jiē lù	phơi bày, lộ ra
969	杰出	jié chū	xuất sắc, kiệt xuất
970	结果	jié guǒ	kết quả
971	竭尽全力	jié jìn quán lì	dốc hết sức lực
972	结晶	jié jīng	kết tinh, kết quả
973	结局	jié jú	kết cục, kết thúc
974	结算	jié suàn	thanh toán
975	截至	jié zhì	cho đến, tính đến
976	节奏	jié zòu	nhịp điệu, tiết tấu
977	解除	jiě chú	giải trừ, hủy bỏ
978	解雇	jiě gù	sa thải, đuổi việc
979	解剖	jiě pōu	giải phẫu
980	解散	jiě sàn	giải tán, tan rã
981	解体	jiě tǐ	phân hủy, tan rã
982	戒备	jiè bèi	cảnh giới, phòng bị
983	借鉴	jiè jiàn	học hỏi, tham khảo
984	界限	jiè xiàn	giới hạn, ranh giới
985	借助	jiè zhù	nhờ cậy, dựa vào
986	津津有味	jīn jīn yǒu wèi	thích thú, say mê
987	金融	jīn róng	tài chính
988	尽快	jǐn kuài	nhanh chóng, càng sớm càng tốt
989	尽量	jǐn liàng	hết sức, cố gắng hết mức
990	紧密	jǐn mì	chặt chẽ, mật thiết
991	紧迫	jǐn pò	cấp bách, khẩn cấp
992	锦绣前程	jǐn xiù qián chéng	tiền đồ sáng lạn
993	进而	jìn ér	tiếp đó, sau đó
994	进攻	jìn gōng	tấn công
995	进化	jìn huà	tiến hóa
996	近来	jìn lái	gần đây
997	浸泡	jìn pào	ngâm, tẩm
998	晋升	jìn shēng	thăng tiến, thăng chức
999	近视	jìn shì	cận thị
1000	劲头	jìn tóu	hứng thú, động lực
1001	进展	jìn zhǎn	tiến triển, tiến độ
1002	茎	jīng	cuống, thân cây
1003	精打细算	jīng dǎ xì suàn	tính toán kỹ lưỡng
1004	惊动	jīng dòng	làm kinh động, quấy rầy
1005	经费	jīng fèi	kinh phí
1006	精华	jīng huá	tinh hoa, tinh túy
1007	精简	jīng jiǎn	giản đơn, tinh gọn
1008	兢兢业业	jīng jīng yè yè	cẩn thận, chăm chỉ
1009	精密	jīng mì	chính xác, tỉ mỉ
1010	惊奇	jīng qí	kinh ngạc, ngạc nhiên
1011	精确	jīng què	chính xác, đúng đắn
1012	经商	jīng shāng	kinh doanh
1013	精通	jīng tōng	thông thạo, tinh thông
1014	经纬	jīng wěi	kinh độ và vĩ độ
1015	精心	jīng xīn	dày công, tỉ mỉ
1016	惊讶	jīng yà	ngạc nhiên
1017	精益求精	jīng yì qiú jīng	cải tiến, hoàn thiện
1018	精致	jīng zhì	tinh xảo, tinh tế
1019	井	jǐng	giếng, thùng
1020	警告	jǐng gào	cảnh báo
1021	警惕	jǐng tì	cảnh giác
1022	颈椎	jǐng zhuī	đốt sống cổ
1023	境界	jìng jiè	cảnh giới, ranh giới
1024	敬礼	jìng lǐ	chào hỏi, chào kính
1025	竞赛	jìng sài	thi đấu, cạnh tranh
1026	镜头	jìng tóu	ống kính, cảnh quay
1027	竞选	jìng xuǎn	tranh cử, vận động bầu cử
1028	纠纷	jiū fēn	tranh chấp, mâu thuẫn
1029	纠正	jiū zhèng	sửa chữa, đính chính
1030	酒精	jiǔ jīng	cồn, rượu
1031	救济	jiù jì	cứu trợ
1032	就近	jiù jìn	gần, lân cận
1033	就业	jiù yè	việc làm, tìm việc
1034	就职	jiù zhí	nhậm chức, nhận chức
1035	鞠躬	jū gōng	cúi đầu, cúi chào
1036	拘留	jū liú	tạm giam, tạm giữ
1037	拘束	jū shù	gò bó, ràng buộc
1038	居住	jū zhù	cư trú, sinh sống
1039	局部	jú bù	cục bộ, một phần
1040	局面	jú miàn	cục diện, tình thế
1041	局势	jú shì	tình hình, tình thế
1042	局限	jú xiàn	hạn chế, giới hạn
1043	举动	jǔ dòng	hành động, động thái
1044	咀嚼	jǔ jué	nhai, nghiền ngẫm
1045	沮丧	jǔ sàng	thất vọng, buồn bã
1046	举世闻名	jǔ shì wén míng	nổi tiếng khắp thế giới
1047	举世瞩目	jǔ shì zhǔ mù	chú ý khắp thế giới
1048	举足轻重	jǔ zú qīng zhòng	có vai trò quan trọng
1049	剧本	jù běn	kịch bản, kịch bản phim
1050	聚精会神	jù jīng huì shén	tập trung cao độ
1051	剧烈	jù liè	dữ dội, kịch liệt
1052	据悉	jù xī	được biết, theo tin
1053	决策	jué cè	quyết sách, quyết định
1054	绝望	jué wàng	tuyệt vọng
1055	觉悟	jué wù	giác ngộ, tỉnh ngộ
1056	觉醒	jué xǐng	thức tỉnh, tỉnh ngộ
1057	军队	jūn duì	quân đội
1058	卡通	kǎ tōng	hoạt hình
1059	开采	kāi cǎi	khai thác
1060	开除	kāi chú	khai trừ, đuổi học
1061	开阔	kāi kuò	mở rộng, rộng rãi
1062	开朗	kāi lǎng	vui vẻ, cởi mở
1063	开明	kāi míng	khai sáng, sáng suốt
1064	开辟	kāi pì	mở đường, khai mở
1065	开水	kāi shuǐ	nước sôi
1066	开拓	kāi tuò	khai thác, mở rộng
1067	开展	kāi zhǎn	triển khai, phát triển
1068	开支	kāi zhī	chi phí, chi tiêu
1069	刊登	kān dēng	đăng tải, đăng báo
1070	勘探	kān tàn	khảo sát, thăm dò
1071	刊物	kān wù	ấn phẩm, tạp chí
1072	看待	kàn dài	xem xét, đánh giá
1073	看来	kàn lái	xem ra, có vẻ như
1074	看望	kàn wàng	thăm hỏi, thăm viếng
1075	慷慨	kāng kǎi	hào phóng, rộng lượng
1076	考察	kǎo chá	khảo sát, điều tra
1077	考古	kǎo gǔ	khảo cổ
1078	考核	kǎo hé	kiểm tra, đánh giá
1079	考验	kǎo yàn	thử thách, kiểm nghiệm
1080	靠拢	kào lǒng	xích lại, gần kề
1081	磕	kē	đập, va đập
1082	颗粒	kē lì	hạt, hạt nhỏ
1083	科目	kē mù	môn học, khóa học
1084	可观	kě guān	đáng kể, to lớn
1085	可口	kě kǒu	ngon miệng
1086	渴望	kě wàng	khao khát, mong đợi
1087	可恶	kě wù	đáng ghét
1088	可笑	kě xiào	buồn cười, nực cười
1089	可行	kě xíng	khả thi, có thể thực hiện
1090	刻不容缓	kè bù róng huǎn	cấp bách, không thể trì hoãn
1091	客户	kè hù	khách hàng
1092	课题	kè tí	đề tài, vấn đề
1093	啃	kěn	gặm, nhấm
1094	恳切	kěn qiè	tha thiết, khẩn thiết
1095	坑	kēng	hố, hố sâu
1096	空洞	kōng dòng	trống rỗng, hời hợt
1097	空前绝后	kōng qián jué hòu	có một không hai
1098	空想	kōng xiǎng	mơ tưởng, ảo tưởng
1099	空虚	kōng xū	trống trải, vô vị
1100	孔	kǒng	lỗ, hố
1101	恐吓	kǒng hè	đe dọa, hăm dọa
1102	恐惧	kǒng jù	sợ hãi, kinh hãi
1103	空白	kòng bái	chỗ trống, khoảng trống
1104	空隙	kòng xì	khoảng trống, khe hở
1105	口气	kǒu qì	khẩu khí, giọng điệu
1106	口腔	kǒu qiāng	khoang miệng
1107	口头	kǒu tóu	bằng miệng, bằng lời nói
1108	口音	kǒu yīn	giọng, giọng nói
1109	枯竭	kū jié	khô cạn, cạn kiệt
1110	枯燥	kū zào	khô khan, buồn tẻ
1111	苦尽甘来	kǔ jìn gān lái	khổ tận cam lai, qua cơn bĩ cực đến hồi thái lai
1112	挎	kuà	đeo, khoác
1113	跨	kuà	bước qua, vượt qua
1114	快活	kuài huó	vui vẻ, hạnh phúc
1115	宽敞	kuān chang	rộng rãi, thoáng đãng
1116	款待	kuǎn dài	khoản đãi, tiếp đãi
1117	款式	kuǎn shì	kiểu dáng, mẫu mã
1118	筐	kuāng	giỏ, sọt
1119	框架	kuàng jià	khung, sườn
1120	旷课	kuàng kè	bỏ học, trốn học
1121	况且	kuàng qiě	hơn nữa, vả lại
1122	亏待	kuī dài	đối xử tệ, bạc đãi
1123	亏损	kuī sǔn	tổn thất, thua lỗ
1124	昆虫	kūn chóng	côn trùng, sâu bọ
1125	捆绑	kǔn bǎng	trói buộc, ràng buộc
1126	扩充	kuò chōng	mở rộng, khuếch trương
1127	扩散	kuò sàn	lan rộng, khuếch tán
1128	扩张	kuò zhāng	mở rộng, bành trướng
1129	啦	la	(trợ từ ngữ khí)
1130	喇叭	lǎ ba	loa, còi
1131	来历	lái lì	lai lịch, nguồn gốc
1132	来源	lái yuán	nguồn gốc, xuất xứ
1133	栏目	lán mù	chuyên mục, mục báo
1134	懒惰	lǎn duò	lười biếng
1135	狼狈	láng bèi	khốn khổ, nhục nhã
1136	朗读	lǎng dú	đọc to, đọc diễn cảm
1137	捞	lāo	vớt, moi móc
1138	唠叨	láo dao	nói lải nhải, càm ràm
1139	牢固	láo gù	vững chắc, kiên cố
1140	牢骚	láo sāo	bất mãn, oán giận
1141	乐趣	lè qù	niềm vui, thú vui
1142	乐意	lè yì	vui lòng, sẵn lòng
1143	雷达	léi dá	radar
1144	类似	lèi sì	tương tự, giống như
1145	冷淡	lěng dàn	lạnh nhạt, hờ hững
1146	冷酷	lěng kù	lạnh lùng, tàn nhẫn
1147	冷却	lěngquè	Làm lạnh, làm nguội
1148	愣	lèng	Ngây ra, sững sờ
1149	黎明	límíng	Bình minh
1150	理睬	lǐcǎi	Quan tâm, để ý
1151	里程碑	lǐchéngbēi	Cột mốc
1152	礼节	lǐjié	Lễ tiết, lễ nghi
1153	理所当然	lǐsuǒdāngrán	Lẽ dĩ nhiên
1154	理直气壮	lǐzhíqìzhuàng	Đầy lý lẽ
1155	理智	lǐzhì	Lý trí, lý trí cao
1156	立场	lìchǎng	Lập trường
1157	历代	lìdài	Các đời, qua các thời đại
1158	利害	lìhài	Lợi hại
1159	立交桥	lìjiāoqiáo	Cầu vượt
1160	历来	lìlái	Từ trước đến nay
1161	利率	lìlǜ	Lãi suất
1162	力所能及	lìsuǒnéngjí	Trong khả năng
1163	立体	lìtǐ	Lập thể, ba chiều
1164	力图	lìtú	Cố gắng
1165	例外	lìwài	Ngoại lệ
1166	力争	lìzhēng	Cố gắng giành được
1167	立足	lìzú	Đứng chân, có chỗ đứng
1168	联欢	liánhuān	Liên hoan
1169	廉洁	liánjié	Liêm khiết
1170	联络	liánluò	Liên lạc
1171	联盟	liánméng	Liên minh
1172	连年	liánnián	Nhiều năm liên tiếp
1173	连锁	liánsuǒ	Chuỗi, liên tiếp
1174	连同	liántóng	Kèm theo, cùng với
1175	联想	liánxiǎng	Liên tưởng
1176	良心	liángxīn	Lương tâm
1177	晾	liàng	Phơi
1178	谅解	liàngjiě	Thấu hiểu, thông cảm
1179	辽阔	liáokuò	Rộng lớn, bao la
1180	列举	lièjǔ	Liệt kê
1181	淋	lín	Dầm, ướt sũng
1182	临床	línchuáng	Lâm sàng
1183	吝啬	lìnsè	Keo kiệt
1184	凌晨	língchén	Rạng sáng
1185	灵感	línggǎn	Cảm hứng
1186	灵魂	línghún	Linh hồn
1187	伶俐	línglì	Lanh lợi
1188	灵敏	língmǐn	Nhạy bén
1189	零星	língxīng	Lẻ tẻ, rời rạc
1190	领会	lǐnghuì	Hiểu rõ, lĩnh hội
1191	领事馆	lǐngshìguǎn	Lãnh sự quán
1192	领土	lǐngtǔ	Lãnh thổ
1193	领悟	lǐngwù	Hiểu rõ, lĩnh ngộ
1194	领先	lǐngxiān	Dẫn đầu
1195	领袖	lǐngxiù	Lãnh tụ, người đứng đầu
1196	溜	liū	Lẻn đi
1197	流浪	liúlàng	Lang thang
1198	留恋	liúliàn	Lưu luyến
1199	流露	liúlù	Thổ lộ
1200	流氓	liúmáng	Lưu manh
1201	留念	liúniàn	Lưu niệm
1202	留神	liúshén	Chú ý, cẩn thận
1203	流通	liútōng	Lưu thông
1204	聋哑	lóngyǎ	Điếc và câm
1205	隆重	lóngzhòng	Long trọng
1206	垄断	lǒngduàn	Lũng đoạn
1207	笼罩	lǒngzhào	Bao trùm
1208	搂	lǒu	Ôm
1209	炉灶	lúzào	Bếp lò
1210	轮船	lúnchuán	Tàu thuỷ
1211	轮廓	lúnkuò	Đường nét, hình dáng
1212	轮胎	lúntāi	Lốp xe
1213	论坛	lùntán	Diễn đàn
1214	论证	lùnzhèng	Chứng minh, luận chứng
1215	啰唆	luōsuo	Lắm lời, lằng nhằng
1216	螺丝钉	luósīdīng	Đinh vít
1217	落成	luòchéng	Hoàn thành (công trình)
1218	落实	luòshí	Thực hiện, thực thi
1219	络绎不绝	luòyìbùjué	Liên tục không dứt
1220	屡次	lǚcì	Nhiều lần
1221	履行	lǚxíng	Thực hiện, thi hành
1222	掠夺	lüèduó	Cướp bóc
1223	略微	lüèwēi	Hơi, một chút
1224	麻痹	mábì	Tê liệt
1225	麻木	mámù	Tê dại, tê liệt
1226	麻醉	mázuì	Gây mê
1227	码头	mǎtóu	Bến cảng
1228	嘛	ma	Mà, nhé
1229	埋伏	máifú	Mai phục
1230	埋没	máimò	Chôn vùi, vùi lấp
1231	埋葬	máizàng	Chôn cất
1232	迈	mài	Bước
1233	脉搏	màibó	Mạch đập, nhịp đập
1234	埋怨	mányuàn	Oán trách
1235	漫长	màncháng	Dài đằng đẵng
1236	漫画	mànhuà	Truyện tranh
1237	慢性	mànxìng	Mãn tính
1238	蔓延	mànyán	Lan rộng
1239	忙碌	mánglù	Bận rộn
1240	茫茫	mángmáng	Mênh mông
1241	盲目	mángmù	Mù quáng
1242	茫然	mángrán	Mờ mịt, ngơ ngác
1243	冒充	màochōng	Giả danh
1244	茂盛	màoshèng	Tươi tốt
1245	枚	méi	Cái, hạt (lượng từ)
1246	媒介	méijiè	Môi giới, trung gian
1247	媒体	méitǐ	Phương tiện truyền thông
1248	没辙	méi zhé	Hết cách, bó tay
1249	美观	měiguān	Đẹp đẽ
1250	美满	měimǎn	Hạnh phúc, mỹ mãn
1251	美妙	měimiào	Tuyệt vời
1252	门诊	ménzhěn	Khám bệnh
1253	蒙	mēng	Bị lừa, bịp bợm
1254	萌芽	méngyá	Mầm mống, nảy mầm
1255	猛烈	měngliè	Mãnh liệt
1256	梦想	mèngxiǎng	Mộng tưởng, ước mơ
1257	眯	mī	Híp mắt
1258	弥补	míbǔ	Bù đắp
1259	迷惑	míhuò	Mê hoặc
1260	弥漫	mímàn	Lan toả, dâng tràn
1261	迷人	mírén	Quyến rũ
1262	迷失	míshī	Lạc mất
1263	迷信	míxìn	Mê tín
1264	密度	mìdù	Mật độ
1265	密封	mìfēng	Niêm phong
1266	免得	miǎnde	Tránh, khỏi phải
1267	勉励	miǎnlì	Khuyến khích
1268	勉强	miǎnqiǎng	Cố gắng, miễn cưỡng
1269	免疫	miǎnyì	Miễn dịch
1270	面貌	miànmào	Diện mạo, dung mạo
1271	面子	miànzi	Thể diện
1272	描绘	miáohuì	Miêu tả
1273	渺小	miǎoxiǎo	Nhỏ bé
1274	蔑视	mièshì	Coi thường, khinh miệt
1275	灭亡	mièwáng	Diệt vong
1276	民间	mínjiān	Dân gian
1277	民用	mínyòng	Dân dụng
1278	敏感	mǐngǎn	Nhạy cảm
1279	敏捷	mǐnjié	Nhanh nhẹn
1280	敏锐	mǐnruì	Nhạy bén
1281	名次	míngcì	Thứ hạng
1282	名额	míng'é	Số người, số lượng quy định
1283	名副其实	míngfùqíshí	Danh xứng kỳ thực
1284	明明	míngmíng	Rõ ràng
1285	名誉	míngyù	Danh dự
1286	命名	mìngmíng	Đặt tên
1287	摸索	mōsuǒ	Mò mẫm
1288	膜	mó	Màng
1289	摩擦	mócā	Ma sát, cọ sát
1290	模范	mófàn	Gương mẫu
1291	魔鬼	móguǐ	Ma quỷ
1292	磨合	móhé	Mài giũa, hoà hợp
1293	模式	móshì	Mô thức, kiểu mẫu
1294	魔术	móshù	Ảo thuật
1295	模型	móxíng	Mô hình
1296	抹杀	mǒshā	Phủ nhận, xoá bỏ
1297	莫名其妙	mòmíngqímiào	Không thể hiểu nổi
1298	默默	mòmò	Lặng lẽ, âm thầm
1299	墨水儿	mòshuǐr	Mực viết
1300	谋求	móuqiú	Mưu cầu
1301	模样	múyàng	Hình dáng, dáng vẻ
1302	母语	mǔyǔ	Tiếng mẹ đẻ
1303	目睹	mùdǔ	Mắt thấy, chứng kiến
1304	目光	mùguāng	Ánh mắt
1305	沐浴	mùyù	Tắm gội
1306	拿手	náshǒu	Giỏi, sở trường
1307	纳闷儿	nàmènr	Bồn chồn, khó hiểu
1308	耐用	nàiyòng	Bền, dùng lâu
1309	难得	nándé	Khó có được, hiếm có
1310	难堪	nánkān	Khó chịu, khó xử
1311	难免	nánmiǎn	Khó tránh, khó khỏi
1312	难能可贵	nánnéngkěguì	Đáng khen ngợi
1313	恼火	nǎohuǒ	Bực mình, tức giận
1314	内涵	nèihán	Nội hàm, hàm súc
1315	内幕	nèimù	Bên trong, nội tình
1316	内在	nèizài	Nội tại, bên trong
1317	能量	néngliàng	Năng lượng
1318	嗯	ń	Ừ, ừm
1319	拟定	nǐdìng	Đề ra, vạch ra
1320	年度	niándù	Niên độ, hàng năm
1321	捏	niē	Nặn, bóp
1322	拧	níng	Vặn, xoay
1323	凝固	nínggù	Đóng băng, đông cứng
1324	凝聚	níngjù	Ngưng tụ
1325	凝视	níngshì	Nhìn chằm chằm
1326	宁肯	nìngkěn	Thà rằng, thà
1327	宁愿	nìngyuàn	Thà, thà rằng
1328	纽扣儿	niǔkòur	Khuy áo, cúc áo
1329	扭转	niǔzhuǎn	Xoay chuyển, xoay ngược
1330	浓厚	nónghòu	Đậm đặc, sâu đậm
1331	农历	nónglì	Lịch âm, âm lịch
1332	奴隶	núlì	Nô lệ
1333	挪	nuó	Chuyển, dời
1334	虐待	nüèdài	Ngược đãi
1335	哦	ó	Ồ, a
1336	殴打	ōudǎ	Đánh đập
1337	欧洲	Ōuzhōu	Châu Âu
1338	呕吐	ǒutù	Nôn mửa
1339	趴	pā	Nằm sấp, phủ phục
1340	排斥	páichì	Bài xích, loại trừ
1341	排除	páichú	Loại trừ, loại bỏ
1342	排放	páifàng	Thải ra, xả thải
1343	徘徊	páihuái	Đi loanh quanh, lưỡng lự
1344	派别	pàibié	Phái, bè phái
1345	派遣	pàiqiǎn	Phái đi, cử đi
1346	攀登	pāndēng	Leo, trèo
1347	盘旋	pánxuán	Lượn quanh
1348	畔	pàn	Bờ, cạnh
1349	判决	pànjué	Phán quyết
1350	庞大	pángdà	To lớn, khổng lồ
1351	抛弃	pāoqì	Vứt bỏ, bỏ rơi
1352	泡沫	pàomò	Bọt, bong bóng
1353	培训	péixùn	Đào tạo, huấn luyện
1354	培育	péiyù	Bồi dưỡng, nuôi dưỡng
1355	配备	pèibèi	Trang bị
1356	配偶	pèi'ǒu	Bạn đời, vợ/chồng
1357	配套	pèitào	Đồng bộ, hoàn chỉnh
1358	盆地	péndì	Thung lũng
1359	烹饪	pēngrèn	Nấu ăn, nấu nướng
1360	捧	pěng	Nâng, bưng
1361	劈	pī	Chẻ, bổ
1362	批发	pīfā	Bán buôn
1363	批判	pīpàn	Phê phán, phê bình
1364	疲惫	píbèi	Mệt mỏi, mệt lả
1365	皮革	pígé	Da thuộc
1366	疲倦	píjuàn	Mệt mỏi, chán chường
1367	脾气	píqi	Tính tình, tính khí
1368	屁股	pìgu	Mông, đít
1369	譬如	pìrú	Ví dụ như
1370	偏差	piānchā	Sai lệch, lệch lạc
1371	偏见	piānjiàn	Định kiến, thành kiến
1372	偏僻	piānpì	Hẻo lánh, xa xôi
1373	偏偏	piānpiān	Cố ý, cố tình
1374	片段	piànduàn	Đoạn, mảnh
1375	片刻	piànkè	Khoảnh khắc
1376	漂浮	piāofú	Nổi, lơ lửng
1377	飘扬	piāoyáng	Bay phấp phới
1378	拼搏	pīnbó	Phấn đấu, nỗ lực
1379	拼命	pīnmìng	Liều mạng, cố hết sức
1380	贫乏	pínfá	Nghèo nàn
1381	频繁	pínfán	Thường xuyên, nhiều lần
1382	贫困	pínkùn	Nghèo khổ, nghèo khó
1383	频率	pínlǜ	Tần suất
1384	品尝	pǐncháng	Nếm, thưởng thức
1385	品德	pǐndé	Đức hạnh
1386	品行	pǐnxíng	Hạnh kiểm, hành vi
1387	品质	pǐnzhì	Chất lượng
1388	平凡	píngfán	Bình thường
1389	评估	pínggū	Đánh giá
1390	评论	pínglùn	Bình luận
1391	平面	píngmiàn	Bề mặt phẳng
1392	平坦	píngtǎn	Bằng phẳng
1393	平行	píngxíng	Song song
1394	平原	píngyuán	Đồng bằng
1395	屏障	píngzhàng	Hàng rào, tường chắn
1396	坡	pō	Dốc, sườn dốc
1397	泼	pō	Té, hắt
1398	颇	pō	Khá, hơi
1399	迫不及待	pòbùjídài	Không thể chờ được
1400	迫害	pòhài	Bức hại, đàn áp
1401	破例	pòlì	Phá lệ
1402	魄力	pòlì	Quyết đoán, dũng khí
1403	扑	pū	Vồ, bổ nhào
1404	铺	pū	Trải, bày
1405	普及	pǔjí	Phổ cập
1406	朴实	pǔshí	Chất phác, giản dị
1407	瀑布	pùbù	Thác nước
1408	欺负	qīfu	Bắt nạt, ức hiếp
1409	凄凉	qīliáng	Thê lương, buồn bã
1410	欺骗	qīpiàn	Lừa dối
1411	期望	qīwàng	Kỳ vọng, mong đợi
1412	期限	qīxiàn	Thời hạn
1413	奇妙	qímiào	Kỳ diệu
1414	旗袍	qípáo	Sườn xám
1415	齐全	qíquán	Đầy đủ, trọn vẹn
1416	歧视	qíshì	Kỳ thị
1417	齐心协力	qíxīnxiélì	Đồng tâm hiệp lực
1418	旗帜	qízhì	Cờ, biểu ngữ
1419	起草	qǐcǎo	Khởi thảo
1420	启程	qǐchéng	Khởi hành
1421	起初	qǐchū	Ban đầu, lúc đầu
1422	起伏	qǐfú	Nhấp nhô, thăng trầm
1423	乞丐	qǐgài	Ăn mày, ăn xin
1424	起哄	qǐhòng	Gây rối, quấy phá
1425	起码	qǐmǎ	Tối thiểu, ít nhất
1426	启示	qǐshì	Gợi ý, khơi dậy
1427	启事	qǐshì	Thông báo
1428	起义	qǐyì	Khởi nghĩa
1429	岂有此理	qǐyǒucǐlǐ	Lẽ nào lại thế
1430	起源	qǐyuán	Nguồn gốc
1431	器材	qìcái	Thiết bị, dụng cụ
1432	气概	qìgài	Khí phách
1433	气功	qìgōng	Khí công
1434	器官	qìguān	Cơ quan (cơ thể)
1435	迄今为止	qìjīnwéizhǐ	Cho đến nay
1436	气魄	qìpò	Khí phách, dũng khí
1437	气色	qìsè	Thần sắc
1438	气势	qìshì	Khí thế
1439	气味	qìwèi	Mùi hương, mùi vị
1440	气象	qìxiàng	Khí tượng
1441	气压	qìyā	Áp suất không khí
1442	掐	qiā	Véo, ngắt
1443	恰当	qiàdàng	Thích hợp, hợp lý
1444	恰到好处	qiàdàohǎochù	Vừa vặn, đúng chỗ
1445	恰巧	qiàqiǎo	Đúng lúc, khéo léo
1446	洽谈	qiàtán	Thảo luận, bàn bạc
1447	牵扯	qiānchě	Dính líu, liên lụy
1448	签订	qiāndìng	Ký kết
1449	千方百计	qiānfāngbǎijì	Trăm phương ngàn kế
1450	迁就	qiānjiù	Nhường nhịn, nhún nhường
1451	签署	qiānshǔ	Ký, phê chuẩn
1452	迁徙	qiānxǐ	Di cư, chuyển chỗ ở
1453	谦逊	qiānxùn	Khiêm tốn
1454	牵制	qiānzhì	Kìm chế, ràng buộc
1455	前景	qiánjǐng	Triển vọng
1456	潜力	qiánlì	Tiềm năng
1457	潜水	qiánshuǐ	Lặn
1458	前提	qiántí	Tiền đề
1459	潜移默化	qiányímòhuà	Thay đổi ngầm
1460	谴责	qiǎnzé	Khiển trách, lên án
1461	抢劫	qiǎngjié	Cướp bóc
1462	强制	qiángzhì	Ép buộc, cưỡng chế
1463	抢救	qiǎngjiù	Cứu trợ, cấp cứu
1464	强迫	qiǎngpò	Ép buộc, cưỡng ép
1465	桥梁	qiáoliáng	Cầu, cầu nối
1466	翘	qiào	Vểnh, nhô lên
1467	锲而不舍	qiè'érbùshě	Kiên trì không bỏ cuộc
1468	切实	qièshí	Thiết thực, cụ thể
1469	侵犯	qīnfàn	Xâm phạm, xâm lấn
1470	钦佩	qīnpèi	Kính phục, thán phục
1471	亲热	qīnrè	Thân mật, nồng nhiệt
1472	亲身	qīnshēn	Tự mình, bản thân
1473	勤俭	qínjiǎn	Cần kiệm
1474	勤恳	qínkěn	Chăm chỉ, cần cù
1475	氢	qīng	Khinh, khí hiếm
1476	清澈	qīngchè	Trong suốt
1477	清晨	qīngchén	Sáng sớm
1478	清除	qīngchú	Dọn sạch, loại bỏ
1479	轻而易举	qīng'éryìjǔ	Dễ dàng, dễ như trở bàn tay
1480	清洁	qīngjié	Sạch sẽ, vệ sinh
1481	清理	qīnglǐ	Dọn dẹp, sắp xếp
1482	倾听	qīngtīng	Lắng nghe
1483	清晰	qīngxī	Rõ ràng, rõ nét
1484	倾向	qīngxiàng	Khuynh hướng, xu hướng
1485	倾斜	qīngxié	Nghiêng, lệch
1486	清醒	qīngxǐng	Tỉnh táo, sáng suốt
1487	清真	qīngzhēn	Hồi giáo, chính giáo
1488	情报	qíngbào	Tình báo, thông tin
1489	情节	qíngjié	Tình tiết, chi tiết
1490	晴朗	qínglǎng	Trời quang, trời trong
1491	情理	qínglǐ	Lý lẽ, đạo lý
1492	情形	qíngxíng	Tình hình, hoàn cảnh
1493	请柬	qǐngjiǎn	Thiệp mời
1494	请教	qǐngjiào	Thỉnh giáo, xin ý kiến
1495	请示	qǐngshì	Xin chỉ thị, xin ý kiến
1496	请帖	qǐngtiě	Thiệp mời
1497	丘陵	qiūlíng	Đồi núi, đồi cỏ
1498	区分	qūfēn	Phân biệt, chia tách
1499	屈服	qūfú	Khuất phục, đầu hàng
1500	区域	qūyù	Khu vực, vùng
1501	曲折	qūzhé	Quanh co, khúc khuỷu
1502	驱逐	qūzhú	Trục xuất, xua đuổi
1503	渠道	qúdào	Kênh rạch, kênh
1504	取缔	qǔdì	Cấm đoán, cấm chỉ
1505	曲子	qǔzi	Bài hát, bản nhạc
1506	趣味	qùwèi	Hứng thú, thú vị
1507	圈套	quāntào	Cái bẫy, cạm bẫy
1508	权衡	quánhéng	Cân nhắc, xem xét
1509	全局	quánjú	Toàn bộ cục diện
1510	全力以赴	quánlìyǐfù	Dốc toàn lực, toàn tâm toàn ý
1511	拳头	quántou	Nắm đấm, quyền lực
1512	权威	quánwēi	Quyền uy, uy tín
1513	权益	quányì	Quyền lợi và lợi ích
1514	犬	quǎn	Chó, cẩu
1515	缺口	quēkǒu	Chỗ hổng, khe hở
1516	缺席	quēxí	Vắng mặt, không tham dự
1517	缺陷	quēxiàn	Khiếm khuyết, khuyết điểm
1518	瘸	qué	Khập khiễng, què
1519	确保	quèbǎo	Đảm bảo, bảo đảm
1520	确立	quèlì	Xác lập, thiết lập
1521	确切	quèqiè	Chính xác, xác thực
1522	确信	quèxìn	Tin chắc, tin tưởng
1523	群众	qúnzhòng	Quần chúng, nhân dân
1524	染	rǎn	Nhuộm, tô điểm
1525	让步	ràngbù	Nhượng bộ, lùi bước
1526	饶恕	ráoshù	Tha thứ, tha lỗi
1527	扰乱	rǎoluàn	Quấy rối, làm loạn
1528	惹祸	rěhuò	Gây họa, gây rắc rối
1529	热泪盈眶	rèlèiyíngkuàng	Nước mắt đầm đìa
1530	热门	rèmén	Phổ biến, thịnh hành
1531	仁慈	réncí	Nhân từ, nhân hậu
1532	人道	réndào	Nhân đạo
1533	人格	réngé	Nhân cách, phẩm cách
1534	人工	réngōng	Nhân công, lao động
1535	人家	rénjiā	Nhà cửa, gia đình
1536	人间	rénjiān	Nhân gian, thế gian
1537	人士	rénshì	Nhân sĩ, người
1538	人为	rénwéi	Do con người làm
1539	人性	rénxìng	Nhân tính, bản tính
1540	人质	rénzhì	Con tin, người bị bắt
1541	忍耐	rěnnài	Nhẫn nại, chịu đựng
1542	忍受	rěnshòu	Chịu đựng, cam chịu
1543	认定	rèndìng	Nhận định, xác định
1544	认可	rènkě	Công nhận, phê duyệt
1545	任命	rènmìng	Bổ nhiệm, cử nhiệm
1546	任性	rènxìng	Tùy hứng, bướng bỉnh
1547	任意	rènyì	Tùy ý, tự do
1548	任重道远	rènzhòngdàoyuǎn	Trách nhiệm nặng nề và đường dài
1549	仍旧	réngjiù	Vẫn như cũ
1550	日新月异	rìxīnyuèyì	Thay đổi từng ngày
1551	日益	rìyì	Ngày càng
1552	溶解	róngjiě	Hòa tan
1553	容貌	róngmào	Dung mạo
1554	容纳	róngnà	Chứa đựng
1555	容器	róngqì	Đồ đựng, dụng cụ chứa
1556	融洽	róngqià	Hòa hợp, êm thấm
1557	容忍	róngrěn	Chịu đựng, nhẫn nhịn
1558	揉	róu	Xoa, bóp
1559	柔和	róuhé	Dịu dàng, mềm mại
1560	弱点	ruòdiǎn	Điểm yếu
1561	若干	ruògān	Một vài, bao nhiêu
1562	撒谎	sāhuǎng	Nói dối
1563	腮	sāi	Má, cằm
1564	三角	sānjiǎo	Tam giác
1565	散文	sǎnwén	Tản văn
1566	散发	sànfā	Tỏa ra, phát tán
1567	丧失	sàngshī	Mất mát
1568	嫂子	sǎozi	Chị dâu
1569	色彩	sècǎi	Màu sắc
1570	刹车	shāchē	Phanh, thắng
1571	啥	shá	Gì (dạng khẩu ngữ của "什么")
1572	筛选	shāixuǎn	Sàng lọc, tuyển chọn
1573	山脉	shānmài	Dãy núi
1574	闪烁	shǎnshuò	Lấp lánh, lung linh
1575	擅长	shàncháng	Giỏi về, sở trường
1576	擅自	shànzì	Tự ý, tự tiện
1577	扇子	shànzi	Quạt
1578	商标	shāngbiāo	Thương hiệu
1579	伤脑筋	shāng nǎojīn	Đau đầu, khó khăn
1580	上级	shàngjí	Cấp trên
1581	上进心	shàngjìnxīn	Tinh thần cầu tiến
1582	上任	shàngrèn	Nhậm chức
1583	上瘾	shàngyǐn	Nghiện
1584	上游	shàngyóu	Thượng nguồn, phần tiên tiến
1585	梢	shāo	Ngọn, chóp
1586	捎	shāo	Mang theo, đưa cho
1587	哨	shào	Còi, kèn
1588	奢侈	shēchǐ	Xa xỉ
1589	涉及	shèjí	Liên quan đến
1590	设立	shèlì	Thiết lập, thành lập
1591	社区	shèqū	Cộng đồng, khu vực
1592	摄取	shèqǔ	Hấp thụ, tiếp thu
1593	摄氏度	shèshìdù	Độ Celsius
1594	设想	shèxiǎng	Dự tính, giả định
1595	设置	shèzhì	Lắp đặt, thiết lập
1596	深奥	shēn'ào	Sâu sắc, khó hiểu
1597	申报	shēnbào	Trình báo, khai báo
1598	深沉	shēnchén	Sâu sắc, thâm trầm
1599	深情厚谊	shēnqíng hòuyì	Tình cảm sâu đậm
1600	绅士	shēnshì	Quý ông, người lịch sự
1601	呻吟	shēnyín	Rên rỉ
1602	神奇	shénqí	Kỳ diệu
1603	神气	shénqì	Vẻ, dáng vẻ
1604	神情	shénqíng	Thần thái, cảm xúc
1605	神色	shénsè	Thần sắc
1606	神圣	shénshèng	Thần thánh
1607	神态	shéntài	Thần thái, dáng vẻ
1608	神仙	shénxiān	Thần tiên
1609	审查	shěnchá	Thẩm tra
1610	审理	shěnlǐ	Xét xử
1611	审美	shěnměi	Thẩm mỹ
1612	审判	shěnpàn	Xét xử, phán xét
1613	渗透	shèntòu	Thẩm thấu, thấm vào
1614	慎重	shènzhòng	Cẩn trọng
1615	牲畜	shēngchù	Gia súc
1616	生存	shēngcún	Sinh tồn
1617	生机	shēngjī	Sức sống
1618	生理	shēnglǐ	Sinh lý
1619	声明	shēngmíng	Tuyên bố
1620	声势	shēngshì	Thanh thế
1621	生疏	shēngshū	Lạ lẫm, không quen thuộc
1622	生态	shēngtài	Sinh thái
1623	生物	shēngwù	Sinh vật
1624	生效	shēngxiào	Có hiệu lực
1625	生锈	shēngxiù	Bị gỉ sét
1626	生育	shēngyù	Sinh sản
1627	声誉	shēngyù	Danh tiếng
1628	省会	shěnghuì	Thủ phủ tỉnh
1629	盛产	shèngchǎn	Sản xuất nhiều, phong phú
1630	胜负	shèngfù	Thắng thua
1631	盛开	shèngkāi	Nở rộ
1632	盛情	shèngqíng	Nồng hậu, ân cần
1633	盛行	shèngxíng	Thịnh hành
1634	师范	shīfàn	Sư phạm
1635	施加	shījiā	Áp đặt, tác động
1636	尸体	shītǐ	Thi thể
1637	失误	shīwù	Sai lầm, lỗi lầm
1638	施展	shīzhǎn	Phát huy, thực hiện
1639	狮子	shīzi	Sư tử
1640	失踪	shīzōng	Mất tích
1641	拾	shí	Nhặt, lượm
1642	识别	shíbié	Nhận biết, phân biệt
1643	时差	shíchā	Chênh lệch múi giờ
1644	时常	shícháng	Thường xuyên
1645	时而	shí'ér	Thỉnh thoảng, đôi khi
1646	时光	shíguāng	Thời gian
1647	实惠	shíhuì	Giá trị thực, có lợi ích thực sự
1648	时机	shíjī	Thời cơ, cơ hội
1649	实力	shílì	Thực lực
1650	实施	shíshī	Thực thi, thực hiện
1651	时事	shíshì	Thời sự
1652	实事求是	shíshìqiúshì	Thực sự cầu thị
1653	石油	shíyóu	Dầu mỏ
1654	实质	shízhì	Thực chất
1655	时装	shízhuāng	Thời trang
1656	十足	shízú	Đầy đủ, hoàn toàn
1657	使命	shǐmìng	Sứ mệnh
1658	势必	shìbì	Chắc chắn
1659	世代	shìdài	Thế hệ
1660	示范	shìfàn	Làm mẫu, mô phỏng
1661	释放	shìfàng	Giải phóng
1662	是非	shìfēi	Đúng sai, thị phi
1663	事故	shìgù	Sự cố
1664	事迹	shìjì	Sự tích, hành động đáng chú ý
1665	事件	shìjiàn	Sự kiện
1666	世界观	shìjièguān	Thế giới quan
1667	视力	shìlì	Thị lực
1668	势力	shìlì	Thế lực
1669	逝世	shìshì	Qua đời
1670	事态	shìtài	Tình hình
1671	试图	shìtú	Thử, cố gắng
1672	示威	shìwēi	Biểu tình
1673	事务	shìwù	Công việc
1674	视线	shìxiàn	Tầm nhìn
1675	事项	shìxiàng	Hạng mục, vấn đề
1676	试验	shìyàn	Thí nghiệm
1677	视野	shìyě	Tầm nhìn
1678	事业	shìyè	Sự nghiệp
1679	适宜	shìyí	Thích hợp
1680	示意	shìyì	Ra hiệu
1681	收藏	shōucáng	Thu thập, sưu tầm
1682	收缩	shōusuō	Co lại
1683	收益	shōuyì	Lợi nhuận
1684	收音机	shōuyīnjī	Đài radio
1685	手法	shǒufǎ	Phương pháp, thủ pháp
1686	守护	shǒuhù	Bảo vệ, canh giữ
1687	手势	shǒushì	Cử chỉ, động tác tay
1688	首要	shǒuyào	Quan trọng nhất
1689	手艺	shǒuyì	Tay nghề
1690	授予	shòuyǔ	Trao tặng
1691	受罪	shòuzuì	Chịu tội, khổ sở
1692	舒畅	shūchàng	Thoải mái
1693	书法	shūfǎ	Thư pháp
1694	疏忽	shūhū	Sơ suất
1695	书籍	shūjí	Sách vở
1696	书记	shūji	Bí thư
1697	书面	shūmiàn	Văn bản
1698	数	shǔ	Đếm, số lượng
1699	竖	shù	Dựng đứng
1700	束	shù	Bó, gói
1701	数额	shù'é	Số lượng
1702	束缚	shùfù	Ràng buộc
1703	树立	shùlì	Xây dựng, thiết lập
1704	数目	shùmù	Số lượng
1705	耍	shuǎ	Chơi đùa, giỡn
1706	衰老	shuāilǎo	Già yếu
1707	衰退	shuāituì	Suy thoái
1708	率领	shuàilǐng	Lãnh đạo, dẫn dắt
1709	涮火锅	shuàn huǒguō	Nhúng lẩu
1710	双胞胎	shuāngbāotāi	Sinh đôi
1711	爽快	shuǎngkuài	Sảng khoái
1712	水利	shuǐlì	Thủy lợi
1713	水龙头	shuǐlóngtóu	Vòi nước
1714	水泥	shuǐní	Xi măng
1715	司法	sīfǎ	Tư pháp
1716	司令	sīlìng	Tư lệnh
1717	思念	sīniàn	Nhớ nhung
1718	思索	sīsuǒ	Suy nghĩ, suy xét
1719	思维	sīwéi	Tư duy
1720	斯文	sīwén	Lịch sự, nhã nhặn
1721	思绪	sīxù	Tâm tư, suy nghĩ
1722	私自	sīzì	Tự tiện
1723	死亡	sǐwáng	Tử vong
1724	肆无忌惮	sìwújìdàn	Không kiêng nể, không kiêng dè
1725	饲养	sìyǎng	Chăn nuôi
1726	四肢	sìzhī	Tứ chi
1727	耸	sǒng	Cao vút, thẳng đứng
1728	艘	sōu	Chiếc (thuyền, tàu)
1729	搜索	sōusuǒ	Tìm kiếm
1730	苏醒	sūxǐng	Tỉnh lại, hồi sinh
1731	俗话	súhuà	Tục ngữ
1732	素食主义	sùshízhǔyì	Chủ nghĩa ăn chay
1733	诉讼	sùsòng	Kiện tụng
1734	塑造	sùzào	Tạo hình, hình thành
1735	素质	sùzhì	Tố chất
1736	算了	suànle	Bỏ qua, thôi đi
1737	算数	suànshù	Đếm, tính toán
1738	随即	suíjí	Ngay lập tức
1739	随身	suíshēn	Mang theo người
1740	随手	suíshǒu	Thuận tay
1741	随意	suíyì	Tùy ý
1742	隧道	suìdào	Đường hầm
1743	岁月	suìyuè	Năm tháng
1744	损坏	sǔnhuài	Hư hỏng
1745	索赔	suǒpéi	Yêu cầu bồi thường
1746	索性	suǒxìng	Dứt khoát
1747	塌	tā	Sập, đổ
1748	踏实	tāshi	Yên tâm, thoải mái
1749	台风	táifēng	Bão tố
1750	泰斗	tàidǒu	Người giỏi nhất, đại thụ
1751	太空	tàikōng	Không gian
1752	瘫痪	tānhuàn	Bại liệt
1753	贪婪	tānlán	Tham lam
1754	摊儿	tānr	Quầy hàng
1755	贪污	tānwū	Tham nhũng
1756	弹性	tánxìng	Tính đàn hồi
1757	坦白	tǎnbái	Thẳng thắn, thành thật
1758	探测	tàncè	Thăm dò
1759	叹气	tànqì	Thở dài
1760	探索	tànsuǒ	Khám phá
1761	探讨	tàntǎo	Thảo luận
1762	探望	tànwàng	Thăm viếng
1763	糖葫芦	tánghúlu	Kẹo hồ lô
1764	掏	tāo	Móc, lấy ra
1765	滔滔不绝	tāotāobùjué	Nói liên tục, không ngừng
1766	陶瓷	táocí	Gốm sứ
1767	淘气	táoqì	Nghịch ngợm
1768	淘汰	táotài	Loại bỏ
1769	讨价还价	tǎojiàhuánjià	Mặc cả
1770	特长	tècháng	Sở trường
1771	特定	tèdìng	Cụ thể, nhất định
1772	特色	tèsè	Đặc sắc
1773	提拔	tíbá	Thăng chức
1774	题材	tícái	Đề tài
1775	提炼	tíliàn	Tinh luyện
1776	提示	tíshì	Gợi ý
1777	提议	tíyì	Đề nghị
1778	体谅	tǐliàng	Thông cảm
1779	体面	tǐmiàn	Thể diện, diện mạo
1780	体系	tǐxì	Hệ thống
1781	天才	tiāncái	Thiên tài
1782	天伦之乐	tiānlún zhī lè	Niềm vui gia đình
1783	天然气	tiānránqì	Khí thiên nhiên
1784	天生	tiānshēng	Bẩm sinh
1785	天堂	tiāntáng	Thiên đường
1786	天文	tiānwén	Thiên văn
1787	田径	tiánjìng	Điền kinh
1788	舔	tiǎn	Liếm
1789	挑剔	tiāoti	Kỹ tính, soi mói
1790	调和	tiáohé	Điều hòa
1791	调剂	tiáojì	Điều chỉnh
1792	调节	tiáojié	Điều chỉnh
1793	调解	tiáojiě	Hòa giải
1794	条款	tiáokuǎn	Điều khoản
1795	条理	tiáolǐ	Trình tự
1796	调料	tiáoliào	Gia vị
1797	条约	tiáoyuē	Hiệp ước
1798	挑拨	tiǎobō	Khiêu khích
1799	挑衅	tiǎoxìn	Khiêu chiến
1800	跳跃	tiàoyuè	Nhảy vọt
1801	停泊	tíngbó	Cập bến
1802	停顿	tíngdùn	Tạm dừng
1803	停滞	tíngzhì	Đình trệ
1804	亭子	tíngzi	Đình, chòi
1805	挺拔	tǐngbá	Cao ráo, thẳng đứng
1806	通货膨胀	tōnghuò péngzhàng	Lạm phát
1807	通俗	tōngsú	Thông thường
1808	通用	tōngyòng	Phổ biến
1809	同胞	tóngbāo	Đồng bào
1810	童话	tónghuà	Truyện cổ tích
1811	铜矿	tóngkuàng	Quặng đồng
1812	同志	tóngzhì	Đồng chí
1813	统筹兼顾	tǒngchóu jiāngù	Tổng thể và toàn diện
1814	统计	tǒngjì	Thống kê
1815	统统	tǒngtǒng	Toàn bộ
1816	投机	tóujī	Đầu cơ, cơ hội
1817	投票	tóupiào	Bỏ phiếu
1818	投降	tóuxiáng	Đầu hàng
1819	投掷	tóuzhì	Ném, quăng
1820	秃	tū	Hói
1821	突破	tūpò	Đột phá
1822	图案	tú'àn	Họa tiết
1823	徒弟	túdì	Đệ tử
1824	途径	tújìng	Con đường, cách thức
1825	涂抹	túmǒ	Bôi, quét
1826	土壤	tǔrǎng	Đất đai
1827	团结	tuánjié	Đoàn kết
1828	团体	tuántǐ	Tập thể
1829	团员	tuányuán	Đoàn viên
1830	推测	tuīcè	Suy đoán
1831	推翻	tuīfān	Lật đổ
1832	推理	tuīlǐ	Suy luận
1833	推论	tuīlùn	Suy luận
1834	推销	tuīxiāo	Tiếp thị
1835	吞咽	tūnyàn	Nuốt
1836	脱离	tuōlí	Thoát ly
1837	拖延	tuōyán	Kéo dài, trì hoãn
1838	托运	tuōyùn	Ký gửi
1839	妥当	tuǒdàng	Thỏa đáng
1840	妥善	tuǒshàn	Thỏa đáng
1841	妥协	tuǒxié	Thỏa hiệp
1842	椭圆	tuǒyuán	Hình elip
1843	唾沫	tuòmò	Nước bọt
1844	挖掘	wājué	Đào bới
1845	娃娃	wáwa	Búp bê, em bé
1846	瓦解	wǎjiě	Tan rã
1847	哇	wā	Wow (thán từ)
1848	歪曲	wāiqū	Xuyên tạc
1849	外表	wàibiǎo	Ngoại hình
1850	外行	wàiháng	Ngoại đạo
1851	外界	wàijiè	Thế giới bên ngoài
1852	外向	wàixiàng	Hướng ngoại
1853	丸	wán	Viên, hoàn
1854	完备	wánbèi	Hoàn bị, đầy đủ
1855	完毕	wánbì	Kết thúc
1856	顽固	wángù	Ngoan cố
1857	玩弄	wánnòng	Trêu chọc
1858	顽强	wánqiáng	Ngoan cường
1859	玩意儿	wányìr	Đồ chơi, món đồ
1860	挽回	wǎnhuí	Cứu vãn
1861	挽救	wǎnjiù	Cứu chữa
1862	惋惜	wǎnxī	Tiếc nuối
1863	万分	wànfēn	Vô cùng
1864	往常	wǎngcháng	Thường ngày
1865	网络	wǎngluò	Mạng lưới
1866	往事	wǎngshì	Chuyện cũ
1867	妄想	wàngxiǎng	Ảo tưởng
1868	微不足道	wēibùzúdào	Không đáng kể
1869	威风	wēifēng	Uy phong
1870	微观	wēiguān	Vi mô
1871	危机	wēijī	Khủng hoảng
1872	威力	wēilì	Uy lực
1873	威望	wēiwàng	Uy tín
1874	威信	wēixìn	Uy tín
1875	违背	wéibèi	Trái ngược
1876	维持	wéichí	Duy trì
1877	唯独	wéidú	Chỉ có, duy nhất
1878	为难	wéinán	Khó xử
1879	为期	wéiqī	Kỳ hạn
1880	维生素	wéishēngsù	Vitamin
1881	为首	wéishǒu	Đứng đầu
1882	维修	wéixiū	Bảo dưỡng
1883	委员	wěiyuán	Ủy viên
1884	伪造	wěizào	Làm giả
1885	畏惧	wèijù	Sợ hãi
1886	胃口	wèikǒu	Khẩu vị
1887	未免	wèimiǎn	Quả là, hơi bị
1888	慰问	wèiwèn	Thăm hỏi
1889	卫星	wèixīng	Vệ tinh
1890	位于	wèiyú	Nằm ở
1891	温带	wēndài	Vùng ôn đới
1892	温和	wēnhé	Ôn hòa
1893	文凭	wénpíng	Văn bằng
1894	文物	wénwù	Văn vật
1895	文献	wénxiàn	Tư liệu
1896	文雅	wényǎ	Văn nhã
1897	文艺	wényì	Văn nghệ
1898	问世	wènshì	Ra đời
1899	窝	wō	Tổ, ổ
1900	乌黑	wūhēi	Đen như mực
1901	污蔑	wūmiè	Vu khống
1902	诬陷	wūxiàn	Vu cáo
1903	无比	wúbǐ	Vô cùng
1904	无偿	wúcháng	Không bồi thường
1905	无耻	wúchǐ	Vô liêm sỉ
1906	无从	wúcóng	Không thể nào
1907	无动于衷	wúdòngyúzhōng	Không chút động lòng
1908	无非	wúfēi	Chỉ là, chẳng qua là
1909	无精打采	wújīng dǎcǎi	Không có sức sống
1910	无可奉告	wúkě fènggào	Không có gì để nói
1911	无可奈何	wúkě nàihé	Không còn cách nào khác
1912	无赖	wúlài	Vô lại
1913	无理取闹	wúlǐ qǔnào	Gây sự vô lý
1914	无能为力	wúnéng wéilì	Bất lực
1915	无穷无尽	wúqióng wújìn	Vô cùng vô tận
1916	无微不至	wúwēi bùzhì	Tận tình, chu đáo
1917	无忧无虑	wúyōu wúlǜ	Vô lo vô nghĩ
1918	无知	wúzhī	Vô tri
1919	舞蹈	wǔdǎo	Vũ đạo
1920	侮辱	wǔrǔ	Sỉ nhục
1921	武侠	wǔxiá	Võ hiệp
1922	武装	wǔzhuāng	Trang bị vũ khí
1923	勿	wù	Đừng, chớ
1924	务必	wùbì	Nhất thiết phải
1925	误差	wùchā	Sai số
1926	误解	wùjiě	Hiểu lầm
1927	物美价廉	wùměi jiàlián	Hàng tốt giá rẻ
1928	务实	wùshí	Thực tế
1929	物资	wùzī	Vật tư
1930	溪	xī	Suối
1931	膝盖	xīgài	Đầu gối
1932	熄灭	xīmiè	Tắt
1933	吸取	xīqǔ	Hấp thu
1934	昔日	xīrì	Ngày xưa
1935	牺牲	xīshēng	Hy sinh
1936	夕阳	xīyáng	Hoàng hôn
1937	媳妇	xífù	Con dâu
1938	袭击	xíjī	Tập kích
1939	习俗	xísú	Tập tục
1940	喜闻乐见	xǐwén lèjiàn	Yêu thích, ưa chuộng
1941	喜悦	xǐyuè	Vui vẻ
1942	细胞	xìbāo	Tế bào
1943	细菌	xìjūn	Vi khuẩn
1944	系列	xìliè	Loạt, chuỗi
1945	细致	xìzhì	Tỉ mỉ
1946	霞	xiá	Ráng, hoàng hôn
1947	狭隘	xiá'ài	Hẹp hòi
1948	峡谷	xiágǔ	Hẻm núi
1949	狭窄	xiázhǎi	Hẹp
1950	夏令营	xiàlìngyíng	Trại hè
1951	下属	xiàshǔ	Cấp dưới
1952	先进	xiānjìn	Tiên tiến
1953	鲜明	xiānmíng	Rõ ràng, sắc nét
1954	掀起	xiānqǐ	Khởi động, bắt đầu
1955	先前	xiānqián	Trước kia
1956	纤维	xiānwéi	Sợi
1957	弦	xián	Dây đàn
1958	嫌	xián	Ghét
1959	闲话	xiánhuà	Lời đồn, chuyện tào lao
1960	贤惠	xiánhuì	Hiền lành, đức hạnh
1961	衔接	xiánjiē	Nối tiếp
1962	嫌疑	xiányí	Nghi ngờ
1963	显著	xiǎnzhù	Rõ rệt
1964	现场	xiànchǎng	Hiện trường
1965	现成	xiànchéng	Có sẵn
1966	宪法	xiànfǎ	Hiến pháp
1967	陷害	xiànhài	Hãm hại
1968	馅儿	xiànr	Nhân (bánh)
1969	陷入	xiànrù	Rơi vào
1970	线索	xiànsuǒ	Manh mối
1971	现状	xiànzhuàng	Tình hình hiện tại
1972	相差	xiāngchà	Chênh lệch
1973	相等	xiāngděng	Tương đương
1974	相辅相成	xiāngfǔ xiāngchéng	Bổ trợ lẫn nhau
1975	镶嵌	xiāngqiàn	Khảm nạm
1976	相应	xiāngyìng	Tương ứng
1977	乡镇	xiāngzhèn	Thị trấn
1978	想方设法	xiǎngfāng shèfǎ	Tìm mọi cách
1979	响亮	xiǎngliàng	Vang dội
1980	响应	xiǎngyìng	Ứng đáp
1981	巷	xiàng	Hẻm
1982	项	xiàng	Hạng mục
1983	向导	xiàngdǎo	Hướng dẫn viên
1984	向来	xiànglái	Từ trước đến nay
1985	向往	xiàngwǎng	Hướng về, khao khát
1986	消除	xiāochú	Loại bỏ
1987	消毒	xiāodú	Khử trùng
1988	消防	xiāofáng	Phòng cháy chữa cháy
1989	消耗	xiāohào	Tiêu hao
1990	销毁	xiāohuǐ	Tiêu hủy
1991	消极	xiāojí	Tiêu cực
1992	小气	xiǎoqì	Keo kiệt
1993	小心翼翼	xiǎoxīn yìyì	Cẩn thận từng chút
1994	孝顺	xiàoshùn	Hiếu thảo
1995	肖像	xiàoxiàng	Chân dung
1996	效益	xiàoyì	Hiệu quả và lợi ích
1997	携带	xiédài	Mang theo
1998	协会	xiéhuì	Hiệp hội
1999	协商	xiéshāng	Hiệp thương
2000	协议	xiéyì	Thỏa thuận
2001	协助	xiézhù	Hỗ trợ
2002	写作	xiězuò	Viết văn
2003	屑	xiè	Mảnh vụn
2004	谢绝	xièjué	Từ chối
2005	泄露	xièlòu	Rò rỉ
2006	泄气	xièqì	Mất tinh thần
2007	新陈代谢	xīnchéndàixiè	Sự trao đổi chất
2008	心得	xīndé	Điều tâm đắc
2009	新郎	xīnláng	Chú rể
2010	心灵	xīnlíng	Tâm hồn
2011	新娘	xīnniáng	Cô dâu
2012	辛勤	xīnqín	Chăm chỉ
2013	薪水	xīnshuǐ	Lương
2014	心态	xīntài	Tâm lý
2015	心疼	xīnténg	Thương xót
2016	欣慰	xīnwèi	Vui mừng và an ủi
2017	欣欣向荣	xīnxīn xiàngróng	Thịnh vượng, phát triển mạnh
2018	心血	xīnxuè	Tâm huyết
2019	心眼儿	xīnyǎnr	Tâm ý, tấm lòng
2020	新颖	xīnyǐng	Mới mẻ
2021	信赖	xìnlài	Tin cậy
2022	信念	xìnniàn	Niềm tin
2023	信仰	xìnyǎng	Tín ngưỡng
2024	信誉	xìnyù	Uy tín
2025	腥	xīng	Tanh
2026	兴高采烈	xìnggāo cǎiliè	Phấn khởi
2027	兴隆	xīnglóng	Thịnh vượng
2028	兴旺	xīngwàng	Phát đạt
2029	刑事	xíngshì	Hình sự
2030	形态	xíngtài	Hình thái
2031	行政	xíngzhèng	Hành chính
2032	性感	xìnggǎn	Gợi cảm
2033	幸好	xìnghǎo	May thay
2034	性命	xìngmìng	Tính mạng
2035	性能	xìngnéng	Tính năng
2036	性情	xìngqíng	Tính tình
2037	兴致勃勃	xìngzhì bóbó	Hăng hái, say mê
2038	凶恶	xiōng'è	Hung ác
2039	胸怀	xiōnghuái	Lòng dạ, tâm hồn
2040	凶手	xiōngshǒu	Hung thủ
2041	胸膛	xiōngtáng	Ngực
2042	雄厚	xiónghòu	Hùng hậu
2043	羞耻	xiūchǐ	Xấu hổ
2044	修复	xiūfù	Sửa chữa, phục hồi
2045	修建	xiūjiàn	Xây dựng
2046	修理	xiūlǐ	Sửa chữa
2047	修养	xiūyǎng	Tu dưỡng
2048	绣	xiù	Thêu
2049	嗅觉	xiùjué	Khứu giác
2050	虚假	xūjiǎ	Giả dối
2051	需求	xūqiú	Nhu cầu
2052	虚荣	xūróng	Hư vinh
2053	虚伪	xūwěi	Giả tạo
2054	须知	xūzhī	Cần biết
2055	许可	xǔkě	Cho phép
2056	酗酒	xùjiǔ	Nghiện rượu
2057	畜牧	xùmù	Chăn nuôi
2058	序言	xùyán	Lời nói đầu
2059	宣誓	xuānshì	Tuyên thệ
2060	宣扬	xuānyáng	Tuyên truyền
2061	悬挂	xuánguà	Treo
2062	旋律	xuánlǜ	Giai điệu
2063	悬念	xuánniàn	Lo lắng
2064	悬崖峭壁	xuányá qiàobì	Vách đá cheo leo
2065	旋转	xuánzhuǎn	Quay, xoay
2066	选拔	xuǎnbá	Tuyển chọn
2067	选手	xuǎnshǒu	Tuyển thủ
2068	削弱	xuēruò	Suy yếu
2069	学历	xuélì	Trình độ học vấn
2070	学说	xuéshuō	Học thuyết
2071	学位	xuéwèi	Học vị
2072	雪上加霜	xuěshàng jiāshuāng	Tuyết trên sương
2073	血压	xuèyā	Huyết áp
2074	熏陶	xūntáo	Đào tạo, hun đúc
2075	循环	xúnhuán	Tuần hoàn
2076	巡逻	xúnluó	Tuần tra
2077	寻觅	xúnmì	Tìm kiếm
2078	循序渐进	xúnxù jiànjìn	Tiến hành tuần tự
2079	押金	yājīn	Tiền đặt cọc
2080	压迫	yāpò	Áp bức
2081	压岁钱	yāsuìqián	Tiền lì xì
2082	压缩	yāsuō	Nén
2083	压抑	yāyì	Ức chế
2084	压榨	yāzhà	Ép, bóc lột
2085	压制	yāzhì	Kìm hãm
2086	亚军	yàjūn	Á quân
2087	烟花爆竹	yānhuā bàozhú	Pháo hoa
2088	淹没	yānmò	Nhấn chìm
2089	沿海	yánhǎi	Ven biển
2090	严寒	yánhán	Lạnh giá
2091	严禁	yánjìn	Cấm tuyệt đối
2092	严峻	yánjùn	Nghiêm trọng
2093	严厉	yánlì	Nghiêm khắc
2094	言论	yánlùn	Ngôn luận
2095	严密	yánmì	Kín đáo
2096	延期	yánqī	Gia hạn
2097	炎热	yánrè	Nóng bức
2098	延伸	yánshēn	Mở rộng
2099	岩石	yánshí	Đá
2100	延续	yánxù	Tiếp tục
2101	演变	yǎnbiàn	Diễn biến
2102	掩盖	yǎngài	Che đậy
2103	眼光	yǎnguāng	Ánh mắt
2104	掩护	yǎnhù	Che chở
2105	演讲	yǎnjiǎng	Diễn thuyết
2106	眼色	yǎnsè	Ánh mắt, ý tứ
2107	眼神	yǎnshén	Thần thái ánh mắt
2108	掩饰	yǎnshì	Che giấu
2109	演习	yǎnxí	Diễn tập
2110	眼下	yǎnxià	Trước mắt
2111	演绎	yǎnyì	Diễn giải
2112	演奏	yǎnzòu	Diễn tấu
2113	验收	yànshōu	Kiểm tra và nhận
2114	厌恶	yànwù	Ghét
2115	验证	yànzhèng	Xác minh
2116	氧气	yǎngqì	Oxy
2117	样品	yàngpǐn	Mẫu hàng
2118	摇摆	yáobǎi	Đung đưa
2119	摇滚	yáogǔn	Nhạc rock
2120	摇晃	yáohuàng	Lắc lư
2121	遥控	yáokòng	Điều khiển từ xa
2122	谣言	yáoyán	Tin đồn
2123	遥远	yáoyuǎn	Xa xôi
2124	咬牙切齿	yǎoyá qièchǐ	Nghiến răng kèn kẹt
2125	要不然	yàobùrán	Nếu không thì
2126	要点	yàodiǎn	Điểm quan trọng
2127	要命	yàomìng	Chết người
2128	要素	yàosù	Yếu tố
2129	耀眼	yàoyǎn	Chói mắt
2130	野蛮	yěmán	Man rợ
2131	野心	yěxīn	Tham vọng
2132	依次	yīcì	Lần lượt
2133	一度	yīdù	Đã từng
2134	一帆风顺	yīfān fēngshùn	Thuận buồm xuôi gió
2135	一贯	yīguàn	Trước sau như một
2136	依旧	yījiù	Vẫn như cũ
2137	一举两得	yījǔ liǎngdé	Một công đôi việc
2138	依据	yījù	Căn cứ vào
2139	依靠	yīkào	Dựa vào
2140	依赖	yīlài	Ỷ lại
2141	一流	yīliú	Hàng đầu
2142	一律	yīlǜ	Đồng nhất
2143	一目了然	yīmù liǎorán	Rõ ràng trong nháy mắt
2144	一如既往	yīrú jìwǎng	Như trước đây
2145	衣裳	yīshang	Quần áo
2146	一丝不苟	yīsī bùgǒu	Tỉ mỉ cẩn thận
2147	依托	yītuō	Dựa vào
2148	一向	yīxiàng	Luôn luôn
2149	一再	yīzài	Nhiều lần
2150	遗产	yíchǎn	Di sản
2151	遗传	yíchuán	Di truyền
2152	疑惑	yíhuò	Nghi ngờ
2153	遗留	yíliú	Để lại
2154	仪器	yíqì	Dụng cụ
2155	遗失	yíshī	Mất mát
2156	仪式	yíshì	Nghi thức
2157	以便	yǐbiàn	Để tiện
2158	以免	yǐmiǎn	Để tránh
2159	以往	yǐwǎng	Trước đây
2160	以至	yǐzhì	Đến mức
2161	以致	yǐzhì	Kết quả là
2162	亦	yì	Cũng
2163	翼	yì	Cánh
2164	异常	yìcháng	Bất thường
2165	毅力	yìlì	Kiên trì
2166	意料	yìliào	Dự đoán
2167	毅然	yìrán	Kiên quyết
2168	意识	yìshí	Ý thức
2169	意图	yìtú	Ý đồ
2170	意味着	yìwèizhe	Nghĩa là
2171	意向	yìxiàng	Ý định
2172	意志	yìzhì	Ý chí
2173	抑制	yìzhì	Ức chế
2174	阴谋	yīnmóu	Âm mưu
2175	音响	yīnxiǎng	Âm thanh
2176	隐蔽	yǐnbì	Ẩn nấp
2177	引导	yǐndǎo	Hướng dẫn
2178	隐患	yǐnhuàn	Hiểm họa tiềm ẩn
2179	隐瞒	yǐnmán	Che giấu
2180	引擎	yǐnqíng	Động cơ
2181	饮食	yǐnshí	Ăn uống
2182	隐私	yǐnsī	Riêng tư
2183	引用	yǐnyòng	Trích dẫn
2184	隐约	yǐnyuē	Mờ ảo
2185	印刷	yìnshuā	In ấn
2186	婴儿	yīng'ér	Trẻ sơ sinh
2187	英明	yīngmíng	Anh minh
2188	英勇	yīngyǒng	Anh dũng
2189	盈利	yínglì	Lợi nhuận
2190	迎面	yíngmiàn	Đối mặt
2191	荧屏	yíngpíng	Màn hình
2192	应酬	yìngchou	Tiệc tùng
2193	应邀	yìngyāo	Được mời
2194	拥护	yōnghù	Ủng hộ
2195	庸俗	yōngsú	Tầm thường
2196	拥有	yōngyǒu	Sở hữu
2197	永恒	yǒnghéng	Vĩnh cửu
2198	涌现	yǒngxiàn	Xuất hiện nhiều
2199	勇于	yǒngyú	Dám
2200	踊跃	yǒngyuè	Hăng hái
2201	用功	yònggōng	Chăm chỉ
2202	用户	yònghù	Người dùng
2203	优胜劣汰	yōushèng liètài	Chọn lọc tự nhiên
2204	优先	yōuxiān	Ưu tiên
2205	优异	yōuyì	Xuất sắc
2206	忧郁	yōuyù	Buồn rầu
2207	优越	yōuyuè	Ưu việt
2208	油腻	yóunì	Mỡ màng
2209	油漆	yóuqī	Sơn
2210	犹如	yóurú	Như là
2211	有条不紊	yǒutiáo bùwěn	Ngăn nắp
2212	诱惑	yòuhuò	Cám dỗ
2213	幼稚	yòuzhì	Non nớt
2214	愚蠢	yúchǔn	Ngu ngốc
2215	舆论	yúlùn	Dư luận
2216	愚昧	yúmèi	Ngu dốt
2217	渔民	yúmín	Ngư dân
2218	与日俱增	yǔrì jùzēng	Tăng theo ngày
2219	羽绒服	yǔróngfú	Áo lông vũ
2220	予以	yǔyǐ	Đưa ra
2221	愈	yù	Càng ... càng
2222	熨	yùn	Ủi (là) quần áo
2223	预料	yùliào	Dự đoán
2224	预期	yùqī	Dự kiến
2225	预赛	yùsài	Vòng loại
2226	预算	yùsuàn	Dự toán
2227	欲望	yùwàng	Ham muốn
2228	预先	yùxiān	Trước
2229	预言	yùyán	Tiên đoán
2230	寓言	yùyán	Ngụ ngôn
2231	预兆	yùzhào	Điềm báo
2232	冤枉	yuānwang	Oan ức
2233	原告	yuángào	Nguyên cáo
2234	原理	yuánlǐ	Nguyên lý
2235	园林	yuánlín	Vườn cảnh
2236	圆满	yuánmǎn	Viên mãn
2237	源泉	yuánquán	Nguồn
2238	原始	yuánshǐ	Nguyên thủy
2239	元首	yuánshǒu	Nguyên thủ
2240	元素	yuánsù	Nguyên tố
2241	原先	yuánxiān	Trước kia
2242	元宵节	Yuánxiāojié	Tết Nguyên tiêu
2243	约束	yuēshù	Ràng buộc
2244	岳父	yuèfù	Bố vợ
2245	乐谱	yuèpǔ	Bản nhạc
2246	蕴藏	yùncáng	Chứa đựng
2247	酝酿	yùnniàng	Lên men
2248	运算	yùnsuàn	Tính toán
2249	运行	yùnxíng	Vận hành
2250	孕育	yùnyù	Nuôi dưỡng
2251	砸	zá	Đập, phá
2252	杂技	zájì	Xiếc
2253	杂交	zájiāo	Lai giống
2254	咋	zǎ	Sao (phương ngữ)
2255	灾难	zāinàn	Thảm họa
2256	栽培	zāipéi	Trồng trọt
2257	宰	zǎi	Giết, mổ
2258	在乎	zàihu	Quan tâm
2259	再接再厉	zàijiē zàilì	Cố gắng không ngừng
2260	在意	zàiyì	Quan tâm
2261	攒	zǎn	Tích lũy
2262	暂且	zànqiě	Tạm thời
2263	赞叹	zàntàn	Ca ngợi
2264	赞同	zàntóng	Đồng tình
2265	赞扬	zànyáng	Ca ngợi
2266	赞助	zànzhù	Tài trợ
2267	遭受	zāoshòu	Chịu đựng
2268	糟蹋	zāotà	Phá hoại
2269	遭殃	zāoyāng	Gặp nạn
2270	遭遇	zāoyù	Gặp phải
2271	造反	zàofǎn	Nổi loạn
2272	造型	zàoxíng	Tạo hình
2273	噪音	zàoyīn	Tiếng ồn
2274	责怪	zéguài	Trách móc
2275	贼	zéi	Kẻ trộm
2276	增添	zēngtiān	Thêm vào
2277	赠送	zèngsòng	Tặng
2278	渣	zhā	Cặn bã
2279	扎	zhā	Cắm vào
2280	扎实	zhāshi	Chắc chắn
2281	眨	zhǎ	Chớp mắt
2282	诈骗	zhàpiàn	Lừa đảo
2283	摘要	zhāiyào	Tóm tắt
2284	债券	zhàiquàn	Trái phiếu
2285	沾光	zhānguāng	Hưởng lợi
2286	瞻仰	zhānyǎng	Chiêm ngưỡng
2287	斩钉截铁	zhǎndīng jiétiě	Kiên quyết dứt khoát
2288	展示	zhǎnshì	Trưng bày
2289	展望	zhǎnwàng	Nhìn xa trông rộng
2290	展现	zhǎnxiàn	Hiển thị
2291	崭新	zhǎnxīn	Mới tinh
2292	战斗	zhàndòu	Chiến đấu
2293	占据	zhànjù	Chiếm giữ
2294	占领	zhànlǐng	Chiếm lĩnh
2295	战略	zhànlüè	Chiến lược
2296	战术	zhànshù	Chiến thuật
2297	战役	zhànyì	Trận đánh
2298	占有	zhànyǒu	Chiếm hữu
2299	章程	zhāngchéng	Điều lệ
2300	长辈	zhǎngbèi	Trưởng bối
2301	障碍	zhàng'ài	Trở ngại
2302	帐篷	zhàngpeng	Lều
2303	朝气蓬勃	zhāoqì péngbó	Tràn đầy sức sống
2304	招收	zhāoshōu	Tuyển dụng
2305	招投标	zhāotóubiāo	Đấu thầu
2306	着迷	zháomí	Mê hoặc
2307	沼泽	zhǎozé	Đầm lầy
2308	照料	zhàoliào	Chăm sóc
2309	照样	zhàoyàng	Như thường lệ
2310	照耀	zhàoyào	Chiếu sáng
2311	照应	zhàoyìng	Đáp lại
2312	遮挡	zhēdǎng	Che chắn
2313	折腾	zhēteng	Quấy rầy
2314	折	zhé	Gấp
2315	折磨	zhémó	Dày vò
2316	珍贵	zhēnguì	Quý báu
2317	侦探	zhēntàn	Trinh thám
2318	珍稀	zhēnxī	Quý hiếm
2319	真相	zhēnxiàng	Sự thật
2320	真挚	zhēnzhì	Chân thành
2321	珍珠	zhēnzhū	Ngọc trai
2322	斟酌	zhēnzhuó	Cân nhắc
2323	阵地	zhèndì	Trận địa
2324	镇定	zhèndìng	Bình tĩnh
2325	振奋	zhènfèn	Phấn khởi
2326	震惊	zhènjīng	Sốc
2327	镇静	zhènjìng	Điềm tĩnh
2328	阵容	zhènróng	Đội hình
2329	振兴	zhènxīng	Chấn hưng
2330	镇压	zhènyā	Đàn áp
2331	争端	zhēngduān	Tranh chấp
2332	争夺	zhēngduó	Tranh đoạt
2333	蒸发	zhēngfā	Bốc hơi
2334	征服	zhēngfú	Chinh phục
2335	争气	zhēngqì	Không phụ lòng
2336	征收	zhēngshōu	Thu thuế
2337	争先恐后	zhēngxiān kǒnghòu	Tranh nhau
2338	争议	zhēngyì	Tranh cãi
2339	正月	zhēngyuè	Tháng Giêng
2340	挣扎	zhēngzhá	Vật lộn
2341	整顿	zhěngdùn	Chỉnh đốn
2342	正当	zhèngdāng	Chính đáng
2343	正负	zhèngfù	Dương và âm
2344	正规	zhèngguī	Quy cách
2345	正经	zhèngjīng	Đứng đắn
2346	正气	zhèngqì	Chính khí
2347	政权	zhèngquán	Chính quyền
2348	证实	zhèngshí	Xác nhận
2349	证书	zhèngshū	Chứng chỉ
2350	正义	zhèngyì	Chính nghĩa
2351	郑重	zhèngzhòng	Trịnh trọng
2352	症状	zhèngzhuàng	Triệu chứng
2353	枝	zhī	Cành cây
2354	支撑	zhīchēng	Chống đỡ
2355	支出	zhīchū	Chi tiêu
2356	脂肪	zhīfáng	Mỡ (trong cơ thể)
2357	知觉	zhījué	Tri giác
2358	支流	zhīliú	Chi lưu
2359	支配	zhīpèi	Chi phối
2360	支援	zhīyuán	Hỗ trợ
2361	支柱	zhīzhù	Trụ cột
2362	知足常乐	zhīzú chánglè	Biết đủ thì luôn vui
2363	值班	zhíbān	Trực ban
2364	直播	zhíbō	Truyền hình trực tiếp
2365	殖民地	zhímíndì	Thuộc địa
2366	职能	zhínéng	Chức năng
2367	职位	zhíwèi	Chức vị
2368	职务	zhíwù	Chức vụ
2369	指标	zhǐbiāo	Chỉ tiêu
2370	指定	zhǐdìng	Chỉ định
2371	指甲	zhǐjiǎ	Móng tay
2372	指令	zhǐlìng	Chỉ thị
2373	指南针	zhǐnánzhēn	La bàn
2374	指示	zhǐshì	Chỉ thị
2375	指望	zhǐwàng	Hy vọng
2376	指责	zhǐzé	Chỉ trích
2377	治安	zhì'ān	Trị an
2378	制裁	zhìcái	Trừng phạt
2379	致辞	zhìcí	Phát biểu
2380	制订	zhìdìng	Lập kế hoạch
2381	制服	zhìfú	Đồng phục
2382	治理	zhìlǐ	Quản lý
2383	智力	zhìlì	Trí lực
2384	致力于	zhìlì yú	Dốc sức vào
2385	滞留	zhìliú	Lưu lại
2386	智能	zhìnéng	Trí tuệ nhân tạo
2387	志气	zhìqì	Chí khí
2388	智商	zhìshāng	Chỉ số thông minh
2389	致使	zhìshǐ	Làm cho
2390	制约	zhìyuē	Hạn chế
2391	制止	zhìzhǐ	Ngăn chặn
2392	忠诚	zhōngchéng	Trung thành
2393	终点	zhōngdiǎn	Điểm cuối
2394	中断	zhōngduàn	Gián đoạn
2395	终究	zhōngjiū	Cuối cùng
2396	中立	zhōnglì	Trung lập
2397	终年	zhōngnián	Quanh năm
2398	终身	zhōngshēn	Suốt đời
2399	忠实	zhōngshí	Trung thực
2400	衷心	zhōngxīn	Chân thành
2401	中央	zhōngyāng	Trung ương
2402	终止	zhōngzhǐ	Kết thúc
2403	肿瘤	zhǒngliú	Khối u
2404	种子	zhǒngzi	Hạt giống
2405	种族	zhǒngzú	Chủng tộc
2406	众所周知	zhòng suǒ zhōu zhī	Mọi người đều biết
2407	重心	zhòngxīn	Trọng tâm
2408	州	zhōu	Bang, châu
2409	舟	zhōu	Thuyền
2410	粥	zhōu	Cháo
2411	周边	zhōubiān	Vùng lân cận
2412	周密	zhōumì	Chu đáo
2413	周年	zhōunián	Kỷ niệm năm
2414	周期	zhōuqī	Chu kỳ
2415	周折	zhōuzhé	Trắc trở
2416	周转	zhōuzhuǎn	Luân chuyển
2417	皱纹	zhòuwén	Nếp nhăn
2418	昼夜	zhòuyè	Ngày đêm
2419	株	zhū	Cây
2420	诸位	zhūwèi	Các vị
2421	逐年	zhúnián	Hằng năm
2422	拄	zhǔ	Chống (gậy)
2423	主办	zhǔbàn	Chủ trì
2424	主导	zhǔdǎo	Chủ đạo
2425	主管	zhǔguǎn	Quản lý
2426	主流	zhǔliú	Trào lưu chính
2427	主权	zhǔquán	Chủ quyền
2428	主题	zhǔtí	Chủ đề
2429	助理	zhùlǐ	Trợ lý
2430	注射	zhùshè	Tiêm
2431	注视	zhùshì	Nhìn chăm chú
2432	注释	zhùshì	Chú thích
2433	助手	zhùshǒu	Trợ thủ
2434	铸造	zhùzào	Đúc
2435	驻扎	zhùzhā	Đóng quân
2436	住宅	zhùzhái	Nhà ở
2437	注重	zhùzhòng	Chú trọng
2438	著作	zhùzuò	Tác phẩm
2439	拽	zhuài	Kéo
2440	专长	zhuāncháng	Chuyên môn
2441	专程	zhuānchéng	Chuyến đi đặc biệt
2442	专科	zhuānkē	Chuyên khoa
2443	专利	zhuānlì	Bằng sáng chế
2444	专题	zhuāntí	Chuyên đề
2445	砖瓦	zhuānwǎ	Gạch ngói
2446	转达	zhuǎndá	Chuyển đạt
2447	转让	zhuǎnràng	Chuyển nhượng
2448	转移	zhuǎnyí	Chuyển đổi
2449	转折	zhuǎnzhé	Chuyển biến
2450	传记	zhuànjì	Tiểu sử
2451	装备	zhuāngbèi	Trang bị
2452	装卸	zhuāngxiè	Bốc dỡ
2453	庄严	zhuāngyán	Trang nghiêm
2454	庄重	zhuāngzhòng	Trịnh trọng
2455	幢	zhuàng	Tòa nhà
2456	壮观	zhuàngguān	Hoành tráng
2457	壮丽	zhuànglì	Tráng lệ
2458	壮烈	zhuàngliè	Oanh liệt
2459	追悼	zhuīdào	Tưởng niệm
2460	追究	zhuījiū	Truy cứu
2461	准则	zhǔnzé	Chuẩn mực
2462	琢磨	zuómo	Suy nghĩ, nghiên cứu
2463	着手	zhuóshǒu	Bắt đầu
2464	着想	zhuóxiǎng	Nghĩ cho
2465	卓越	zhuóyuè	Xuất sắc
2466	着重	zhuózhòng	Nhấn mạnh
2467	资本	zīběn	Vốn
2468	资产	zīchǎn	Tài sản
2469	资深	zīshēn	Kinh nghiệm
2470	姿态	zītài	Tư thế
2471	滋味	zīwèi	Mùi vị
2472	滋长	zīzhǎng	Tăng trưởng
2473	资助	zīzhù	Tài trợ
2474	子弹	zǐdàn	Đạn
2475	自卑	zìbēi	Tự ti
2476	自发	zìfā	Tự phát
2477	自力更生	zìlì gēngshēng	Tự lực cánh sinh
2478	自满	zìmǎn	Tự mãn
2479	字母	zìmǔ	Chữ cái
2480	自主	zìzhǔ	Tự chủ
2481	踪迹	zōngjì	Dấu vết
2482	棕色	zōngsè	Màu nâu
2483	宗旨	zōngzhǐ	Tôn chỉ
2484	总而言之	zǒng'éryánzhī	Tóm lại
2485	总和	zǒnghé	Tổng hợp
2486	纵横	zònghéng	Ngang dọc
2487	走廊	zǒuláng	Hành lang
2488	走漏	zǒulòu	Rò rỉ
2489	走私	zǒusī	Buôn lậu
2490	揍	zòu	Đánh
2491	租赁	zūlìn	Thuê
2492	足以	zúyǐ	Đủ để
2493	组	zǔ	Nhóm
2494	阻碍	zǔ'ài	Cản trở
2495	祖父	zǔfù	Ông nội
2496	阻拦	zǔlán	Ngăn cản
2497	阻挠	zǔnáo	Cản trở
2498	钻研	zuānyán	Nghiên cứu kỹ lưỡng
2499	钻石	zuànshí	Kim cương
2500	嘴唇	zuǐchún	Môi
2501	遵循	zūnxún	Tuân theo
2502	尊严	zūnyán	Nhân phẩm
2503	左右	zuǒyòu	Khoảng
2504	作弊	zuòbì	Gian lận
2505	做东	zuòdōng	Làm chủ
2506	作废	zuòfèi	Vô hiệu
2507	作风	zuòfēng	Phong cách
2508	作息	zuòxī	Làm việc và nghỉ ngơi
2509	座右铭	zuòyòumíng	Câu nói yêu thích
2510	做主	zuòzhǔ	Quyết định
`;

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
const HSK6_UNSORTED_VOCABULARY = parseData(rawData);

// Sort the HSK6 vocabulary alphabetically by pinyin for range generation
export const HSK6_VOCABULARY: HSKWord[] = [...HSK6_UNSORTED_VOCABULARY].sort((a, b) => {
  const pinyinA = normalizePinyin(a.pinyin);
  const pinyinB = normalizePinyin(b.pinyin);
  return pinyinA.localeCompare(pinyinB);
});
