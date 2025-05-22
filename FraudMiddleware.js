const User = require('../Models/UserModel');
const FraudLog = require('../Models/FraudModel');
const threshold = 1000; // configurable threshold

// Mock email function - replace with real email sending later
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

    // Filter recent transactions of same type
    const recent = user.transactions
      .filter(tx => tx.type === action)
      .filter(tx => now - new Date(tx.date).getTime() < 60 * 1000);

    // Condition 1: too many in short period
    if (recent.length >= 5) {
      await FraudLog.create({
        user: userId,
        action,
        amount,
        currency,
        reason: 'High frequency of transactions',
        metadata: { countLastMinute: recent.length }
      });

      // Send email alert for high frequency transactions
      await sendEmail(
        user.email,
        'Alert: High Frequency of Transactions Detected',
        `Dear ${user.username}, we have detected ${recent.length} ${action} transactions within the last minute. Please verify if this was you.`
      );
    }

    // Condition 2: sudden large withdrawal or transfer
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

        // Send email alert for sudden large transaction
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
