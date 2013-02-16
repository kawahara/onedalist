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
  uniq_code = crypto.createHash('md5').update(dt_str+listData.subject).digest("hex");

  RequestListModel = new model.RequestList();
  RequestListModel.subject = listData.subject;
  RequestListModel.code = uniq_code;
  RequestListModel.items = [];

  console.log(listData);

  for(var i = 0; i < listData.items.length; i++) {
  	RequestItemModel = new model.RequestItem();
  	RequestItemModel.subject = listData.items[i].subject;
  	RequestItemModel.overview = listData.items[i].overview;
  	RequestItemModel.cost = listData.items[i].cost;
  	RequestItemModel.type = listData.items[i].type;
  	RequestItemModel.source_url = listData.items[i].source_url;

  	RequestListModel.items.push(RequestItemModel); 
  }

  res.render('show.html', { title: 'Express' });
};

/**
 * show
 */
exports.show = function(req, res) {
  res.render('index.html', { title: 'Express' });
};
