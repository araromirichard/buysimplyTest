const fs = require('fs');
const { LOANS_FILE_PATH } = require('../config/config');

// Load loans from the JSON file
function loadLoans() {
  const data = fs.readFileSync(LOANS_FILE_PATH, 'utf8');
  return JSON.parse(data);
}

//get all loans
exports.getLoans = (req, res) => {
  const loans = loadLoans();
  const { status } = req.query;

  //get the auth user role
  const userRole = req.user.role;

  //filter query by status if available 
  let filteredLoans = loans;
  if (status && (status === 'pending' || status === 'active')) {
    filteredLoans = loans.filter(loan => loan.status === status);
  }

  // If the user is a staff, remove the applicant's total loan field
  if (userRole === 'staff') {
    filteredLoans = filteredLoans.map(loan => {
      const { totalLoan, ...applicant } = loan.applicant;
      return { ...loan, applicant };
    });
  }

  // Return the filtered loans
  res.json(filteredLoans);
};

//get loans by applicant email
exports.getLoansByApplicantEmail = (req, res) => {
  //get the auth user role
  const userRole = req.user.role;

  const loans = loadLoans();
  const userEmail = req.params.userEmail.toLowerCase();

  // Filter loans by applicant email
  const userLoans = loans.filter(loan => loan.applicant.email.toLowerCase() === userEmail);
  // If the user is a staff, remove the applicant's total loan field
  if (userRole === 'staff') {
    userLoans = userLoans.map(loan => {
      const { totalLoan, ...applicant } = loan.applicant;
      return { ...loan, applicant };
    });
  }

  res.json({ loans: userLoans });
};
