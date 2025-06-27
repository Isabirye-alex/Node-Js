const Product = require("../models/product.models.js");

// Create Product
async function createProduct(req, res) {
  try {
    const {
      name,
      description,
      categoryId,
      subcategoryId,
      price,
      stock,
      imageUrls,
      isFeatured,
      brand,
    } = req.body;

    // Basic validation
    if (
      !name ||
      !description ||
      !categoryId ||
      !subcategoryId ||
      price === undefined ||
      stock === undefined
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields are missing" });
    }

    const newProduct = new Product({
      name: name.trim(),
      description,
      categoryId,
      subcategoryId,
      price,
      stock,
      imageUrls: imageUrls || [],
      isFeatured: isFeatured || false,
      brand: brand || "",
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error creating product",
        error: error.message,
      });
  }
}

// Get all Products
async function getAllProducts(req, res) {
  try {
    const products = await Product.find()
      .populate("categoryId", "name")
      .populate("subcategoryId", "name");

    if (!products.length) {
      return res
        .status(404)
        .json({ success: false, message: "No products found" });
    }

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching products" });
  }
}

// Get product by ID
async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("categoryId", "name")
      .populate("subcategoryId", "name");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Invalid product ID" });
  }
}

// Update product
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      categoryId,
      subcategoryId,
      price,
      stock,
      imageUrls,
      isFeatured,
      brand,
    } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        categoryId,
        subcategoryId,
        price,
        stock,
        imageUrls,
        isFeatured,
        brand,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating product" });
  }
}

// Delete product
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting product" });
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
