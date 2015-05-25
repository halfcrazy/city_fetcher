var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  username: String,
  password: String,
  is_block: { type: Boolean, default: false },

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});


UserSchema.index({username: 1}, {unique: true});
UserSchema.index({password: 1});

mongoose.model('User', UserSchema);