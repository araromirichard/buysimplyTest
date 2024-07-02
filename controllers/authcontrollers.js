const fs = require('fs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, STAFFS_FILE_PATH } = require('../config/config');
const { blacklist } = require('../middleware/authmiddleware');


// load data from file to simulate db
function loadStaffs() {
    const data = fs.readFileSync(STAFFS_FILE_PATH, 'utf8');
    return JSON.parse(data);
}

//generate token for user
function generateToken(user) {
    return jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
}


exports.login = (req, res) => {
    const { email, password } = req.body;
    const staffs = loadStaffs();
    const user = staffs.find(u => u.email === email);
   const accessPassword = staffs.find(u => u.password === password)

    if (user && accessPassword) {
        const token = generateToken(user);
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

exports.logout = (req, res) => {
    const token = req.headers['authorization'];
    if (token) {
        blacklist.add(token);
    }
    res.status(200).json({ message: 'Logged out successfully' });
};
