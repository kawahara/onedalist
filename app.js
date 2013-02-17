
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , apiRoutes = require('./api_routes')
  , http = require('http')
  , path = require('path')
  , cons = require('consolidate')
  , swig = require('swig')
  , config = require('./config');

var app = express();

app.configure(function(){
  swig.init({
    root: __dirname + '/views',
    allowErrors: true,
    cache: false,
    filters: {
      number_format: function(input) {
        return input.toString().replace(/([\d]+?)(?=(?:\d{3})+$)/g, function(t){ return t + ','; });
      },
      path_to: function(input) {
        return config.base_url + input.toString();
      }
    }
  });

  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.engine('.html', cons.swig);
  app.set('view engine', 'html');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.configure('production', function() {
});

// pages
app.get('/', routes.index);
app.get('/index', routes.index);
app.get('/create', routes.createNew);
app.post('/create', routes.create);
app.get('/show/:id', routes.checkId, routes.show);

// apis
app.get('/api/getInfo', apiRoutes.responseInfomation);
app.get('/api/rakuten/fb', apiRoutes.getRakutenFb);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
