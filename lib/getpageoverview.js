var request = require('request')
  , u = require('url')
  , $ = require('jquery');

var Info = function() {
};
Info.prototype.getTitle = function() {
  if (this.ogTitle) {
    return this.ogTitle;
  }

  return this.title;
};
Info.prototype.getOneImage = function() {
  if (this.ogImage) {
    return this.ogImage;
  }

  if (this.images.length > 0) {
    return this.images[0];
  }

  return null;
};

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

module.exports = function(url, onResponse) {
  request(url, function(error, response, body) {
    var info = new Info()
      , obj = null
      , images = null
      , parsedUrl = u.parse(url);

    if (!error && response.statusCode == 200) {

      obj = $(body);

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

      onResponse(null, info);
      return;
    };

    onResponse(error, null);
  });
};
