const db = require('../controllers/db.controller.js'); 
async function createBrand(req, res) {
    try {
        const { name, logoUrl, description } = req.body;
        if (!name || !logoUrl || !description || !subCategory) {
            res.status(400).json({ sucess: false, message: 'All fields are required' });
        }
        const existing = await Brand.findOne({ name: name.toLowerCase.trim() });
        if (existing) {
            res.status(409).json({ sucess: false, message: 'Brand already exists' });
        }
        const newBrand = new Brand({ name, logoUrl, description });
        await newBrand.save();
        res.status(201).json({ sucess: true, message: 'Brand successfully saved' });
     } catch (error) {
        res.status(500).json({success: false, message: 'Failed to create brand with error reason', error: error.message})
    }
}

async function getBrand(req, res) {
    try {
        const allBrands = await Brand.find();
        if (!allBrands.length) {
            res.status(404).json({ success: false, message: 'Brand not found' });
        }
        res.status(201).json({ success: true, message: 'Brands successfully retrieved', date: Brands });
     } catch (error) {
        res.status(500).json({ sucess: false, message: 'Failed to retrieve brands', error: error.message });
    }
}

async function getBrandById(req, res) {
    try { 
        const { id } = req.params;
        const findBrandById = await Brand.findById(id);
        if (!findBrandById) {
            res.status(404).json({ success: false, message: 'Brand for the givem id not found' });
        }
        res.status(201).json({ success: true, message: 'Brand successfully got' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'No brand found with the given id', error:error.message });
    }
}

async function updateBrand(req, res) {
    try { 
        const { id } = req.params;
        const { name, logoUrl, description, subCategory } = req.body;
        const updatedBrand = await Brand.findByIdAndUpdate(id, {name, description, logoUrl, subCategory}, {new:true, runValidators:true});
        if (!updateBrand.length) {
            res.status(404).json({ success: false, message: 'Brand with given id not found' });
        }
        res.status(201).json({ success: true, messsage: 'Brand successfully updated', data: Brand });

    } catch (error) {
        res.status(500).json({ success: true, message: 'Error ocuured while executing your query', error: error.message });
    }
}
async function deleteBrand(req, res) {
    try { 
        const { id } = req.params;
        const deleteBrand = await Brand.findByIdAndDelete(id);
        if (!deleteBrand.length) {
            res.status(404).json({ success: fale, message: 'Faild to delete. The provided id does not match any brand' });
        }
        res.status(201).json({ success: true, message: 'Brand successfully deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete brand', error: error.message });
    }
}

module.exports = {
    createBrand,
    getBrand,
    getBrandById,
    deleteBrand,
    updateBrand
}