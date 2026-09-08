// Original editorial lessons: each row is a specific everyday exchange, not a template permutation.
(() => {
  const scenes=[
    {id:'kitchen-prep',title:'厨房 · 一起备菜',label:'KITCHEN / PREP',intro:'找厨具、洗菜、切菜，和室友一起把晚饭准备好。',speaker:'Roommate',rows:[
      ['你能把砧板递给我吗？','Could you pass me the cutting board?','Let’s get the vegetables ready.','cutting board','砧板；英式也常说 chopping board','pass me the cutting board',['Could you pass me the chopping board?']],
      ['削皮器在抽屉里。','The peeler is in the drawer.','Where is the peeler?','peeler','削皮器','a vegetable peeler'],
      ['先用漏盆把这些菜冲一下。','Rinse these vegetables in the colander first.','Should I start chopping these?','colander','沥水用的漏盆','rinse vegetables in a colander'],
      ['这把刀有点钝了。','This knife is a bit blunt.','How is the chopping going?','blunt','钝的；刀刃不锋利也可说 dull','a blunt knife',['This knife is a little dull.']],
      ['你想让我把胡萝卜切成片还是切成小块？','Do you want me to slice the carrots or dice them?','Could you prepare the carrots next?','dice','切成小丁；slice 是切成片','dice the carrots'],
      ['请把土豆放进那个搅拌碗里。','Please put the potatoes in that mixing bowl.','These potatoes are ready. Where should they go?','mixing bowl','搅拌碗；拌食材用的大碗','put the potatoes in a mixing bowl'],
      ['我需要量杯，不是普通的杯子。','I need a measuring cup, not a regular cup.','Will this mug work for measuring the milk?','measuring cup','量杯','a measuring cup'],
      ['橱柜里还有一个开罐器。','There is another can opener in the cupboard.','This can opener isn’t working.','can opener','开罐器；英式也常说 tin opener','a can opener in the cupboard']
    ]},
    {id:'cooking',title:'厨房 · 开火做饭',label:'KITCHEN / COOK',intro:'调火候、防溢锅、找锅铲，把常见动作说清楚。',speaker:'Roommate',rows:[
      ['平底锅够热了吗？','Is the frying pan hot enough?','I’ve put the pan on the stove.','frying pan','平底煎锅；也可说 skillet','heat the frying pan'],
      ['先用锅铲把它翻过来。','Flip it over with the spatula first.','Is this side cooked enough?','spatula','锅铲；也指刮刀，含义取决于形状和用途','flip it over with a spatula'],
      ['你能把火调小一点吗？','Could you turn the heat down a little?','The onions are browning very quickly.','turn the heat down','把火调小','turn the heat down a little'],
      ['锅里的水快溢出来了。','The water in the pot is about to boil over.','Why are you rushing over to the stove?','boil over','沸腾后溢出锅外','be about to boil over'],
      ['盖子没有盖严。','The lid is not on properly.','Why is so much steam escaping?','lid','盖子','put the lid on properly'],
      ['用夹子夹，别用手拿。','Use the tongs, not your hands.','I’ll move these hot pieces onto the plate.','tongs','夹子；通常用复数形式','use the tongs'],
      ['拿烤盘之前先戴上隔热手套。','Put on oven gloves before you pick up the baking tray.','The cookies look ready.','oven gloves','隔热手套；美式常说 oven mitts；baking tray 是烤盘','put on oven gloves',['Put on oven mitts before you pick up the baking tray.']],
      ['关火以后再把锅端下来。','Turn off the heat before you take the pot off the stove.','Shall I move this pot now?','stove','炉灶；hob 通常指灶台的炉头部分','take the pot off the stove']
    ]},
    {id:'washing-up',title:'厨房 · 饭后收拾',label:'KITCHEN / CLEAN',intro:'海绵、洗洁精、沥水架，还有“泡一下再洗”。',speaker:'Roommate',rows:[
      ['洗洁精快用完了。','We are almost out of dish soap.','I’m about to wash the dishes.','dish soap','洗洁精；英式常说 washing-up liquid','be almost out of dish soap',['We are almost out of washing-up liquid.']],
      ['水槽旁边有块新的海绵。','There is a new sponge next to the sink.','This sponge is falling apart.','sponge','海绵；sink 是水槽','a sponge next to the sink'],
      ['这个锅先泡一会儿吧。','Let this pot soak for a while.','The food is stuck to the bottom.','soak','浸泡','let the pot soak'],
      ['别用钢丝球擦这个不粘锅。','Do not use a steel scourer on this nonstick pan.','Should I scrub it with this?','nonstick pan','不粘锅；steel scourer 是金属丝清洁球','clean a nonstick pan'],
      ['把盘子放到沥水架上就行。','Just put the plates on the drying rack.','Where should I put the clean plates?','drying rack','沥水架；此处也可说 dish rack','put plates on the drying rack'],
      ['你能擦一下台面吗？','Could you wipe down the countertop?','The dishes are done. What else needs cleaning?','countertop','厨房台面；英式也常说 worktop','wipe down the countertop',['Could you wipe down the worktop?']],
      ['水龙头还在滴水。','The faucet is still dripping.','I thought I turned the water off.','faucet','水龙头；英式常说 tap','a dripping faucet',['The tap is still dripping.']],
      ['垃圾袋漏了，我们换一个吧。','The garbage bag is leaking. Let’s replace it.','Why is the floor wet under the bin?','garbage bag','垃圾袋；也可说 trash bag 或 bin bag','replace a leaking garbage bag']
    ]},
    {id:'leftovers',title:'厨房 · 冰箱与剩菜',label:'KITCHEN / STORE',intro:'保鲜盒、保鲜膜、冷冻室，以及保存和加热剩菜。',speaker:'Roommate',rows:[
      ['剩菜放进密封盒里吧。','Put the leftovers in an airtight container.','What should we do with the extra food?','airtight container','密封容器；leftovers 是剩菜','store leftovers in an airtight container'],
      ['保鲜膜放在哪儿了？','Where did we put the plastic wrap?','We need to cover this bowl.','plastic wrap','保鲜膜；英式常说 cling film','cover a bowl with plastic wrap',['Where did we put the cling film?']],
      ['这个盒子可以放进微波炉吗？','Is this container microwave-safe?','Can we reheat the food in this?','microwave-safe','可用于微波炉的','a microwave-safe container'],
      ['请在标签上写一下今天的日期。','Please write today’s date on the label.','How will we know when we cooked it?','label','标签','write the date on the label'],
      ['牛奶在冰箱门上的架子里。','The milk is on the shelf in the fridge door.','I can’t find the milk.','shelf','架子的一层；复数 shelves','the shelf in the fridge door'],
      ['冰格已经空了。','The ice cube tray is empty.','Do we have any ice for our drinks?','ice cube tray','冰格；制冰用的小托盘','fill the ice cube tray'],
      ['冷冻室里还有一袋豌豆。','There is another bag of peas in the freezer.','We’ve used up the fresh vegetables.','freezer','冷冻室；冷冻柜','a bag of peas in the freezer'],
      ['这盒酸奶已经过期了。','This yogurt is past its use-by date.','Should we keep this yogurt?','use-by date','食用期限；与侧重品质的 best-before date 不同','be past the use-by date']
    ]},
    {id:'office-supplies',title:'办公室 · 借个小东西',label:'OFFICE / DESK',intro:'订书机、便利贴、回形针：不是只会说 thing。',speaker:'Colleague',rows:[
      ['能借我一下订书机吗？','Could I borrow your stapler?','Are you ready to hand in those pages?','stapler','订书机','borrow a stapler'],
      ['订书钉用完了。','We have run out of staples.','Why isn’t the stapler working?','staples','订书钉；不要与 stapler 订书机混淆','run out of staples'],
      ['用回形针夹住就行。','Just hold them together with a paper clip.','How should I keep these pages together, then?','paper clip','回形针','hold papers together with a paper clip'],
      ['你有荧光笔吗？','Do you have a highlighter?','Which part of the document do you want to mark?','highlighter','荧光笔','mark a sentence with a highlighter'],
      ['我把号码写在便利贴上了。','I wrote the number on a sticky note.','Did you write down the extension number?','sticky note','便利贴','write on a sticky note'],
      ['这叠纸太厚了，要用长尾夹。','This stack of paper is too thick. We need a binder clip.','Can I use a paper clip for all of these?','binder clip','长尾夹','a binder clip for a thick stack'],
      ['打孔器在最下面的抽屉里。','The hole punch is in the bottom drawer.','I need to file these pages in a binder.','hole punch','打孔器；binder 是活页夹','the hole punch in the bottom drawer'],
      ['用完剪刀后放回原处就好。','Just put the scissors back when you are done.','Thanks for letting me use these.','scissors','剪刀；通常用复数形式','put the scissors back']
    ]},
    {id:'office-equipment',title:'办公室 · 设备小麻烦',label:'OFFICE / EQUIPMENT',intro:'卡纸、插座、转接头、静音，用简单英语解决问题。',speaker:'Colleague',rows:[
      ['打印机好像卡纸了。','The printer seems to have a paper jam.','My document hasn’t come out.','paper jam','卡纸','the printer has a paper jam'],
      ['纸盘里没有纸了。','There is no paper left in the paper tray.','The jam is cleared, but it still won’t print.','paper tray','打印机纸盘','refill the paper tray'],
      ['请帮我改成双面打印。','Could you set it to print double-sided?','How would you like these copies printed?','double-sided','双面的；也可说 on both sides','print double-sided'],
      ['这个插座没电。','There is no power at this outlet.','Why isn’t your laptop charging?','outlet','电源插座；英式常说 socket','plug into an outlet',['There is no power at this socket.']],
      ['你有多余的转接头吗？','Do you have a spare adapter?','My charger doesn’t fit this socket.','adapter','转接头；适配器','a spare adapter'],
      ['桌子下面有个插线板。','There is a power strip under the desk.','We need somewhere to plug in the monitor too.','power strip','多位插线板','a power strip under the desk'],
      ['我的鼠标滚轮不太灵了。','The scroll wheel on my mouse is not working properly.','Why are you dragging the scroll bar?','scroll wheel','鼠标滚轮','the scroll wheel on a mouse'],
      ['你还在静音状态，我们听不到你。','You are still on mute. We can’t hear you.','The online meeting has started, but your colleague’s lips are moving silently.','on mute','处于静音状态','be on mute']
    ]},
    {id:'break-room',title:'办公室 · 茶水间闲聊',label:'OFFICE / BREAK',intro:'热水壶、杯垫和茶包，顺手帮忙时怎么说。',speaker:'Colleague',rows:[
      ['我正要烧水，你也要一杯茶吗？','I’m about to boil the kettle. Would you like some tea too?','You meet a colleague in the break room.','kettle','烧水壶；boil the kettle 是常见口语搭配','boil the kettle'],
      ['茶包在咖啡旁边的罐子里。','The tea bags are in the jar next to the coffee.','Where do you keep the tea bags?','tea bag','茶包；jar 是罐子','tea bags in a jar'],
      ['这个杯子有人在用吗？','Is anyone using this mug?','There is a mug on the counter.','mug','通常带柄的马克杯','use this mug'],
      ['你想用蜂蜜还是糖？','Would you like honey or sugar?','Could you make mine a little sweeter?','honey','蜂蜜','honey or sugar'],
      ['请在杯子下面放个杯垫。','Please put a coaster under your cup.','Can I put my drink on this wooden table?','coaster','杯垫','put a coaster under a cup'],
      ['纸巾盒空了。','The tissue box is empty.','Could you pass me a tissue?','tissue box','纸巾盒；tissue 是面巾纸','an empty tissue box'],
      ['小心，杯子边缘有个缺口。','Be careful. There is a chip in the rim of that cup.','I’ll use this cup instead.','rim','杯口等边缘；chip 在这里指崩掉的小缺口','a chip in the rim'],
      ['我去接点水，要帮你把水瓶装满吗？','I’m getting some water. Shall I fill your water bottle too?','You are both about to go back to your desks.','fill','装满；倒满','fill a water bottle']
    ]},
    {id:'street',title:'街头 · 走路时随口说',label:'OUTSIDE / ON FOOT',intro:'路沿、积水、鞋带、拉链，还有擦身而过时的提醒。',speaker:'Friend',rows:[
      ['你的鞋带松了。','Your shoelace is untied.','You are walking along the street with a friend.','shoelace','鞋带；鞋带开了常说 untied','tie your shoelace'],
      ['你背包的拉链没拉。','Your backpack is unzipped.','Your friend gets up after tying their shoe.','unzipped','拉链没拉上的；zipper 是拉链','your backpack is unzipped'],
      ['小心路沿，那里有个台阶。','Watch the curb. There is a step there.','Your friend is looking at their phone while walking.','curb','路沿；英式拼写 kerb','watch the curb',['Watch the kerb. There is a step there.']],
      ['我们绕过这摊水吧。','Let’s walk around this puddle.','It rained earlier, and the path is wet.','puddle','地面的一小摊积水','walk around a puddle'],
      ['我们到人行横道那边过马路吧。','Let’s cross at the pedestrian crossing.','The café is across the road.','pedestrian crossing','人行横道；美式常说 crosswalk','cross at the pedestrian crossing',['Let’s cross at the crosswalk.']],
      ['不好意思，可以借过一下吗？','Excuse me, could I get past?','Someone is blocking a narrow part of the sidewalk.','get past','从旁边通过；借过','could I get past'],
      ['不好意思，你掉了一只手套。','Excuse me, you dropped a glove.','A passerby has left something behind.','glove','手套','drop a glove'],
      ['我们站到雨棚下面去吧。','Let’s stand under the awning.','It has started raining outside a shop.','awning','商店门前等处的遮阳篷或雨棚','stand under an awning']
    ]},
    {id:'groceries',title:'超市 · 买生活小用品',label:'SHOP / EVERYDAY',intro:'补充装、收据、袋子和找零，顺手购物更从容。',speaker:'Shop assistant',rows:[
      ['垃圾袋在哪个货架通道？','Which aisle are the garbage bags in?','Hello. Can I help you find anything?','aisle','货架之间的通道；与 shelf 架子不同','which aisle'],
      ['这种洗手液有补充装吗？','Do you have a refill for this hand soap?','You find a bottle of hand soap on the shelf.','refill','补充装；也可作动词“重新装满”','a refill for hand soap'],
      ['我要无香型的。','I would like the fragrance-free one.','Would you prefer lavender or fragrance-free?','fragrance-free','不含添加香料的；无香型','the fragrance-free one'],
      ['这两包的单价一样吗？','Is the unit price the same for these two packs?','These are different pack sizes.','unit price','单位价格，如每升或每件的价格','compare the unit price'],
      ['我自己带了购物袋。','I brought my own shopping bag.','Would you like a bag?','shopping bag','购物袋','bring your own shopping bag'],
      ['能把易碎的东西分开装吗？','Could you pack the fragile items separately?','Shall I put everything in this bag?','fragile','易碎的','pack fragile items separately'],
      ['请给我一张收据。','Could I have a receipt, please?','Would you like your receipt?','receipt','收据；小票，p 不发音','keep the receipt'],
      ['不好意思，好像找零少了。','Excuse me, I think the change is short.','You check the coins before leaving.','change','此处指找零，不可数','check the change']
    ]},
    {id:'laundry',title:'家里 · 浴室与洗衣',label:'HOME / LAUNDRY',intro:'洗衣液、柔顺剂、衣架和堵住的下水口。',speaker:'Housemate',rows:[
      ['洗衣液应该倒进哪个格子？','Which compartment should I put the laundry detergent in?','You are using the washing machine for the first time.','laundry detergent','洗衣液或洗衣粉的统称；compartment 是分隔的格子','add laundry detergent'],
      ['这次不要加柔顺剂。','Do not add fabric softener this time.','Shall I use the softener as well?','fabric softener','衣物柔顺剂','add fabric softener'],
      ['这件毛衣不能放进烘干机。','This sweater cannot go in the dryer.','Can I dry all of these together?','dryer','衣物烘干机','put clothes in the dryer'],
      ['请把它挂在晾衣架上。','Please hang it on the clothes airer.','Where should I put the sweater instead?','clothes airer','晾衣架；也可说 drying rack','hang it on the clothes airer',['Please hang it on the drying rack.']],
      ['我需要两个衣架。','I need two hangers.','What else do you need for these shirts?','hanger','衣架','two clothes hangers'],
      ['浴室地垫还没干。','The bath mat is still wet.','Can I put this mat back on the floor?','bath mat','浴室地垫','a wet bath mat'],
      ['淋浴间的下水口堵了。','The shower drain is blocked.','Why is the water draining so slowly?','drain','排水口；blocked 或 clogged 表示堵住','a blocked shower drain',['The shower drain is clogged.']],
      ['能把花洒再调低一点吗？','Could you lower the showerhead a little?','Is the shower set up comfortably for you?','showerhead','淋浴花洒头','lower the showerhead']
    ]},
    {id:'cleaning',title:'家里 · 打扫与整理',label:'HOME / TIDY UP',intro:'拖把、簸箕、遥控器：一起住时最常用的词。',speaker:'Housemate',rows:[
      ['扫帚和簸箕放在哪里？','Where are the broom and dustpan?','There are crumbs all over the floor.','dustpan','簸箕；broom 是扫帚','a broom and dustpan'],
      ['先吸尘，再拖地。','Vacuum first, then mop the floor.','Should I get the mop now?','mop','拖把；也作动词“拖地”','mop the floor'],
      ['吸尘器的集尘盒满了。','The vacuum cleaner’s dust container is full.','Why has the suction become so weak?','vacuum cleaner','吸尘器','empty the vacuum cleaner’s dust container'],
      ['这块抹布是擦地板用的。','This cloth is for cleaning the floor.','Can I use this cloth on the dining table?','cloth','布；此处指清洁抹布','a cleaning cloth'],
      ['垃圾桶里套一个新袋子吧。','Put a new bag in the bin.','I’ve taken the rubbish out.','bin','垃圾桶；美式常说 trash can','put a bag in the bin'],
      ['遥控器掉进沙发垫之间了。','The remote control fell between the sofa cushions.','Have you seen the remote?','cushion','靠垫；坐垫','between the sofa cushions'],
      ['能把百叶窗拉下来吗？','Could you lower the blinds?','The sun is shining straight onto the screen.','blinds','百叶窗或卷帘类遮光帘；通常用复数','lower the blinds'],
      ['进来之前请在门垫上擦一下鞋。','Please wipe your shoes on the doormat before coming in.','Can I come in with my shoes on?','doormat','门垫','wipe your shoes on the doormat']
    ]},
    {id:'doorstep',title:'门口 · 包裹和邻居',label:'HOME / AT THE DOOR',intro:'门铃、胶带、快递柜和顺手替别人扶住门。',speaker:'Neighbour',rows:[
      ['刚才是门铃响了吗？','Was that the doorbell?','You hear a sound while chatting in the hallway.','doorbell','门铃','ring the doorbell'],
      ['我可以帮你扶着门。','I can hold the door for you.','Your neighbour is carrying a large box.','hold the door','替别人扶住门，方便通过','hold the door for someone'],
      ['包裹上写的是你的名字。','The parcel has your name on it.','Is this parcel for you or for me?','parcel','包裹；美式也常说 package','a parcel with your name on it'],
      ['胶带缠得太紧了。','The tape is wrapped too tightly.','Why is the box so hard to open?','tape','胶带；此处不是录音带','tape wrapped around a box'],
      ['你有美工刀吗？','Do you have a utility knife?','We need something to cut this tape.','utility knife','美工刀；开纸箱也常用 box cutter','open a box with a utility knife',['Do you have a box cutter?']],
      ['里面还有一层气泡膜。','There is another layer of bubble wrap inside.','Is the item still wrapped up?','bubble wrap','气泡包装膜','a layer of bubble wrap'],
      ['另一个包裹放在快递柜里了。','The other parcel is in the parcel locker.','Were both parcels delivered to your door?','parcel locker','快递柜','collect a parcel from a parcel locker'],
      ['取件码发到我手机上了。','The pickup code was sent to my phone.','How do you open the locker?','pickup code','取件码；英式也可说 collection code','enter the pickup code']
    ]}
  ];
  const questions=scenes.flatMap(scene=>scene.rows.map(([cn,en,context,word,meaning,phrase,alts=[]],i)=>({id:`life-${scene.id}-${i+1}`,category:'日常生活英语',scene:scene.title,lifeScene:scene.id,turn:`${i+1}/${scene.rows.length}`,speaker:scene.speaker,context,cn,en,alts,tag:'生活表达 · 实际交流',vocabulary:[{word,meaning,phrase}]})));
  window.ECHO_DAILY_LIFE={scenes:scenes.map(({rows,...scene})=>({...scene,count:rows.length})),questions};
})();
