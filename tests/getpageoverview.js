var vows = require('vows')
  , assert = require('assert')
  , getPageOverview = require('../lib/getpageoverview');

vows.describe('fetch data').addBatch({
    'when fetch contents from webservice.rakuten.co.jp': {
        topic: function() { return 'http://webservice.rakuten.co.jp' },
        'get information': function(topic) {
            getPageOverview(topic, function(error, info) {
                assert.equal(info.getTitle(), "楽天ウェブサービス(RAKUTEN WEBSERVICE)");
            });
        }
    }
}).run();