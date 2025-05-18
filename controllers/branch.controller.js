const sequelize = require("../config/database");
const initModels = require("../models_gen/init-models");
const models = initModels(sequelize);
const Branch = models.branches;

exports.createBranch = async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu tên nhãn hàng" });
  }
  try {
    const existed = await Branch.findOne({ where: { name } });
    if (existed)
      return res
        .status(400)
        .json({ success: false, message: "Nhãn hàng đã tồn tại" });
    const branch = await Branch.create({ name, description });
    res
      .status(201)
      .json({ success: true, message: "Thêm nhãn hàng thành công", branch });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Lỗi thêm nhãn hàng",
        details: err.message,
      });
  }
};

exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.findAll({
      where: { is_deleted: false },
      attributes: ["id", "name", "description"],
    });
    res.status(200).json({ success: true, data: branches });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Lỗi lấy danh sách nhãn hàng",
        details: err.message,
      });
  }
};

exports.deleteBranch = async (req, res) => {
  const { id } = req.params;
  try {
    const branch = await Branch.findByPk(id);
    if (!branch)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy nhãn hàng" });
    await branch.update({ is_deleted: true });
    res.status(200).json({ success: true, message: "Đã xóa nhãn hàng" });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Lỗi xóa nhãn hàng",
        details: err.message,
      });
  }
};

exports.getProductsByBranch = async (req, res) => {
  const { branch_id } = req.params;
  try {
    const products = await models.products.findAll({ where: { branch_id } });
    if (!products.length) {
      return res
        .status(404)
        .json({ message: "Không có sản phẩm nào thuộc nhãn hàng này" });
    }
    res.status(200).json(products);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Lỗi lấy sản phẩm theo nhãn hàng", details: err.message });
  }
};
