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
