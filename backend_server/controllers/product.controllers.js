const db = require('./db.controller.js');

// Create Product
async function createProduct(req, res) {
  try {
    const {
      name,
      description,
      category_id,
      subcategory_id,
      price,
      stock,
      imageUrl ,
      is_featured = false,
      brand = ''
    } = req.body;

    if (!name || !description || !category_id || !subcategory_id || price == null || stock == null||imageUrl) {
      return res.status(400).json({ success: false, message: 'Required fields are missing' });
    }

    const [result] = await db.query(
      `INSERT INTO products 
      (name, description, category_id, subcategory_id, price, stock, imageUrl, is_featured, brand) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), description, category_id, subcategory_id, price, stock, JSON.stringify(imageUrl), is_featured, brand]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        id: result.insertId,
        name,
        description,
        category_id,
        subcategory_id,
        price,
        stock,
        imageUrl,
        is_featured,
        brand
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating product', error: error.message });
  }
}

// Get all Products
async function getAllProducts(req, res) {
  try {
    const { category_id, subcategory_id } = req.query;

    let sql = `
      SELECT 
        p.id, p.name, p.description, p.price, p.stock, p.imageUrl, 
        p.is_featured, p.brand, 
        c.id AS category_id, c.name AS categoryName, 
        s.id AS subcategory_id, s.name AS subcategoryName
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN subcategories s ON p.subcategory_id = s.id
    `;

    const params = [];

    if (category_id) {
      sql += ' WHERE p.category_id = ?';
      params.push(category_id);
    }

    if (subcategory_id) {
      sql += category_id ? ' AND p.subcategory_id = ?' : ' WHERE p.subcategory_id = ?';
      params.push(subcategory_id);
    }

    const [products] = await db.query(sql, params);

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'No products found' });
    }

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: products
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
  }
}


// Get Product by ID
async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`
      SELECT 
        p.*, 
        c.name AS categoryName,
        s.name AS subcategoryName
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN subcategories s ON p.subcategory_id = s.id
      WHERE p.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = rows[0];
    product.imageUrl = JSON.parse(product.imageUrl || '[]');

    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving product', error: error.message });
  }
}

// Update Product
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category_id,
      subcategory_id,
      price,
      stock,
      imageUrl,
      is_featured,
      brand
    } = req.body;

    const [check] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await db.query(`
      UPDATE products 
      SET name = ?, description = ?, category_id = ?, subcategory_id = ?, price = ?, stock = ?, imageUrl = ?, is_featured = ?, brand = ? 
      WHERE id = ?
    `, [
      name, description, category_id, subcategory_id,
      price, stock, JSON.stringify(imageUrl || []),
      is_featured ?? false, brand ?? '', id
    ]);

    res.status(200).json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating product', error: error.message });
  }
}

// Delete Product
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const [check] = await db.query('SELECT * FROM products WHERE id = ?', [id]);

    if (check.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await db.query('DELETE FROM products WHERE id = ?', [id]);

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting product', error: error.message });
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
