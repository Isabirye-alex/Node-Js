const db = require('./db.controller.js');

// Create Product
async function createProduct(req, res) {
  try {
    const {
      name,
      description,
      category_id,
      price,
      stock,
      is_featured = false,
      brand = ''
    } = req.body;

    const isFeaturedValue = is_featured === 'true' || is_featured === true ? 1 : 0;
    const imageUrl = req.file?.path;

    if (!name || !description || !category_id || price == null || stock == null || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Required fields are missing' });
    }

    const [result] = await db.query(
      `INSERT INTO products 
      (name, description, category_id, price, stock, imageUrl, is_featured, brand) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), description, category_id, price, stock, imageUrl, isFeaturedValue, brand]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        id: result.insertId,
        name,
        description,
        category_id,
        price,
        stock,
        imageUrl,
        is_featured: isFeaturedValue,
        brand
      }
    });
  } catch (error) {
    console.log('Error occurred:', error);
    res.status(500).json({ success: false, message: 'Error creating product', error: error.message });
  }
}

// Get all Products
async function getAllProducts(req, res) {
  try {
    const { category_id } = req.query;

    let sql = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.category_id,
        p.price,
        p.previous_price,
        p.percentage_discount,
        p.stock,
        p.is_featured,
        p.is_hot_sale,
        p.is_summer_sale,
        p.is_new,
        p.brand,
        p.rating,
        p.reviews,
        p.created_at,
        p.updated_at,
        p.imageUrl,
        c.name AS categoryName
      FROM products p
      JOIN categories c ON p.category_id = c.id
    `;

    const params = [];

    if (category_id) {
      sql += ' WHERE p.category_id = ?';
      params.push(category_id);
    }

    sql += ' ORDER BY p.id DESC';

    const [products] = await db.query(sql, params);

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
      count: products.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
  }
}

async function getSummerSaleProducts(req, res) {
  try {
    const sql = `
      SELECT 
        id, name, description, category_id, price, previous_price, 
        percentage_discount, stock, is_featured, is_hot_sale, is_summer_sale, 
        is_new, brand, rating, reviews, created_at, updated_at, imageUrl
      FROM products
      WHERE is_summer_sale = 1
      ORDER BY created_at DESC
    `;

    const [products] = await db.query(sql);

    res.status(200).json({
      success: true,
      message: 'Summer sale products retrieved successfully',
      data: products,
      count: products.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching summer sale products',
      error: error.message,
    });
  }
}

// Get Product by ID
async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`
      SELECT 
        p.*, 
        c.name AS categoryName
      FROM products p
      JOIN categories c ON p.category_id = c.id
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
      price,
      stock,
      imageUrl,
      is_featured,
      brand
    } = req.body;

    const isFeaturedValue = is_featured === 'true' || is_featured === true ? 1 : 0;

    const [check] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await db.query(`
      UPDATE products 
      SET name = ?, description = ?, category_id = ?, price = ?, stock = ?, imageUrl = ?, is_featured = ?, brand = ? 
      WHERE id = ?
    `, [
      name, description, category_id,
      price, stock, JSON.stringify(imageUrl || []),
      isFeaturedValue, brand ?? '', id
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

// Get Featured Products
async function getFeaturedProducts(req, res) {
  try {
    const [products] = await db.query(`
      SELECT
        p.id, p.name, p.description, p.price, p.stock, p.imageUrl,
        p.is_featured, p.brand,
        c.id AS category_id, c.name AS categoryName
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_featured = 1
      ORDER BY p.name ASC
    `);

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'No featured products found' });
    }

    res.status(200).json({
      success: true,
      message: 'Featured products retrieved successfully',
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    });
  }
}

// Search Products by name or description
async function searchProducts(req, res) {
  try {
    const { query } = req.query;

    if (!query || query.trim() === '') {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const searchTerm = `%${query.trim()}%`;

    const [results] = await db.query(`
      SELECT 
        p.id, p.name, p.description, p.price, p.stock, p.imageUrl,
        p.is_featured, p.brand,
        c.id AS category_id, c.name AS categoryName
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.name LIKE ? OR p.description LIKE ?
      ORDER BY p.name ASC
    `, [searchTerm, searchTerm]);

    res.status(200).json({
      success: true,
      message: `Found ${results.length} matching product(s)`,
      data: results
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
}

// Get Products by Category ID
async function getProductsByCategoryId(req, res) {
  try {
    const { categoryId } = req.params;

    const [products] = await db.query(`
      SELECT 
        p.id, p.name, p.description, p.price, p.stock, p.imageUrl,
        p.is_featured, p.brand,
        c.id AS category_id, c.name AS categoryName
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ?
      ORDER BY p.name ASC
    `, [categoryId]);

    res.status(200).json({
      success: true,
      message: 'Products by category retrieved successfully',
      data: products,
      count: products.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching products by category', error: error.message });
  }
}

async function getHotSaleProducts(req, res) {
  try {
    const sql = `
      SELECT 
        id, name, description, category_id, price, previous_price, 
        percentage_discount, stock, is_featured, is_hot_sale, is_summer_sale, 
        is_new, brand, rating, reviews, created_at, updated_at, imageUrl
      FROM products
      WHERE is_hot_sale = 1
      ORDER BY created_at DESC
    `;

    const [products] = await db.query(sql);

    res.status(200).json({
      success: true,
      message: 'Hot sale products retrieved successfully',
      data: products,
      count: products.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hot sale products',
      error: error.message,
    });
  }
}


module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  searchProducts,
  getProductsByCategoryId,
  getSummerSaleProducts,
  getHotSaleProducts
};
