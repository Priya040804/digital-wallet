const { Transfer, Deposit, Withdraw, Balance, History, closeAccount } = require("../controllers/UserController");
const { userVerification } = require('../Middlewares/Authmiddleware');
const FraudMiddleware = require("../Middlewares/FraudMiddleware");

const router = require('express').Router();

router.use(userVerification);
router.use(FraudMiddleware);

router.post('/transfer', Transfer);
router.post('/deposit', Deposit);
router.post('/withdraw', Withdraw);
router.post('/history', History);
router.post('/balance', Balance);
router.post('/close-account', closeAccount); 

module.exports = router;
