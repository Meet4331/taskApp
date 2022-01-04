const express = require('express');
const router = new express.Router();
const accountController = require('../controller/accountController')

router.post('/open-account', accountController.openAccount)
router.post('/transaction', accountController.transaction)


module.exports = router;