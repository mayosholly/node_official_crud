const Product = require('../models/product');
const { validationResult } = require('express-validator');
const { flash } = require('connect-flash');

// Create a new product
const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', 'Validation errors occurred.');
    return res.redirect('/products/new');
  }

  try {
    const product = new Product(req.body);
    await product.save();
    req.flash('success', 'Product created successfully.');
    res.redirect('/products');
  } catch (err) {
    req.flash('error', 'Error creating the product.');
    res.redirect('/products');
  }
};

// Read all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products/index', { products });
  } catch (err) {
    req.flash('error', 'Error fetching products.');
    res.redirect('/products');
  }
};

// Read a single product
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('products/show', { product });
  } catch (err) {
    req.flash('error', 'Product not found.');
    res.redirect('/products');
  }
};

// Update a product
const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', 'Validation errors occurred.');
    return res.redirect(`/products/${req.params.id}/edit`);
  }

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    req.flash('success', 'Product updated successfully.');
    res.redirect(`/products/${product._id}`);
  } catch (err) {
    req.flash('error', 'Error updating the product.');
    res.redirect('/products');
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.id);
    req.flash('success', 'Product deleted successfully.');
    res.redirect('/products');
  } catch (err) {
    req.flash('error', 'Error deleting the product.');
    res.redirect('/products');
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
