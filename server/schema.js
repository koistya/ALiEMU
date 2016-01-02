import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId
  },
  name: {
    type: String
  },
  widgets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Widget'
  }]
});

const WidgetSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId
  },
  name: {
    type: String
  }
});


const User = mongoose.model('User', UserSchema);
const Widget = mongoose.model('Widget', WidgetSchema);


export default [User, Widget];
