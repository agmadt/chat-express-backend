const Chatroom = require('./Chatroom');
const Participant = require('./Participant');
const User = require('./User');

Chatroom.hasMany(Participant, { as: 'chatroom_participants', foreignKey: 'room_id' });
Chatroom.belongsToMany(User, { through: Participant, as: 'chatroom_users', foreignKey: 'room_id', otherKey: 'user_id' });
Participant.belongsTo(User, { as: 'participant_user', foreignKey: 'user_id' });
User.hasOne(Participant, { as: 'user_participant', foreignKey: 'user_id' });

module.exports = {
    Chatroom,
    Participant,
    User
}