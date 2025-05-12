const { Op } = require("sequelize");
const Product = require("../models/product_model");

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
    await Product.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Đã cập nhật" });
  } catch {
    res.status(500).json({ error: "Lỗi cập nhật" });
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

const Category = require("../models/category_model");

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

exports.getAllProduct = async(req, res) =>{
  try {
    const products = await Product.findAll(); 
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm' });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { is_deleted: false }, // Lọc các danh mục chưa bị xóa
      attributes: ["id", "name", "description"], // Chỉ lấy các trường cần thiết
    });

    if (categories.length === 0) {
      return res.status(404).json({ message: "Không có danh mục nào" });
    }

    res.status(200).json(categories);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi lấy danh sách danh mục" });
  }
};