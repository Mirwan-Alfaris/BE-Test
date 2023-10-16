const jwt = require('jsonwebtoken');
const db = require('../models');
const configAuth = require('../config/auth');

exports.generateToken = async (req, res) => {
  const {id} = req.params;

  // eslint-disable-next-line max-len, no-unused-vars
  const [result, metadata] = await db.sequelize.query('SELECT id FROM users WHERE id=$1 LIMIT 1', {
    bind: [id],
  });
  const user = result[0];

  if (!user) {
    res.status(400).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  payload = {id: user.id};

  const token = jwt.sign(payload, configAuth.secret, {
    algorithm: 'HS256',
    expiresIn: '24h',
  });

  res.status(200).json({
    success: true,
    message: 'Generate Token Successfully',
    data: {
      token: token,
    },
  });
};

exports.onlyManager = async (req, res) => {
  [result, metadata] = await db.sequelize.query('SELECT * FROM users');

  res.status(200).json({
    success: true,
    message: 'Only Manager can access',
    data: result,
  });
};
