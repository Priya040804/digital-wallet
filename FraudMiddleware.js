const User = require('../Models/UserModel');
const FraudLog = require('../Models/FraudModel');
const threshold = 1000; // configurable threshold

async function sendEmail(to, subject, message) {
  console.log(`📧 Mock Email sent to ${to} - Subject: "${subject}" - Message: "${message}"`);
}

module.exports = async function fraudDetector(req, res, next) {
  try {
    const userId = req.user.id;
    const { currency, amount, toUsername } = req.body;
    const action = (() => {
      switch(req.path) {
        case '/deposit': return 'deposit';
        case '/withdraw': return 'withdraw';
        case '/transfer': return 'transfer';
        default: return null;
      }
    })();
    if (!action) return next();

    const user = await User.findById(userId);
    const now = Date.now();

    const recent = user.transactions
      .filter(tx => tx.type === action)
      .filter(tx => now - new Date(tx.date).getTime() < 60 * 1000);

    if (recent.length >= 5) {
      await FraudLog.create({
        user: userId,
        action,
        amount,
        currency,
        reason: 'High frequency of transactions',
        metadata: { countLastMinute: recent.length }
      });

      await sendEmail(
        user.email,
        'Alert: High Frequency of Transactions Detected',
        `Dear ${user.username}, we have detected ${recent.length} ${action} transactions within the last minute. Please verify if this was you.`
      );
    }

    if ((action === 'withdraw' || action === 'transfer') && amount > 0) {
      const lastTen = user.transactions
        .filter(tx => tx.type === action)
        .slice(-10)
        .map(tx => tx.amount);
      const avg = lastTen.length ? lastTen.reduce((a,b)=>a+b,0)/lastTen.length : 0;

      if (amount > Math.max(avg * 3, threshold)) {
        await FraudLog.create({
          user: userId,
          action,
          amount,
          currency,
          reason: 'Sudden large transaction',
          metadata: { avgLast10: avg }
        });

        await sendEmail(
          user.email,
          'Alert: Large Transaction Detected',
          `Dear ${user.username}, a suspiciously large ${action} of amount ${amount} ${currency} was detected in your account. If this wasn't you, please contact support immediately.`
        );
      }

      console.log(`Fraud detection triggered for user: ${userId}, action: ${action}, amount: ${amount}`);
    }

    next();
  } catch (err) {
    next(err);
  }
};
