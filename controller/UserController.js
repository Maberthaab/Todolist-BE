const { users } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.getUsers = async (req, res) => {
  try {
    const Users = await users.findAll({
      attributes: ['id', 'username', 'email', 'nama'],
      order: [['id', 'ASC']],
    });
    if (Users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found',
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: 'List All Users',
      data: Users,
    });
  } catch (error) {
    console.log(error);
  }
};


exports.Register = async (req, res) => {
  const { username, password, nama, email} = req.body;

  const emailExisted = await users.findOne({
    where: {
      email: email,
    },
  });

  if (emailExisted) {
    return res.status(409).json({
      status: false,
      msg: 'Email already exists',
    });
  }
  const salt = 10;
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    let user = await users.create({
      username: username,
      password: hashPassword,
      nama: nama,
      email: email,
  
    });

    user = JSON.parse(JSON.stringify(user));

    return res.status(200).json({
      success: true,
      message: 'Register Successfully',
    });
  } catch (error) {
    console.log(error);
  }
};

exports.Login = async (req, res) => {
  try {
    let user = await users.findOne({
      where: {
        email: req.body.email,
      },
    });

    user = JSON.parse(JSON.stringify(user));

    if (!user) return res.status(400).json({ success: false, message: "Email or Password didn't match" });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ success: false, message: 'Wrong Password' });

    // Token generation
    let refreshTokens = [];

    const userId = user.id;
    const username = user.username;
    const email = user.email;
    const nama = user.nama;
  

    const tokenParams = { userId, email, nama };

    const accessToken = jwt.sign(tokenParams, 'access', {
      expiresIn: '1d',
    });
    const refreshToken = jwt.sign(tokenParams, 'refresh', {
      expiresIn: '30d',
    });
    refreshTokens.push(refreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const expiresInDays = 1; // 1 day expiration for accessToken
    const refreshTokenExpiresInDays = 30; // 30 days expiration for refreshToken

    const data = {
      userId,
      username,
      email,
      nama,
      accessToken,
      refreshToken,
      accessTokenExpiresIn: expiresInDays + ' day(s)',
      refreshTokenExpiresIn: refreshTokenExpiresInDays + ' day(s)',
    };

    return res.status(201).json({
      success: true,
      message: 'Login Successfully',
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: 'Login Failed' });
  }
};


exports.Logout = (req, res) => {
  try {
    res.clearCookie('accessToken');

    res.clearCookie('refreshToken');

    return res.status(200).json({
      success: true,
      message: 'Logout Successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Logout Failed' });
  }
};

