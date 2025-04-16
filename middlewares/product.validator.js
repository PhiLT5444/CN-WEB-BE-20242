const { body, param, validationResult } = require("express-validator");

// Middleware kiểm tra dữ liệu đầu vào khi thêm sản phẩm
exports.validateAddProduct = [
  body("name").notEmpty().withMessage("Tên sản phẩm là bắt buộc"),
  body("price").isFloat({ gt: 0 }).withMessage("Giá sản phẩm phải lớn hơn 0"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Số lượng tồn kho phải là số nguyên không âm"),
  body("category_id")
    .optional()
    .isInt()
    .withMessage("ID danh mục phải là số nguyên"),
  body("branch_id")
    .optional()
    .isInt()
    .withMessage("ID chi nhánh phải là số nguyên"),
  body("discount")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Giảm giá phải từ 0 đến 100"),
  body("image_url").optional().isURL().withMessage("URL hình ảnh không hợp lệ"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware kiểm tra dữ liệu đầu vào khi cập nhật sản phẩm
exports.validateUpdateProduct = [
  param("id").isInt().withMessage("ID sản phẩm phải là số nguyên"),
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Tên sản phẩm không được để trống"),
  body("price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Giá sản phẩm phải lớn hơn 0"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Số lượng tồn kho phải là số nguyên không âm"),
  body("category_id")
    .optional()
    .isInt()
    .withMessage("ID danh mục phải là số nguyên"),
  body("branch_id")
    .optional()
    .isInt()
    .withMessage("ID chi nhánh phải là số nguyên"),
  body("discount")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Giảm giá phải từ 0 đến 100"),
  body("image_url").optional().isURL().withMessage("URL hình ảnh không hợp lệ"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware kiểm tra dữ liệu đầu vào khi xóa sản phẩm
exports.validateDeleteProduct = [
  param("id").isInt().withMessage("ID sản phẩm phải là số nguyên"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
