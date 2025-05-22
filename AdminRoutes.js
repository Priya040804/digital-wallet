const express = require('express');
const router = express.Router();
const { viewFlagged, aggregateBalances, topUsersByBalance, topUsersByVolume } = require('../controllers/AdminController');
const { userVerification } = require('../Middlewares/Authmiddleware');
const { isAdmin } = require('../Middlewares/Authmiddleware');

// Protect admin routes
router.use(userVerification);
//Check if user is admin
router.use(isAdmin);
// View flagged fraud transactions
router.get('/flagged', viewFlagged);

// Get all users with their aggregated balances
router.get('/balances', aggregateBalances);

// Get top users by balance (query: ?limit=n)
router.get('/top-balance', topUsersByBalance);

// Get top users by transaction volume (query: ?limit=n)
router.get('/top-volume', topUsersByVolume);

module.exports = router;
