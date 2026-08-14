(() => {
  const pair = (zh, en) => ({ zh, en });
  const replaceSlots = (template, a, b) => template
    .replaceAll("{a}", a.zh)
    .replaceAll("{b}", b.zh);
  const replaceEnglishSlots = (template, a, b) => template
    .replaceAll("{a}", a.en)
    .replaceAll("{b}", b.en);

  const flightDestinations = [
    pair("温哥华", "Vancouver"), pair("伦敦", "London"), pair("巴黎", "Paris"),
    pair("纽约", "New York"), pair("洛杉矶", "Los Angeles"), pair("东京", "Tokyo"),
    pair("新加坡", "Singapore"), pair("悉尼", "Sydney"), pair("多伦多", "Toronto"),
    pair("柏林", "Berlin"), pair("阿姆斯特丹", "Amsterdam"), pair("苏黎世", "Zurich"),
    pair("首尔", "Seoul"), pair("曼谷", "Bangkok"), pair("罗马", "Rome")
  ];
  const flightTimes = [
    pair("早上六点", "6:00 a.m."), pair("早上七点半", "7:30 a.m."), pair("早上九点", "9:00 a.m."),
    pair("上午十点半", "10:30 a.m."), pair("中午十二点", "noon"), pair("下午一点半", "1:30 p.m."),
    pair("下午三点", "3:00 p.m."), pair("下午四点半", "4:30 p.m."), pair("傍晚六点", "6:00 p.m."),
    pair("晚上七点半", "7:30 p.m."), pair("晚上九点", "9:00 p.m."), pair("晚上十一点", "11:00 p.m."),
    pair("凌晨十二点半", "12:30 a.m."), pair("清晨五点半", "5:30 a.m."), pair("晚上十点半", "10:30 p.m.")
  ];

  const cityPlaces = [
    pair("市中心", "downtown"), pair("机场", "the airport"), pair("中央火车站", "Central Station"),
    pair("会议中心", "the convention center"), pair("大学校园", "the university campus"), pair("自然历史博物馆", "the Natural History Museum"),
    pair("最近的地铁站", "the nearest subway station"), pair("长途汽车站", "the coach station"), pair("港口", "the harbor"),
    pair("老城区", "the old town"), pair("市立医院", "the city hospital"), pair("中国领事馆", "the Chinese consulate"),
    pair("科技园", "the science park"), pair("中央图书馆", "the central library"), pair("河边市场", "the riverside market")
  ];
  const cityTimes = [
    pair("现在", "right now"), pair("早高峰之前", "before the morning rush"), pair("上午九点左右", "around 9:00 a.m."),
    pair("午饭时间", "around lunchtime"), pair("下午两点", "at 2:00 p.m."), pair("下午五点之前", "before 5:00 p.m."),
    pair("晚高峰期间", "during the evening rush"), pair("今晚七点", "at 7:00 tonight"), pair("末班车之前", "before the last service"),
    pair("明天早上", "tomorrow morning"), pair("明天下午", "tomorrow afternoon"), pair("周六上午", "on Saturday morning"),
    pair("周日下午", "on Sunday afternoon"), pair("今天晚些时候", "later today"), pair("会议结束以后", "after the meeting")
  ];

  const roomTypes = [
    pair("一间单人房", "a single room"), pair("一间双人房", "a double room"), pair("一间双床房", "a twin room"),
    pair("一间安静的房间", "a quiet room"), pair("一间高楼层的房间", "a room on a high floor"), pair("一间带阳台的房间", "a room with a balcony"),
    pair("一间带厨房的房间", "a room with a kitchen"), pair("一间无障碍房间", "an accessible room"), pair("一间可以看到城市景色的房间", "a room with a city view"),
    pair("一间靠近电梯的房间", "a room near the elevator"), pair("一间远离电梯的房间", "a room away from the elevator"), pair("一间禁烟房", "a non-smoking room"),
    pair("一间家庭房", "a family room"), pair("一间套房", "a suite"), pair("一间可以提前入住的房间", "a room with early check-in")
  ];
  const stayPeriods = [
    pair("今晚", "tonight"), pair("明晚", "tomorrow night"), pair("两个晚上", "two nights"),
    pair("三个晚上", "three nights"), pair("本周末", "this weekend"), pair("下周末", "next weekend"),
    pair("周一到周三", "from Monday to Wednesday"), pair("周三到周五", "from Wednesday to Friday"), pair("一整周", "a full week"),
    pair("会议期间", "during the conference"), pair("暑期学校期间", "during the summer school"), pair("下个月的第一周", "the first week of next month"),
    pair("十二月二十日至二十三日", "December 20th to the 23rd"), pair("抵达后的前两晚", "the first two nights after I arrive"), pair("行程的最后一晚", "the final night of my trip")
  ];

  const dishes = [
    pair("烤鸡", "the grilled chicken"), pair("牛肉汉堡", "the beef burger"), pair("海鲜意面", "the seafood pasta"),
    pair("蔬菜咖喱", "the vegetable curry"), pair("烤三文鱼", "the grilled salmon"), pair("鸡肉沙拉", "the chicken salad"),
    pair("牛排", "the steak"), pair("炒饭", "the fried rice"), pair("鸡肉三明治", "the chicken sandwich"),
    pair("番茄披萨", "the tomato pizza"), pair("照烧鸡饭", "the teriyaki chicken bowl"), pair("炒面", "the stir-fried noodles"),
    pair("烤牛肉", "the roast beef"), pair("烤鱼", "the baked fish"), pair("素食汉堡", "the veggie burger")
  ];
  const foodChanges = [
    pair("不要花生", "without peanuts"), pair("不要奶制品", "without dairy"), pair("不要麸质", "without gluten"),
    pair("少放盐", "with less salt"), pair("不要洋葱", "without onions"), pair("不要辣", "not spicy"),
    pair("微辣", "mildly spicy"), pair("酱汁另放", "with the sauce on the side"), pair("把配菜换成沙拉", "with salad instead of the usual side"),
    pair("小份一点", "as a smaller portion"), pair("热一点上桌", "served hot"), pair("不要鸡蛋", "without eggs"),
    pair("打包带走", "for takeout"), pair("分成两份", "split into two portions"), pair("多加一些蔬菜", "with extra vegetables")
  ];

  const clothingItems = [
    pair("夹克", "this jacket"), pair("衬衫", "this shirt"), pair("毛衣", "this sweater"),
    pair("连帽衫", "this hoodie"), pair("外套", "this coat")
  ];
  const clothingOptions = [
    pair("特小码的", "in extra small"), pair("小码的", "in small"), pair("中码的", "in medium"),
    pair("大码的", "in large"), pair("特大码的", "in extra large"), pair("大一号的", "in a larger size"),
    pair("小一号的", "in a smaller size"), pair("黑色的", "in black"), pair("蓝色的", "in blue"),
    pair("灰色的", "in gray"), pair("白色的", "in white"), pair("红色的", "in red"),
    pair("绿色的", "in green"), pair("米色的", "in beige"), pair("深蓝色的", "in navy")
  ];
  const powerItems = [
    pair("旅行转换插头", "this travel adapter"), pair("手机充电器", "this phone charger"), pair("笔记本充电器", "this laptop charger"),
    pair("旅行插线板", "this travel power strip"), pair("USB充电器", "this USB charger")
  ];
  const powerOptions = [
    pair("带英式插头的", "with a UK plug"), pair("带美式插头的", "with a US plug"), pair("带欧式插头的", "with a European plug"),
    pair("支持快速充电的", "with fast charging"), pair("带两个USB接口的", "with two USB ports"), pair("带三个USB接口的", "with three USB ports"),
    pair("带保修的", "with a warranty"), pair("今天有现货的", "in stock today"), pair("价格更低的", "at a lower price"),
    pair("五十美元以内的", "for under fifty dollars"), pair("可以免税的", "tax-free"), pair("可以提供收据的", "with a receipt"),
    pair("黑色的", "in black"), pair("更轻便的", "in a lighter version"), pair("可以送货的", "with delivery")
  ];
  const luggageItems = [
    pair("行李箱", "this suitcase"), pair("旅行背包", "this travel backpack"), pair("旅行袋", "this duffel bag"),
    pair("登机箱", "this carry-on bag"), pair("日用背包", "this daypack")
  ];
  const luggageOptions = [
    pair("黑色的", "in black"), pair("蓝色的", "in blue"), pair("灰色的", "in gray"),
    pair("更大尺寸的", "in a larger size"), pair("更小尺寸的", "in a smaller size"), pair("符合登机尺寸的", "in a carry-on size"),
    pair("更轻便的", "in a lighter version"), pair("防水的", "in a waterproof version"), pair("带锁的", "with a lock"),
    pair("带保修的", "with a warranty"), pair("今天有现货的", "in stock today"), pair("正在打折的", "on sale"),
    pair("可以免税的", "tax-free"), pair("使用再生材料的", "made from recycled material"), pair("可以送货的", "with delivery")
  ];
  const shoppingPatterns = [
    ["请问有{b}{a}吗？", "Do you have {a} {b}?", "查找商品"],
    ["我可以看一下{b}{a}吗？", "Could I see {a} {b}?", "查看商品"],
    ["{a}有{b}的吗？", "Can I get {a} {b}?", "确认库存"],
    ["我在找{b}{a}。", "I am looking for {a} {b}.", "说明需求"],
    ["我可以订购{b}{a}吗？", "Can I order {a} {b}?", "订购商品"],
    ["你能查一下其他分店有没有{b}{a}吗？", "Could you check whether another branch has {a} {b}?", "跨店查询"]
  ];

  const medicalSymptoms = [
    pair("头痛", "a headache"), pair("喉咙痛", "a sore throat"), pair("腰部疼痛", "pain in my lower back"),
    pair("手臂上出现皮疹", "a rash on my arm"), pair("咳嗽", "a cough"), pair("发烧", "a fever"),
    pair("胃痛", "stomach pain"), pair("头晕", "dizziness"), pair("恶心", "nausea"),
    pair("过敏反应", "an allergic reaction"), pair("脚踝疼痛", "pain in my ankle"), pair("睡眠困难", "trouble sleeping"),
    pair("呼吸急促", "shortness of breath"), pair("眼睛发炎", "eye irritation"), pair("牙痛", "tooth pain")
  ];
  const symptomDurations = [
    pair("从昨天开始", "since yesterday"), pair("从今天早上开始", "since this morning"), pair("已经两天了", "for two days"),
    pair("已经三天了", "for three days"), pair("大约一周了", "for about a week"), pair("从上周末开始", "since last weekend"),
    pair("旅行开始以后", "since the trip began"), pair("吃完晚饭以后", "since dinner"), pair("服药以后", "since taking the medicine"),
    pair("每到晚上", "every evening"), pair("运动以后", "after exercise"), pair("坐飞机以后", "since the flight"),
    pair("今天一整天", "throughout the day"), pair("断断续续有一个月了", "on and off for a month"), pair("过去几个小时里", "for the past few hours")
  ];

  const socialActivities = [
    pair("一起喝杯咖啡", "get coffee"), pair("一起吃午饭", "have lunch"), pair("一起吃晚饭", "have dinner"),
    pair("去参观博物馆", "visit the museum"), pair("出去散步", "go for a walk"), pair("参观一下校园", "take a campus tour"),
    pair("休息一下聊聊天", "take a study break"), pair("安排一次周末短途旅行", "take a weekend trip"), pair("去听音乐会", "go to the concert"),
    pair("逛周末市场", "visit the weekend market"), pair("一起做饭", "cook dinner together"), pair("去徒步", "go hiking"),
    pair("去看电影", "see a movie"), pair("参加语言交换活动", "join the language exchange"), pair("玩桌游", "play board games")
  ];
  const socialTimes = [
    pair("今天课后", "after class today"), pair("明天上午", "tomorrow morning"), pair("明天下午", "tomorrow afternoon"),
    pair("明天晚上", "tomorrow evening"), pair("午饭时间", "around lunchtime"), pair("今晚七点", "at seven tonight"),
    pair("周五下班后", "after work on Friday"), pair("周六上午", "on Saturday morning"), pair("周六下午", "on Saturday afternoon"),
    pair("周日晚上", "on Sunday evening"), pair("这个周末", "this weekend"), pair("下个周末", "next weekend"),
    pair("会议结束后", "after the conference session"), pair("考试结束后", "after the exam"), pair("下周某个晚上", "one evening next week")
  ];

  const dailyServices = [
    pair("我的手机套餐", "my mobile phone plan"), pair("家里的网络服务", "my home internet service"), pair("我的银行账户", "my bank account"),
    pair("我的电费账户", "my electricity account"), pair("我的水费账户", "my water account"), pair("一个包裹配送", "a package delivery"),
    pair("我的健身房会员", "my gym membership"), pair("我的公共交通卡", "my public transport card"), pair("垃圾回收服务", "my waste collection service"),
    pair("我的保险保单", "my insurance policy"), pair("一张图书馆卡", "a library card"), pair("一项洗衣服务", "a laundry service"),
    pair("一辆共享自行车", "a rental bike"), pair("我的网上订单", "my online order"), pair("我的居住登记", "my residence registration")
  ];
  const serviceTimes = [
    pair("今天", "today"), pair("明天", "tomorrow"), pair("本周内", "this week"),
    pair("周五之前", "before Friday"), pair("月底之前", "before the end of the month"), pair("下周一开始", "starting next Monday"),
    pair("下午三点以后", "after 3:00 p.m."), pair("工作日上午", "on a weekday morning"), pair("周六下午", "on Saturday afternoon"),
    pair("我出发之前", "before I leave"), pair("我回来以后", "after I return"), pair("尽快", "as soon as possible"),
    pair("未来三天内", "within the next three days"), pair("下个账单周期", "in the next billing cycle"), pair("下周的工作日", "on a weekday next week")
  ];

  const housingProblems = [
    pair("暖气停止工作了", "the heating has stopped working"), pair("淋浴一直漏水", "the shower keeps leaking"), pair("前门的锁卡住了", "the front door lock is stuck"),
    pair("厨房水槽堵住了", "the kitchen sink is blocked"), pair("冰箱发出很大的声音", "the refrigerator is making a loud noise"), pair("卧室的灯不亮了", "the bedroom light is not working"),
    pair("窗户关不严", "the window will not close properly"), pair("烟雾报警器一直响", "the smoke alarm keeps beeping"), pair("洗衣机中途停机", "the washing machine stops halfway through a cycle"),
    pair("热水不稳定", "the hot water is not reliable"), pair("墙上出现了潮湿的痕迹", "there is a damp patch on the wall"), pair("楼上的噪音很大", "the noise from upstairs is very loud"),
    pair("信箱的钥匙打不开", "the mailbox key does not work"), pair("厨房里有奇怪的气味", "there is a strange smell in the kitchen"), pair("公共区域的灯坏了", "the light in the common area is broken")
  ];
  const problemTimes = [
    pair("从昨晚开始", "since last night"), pair("从今天早上开始", "since this morning"), pair("已经两天了", "for two days"),
    pair("已经一周了", "for a week"), pair("今天又发生了", "again today"), pair("每天晚上都会发生", "every night"),
    pair("每次下雨时都会发生", "whenever it rains"), pair("夜间特别严重", "especially during the night"), pair("每次使用时都会发生", "whenever I use it"),
    pair("暴风雨后开始的", "since the storm"), pair("从我搬进来就这样", "since I moved in"), pair("整个周末都这样", "throughout the weekend"),
    pair("停电后开始的", "since the power cut"), pair("偶尔会发生", "from time to time"), pair("今天一整天都这样", "all day today")
  ];

  const campusTasks = [
    pair("小组作业", "the group assignment"), pair("这周的问题集", "this week's problem set"), pair("研讨课展示", "the seminar presentation"),
    pair("阅读回应", "the reading response"), pair("实验报告", "the lab report"), pair("文献综述", "the literature review"),
    pair("研究计划", "the research proposal"), pair("编程项目", "the coding project"), pair("数据分析", "the data analysis"),
    pair("海报初稿", "the poster draft"), pair("选课问题", "the course registration issue"), pair("老师的答疑时间", "the professor's office hours"),
    pair("学习小组", "the study group"), pair("上周的课堂笔记", "last week's class notes"), pair("期末展示", "the final presentation")
  ];
  const campusTimes = [
    pair("今天课后", "after class today"), pair("明天上午", "tomorrow morning"), pair("明天下午", "tomorrow afternoon"),
    pair("午饭以后", "after lunch"), pair("下午三点", "at 3:00 p.m."), pair("今晚七点", "at 7:00 tonight"),
    pair("周三的课前", "before class on Wednesday"), pair("周四下午", "on Thursday afternoon"), pair("周五之前", "before Friday"),
    pair("这个周末", "this weekend"), pair("下周一", "next Monday"), pair("下次研讨课之前", "before the next seminar"),
    pair("实验室会议以后", "after the lab meeting"), pair("导师见面之前", "before the supervisor meeting"), pair("下周某个晚上", "one evening next week")
  ];

  const researchItems = [
    pair("这个数据集", "this dataset"), pair("当前的模型", "the current model"), pair("这组实验", "this set of experiments"),
    pair("采样计划", "the sampling plan"), pair("分析代码", "the analysis code"), pair("论文初稿", "the manuscript draft"),
    pair("文献综述", "the literature review"), pair("方法部分", "the methods section"), pair("主要图表", "the main figures"),
    pair("统计分析", "the statistical analysis"), pair("校准结果", "the calibration results"), pair("验证方案", "the validation plan"),
    pair("补充材料", "the supplementary material"), pair("研究计划书", "the research proposal"), pair("审稿意见回复", "the response to the reviewers")
  ];
  const researchIssues = [
    pair("需要再检查一遍", "needs another check"), pair("需要更清楚的解释", "needs a clearer explanation"), pair("还不够完整", "is not complete enough"),
    pair("与之前的版本不一致", "is inconsistent with the previous version"), pair("需要更多证据支持", "needs more supporting evidence"), pair("可能存在一些偏差", "may contain some bias"),
    pair("需要在组会前完成", "needs to be finished before the group meeting"), pair("需要导师确认", "needs the supervisor's confirmation"), pair("应该在共享文件夹里更新", "should be updated in the shared folder"),
    pair("需要记录所有修改", "needs a record of all changes"), pair("需要进行可重复性检查", "needs a reproducibility check"), pair("需要补充不确定性分析", "needs an uncertainty analysis"),
    pair("需要和原始数据重新核对", "needs to be checked against the raw data"), pair("还没有回答核心问题", "does not yet answer the central question"), pair("需要更明确地说明局限性", "needs a clearer statement of its limitations")
  ];

  const conferenceEvents = [
    pair("开幕主题报告", "the opening keynote"), pair("海报交流环节", "the poster session"), pair("方法培训工作坊", "the methods workshop"),
    pair("多介质模型分会", "the session on multimedia modeling"), pair("青年学者交流会", "the early-career networking event"), pair("圆桌讨论", "the roundtable discussion"),
    pair("大会专题讨论", "the conference panel"), pair("参展商演示", "the exhibitor demonstration"), pair("我的口头报告", "my oral presentation"),
    pair("午餐研讨会", "the lunch symposium"), pair("软件演示", "the software demonstration"), pair("闭幕全会", "the closing plenary"),
    pair("特刊编辑见面会", "the special issue meeting"), pair("大会晚宴", "the conference dinner"), pair("会后合作讨论", "the post-conference collaboration meeting")
  ];
  const conferenceLocations = [
    pair("主会场", "the main hall"), pair("二〇一会议室", "Room 201"), pair("三楼宴会厅", "the ballroom on the third floor"),
    pair("海报大厅", "the poster hall"), pair("展览中心东翼", "the east wing of the exhibition center"), pair("大学礼堂", "the university auditorium"),
    pair("一号报告厅", "Lecture Theatre 1"), pair("酒店会议层", "the hotel's conference floor"), pair("注册区旁边的会议室", "the meeting room next to registration"),
    pair("线上会议平台", "the online conference platform"), pair("图书馆报告厅", "the library auditorium"), pair("会议中心屋顶花园", "the convention center's rooftop garden"),
    pair("B区展厅", "Exhibition Hall B"), pair("大会休息区", "the conference lounge"), pair("会场旁边的餐厅", "the restaurant next to the venue")
  ];

  const packs = [
    {
      category: "机场通关", scene: "机场 · 航班服务", speaker: "Airline staff", a: flightDestinations, b: flightTimes,
      patterns: [
        ["我想找一班{b}左右飞往{a}的航班。", "I am looking for a flight to {a} around {b}.", "询问航班"],
        ["有没有{b}以后直飞{a}的航班？", "Is there a direct flight to {a} after {b}?", "直飞航班"],
        ["{b}飞往{a}的航班在哪个登机口？", "Which gate is the {b} flight to {a} leaving from?", "确认登机口"],
        ["我可以把飞往{a}的航班改到{b}吗？", "Can I change my flight to {a} to the one at {b}?", "改签航班"],
        ["{b}飞往{a}的航班最晚几点办理值机？", "What is the check-in deadline for the {b} flight to {a}?", "值机时间"],
        ["{b}飞往{a}的航班延误了吗？", "Has the {b} flight to {a} been delayed?", "航班延误"]
      ]
    },
    {
      category: "交通问路", scene: "城市 · 规划路线", speaker: "Transit staff", a: cityPlaces, b: cityTimes,
      patterns: [
        ["我需要在{b}到达{a}，应该怎么走？", "I need to get to {a} {b}. What is the best way to get there?", "规划路线"],
        ["{b}去{a}还有公共交通吗？", "Is there still public transportation to {a} {b}?", "公共交通"],
        ["如果我想{b}到达{a}，应该几点出发？", "What time should I leave if I want to reach {a} {b}?", "出发时间"],
        ["{b}去{a}打车大概多少钱？", "About how much would a taxi to {a} cost {b}?", "出租车费用"],
        ["{b}去{a}需要换乘吗？", "Do I need to transfer to get to {a} {b}?", "换乘路线"],
        ["我能在{b}预订去{a}的车吗？", "Can I book a ride to {a} {b}?", "预约用车"]
      ]
    },
    {
      category: "酒店住宿", scene: "酒店 · 预订与入住", speaker: "Receptionist", a: roomTypes, b: stayPeriods,
      patterns: [
        ["我想预订{a}，住{b}。", "I would like to book {a} for {b}.", "预订房间"],
        ["请问{b}还有{a}吗？", "Do you have {a} available for {b}?", "查询房态"],
        ["{b}入住{a}的总价是多少？", "What is the total price for {a} for {b}?", "询问房价"],
        ["如果我订{b}的{a}，可以免费取消吗？", "Can I cancel for free if I book {a} for {b}?", "取消政策"],
        ["{b}入住{a}最早几点可以办理？", "What is the earliest check-in time for {a} for {b}?", "提前入住"],
        ["预订{b}的{a}需要支付押金吗？", "Is a deposit required for {a} for {b}?", "酒店押金"]
      ]
    },
    {
      category: "餐厅点餐", scene: "餐厅 · 个性化点餐", speaker: "Server", a: dishes, b: foodChanges,
      patterns: [
        ["我想要{a}，{b}。", "I would like {a} {b}.", "个性化点餐"],
        ["请问{a}可以做成{b}吗？", "Could {a} be prepared {b}?", "调整菜品"],
        ["如果我要{a}，可以{b}吗？", "If I order {a}, could I have it {b}?", "确认要求"],
        ["我需要{a}{b}，这是我的用餐要求。", "I need {a} {b}. This is how I need my order prepared.", "用餐要求"],
        ["厨房能不能把{a}做成{b}？", "Would the kitchen be able to make {a} {b}?", "询问厨房"],
        ["麻烦确认一下，{a}会按{b}来准备，对吗？", "Could you confirm that {a} will be prepared {b}?", "确认订单"]
      ]
    },
    {
      category: "购物生活", scene: "服装店 · 尺码颜色", speaker: "Shop assistant", a: clothingItems, b: clothingOptions, patterns: shoppingPatterns
    },
    {
      category: "购物生活", scene: "电子商店 · 旅行电源", speaker: "Shop assistant", a: powerItems, b: powerOptions, patterns: shoppingPatterns
    },
    {
      category: "购物生活", scene: "旅行用品店 · 行李", speaker: "Shop assistant", a: luggageItems, b: luggageOptions, patterns: shoppingPatterns
    },
    {
      category: "医疗求助", scene: "诊所 · 描述症状", speaker: "Doctor", a: medicalSymptoms, b: symptomDurations,
      patterns: [
        ["我的症状是{a}，{b}。", "I have had {a} {b}.", "描述症状"],
        ["我{b}一直有{a}。", "I have been experiencing {a} {b}.", "说明病程"],
        ["如果{a}{b}，我应该去看医生吗？", "Should I see a doctor if I have had {a} {b}?", "询问就医"],
        ["对于{b}的{a}，有什么药可以吃吗？", "Is there anything I can take for {a} that has lasted {b}?", "询问药物"],
        ["因为我的{a}{b}，我想预约看诊。", "I would like to make an appointment because I have had {a} {b}.", "预约看诊"],
        ["我很担心，因为{a}{b}，而且越来越严重。", "I am concerned because I have had {a} {b}, and it is getting worse.", "症状加重"]
      ]
    },
    {
      category: "社交交流", scene: "日常社交 · 邀请朋友", speaker: "Friend", a: socialActivities, b: socialTimes,
      patterns: [
        ["你愿意{b}{a}吗？", "Would you like to {a} {b}?", "发出邀请"],
        ["你{b}有空{a}吗？", "Are you free to {a} {b}?", "询问时间"],
        ["我们几个人打算{b}{a}，你想一起来吗？", "A few of us are planning to {a} {b}. Would you like to join us?", "邀请加入"],
        ["我们{b}{a}，应该在哪里见面？", "Where should we meet to {a} {b}?", "确认见面地点"],
        ["我们{b}{a}时，我可以带一个朋友吗？", "Would it be okay if I brought a friend when we {a} {b}?", "携带朋友"],
        ["如果你{b}不能{a}，我们可以改时间。", "If you cannot {a} {b}, we can reschedule.", "更改安排"]
      ]
    },
    {
      category: "生活服务", scene: "城市生活 · 办理服务", speaker: "Service agent", a: dailyServices, b: serviceTimes,
      patterns: [
        ["我想在{b}咨询办理{a}。", "I would like help with {a} {b}.", "办理服务"],
        ["请问可以在{b}更改{a}吗？", "Can I make a change to {a} {b}?", "更改服务"],
        ["我需要{b}取消{a}。", "I need to cancel {a} {b}.", "取消服务"],
        ["{a}出了问题，我希望{b}有人处理。", "There is a problem with {a}, and I would like someone to deal with it {b}.", "报告问题"],
        ["关于{a}，我能预约在{b}咨询吗？", "Could I schedule an appointment about {a} {b}?", "预约咨询"],
        ["我之前联系过{a}的问题，想在{b}跟进一下。", "I previously contacted you about {a}, and I would like to follow up {b}.", "跟进服务"]
      ]
    },
    {
      category: "住房邻里", scene: "住所 · 报修与沟通", speaker: "Property manager", a: housingProblems, b: problemTimes,
      patterns: [
        ["我想报告一个问题：{a}，{b}。", "I would like to report a problem: {a} {b}.", "住房报修"],
        ["{a}，{b}，可以派人来检查吗？", "{a} {b}. Could someone come and check it?", "请求检查"],
        ["问题是{a}，而且{b}，请问什么时候能修？", "The issue is that {a} {b}. When can it be repaired?", "询问维修"],
        ["{a}，{b}，现在有什么临时解决办法吗？", "{a} {b}. Is there a temporary solution for now?", "临时处理"],
        ["我之前报告过{a}，{b}，但问题还没有解决。", "I reported that {a} {b}, but the problem is still unresolved.", "跟进报修"],
        ["{a}，{b}，这已经影响到我的日常生活了。", "{a} {b}, and it is now affecting my daily life.", "说明影响"]
      ]
    },
    {
      category: "校园交流", scene: "校园 · 同学与老师", speaker: "Classmate", a: campusTasks, b: campusTimes,
      patterns: [
        ["我们可以在{b}讨论{a}吗？", "Can we discuss {a} {b}?", "安排讨论"],
        ["你{b}有空一起做{a}吗？", "Are you free to work on {a} {b}?", "同学协作"],
        ["你能在{b}帮我看看{a}吗？", "Could you help me with {a} {b}?", "请求帮助"],
        ["我们定在{b}开会讨论{a}吧。", "Let us meet {b} to talk about {a}.", "小组会议"],
        ["{b}适合一起检查{a}吗？", "Would it work to review {a} together {b}?", "确认时间"],
        ["我对{a}有个问题，可以在{b}聊一下吗？", "I have a question about {a}. Could we talk {b}?", "请教问题"]
      ]
    },
    {
      category: "科研沟通", scene: "研究组 · 项目讨论", speaker: "Supervisor", a: researchItems, b: researchIssues,
      patterns: [
        ["我认为{a}{b}。", "I think {a} {b}.", "汇报判断"],
        ["我们可以讨论一下为什么{a}{b}吗？", "Could we discuss why {a} {b}?", "讨论原因"],
        ["我目前主要担心的是{a}{b}。", "My main concern is that {a} {b}.", "说明担忧"],
        ["我们需要处理{a}{b}这个问题。", "We need to address the fact that {a} {b}.", "提出问题"],
        ["对于{a}{b}，你建议怎么处理？", "How would you suggest handling the fact that {a} {b}?", "征求建议"],
        ["我注意到{a}{b}，我们能一起检查吗？", "I noticed that {a} {b}. Could we review it together?", "请求复核"]
      ]
    },
    {
      category: "学术会议", scene: "国际会议 · 会场交流", speaker: "Conference staff", a: conferenceEvents, b: conferenceLocations,
      patterns: [
        ["请问{a}是在{b}举行吗？", "Is {a} being held in {b}?", "确认会场"],
        ["{a}是不是改到{b}了？", "Has {a} been moved to {b}?", "会场变更"],
        ["你能告诉我怎么去{b}参加{a}吗？", "Could you tell me how to get to {b} for {a}?", "会议问路"],
        ["我已经注册了{a}，应该直接去{b}吗？", "I have registered for {a}. Should I go directly to {b}?", "会议注册"],
        ["{b}有足够的座位参加{a}吗？", "Will there be enough seating in {b} for {a}?", "会场座位"],
        ["在{b}参加{a}需要提前签到吗？", "Do I need to check in early for {a} in {b}?", "会议签到"]
      ]
    }
  ];

  const generated = [];
  const seen = new Set();
  const contexts = {
    "机场通关": "You are speaking with airline staff about your flight.",
    "交通问路": "You are asking local transit staff to help plan your route.",
    "酒店住宿": "You are discussing a booking with the hotel receptionist.",
    "餐厅点餐": "The server is ready to take or confirm your order.",
    "购物生活": "You are asking a shop assistant about a product you need.",
    "医疗求助": "You are describing a symptom to a doctor or pharmacist.",
    "社交交流": "You are making plans with a friend in everyday life.",
    "生活服务": "You are speaking with a customer service agent about an everyday service.",
    "住房邻里": "You are explaining a housing problem to the property manager.",
    "校园交流": "You are arranging study work with a classmate or professor.",
    "科研沟通": "You are discussing research progress with your supervisor or lab group.",
    "学术会议": "You are speaking with conference staff or another researcher."
  };
  packs.forEach((pack, packIndex) => {
    pack.patterns.forEach((pattern, patternIndex) => {
      pack.a.forEach((a, aIndex) => {
        pack.b.forEach((b, bIndex) => {
          const cn = replaceSlots(pattern[0], a, b);
          const rawEnglish = replaceEnglishSlots(pattern[1], a, b).replace(/\.\./g, ".");
          const en = rawEnglish[0].toUpperCase() + rawEnglish.slice(1);
          const key = `${cn}|||${en}`;
          if (seen.has(key)) return;
          seen.add(key);
          generated.push({
            id: `matrix-${packIndex}-${patternIndex}-${aIndex}-${bIndex}`,
            scene: pack.scene,
            speaker: pack.speaker,
            context: contexts[pack.category],
            cn,
            en,
            alts: [],
            category: pack.category,
            tag: `情境变体 · ${pattern[2]}`,
            generated: true
          });
        });
      });
    });
  });

  window.ECHO_GENERATED_QUESTIONS = generated;
})();
