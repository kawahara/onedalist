var getPageOverview = require('./lib/getpageoverview');

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