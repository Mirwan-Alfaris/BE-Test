module.exports = (sequelize, Sequelize) => {
  const Example = sequelize.define(
      'examples',
      {
        field: {
          // eslint-disable-next-line new-cap
          type: Sequelize.STRING(50),
        },
      },
      {timestamps: false},
  );
  return Example;
};
