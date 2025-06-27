const Poster = require('../models/poster.model');

// Create Poster
async function createPoster(req, res) {
  try {
    const { imageUrl, title, description, isActive } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Image URL is required' });
    }

    const poster = new Poster({ imageUrl, title, description, isActive });
    await poster.save();

    res.status(201).json({ success: true, message: 'Poster created successfully', data: poster });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create poster', error: error.message });
  }
}

// Get All Posters
async function getPosters(req, res) {
  try {
    const posters = await Poster.find();
    res.status(200).json({ success: true, data: posters });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch posters' });
  }
}

// Get Poster by ID
async function getPosterById(req, res) {
  try {
    const { id } = req.params;
    const poster = await Poster.findById(id);
    if (!poster) return res.status(404).json({ success: false, message: 'Poster not found' });

    res.status(200).json({ success: true, data: poster });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving poster' });
  }
}

// Delete Poster
async function deletePoster(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Poster.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Poster not found' });

    res.status(200).json({ success: true, message: 'Poster deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting poster' });
  }
}

module.exports = {
  createPoster,
  getPosters,
  getPosterById,
  deletePoster,
};
