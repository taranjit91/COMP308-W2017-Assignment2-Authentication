// require modules for our User Model
let mongoose = require('mongoose');
let Schema = mongoose.Schema; //alias for mongoose Schema
let passportLocalMongoose = require('passport-local-mongoose');

let ContactsSchema = new Schema({
  contactname: {
    type: String,
    default: '',
    trim: true,
    required: 'contact name is required'
  },
  contactnumber: {
    type: String,
    default: '',
    trim: true,
    required: 'contact number  is required'
  },
  email: {
    type: String,
    default: '',
    trim: true,
    required: 'email is required'
  }
},{
  collection: "businesscontacts"
});

let options = ({missingPasswordError: "Wrong Password"});

ContactsSchema.plugin(passportLocalMongoose, options);

exports.User = mongoose.model('businesscontacts', ContactsSchema);