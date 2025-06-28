const db = require('./db.controller.js');

// Create Subcategory
async function createSubCategory(req, res) {
  try {
    const { name, category_id, description, imageUrl } = req.body;

    if (!name || !category_id || !description || !imageUrl) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const [existing] = await db.query('SELECT * FROM subcategories WHERE name = ?', [name]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Subcategory already exists' });
    }

    const [result] = await db.query(
      'INSERT INTO subcategories (name, category_id, description, imageUrl) VALUES (?, ?, ?, ?)',
      [name, category_id, description, imageUrl]
    );

    res.status(201).json({
      success: true,
      message: 'New subcategory saved successfully',
      data: { id: result.insertId, name, category_id, description, imageUrl }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving subcategory', error: error.message });
  }
}

// Get All Subcategories
async function getSubCategory(req, res) {
  try {
    const [subcategories] = await db.query('SELECT * FROM subcategories');
    if (subcategories.length === 0) {
      return res.status(404).json({ success: false, message: 'No subcategories found' });
    }

    res.status(200).json({
      success: true,
      message: 'Subcategories retrieved successfully',
      data: subcategories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching subcategories', error: error.message });
  }
}

// Get Subcategory by ID
async function getSubCategoryById(req, res) {
  try {
    const { id } = req.params;
    const [subcategory] = await db.query('SELECT * FROM subcategories WHERE id = ?', [id]);
    if (subcategory.length === 0) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Subcategory retrieved successfully',
      data: subcategory[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Invalid subcategory ID', error: error.message });
  }
}

// Update Subcategory
async function updateSubCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description, imageUrl } = req.body;

    const [existing] = await db.query('SELECT * FROM subcategories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }

    await db.query(
      'UPDATE subcategories SET name = ?, description = ?, imageUrl = ? WHERE id = ?',
      [name, description, imageUrl, id]
    );

    res.status(200).json({
      success: true,
      message: 'Subcategory updated successfully',
      data: { id, name, description, imageUrl }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating subcategory', error: error.message });
  }
}

// Delete Subcategory
async function deleteSubCategory(req, res) {
  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT * FROM subcategories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }

    await db.query('DELETE FROM subcategories WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting subcategory', error: error.message });
  }
}

module.exports = {
  createSubCategory,
  getSubCategory,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory
};
