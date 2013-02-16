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
  uniq_code = crypto.createHash('md5').update(dt+req.subject).digist("hex");

  RequestListModel = new model.RequestList();
  RequestListModel.subject = req.params.subject;
  RequestListModel.code = uniq_code;
  RequestListModel.items = [];

  for(var i = 0; i < req.items.length; i++) {
  	RequestItemModel = new model.RequestItem();
  	RequestItemModel.subject = req.items[i].subject;
  	RequestItemModel.overview = req.items[i].overview;
  	RequestItemModel.cost = req.items[i].cost;
  	RequestItemModel.type = req.items[i]type;
  	RequestItemModel.source_url = req.items[i].source_url;

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
