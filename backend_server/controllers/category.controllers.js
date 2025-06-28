const db = require('./db.controller.js');

// GET all categories
async function getAllCategories(req, res) {
  try {
    const [categories] = await db.query('SELECT * FROM categories');

    if (categories.length === 0) {
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
    const { name, imageUrl } = req.body;

    if (!name || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Name and imageUrl are required' });
    }

    const [existing] = await db.query('SELECT * FROM categories WHERE name = ?', [name]);

    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Category already exists' });
    }

    const [result] = await db.query(
      'INSERT INTO categories (name, imageUrl) VALUES (?, ?)',
      [name, imageUrl]
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { id: result.insertId, name, imageUrl }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// GET category by ID
async function getCategoryById(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({ success: true, message: 'Category fetched', data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Invalid ID or server error' });
  }
}

// UPDATE category by ID
async function updateCategoryById(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const [category] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (category.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await db.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: { id, name }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// DELETE category by ID
async function deleteCategoryById(req, res) {
  try {
    const { id } = req.params;

    const [category] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (category.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await db.query('DELETE FROM categories WHERE id = ?', [id]);

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
