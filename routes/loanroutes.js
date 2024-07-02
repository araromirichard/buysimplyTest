const express = require('express');
const { authenticate } = require('../middleware/authmiddleware');
const { getLoans, getLoansByApplicantEmail } = require('../controllers/loancontrollers');

const router = express.Router();


//get all loans with auth middleware
router.get('/loans', authenticate(), getLoans);
router.get('/loans/:userEmail/get', authenticate(), getLoansByApplicantEmail);



module.exports = router;