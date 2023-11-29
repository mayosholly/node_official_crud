// routes/products.js

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const flash = require('connect-flash');
const Product = require('../models/Product');

// Read (GET): Display a list of products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.render('index', { products });
});

// Create (GET): Show the form to create a new product
router.get('/create', (req, res) => {
  res.render('create');
});

// Create (POST): Create a new product
router.post(
  '/create',
  [
    body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({min:3}).withMessage('Minimum length is 3'),
    body('price')
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Must be a number')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('formData', req.body);

      const errorMessages = errors.array().map(error => error.msg);
      req.flash('error', errorMessages);
      res.redirect('/products/create');
    } else {
      const { name, description, price } = req.body;
      const product = new Product({ name, description, price });
      await product.save();
      req.flash('success', 'Product created successfully');
      res.redirect('/products');
    }
  }
);

// Edit (GET): Show the form to edit a product
router.get('/edit/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('edit', { product });
});

// Edit (POST): Update a product
router.post('/edit/:id', async (req, res) => {
  const { name, description, price } = req.body;
  await Product.findByIdAndUpdate(req.params.id, { name, description, price });
  req.flash('success', 'Product updated successfully');
  res.redirect('/products');
});

// Delete: Delete a product
router.get('/delete/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  req.flash('success', 'Product deleted successfully');
  res.redirect('/products');
});

module.exports = router;
