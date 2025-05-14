const { Op } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("../models_gen/products")(
  sequelize,
  sequelize.DataTypes
);
const Category = require("../models_gen/categories")(
  sequelize,
  sequelize.DataTypes
);
const Cart = require("../models_gen/carts")(sequelize, sequelize.DataTypes);

exports.addToCart = async (req, res) => {
  const { product_id, user_id } = req.params;
  const { quantity } = req.body;

  if (!user_id || !product_id || !quantity) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: user_id, product_id, quantity",
    });
  }

  try {
    const existingCart = await Cart.findOne({
      where: {
        user_id,
        product_id,
      },
    });

    if (existingCart) {
      if (existingCart.is_deleted) {
        await existingCart.update({
          quantity,
          is_deleted: false,
        });
      } else {
        await existingCart.update({
          quantity: existingCart.quantity + quantity,
        });
      }
    } else {
      await Cart.create({
        user_id,
        product_id,
        quantity,
        is_deleted: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.searchProducts = async (req, res) => {
  const { keyword, category } = req.query;
  const where = {};
  if (keyword) where.name = { [Op.like]: `%${keyword}%` };
  if (category) where.category_id = category;

  try {
    const products = await Product.findAll({ where });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Lỗi tìm kiếm sản phẩm" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Không tìm thấy" });
    res.json(product);
  } catch {
    res.status(500).json({ error: "Lỗi lấy sản phẩm" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated) {
      res.json({ message: "Đã cập nhật sản phẩm" });
    } else {
      res.status(404).json({ error: "Không tìm thấy sản phẩm để cập nhật" });
    }
  } catch {
    res.status(500).json({ error: "Lỗi cập nhật sản phẩm" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.json({ message: "Đã xóa" });
  } catch {
    res.status(500).json({ error: "Lỗi xóa" });
  }
};

exports.assignCategoryToProduct = async (req, res) => {
  try {
    await Product.update(
      { category_id: req.body.category_id },
      { where: { id: req.params.id } }
    );
    res.json({ message: "Đã phân loại sản phẩm" });
  } catch {
    res.status(500).json({ error: "Lỗi phân loại" });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { id, name, description } = req.body;

    // Tạo danh mục với các trường được cung cấp
    const category = await Category.create({ id, name, description });

    res.status(201).json({ message: "Đã thêm danh mục thành công", category });
  } catch (err) {
    res.status(500).json({ error: "Lỗi thêm danh mục", details: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.destroy({ where: { id: req.params.id } });
    res.json({ message: "Đã xóa danh mục" });
  } catch {
    res.status(500).json({ error: "Lỗi xóa danh mục" });
  }
};

exports.checkStock = async (req, res) => {
  try {
    const allStock = await Product.findAll({
      attributes: ["id", "name", "stock"],
    });

    res.json(
      allStock.map((p) => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
      }))
    );
  } catch {
    res.status(500).json({ error: "Lỗi kiểm tra tồn kho" });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: "Đã thêm sản phẩm thành công", product });
  } catch (err) {
    res.status(500).json({ error: "Lỗi thêm sản phẩm", details: err.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  const { category_id } = req.params; // Lấy category_id từ URL
  try {
    const products = await Product.findAll({
      where: { category_id }, // Lọc theo category_id
    });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có sản phẩm nào trong danh mục này" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
    res
      .status(500)
      .json({ error: "Đã xảy ra lỗi khi lấy sản phẩm theo danh mục" });
  }
};

exports.getCategoryOfProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });

    const category = await Category.findByPk(product.category_id);
    if (!category)
      return res.status(404).json({ error: "Không tìm thấy danh mục" });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Lỗi lấy danh mục sản phẩm" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: {
        is_deleted: false,
      },
      attributes: ["id", "name", "description"],
    });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Lỗi lấy danh mục:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
