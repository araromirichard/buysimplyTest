const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/config');
const blacklist = new Set();

function authenticate(requiredRole) {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(403).json({ message: 'You need to log in to access this resource' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token
    if (!token) {
      return res.status(403).json({ message: 'You need to log in to access this resource' });
    }

    if (blacklist.has(token)) {
      return res.status(401).json({ message: 'Token no longer valid' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        console.error('Token verification failed:', err); // Log the error
        return res.status(500).json({ message: 'Failed to authenticate token' });
      }

      if (requiredRole && !checkUserRole(decoded.role, requiredRole)) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      req.user = decoded;
      next();
    });
  };
}

function logout(req, res) {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      blacklist.add(token);
    }
  }
  res.status(200).json({ message: 'Logged out successfully' });
}

function checkUserRole(userRole, requiredRole) {
  const roleHierarchy = {
    'staff': 0,
    'admin': 1,
    'superadmin': 2
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

module.exports = { authenticate, logout, blacklist };
