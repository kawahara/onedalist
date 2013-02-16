/**
 * get home page
 */
exports.index = function(req, res){
  res.render('index.html', { title: 'Express' });
};

/**
 * create form
 */
exports.createNew = function(req, res){
  res.render('index.html', { title: 'Express' });
};

/**
 * accept create request and validate
 */
exports.create = function(req, res) {
  res.render('index.html', { title: 'Express' });
};

/**
 * show
 */
exports.show = function(req, res) {
  res.render('index.html', { title: 'Express' });
};
