const jwt = require('jsonwebtoken');
const db = require('../models');
const configAuth = require('../config/auth');

const verify = (req, res, next) => {
  const accessToken = req.headers['authorization'];

  if (accessToken.split(' ')[0] != 'Bearer') {
    return res.status(500).json({
      success: false,
      message: 'Incorrect token format',
    });
  }

  const token = accessToken.split(' ')[1];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'No token provided',
    });
  }

  jwt.verify(token, configAuth.secret, (err, decoded) => {
    if (err) {
      return res.status(402)
          .json({
            success: true,
            message: 'Unauthenticate!',
          });
    }

    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  userId = req.userId;

  // eslint-disable-next-line max-len
  const [result] = await db.sequelize.query(`SELECT id, fullname, "positionTitle" FROM users where id=$1 LIMIT 1`, {
    bind: [userId],
  });

  if (result[0].positionTitle.toLowerCase() != 'manager') {
    return res.status(403)
        .json({
          success: false,
          message: 'Unauthorize!',
        });
  }
  next();
};

module.exports = {
  verify,
  isAdmin,
};
