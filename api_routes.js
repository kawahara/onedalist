var getPageOverview = require('./lib/getpageoverview')
    , request = require('request')
    , $ = require('jquery')
    , config = require('./config');

exports.responseInfomation = function(req, res){
    var url = req.query.url;
    res.header('Content-Type', 'application/json;')
    if (!url) {

        res.status(400);
        res.send('{}');

        return;
    }
    getPageOverview(url, function(error, info) {
        if (!error) {
            res.send(JSON.stringify(info));
            return;
        }

        res.status(400);
        res.send('{}');
    });
};

exports.getRakutenFb = function(req, res) {
    var code = req.query.code
        , url = '';
    if (code) {

        url = 'https://app.rakuten.co.jp/services/token';
        request({
            method: 'post',
            url: url,
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            body: $.param({
                grant_type: 'authorization_code',
                client_id: config.rakuten_api.application_id,
                client_secret: config.rakuten_api.secret,
                code: code,
                redirect_uri: 'http://localhost:3000/api/rakuten/fb',
            })
        }, function(error, response, body) {
            if (response.statusCode == 200) {
                var token = JSON.parse(body);
                console.log('hoge');
                request('https://app.rakuten.co.jp/services/api/FavoriteBookmark/List/20120627'
                    + '?access_token=' + token.access_token
                    + '&hits=30', function(error, response, body) {
                        if (!error & response.statusCode == 200) {
                            res.render('rakutenfb.html', { data: body });
                        } else {
                            res.render('rakutenfb.html', { data: "{}" });
                        }
                });
            } else {
                res.render('rakutenfb.html', { data: "{}" });
            }
        });
        return;
    }

    res.send("close");
};
