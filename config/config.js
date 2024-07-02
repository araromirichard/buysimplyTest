const path = require('path');

module.exports = {
  SECRET_KEY: 'B4D474DFAD857C9C5C8FA7F127493', // this key was genrated using the randomkeygen.com website, ina production app this should be a stored in 
  STAFFS_FILE_PATH: path.join(__dirname, '../data/staffs.json'),
  LOANS_FILE_PATH: path.join(__dirname, '../data/loans.json')
};
