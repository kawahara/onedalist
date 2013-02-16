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
    },
    'when fetch shift_jis contents': {
        topic: function() { return 'http://travel.rakuten.co.jp/HOTEL/776/776.html' },
        'get information': function(topic) {
            getPageOverview(topic, function(error, info) {
                assert.equal(info.getTitle(), "楽天トラベル:ビジネスホテル　サンシャイン高松");
            });
        }
    },
    'when fetch EUC-JP contents': {
        topic: function() { return 'http://item.rakuten.co.jp/kijoan/435004/' },
        'get information': function(topic) {
            getPageOverview(topic, function(error, info) {
                assert.equal(info.getTitle(), "【楽天市場】【ネット限定】【さぬきうどん】【送料無料】【人気セット】 ロングセラー！讃岐うどんならではの生醤油うどんセット【RCP】：さぬきうどんの亀城庵・楽天市場店");
            });
        }
    },
}).run();