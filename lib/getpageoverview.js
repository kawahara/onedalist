var request = require('request')
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

module.exports = function(url, onResponse) {
  request(url, function(error, response, body) {
    var info = new Info()
      , obj = null;

    if (!error && response.statusCode == 200) {

      obj = $(body);

      info.ogTitle = obj.find('meta[property="og:title"]').attr('content');
      info.ogType  = obj.find('meta[property="og:type"]').attr('content');
      info.ogImage = obj.find('meta[property="og:image"]').attr('content');
      info.ogDescription = obj.find('meta[property="og:description"]').attr('content');
      info.title  = obj.find('title').text();
      info.images = obj.find('image');
      if (!info.images) {
        info.images = [];
      }

      onResponse(null, info);
      return;
    };

    onResponse(error, null);
  });
};
