var model = require('./lib/model');
var crypto = require('crypto');

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
  res.render('createNew.html', { title: 'Express', action: 'createNew' });
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
    RequestItemModel.subject = listData.item[i].title;
    RequestItemModel.overview = listData.item[i].overview;
    RequestItemModel.cost = listData.item[i].cost;
    RequestItemModel.type = listData.item[i].type;
    RequestItemModel.source_url = listData.item[i].url;

    RequestListModel.items.push(RequestItemModel); 
  }
  RequestListModel.save(function(err) {
    if (err) {
      res.render('createNew.html', { title: 'Express', action: 'createNew' });
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
  res.render('index.html', { title: 'Express' });
};
