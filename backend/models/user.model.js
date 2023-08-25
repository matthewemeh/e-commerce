const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const NotificationSchema = new Schema(
  {
    time: { type: Date, default: new Date() },
    message: { type: String, required: true },
    status: { type: String, default: 'unread' },
  },
  { _id: false, minimize: false, timestamps: false, versionKey: false }
);

const UserSchema = new Schema(
  {
    name: { type: String, required: [true, 'is required'], minlength: 2, trim: true },

    email: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      required: [true, 'is required'],
      validate: {
        validator: str => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(str),
        message: props => `${props.value} is not a valid email`,
      },
    },

    password: { type: String, trim: true, required: [true, 'is required'] },

    isAdmin: { type: Boolean, default: false },

    cart: { type: Object, default: { totalPrice: 0, totalItems: 0 } },

    notifications: { type: [NotificationSchema], default: [] },

    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  },
  { minimize: false, timestamps: true, collection: 'users' }
);

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const passwordMatches = bcrypt.compareSync(password, user.password);
  if (passwordMatches) return user;
  throw new Error('Invalid credentials');
};

/* Before returning json response to client, remove the password field */
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

/* before saving user details, hash the password */
UserSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

/* Before deleting a user, remove any orders(orderIDs) linked to the user */
UserSchema.pre('remove', function (next) {
  this.model('Order').remove({ owner: this._id }, next);
});

const User = model('User', UserSchema);

module.exports = User;
