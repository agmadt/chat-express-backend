var Sequelize = require('sequelize');
var sequelize = require('../sequelize');
const { v4: uuidv4 } = require('uuid');

var Participant = sequelize.define('participants', {
  id: {
    type: Sequelize.STRING,
    field: 'id',
    primaryKey: true
  },
  user_id: {
    type: Sequelize.STRING,
    field: 'user_id'
  },
  room_id: {
    type: Sequelize.STRING,
    field: 'room_id'
  },
  owner: {
    type: Sequelize.BOOLEAN,
    field: 'owner'
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
}
);

Participant.beforeCreate((participant, _ ) => {
  return participant.id = uuidv4();
});

module.exports = Participant;