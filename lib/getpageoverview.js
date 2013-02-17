var request = require('request')
  , Buffer = require("buffer").Buffer
  , u = require('url')
  , iconv = require('iconv')
  , $ = require('jquery')
  , config = require('../config');

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
    name: 'r-ichiba-n',
    pattern: '^http:\/\/item\.rakuten\.co\.jp\/(.+)\/(\\d+)',
    filter: function(matchResult, contentBody, callback) {
      var ic = $(contentBody).find('meta[property="apprakuten:item_code"]').attr('content')
        , url = '';

      if (!ic) {
        return callback({});
      }

      url = "https://app.rakuten.co.jp/services/api/IchibaItem/Search/20120723"
        + "?itemCode=" + ic
        + "&applicationId=" + config.rakuten_api.application_id;

      request(url, function(error, response, body) {
        var data = null
          , result = {}
          , item = null;

        if (error) {
          return callback({});
        }

        if (response.statusCode != 200) {
          return callback({});
        }

        data = JSON.parse(body);
        if (data.Items.length > 0) {
          item = data.Items[0].Item;
          result.cost = item.itemPrice;
          result.description = item.itemCaption;
          return callback(result);
        }

        return callback({});
      });
    }
  },
  {
    name: 'r-travel-v',
    pattern: '^http:\/\/travel\.rakuten\.co\.jp\/HOTEL\/(\\d+)\/?',
    type: 'いきたい'
  },
  {
    name: 'r-travel',
    pattern: '^http:\/\/travel\.rakuten\.co\.jp\/',
    type: 'いきたい'
  },
  {
    name: 'y-travel',
    pattern: '^http:\/\/domestic\.hotel\.travel\.yahoo\.co\.jp\/',
    type: 'いきたい'
  },
  {
    name: 'y-shopping',
    pattern: '^http:\/\/store\.shopping\.yahoo\.co\.jp\/(.+)\/(.+)\.html',
    filter: function (matchResult, contentBody, callback) {
      var url = "http://shopping.yahooapis.jp/ShoppingWebService/V1/json/itemLookup"
        + "?appid=" + config.yahoo_j_api.appid
        + "&itemcode=" + matchResult[1] + "_" + matchResult[2];

      request(url, function(error, response, body) {
        var data = {}
          , result = {};
        if (error) {
          return callback({});
        }

        if (response.statusCode != 200) {
          return callback({});
        }

        data = JSON.parse(body);
        if (data.ResultSet[0].Result) {
          result.cost = data.ResultSet[0].Result[0].Price._value;

          return callback(result);
        }

        return callback({});
      });
    }
  },
  {
    name: 'cookbad',
    pattern: '^http:\/\/cookpad\.com\/recipe\/(\\d+)',
    type: 'つくってほしい'
  }
]

var filter = function(url) {
  for(var i = 0; i < filters.length; i++) {
    var regex = new RegExp(filters[i].pattern)
      result = null;
    if (result = url.match(regex)) {
      return {
        filterInfo: filters[i],
        matchResult: result
      };
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
      , body = ""
      , encoding = 'UTF-8'
      , ct = "";

    if (!error && response.statusCode == 200) {
      if (ct = response.headers['content-type']) {
        if (ct.match(/charset=(.*);?/)) {
            if (RegExp.$1 != encoding) {
              encoding = RegExp.$1;
            }
        }
      }

      // 1st encode
      conv = new iconv.Iconv(encoding, 'UTF-8//TRANSLIT//IGNORE');
      body = new Buffer(pbody, 'binary');
      body = conv.convert(body).toString();

      obj = $(body);

      // parse meta
      ct = obj.find('meta[http-equiv="Content-Type"]').attr('content');
      if (ct) {
        if (ct.match(/charset=(.*);?/)) {
            if (RegExp.$1 != encoding) {
              conv = new iconv.Iconv(RegExp.$1, 'UTF-8//TRANSLIT//IGNORE');
              body = new Buffer(pbody, 'binary');
              body = conv.convert(body).toString();
              obj = $(body);
            }
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
        if (f.filterInfo.type) {
          info.type = f.filterInfo.type;
        }
        if (f.filterInfo.filter) {
          f.filterInfo.filter(f.matchResult, body, function(appendData) {
            $.extend(info, appendData);
            onResponse(null, info);
          });

          return;
        }
      }

      onResponse(null, info);
      return;
    };

    onResponse(error, null);
  });
};
