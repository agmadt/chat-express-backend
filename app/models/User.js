var Sequelize = require('sequelize');
var sequelize = require('../sequelize');
const { v4: uuidv4 } = require('uuid');

var User = sequelize.define('users', {
  id: {
    type: Sequelize.STRING,
    field: 'id',
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING,
    field: 'email'
  },
  password: {
    type: Sequelize.STRING,
    field: 'password'
  },
  jwtoken: {
    type: Sequelize.STRING,
    field: 'jwtoken'
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
}
);

User.beforeCreate((user, _ ) => {
  return user.id = uuidv4();
});

module.exports = User;