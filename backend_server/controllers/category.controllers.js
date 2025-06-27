const Category = require('../models/category.model');

// GET all categories
async function getAllCategories(req, res) {
  try {
    const categories = await Category.find();
    if (!categories || categories.length === 0) {
      return res.status(404).json({ success: false, message: 'No categories found' });
    }

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// POST a new category
async function createCategory(req, res) {
  try {
    const { name, imageUrl, subCategory } = req.body;

    if (!name || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Name and imageUrl are required' });
    }

    const existing = await Category.findOne({ name: name.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Category already exists' });
    }

    const newCategory = new Category({ name, imageUrl, subCategory });
    await newCategory.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// GET category by ID
async function getCategoryById(req, res) {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Invalid ID or server error' });
  }
}

// UPDATE category by ID
async function updateCategoryById(req, res) {
  try {
    const { id } = req.params;
    const { name, imageUrl, subCategory } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, imageUrl, subCategory },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({ success: true, message: 'Category updated successfully', data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// DELETE category by ID
async function deleteCategoryById(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById
};
