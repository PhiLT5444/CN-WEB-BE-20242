const User = require('../models/user.model');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role, status } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'customer',
      status: status || 'active',
    });

    res.status(201).json({ message: 'User tạo thành công!', user: newUser });
  } catch (error) {
    console.error('❌ Lỗi khi tạo user:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        username: "tuanphi2"
      }
    })    
    res.status(200).json({data: users });
  } catch (error) {
    console.error('❌ Lỗi khi lấy user:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
