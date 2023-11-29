const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/official_crud', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Configure view engine and static assets
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Session and flash middleware
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = {
    success: req.flash('success'),
    error: req.flash('error'),
    formData: req.flash('formData')[0] || {}
  };
  next();
});

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/products', require('./routes/products'));

// Error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // If headers were already sent, delegate to the default error handler
  }
  
  // Handle the error and send an appropriate response
  res.status(500).send('Internal Server Error');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
