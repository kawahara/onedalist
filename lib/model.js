var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Types = Schema.Types
  , db = mongoose.connect('mongodb://localhost:27017/kure');

var RequestItemSchema = new Schema({
  subject: String,
  overview: String,
  cost: Number,
  type: String
});

var RequestListSchema = new Schema({
  code: Number,
  subject: String,
  items: [RequestItem]
});

var RequestItem = db.model('RequestItem', RequestItemSchema);
var RequestList = db.model('RequestList', RequestListSchema);


exports.schemas = {
};

exports.db = db;

exports.schemas.RequestItemSchema = RequestItemSchema;
exports.schemas.RequestListSchema = RequestListSchema;

exports.RequestItem = RequestItem;
exports.RequestList = RequestList;
