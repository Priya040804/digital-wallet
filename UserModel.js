
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['deposit', 'withdraw', 'transfer'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  wallet: {
    type: Map,
    of: Number,
    default: {},
  },
  transactions: [transactionSchema],

  deletedAt: {
    type: Date,
    default: null,
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});


userSchema.methods.deposit = async function(currency, amount) {
  const current = this.wallet.get(currency) || 0;
  this.wallet.set(currency, current + amount);
  this.transactions.push({ type: 'deposit', amount, currency });
  await this.save();
  return this.wallet.get(currency);
};

userSchema.methods.withdraw = async function(currency, amount) {
  const current = this.wallet.get(currency) || 0;
  if (amount > current) {
    throw new Error('Insufficient balance');
  }
  this.wallet.set(currency, current - amount);
  this.transactions.push({ type: 'withdraw', amount, currency });
  await this.save();
  return this.wallet.get(currency);
};

userSchema.methods.transfer = async function(targetUserId, currency, amount) {
  const User = mongoose.model('User');
  const target = await User.findById(targetUserId);
  if (!target) {
    throw new Error('Target user not found');
  }

  const senderBalance = this.wallet.get(currency) || 0;
  if (amount > senderBalance) {
    throw new Error('Insufficient balance');
  }
  this.wallet.set(currency, senderBalance - amount);
  this.transactions.push({ type: 'transfer', amount, currency, to: target._id });

  const recipientBalance = target.wallet.get(currency) || 0;
  target.wallet.set(currency, recipientBalance + amount);
  target.transactions.push({ type: 'transfer', amount, currency, from: this._id });

  await this.save();
  await target.save();

  return this.wallet.get(currency);
};

userSchema.methods.getBalance = function(currency) {
  return this.wallet.get(currency) || 0;
};

userSchema.methods.getHistory = function({ type, currency } = {}) {
  return this.transactions
    .filter(tx => (type ? tx.type === type : true))
    .filter(tx => (currency ? tx.currency === currency : true));
};

module.exports = mongoose.model("User", userSchema);
