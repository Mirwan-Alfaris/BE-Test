// const { exampleMiddleware } = require("../middleware");
const authController = require('../controllers/authController');
const exampleMiddleWare = require('../middleware/exampleMiddleware');

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
        'Access-Control-Allow-Headers',
        'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  // eslint-disable-next-line new-cap
  const router = require('express').Router();

  router.get(
      '/:id',
      authController.generateToken,
  );

  router.get(
      '/role/manager',
      exampleMiddleWare.verify,
      exampleMiddleWare.isAdmin,
      authController.onlyManager,
  );

  app.use('/api/token', router);
};
