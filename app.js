const express = require('express');
const cors = require('cors');
const apiLimiter = require('./middleware/apiThrottleMiddleware');
const errorHandler = require('./middleware/errors');
const authRoutes = require('./routes/authroutes');
const loanRoutes = require('./routes/loanroutes');

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use(apiLimiter); // Rate limiting middleware

app.use('/api', authRoutes);
app.use('/api', loanRoutes);

app.use(errorHandler); // Global error handling middleware

const PORT = 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
