var Sequelize = require('sequelize');
var sequelize = require('../sequelize');
const { v4: uuidv4 } = require('uuid');

var Chatroom = sequelize.define('chatrooms', {
  id: {
    type: Sequelize.STRING,
    field: 'id',
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    field: 'name'
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
}
);

Chatroom.beforeCreate((chatroom, _ ) => {
  return chatroom.id = uuidv4();
});

module.exports = Chatroom;