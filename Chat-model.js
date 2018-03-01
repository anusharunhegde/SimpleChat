var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var chatSchema = new Schema({

	 user : String,

	 msg  : String,

	 created : {type: Date,default:Date.now}
});

module.exports.Chat = mongoose.model('Chat',chatSchema);