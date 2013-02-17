var request = require('request')
  , Buffer = require("buffer").Buffer
  , u = require('url')
  , iconv = require('iconv')
  , $ = require('jquery');

var getBaseUrl = function(parsedUrl) {
  var url = parsedUrl.protocol + "//"
    + parsedUrl.host;

  if (parsedUrl.port) {
    url = ":" + parsedUrl.port;
  }

  return url;
};

var getCurrentPath = function(parsedUrl) {
  var url = getBaseUrl(parsedUrl);

  return url + parsedUrl.pathname;
}

var filters = [
  {
    name: 'r-travel',
    pattern: 'http:\/\/travel\.rakuten\.co\.jp\/HOTEL\/(\\d+)\/?',
    type: 'いきたい'
  },
  {
    name: 'y-travel',
    pattern: 'http:\/\/domestic\.hotel\.travel\.yahoo\.co\.jp\/bin\/hotelshisetsu',
    type: 'いきたい'
  },
  {
    name: 'cookbad',
    pattern: 'http:\/\/cookpad\.com\/recipe\/(\\d+)',
    type: 'つくってほしい'
  }
]

var filter = function(url) {
  for(var i = 0; i < filters.length; i++) {
    var regex = new RegExp(filters[i].pattern);
    console.log(regex);
    if (url.match(regex)) {
      return filters[i];
    }
  }
  return null;
}

module.exports = function(url, onResponse) {
  request.get(url, {encoding: 'binary'}, function(error, response, pbody) {
    var info = {}
      , obj = null
      , images = null
      , parsedUrl = u.parse(url)
      , conv = null
      , body = "";

    if (!error && response.statusCode == 200) {
      conv = new iconv.Iconv('UTF-8', 'UTF-8//TRANSLIT//IGNORE');
      body = new Buffer(pbody, 'binary');
      body = conv.convert(body).toString();

      obj = $(body);

      var ct = obj.find('meta[http-equiv="Content-Type"]').attr('content');
      if (ct) {
        if (ct.match(/charset=(.*);?/)) {
          conv = new iconv.Iconv(RegExp.$1, 'UTF-8//TRANSLIT//IGNORE');
          body = new Buffer(pbody, 'binary');
          body = conv.convert(body).toString();
          obj = $(body);
        }
      }

      info.ogTitle = obj.find('meta[property="og:title"]').attr('content');
      info.ogType  = obj.find('meta[property="og:type"]').attr('content');
      info.ogImage = obj.find('meta[property="og:image"]').attr('content');
      info.ogDescription = obj.find('meta[property="og:description"]').attr('content');
      info.title  = obj.find('title').text();
      images = obj.find('img');
      if (!images) {
        images = [];
      }
      info.images = [];

      for (var i = 0; i < images.length; i++) {
        var image = {};
        image.src = $(images[i]).attr('src');
        image.alt = $(images[i]).attr('alt');
        if (image.src) {
          image.src = u.resolve(getCurrentPath(parsedUrl), image.src);
        }

        info.images.push(image);
      }

      info.type = 'ほしい';

      var f = filter(url);
      if (f) {
        if (f.type) {
          info.type = f.type;
        }
      }

      onResponse(null, info);
      return;
    };

    onResponse(error, null);
  });
};
