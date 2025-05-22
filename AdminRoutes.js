const express = require('express');
const router = express.Router();
const { viewFlagged, aggregateBalances, topUsersByBalance, topUsersByVolume } = require('../controllers/AdminController');
const { userVerification } = require('../Middlewares/Authmiddleware');
const { isAdmin } = require('../Middlewares/Authmiddleware');

router.use(userVerification);
router.use(isAdmin);
router.get('/flagged', viewFlagged);

router.get('/balances', aggregateBalances);
router.get('/top-balance', topUsersByBalance);

router.get('/top-volume', topUsersByVolume);

module.exports = router;
