const User = require('../Models/UserModel');
const FraudLog = require('../Models/FraudModel');

exports.viewFlagged = async (req, res, next) => {
  try {
    const logs = await FraudLog.find()
      .populate('user', 'username email')
      .sort({ timestamp: -1 });
    res.json({ flagged: logs });
  } catch (err) {
    next(err);
  }
};


exports.aggregateBalances = async (req, res, next) => {
  try {
    const users = await User.find({}, 'username wallet');
    // Sum balances for each user
    const results = users.map(u => {
      const balances = Object.fromEntries(u.wallet);
      const total = Object.values(balances).reduce((sum, v) => sum + v, 0);
      return { username: u.username, totalBalance: total, balances };
    });
    res.json({ users: results });
  } catch (err) {
    next(err);
  }
};

exports.topUsersByBalance = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const users = await User.find({}, 'username wallet');
    const ranked = users.map(u => {
      const total = Array.from(u.wallet.values()).reduce((s, v) => s + v, 0);
      return { username: u.username, total };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
    res.json({ topByBalance: ranked });
  } catch (err) {
    next(err);
  }
};


exports.topUsersByVolume = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const users = await User.find({}, 'username transactions');
    const ranked = users.map(u => {
      const volume = u.transactions
        .reduce((sum, tx) => sum + tx.amount, 0);
      return { username: u.username, volume };
    })
    .sort((a, b) => b.volume - a.volume)
    .slice(0, limit);
    res.json({ topByVolume: ranked });
  } catch (err) {
    next(err);
  }
};
