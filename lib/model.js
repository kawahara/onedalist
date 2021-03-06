var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Types = Schema.Types
  , db = mongoose.connect('mongodb://localhost:27017/kure');

var RequestItemSchema = new Schema({
  title: String,
  image: String,
  cost: Number,
  type: String,
  url: String,
  description: String
});

var RequestListSchema = new Schema({
  code: String,
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
