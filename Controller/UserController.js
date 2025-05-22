



const User = require('../Models/UserModel');

/**
 * Transfer amount from the verified user to another user
 */
exports.Transfer = async (req, res, next) => {
  try {
    const fromUserId = req.user.id;
    const { toUsername, currency, amount } = req.body;

    if (!toUsername || !currency || amount == null) {
      return res.status(400).json({ error: 'toUsername, currency, and amount are required' });
    }

    if (amount <= 0 || isNaN(amount)) {
      return res.status(400).json({ error: 'amount must be greater than zero' });
    }

    const sender = await User.findById(fromUserId);
    if (!sender || sender.deletedAt) {
      return res.status(403).json({ error: 'Your account is closed' });
    }

    const user = await User.findOne({ username: toUsername });
    if (!user || user.deletedAt) {
      return res.status(404).json({ error: 'Receiver not found or account is closed' });
    }

    if (sender._id.equals(user._id)) {
      return res.status(400).json({ error: 'You cannot transfer money to yourself' });
    }

    const newBalance = await sender.transfer(user._id, currency, Number(amount));
    res.json({ balance: newBalance });
  } catch (err) {
    next(err);
  }
};

/**
 * Deposit amount into the verified user's wallet
 */
exports.Deposit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currency, amount } = req.body;

    if (!currency || amount == null) {
      return res.status(400).json({ error: 'currency and amount are required' });
    }
    if (amount < 0 || isNaN(amount)) {
      return res.status(400).json({ error: 'amount must be a positive number' });
    }

    const user = await User.findById(userId);
    if (!user || user.deletedAt) {
      return res.status(403).json({ error: 'Your account is closed' });
    }

    const newBalance = await user.deposit(currency, Number(amount));
    res.json({ balance: newBalance });
  } catch (err) {
    next(err);
  }
};

/**
 * Withdraw amount from the verified user's wallet
 */
exports.Withdraw = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currency, amount } = req.body;

    if (!currency || amount == null) {
      return res.status(400).json({ error: 'currency and amount are required' });
    }
    if (amount < 0 || isNaN(amount)) {
      return res.status(400).json({ error: 'amount must be a positive number' });
    }

    const user = await User.findById(userId);
    if (!user || user.deletedAt) {
      return res.status(403).json({ error: 'Your account is closed' });
    }

    const newBalance = await user.withdraw(currency, Number(amount));
    res.json({ balance: newBalance });
  } catch (err) {
    next(err);
  }
};

/**
 * Get transaction history for the verified user
 */
exports.History = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type, currency } = req.body;

    const user = await User.findById(userId);
    if (!user || user.deletedAt) {
      return res.status(403).json({ error: 'Your account is closed' });
    }

    const history = user.getHistory({ type, currency });
    res.json({ history });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current balance for a specific currency or full wallet
 */
exports.Balance = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currency } = req.body;

    const user = await User.findById(userId);
    if (!user || user.deletedAt) {
      return res.status(403).json({ error: 'Your account is closed' });
    }

    if (currency) {
      const balance = user.getBalance(currency);
      return res.json({ currency, balance });
    }

    const wallet = Object.fromEntries(user.wallet);
    res.json({ wallet });
  } catch (err) {
    next(err);
  }
};

/**
 * Soft delete the user (close account)
 */
exports.closeAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || user.deletedAt) {
      return res.status(403).json({ error: 'Account already closed or does not exist' });
    }

    user.deletedAt = new Date();
    await user.save();

    res.json({ message: 'Your account has been closed (soft deleted).' });
  } catch (err) {
    next(err);
  }
};
