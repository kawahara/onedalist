var model = require('./lib/model')
  , crypto = require('crypto')
  , config = require('./config')
  , async = require('async');

/**
 * get home page
 */
exports.index = function(req, res){
  res.render('index.html', { title: 'Express', action: 'index' });
};

/**
 * create form
 */
exports.createNew = function(req, res){
  res.render('createNew.html', { config: config, action: 'createNew' });
};

/**
 * accept create request and validate
 */
exports.create = function(req, res) {
  var d = new Date();
  var dt = d.getTime();
  var dt_str = (dt).toString();
  var listData = req.body;
  var uniq_code = crypto.createHash('md5').update(dt_str+listData.subject).digest("hex");

  RequestListModel = new model.RequestList();
  RequestListModel.subject = listData.subject;
  RequestListModel.code = uniq_code;
  RequestListModel.items = [];


  for(var i = 0; i < listData.item.length; i++) {
listData.item[i].description = "合計金額7千円以上のお買い上げで送料無料です。 品番 OW-03 サイズ(約) 19×15.2×高さ6.4cm 容量(約) 800cc(ml) いっぱいに入れた状態 素地の種類 天然木（杉） 塗装の種類 漆塗り Comment 漆を何度も摺りこんで仕上げ、使い込むほどに風格を増していく逸品です。杉の木が保湿をしますので、ごはんが冷めてもかたくなりにくく美味しく頂けます。末永くお使いください。大きめのサイズですので、働く男性用にオススメです。 おかず仕切り付き。(仕切りは取り外し可能) さらに当店ではランチバンドもお付けしますので、携帯に最適です。さらに容量が大きいDXタイプもできました。⇒★曲げわっぱ　DX大判弁当箱　漆塗り お取り扱いについて ● 柔らかい素材ですので手荒い扱いをすると破損の原因になります。● 使用中に表面の塗装皮膜を箸等で強く傷つけると水アカ等の汚れが沈着し、シミになりますので丁寧に扱って下さい。● ご使用後はお湯か水で汚れをよく洗いおとし、必ず乾いた布でよく水分をふきとって下さい。湯水に長く浸したり、固い物と一緒に洗わないで下さい。● 保管の際は火のそばや直射日光の当る場所は避けて収納下さい。● みがき粉やたわし等は皮膜に傷をつけますので使用しないで下さい。 ●電子レンジ、食器乾燥機等には、ご使用できません。 他の曲げわっぱはこちらみよし漆器本舗(旧みよし屋)のトップページに行くギフト対応の詳細はこちら業務コード：【楽ギフ_包装】 【楽ギフ_包装選択】 【楽ギフ_のし】 【楽ギフ_のし宛書】 【楽ギフ_メッセ】 【楽ギフ_メッセ入力】 【楽ギフ_名入れ】●当店の商品は、常時十分な在庫を確保しています。(稀に欠品もありますが。)また、ホームページ掲載商品以外にも多数取り扱っています。お探しの商品がございましたら、お気軽にお問い合わせください。店舗用、業務用など、まとまった数量が必要な場合でもご安心ください。これまで数々の店舗様や業者様との取引実績がございます。また、急を要するご注文でも精一杯最善を尽くさせて頂きます。ご注文前にご相談頂ければ、よりスムーズにお取引ができるかと思います。何卒宜しくお願い致します。●漆器は元来、ギフトの王道です。当店は実績豊かな≪漆器屋≫ですので、下記のような用途でも安心してご利用下さいませ。のし・ラッピングなども無料サービスさせて頂いております。【引き出物(引出物)】【内祝い】【結婚祝・結婚内祝い】【ウエディングギフト】【プチギフト・ドラジェ】【出産祝い】【還暦祝】【金婚式・銀婚式】 【新築祝い】【開店祝い】【快気祝い・快気内祝い】【記念日】【誕生日】【長寿のお祝い】【お年賀・御年賀】【お中元・御中元・暑中見舞い・残暑見舞い】【お彼岸】 【お歳暮・御歳暮・寒中見舞い】【贈り物】【クリスマスプレゼント】【バレンタインデー】【ホワイトデー】【お返し】【御祝い・お祝い】【寿】【御礼】【挨拶】【引越】【帰省】【手土産・お土産】【季節のご挨拶】【法人の方に】 【法事・法要】【仏事】【志】【香典返し】【初節句内祝い】【桃の節句・ひなまつり・ひな祭り】【端午の節句】【七五三】【母の日ギフト】【父の日ギフト】【敬老の日】【ギフト】●楽天シニア市場取扱関連品目：曲げわっぱ　まげわっぱ　曲げワッパ　お弁当箱　ランチボックス　重箱　ノンスリップトレー　トレイ　お盆　 お食い初め膳　お喰い初め膳　百日祝　箸揃え　子供食器　こども　キッズ　ベビー　子ども　おひつ　ランチョンマット　汁椀　電子レンジ対応　多用椀　丼椀　麺鉢　丼鉢　銘々皿　取り皿　カップ　茶托　コースター　酒器　ぐい呑み　ぐいのみ　おちょこ　盛器　飯椀　こね鉢　裁縫箱　マイ箸　つなぎ箸　半月盆　半月膳　在庫処分　賞状盆　表彰盆　切手盆　広蓋　万寿盆　ペット仏壇　カトラリー　カントリー　雑貨　開店準備　まげわっぱ　紀州漆器曲げわっぱの取り扱い　誤解していませんか?そんなに難しく考えないで！曲げわっぱは　…普段づかい…　にと考え、作られました。■洗剤で洗ってはいけないんじゃ？　いいえ、ご家庭の洗剤で洗っても大丈夫です。ウレタン塗装(うるし製品の場合はうるし塗り)を施していますので洗剤を使っていただけます。漂白剤はダメです。■油物をいれると黒ずむのでは？　いいえ、油物も大丈夫です。これもまたウレタン塗装(うるし製品の場合はうるし塗り)でコーティングされていますので、黒ずむ心配はありません。▼絶対にやらないで欲しいこと■電子レンジでの使用■食器乾燥機での使用■水に浸けっぱなし(浸け置き洗い)洗った後は布巾で水気をよく拭き取り、下向きにかぶせて置かないで、上向きに置いて自然乾燥してください。あまり難しく考えないで、取り扱いは“ちょっと丁寧に”の気持ちが大切です♪日本人本来の物を大切にするの精神があれば大丈夫です♪"

    RequestItemModel = new model.RequestItem();
    RequestItemModel.title = listData.item[i].title;
    RequestItemModel.image = listData.item[i].image;
    RequestItemModel.description = listData.item[i].description;
    RequestItemModel.cost = listData.item[i].cost;
    RequestItemModel.type = listData.item[i].type;
    RequestItemModel.url = listData.item[i].url;

    RequestListModel.items.push(RequestItemModel); 
  }

  RequestListModel.save(function(err) {
    if (err) {
      res.render('createNew.html', { config: config, action: 'createNew' });
      return;
    }

    res.redirect('/show/' + uniq_code);
    return;
  });
};

/**
 * show
 */
exports.show = function(req, res) {
  var tasks = [];
  async.series(tasks, function(err){
    if(err){
      res.status(500);
      res.render('error.html');
    } else {
      res.render('show.html', { doc: req.validparams});
    }
  });
};


exports.checkId = function(req,res,next) {
  req.validparams = {};
  model.RequestList.findOne({'code': req.params.id }, function(err, doc) {
    if (err) {
      res.status(500);
      res.render('error.html', { err: err });
      return;
    }

    if (!doc) {
      res.status(400);
      res.render('error.html', { err: 'おねだリストが存在しません' });
      return;
    }
    req.validparams.id = req.params.id;
    req.validparams.subject = doc.subject;
    req.validparams.items = doc.items;
    req.validparams.share_url = config.base_url + "/show/" + req.params.id
    next();
  });
};
