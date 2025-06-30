const db = require('./db.controller.js');

// CREATE Brand
async function createBrand(req, res) {
  try {
    const { name, description, subcategory_id } = req.body;
    const logo_url = req.file?.path; 
    if (!name || !logo_url || !description||!subcategory_id) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const [existing] = await db.query('SELECT * FROM brands WHERE name = ?', [name]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Brand already exists' });
    }

    const [result] = await db.query(
      'INSERT INTO brands (name, logo_url, description,subcategory_id) VALUES (?, ?, ?,?)',
      [name, logo_url, description,subcategory_id]
    );

    res.status(201).json({
      success: true,
      message: 'Brand successfully saved',
      data: { id: result.insertId, name, logo_url, description,subcategory_id }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create brand', error: error.message });
  }
}

// GET All Brands
async function getBrand(req, res) {
  try {
    const [brands] = await db.query('SELECT * FROM brands');
    if (!brands.length) {
      return res.status(404).json({ success: false, message: 'No brands found' });
    }

    res.status(200).json({ success: true, message: 'Brands retrieved successfully', data: brands });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve brands', error: error.message });
  }
}

// GET Brand by ID
async function getBrandById(req, res) {
  try {
    const { id } = req.params;
    const [brand] = await db.query('SELECT * FROM brands WHERE id = ?', [id]);

    if (!brand.length) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    res.status(200).json({ success: true, message: 'Brand retrieved successfully', data: brand[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get brand', error: error.message });
  }
}

// UPDATE Brand
async function updateBrand(req, res) {
  try {
    const { id } = req.params;
    const { name, logo_url, description } = req.body;

    const [existing] = await db.query('SELECT * FROM brands WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    await db.query(
      'UPDATE brands SET name = ?, logo_url = ?, description = ? WHERE id = ?',
      [name, logo_url, description, id]
    );

    res.status(200).json({ success: true, message: 'Brand updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating brand', error: error.message });
  }
}

// DELETE Brand
async function deleteBrand(req, res) {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT * FROM brands WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    await db.query('DELETE FROM brands WHERE id = ?', [id]);

    res.status(200).json({ success: true, message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting brand', error: error.message });
  }
}

module.exports = {
  createBrand,
  getBrand,
  getBrandById,
  updateBrand,
  deleteBrand
};
