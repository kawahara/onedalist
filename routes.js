var model = require('./lib/model');

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
  res.render('index.html', { title: 'Express', action: 'create' });
};

/**
 * show
 */
exports.show = function(req, res) {
  res.render('index.html', { title: 'Express' });
};
