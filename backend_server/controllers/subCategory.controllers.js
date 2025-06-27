const Subcategory = require('../models/subCategory.model.js');

// Create Subcategory
async function createSubCategory(req, res) {
  try {
    const { name, category, description, imageUrl } = req.body;
    if (!name || !category || !description || !imageUrl) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existing = await Subcategory.findOne({ name: name.toLowerCase().trim(), category: category });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Subcategory already exists' });
    }

    const newSubCategory = new Subcategory({ name, imageUrl, description, category });
    await newSubCategory.save();

    res.status(201).json({
      success: true,
      message: 'New subcategory saved successfully',
      data: newSubCategory
    });
  }catch (error) {
    res.status(500).json({ success: false, message: 'Error saving subcategory', error: error.message });
  }  
}

// Get All Subcategories
async function getSubCategory(req, res) {
  try {
    const subCategories = await Subcategory.find();
    if (!subCategories.length) {
      return res.status(404).json({ success: false, message: 'No subcategories found' });
    }

    res.status(200).json({
      success: true,
      message: 'Subcategories retrieved successfully',
      data: subCategories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching subcategories' });
  }
}

// Get Subcategory by ID
async function getSubCategoryById(req, res) {
  try {
    const { id } = req.params;
    const subCategory = await Subcategory.findById(id);
    if (!subCategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Subcategory retrieved successfully',
      data: subCategory
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Invalid subcategory ID' });
  }
}

// Update Subcategory
async function updateSubCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, category } = req.body;

    const updatedCategory = await Subcategory.findByIdAndUpdate(
      id,
      { name, description, imageUrl, category },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Subcategory updated successfully',
      data: updatedCategory
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating subcategory' });
  }
}

// Delete Subcategory
async function deleteSubCategory(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Subcategory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }

    res.status(200).json({ success: true, message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting subcategory' });
  }
}

module.exports = {
  createSubCategory,
  getSubCategory,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory
};
