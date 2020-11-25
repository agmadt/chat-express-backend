const { Chatroom, User } = require('../models/Model')

const ChatRoomController = {
  
  get: async(data) => {

    const chatrooms = await Chatroom.findAll({
      order: [
        ['created_at', 'DESC']
      ],
      include: [
        {
          model: User,
          as: 'chatroom_users'
        }
      ]
    });

    return chatrooms;
  },
  
  findByID: async(id) => {

    const chatroom = await Chatroom.findOne({
      where: { id: id },
      include: [
        {
          model: User,
          as: 'chatroom_users'
        }
      ]
    });

    return chatroom;
  },
  
  create: async(data) => {
    
    const { name } = data;

    const chatroom = await Chatroom.create({
      name: name
    });

    return chatroom;
  },

}

module.exports = ChatRoomController;
