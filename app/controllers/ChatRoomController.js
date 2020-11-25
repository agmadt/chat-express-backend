const url  = require('url');
const { Chatroom, User, Participant } = require('../models/Model')
const WebSocket = require('ws');
const ChatRoomRepository = require('../repositories/ChatroomRepository');
const WebSocketChatRoom = require('../websockets/WebSocketChatRoom');

const ChatRoomController = {
  
  index: async(req, res) => {
    let chatroomsArr = [];
    const chatrooms = await ChatRoomRepository.get()

    for (let i = 0; i < chatrooms.length; i++) {
      const chatroom = chatrooms[i];
      let participants = [];

      for (let j = 0; j < chatroom.chatroom_users.length; j++) {
        const participant = chatroom.chatroom_users[j];

        participants.push({
          id: participant.id,
          email: participant.email,
          owner: participant.participants.owner
        })
      }

      chatroomsArr.push({
        id: chatroom.id,
        name: chatroom.name,
        participants: participants
      })
    }

    return res.json({
      chatrooms: chatroomsArr,
    })
  },

  show: async(req, res) => {
    
    let participants = [];
    const { id } = req.params;
    console.log(id)

    const chatroom = await ChatRoomRepository.findByID(id);

    if (!chatroom) {
      return res.json({
        message: "Not found"
      }).status(404)
    }

    for (let j = 0; j < chatroom.chatroom_users.length; j++) {
      const participant = chatroom.chatroom_users[j];

      participants.push({
        id: participant.id,
        email: participant.email,
        owner: participant.participants.owner
      })
    }

    return res.json({
      id: chatroom.id,
      name: chatroom.name,
      participants: participants
    })
  },

  create: async(req, res) => {
    
    const chatroom = await ChatRoomRepository.create(req.body);

    WebSocketChatRoom.emitChatRoom(req)

    return res.json({
      id: chatroom.id,
      name: chatroom.name,
    })
  },

  join: async (req, res) => {
    const { room_id, user_id } = req.body
    let isOwner = 0;

    const participants = await Participant.findAll({
      where: { room_id: room_id }
    });

    if (participants.length > 0) {
      isOwner = 1;
    }

    const participant = await Participant.create({
      user_id: user_id,
      room_id: room_id,
      owner: isOwner
    });

    const user = await User.findOne({
      where: { id: user_id }
    });

    WebSocketChatRoom.emitJoinRoom(req, room_id, user)
    WebSocketChatRoom.emitChatRoom(req)

    return res.json({
      message: 'Successfully joined a room'
    })
  },

  leave: async (req, res) => {
    const { room_id, user_id } = req.body

    const participant = await Participant.findOne({
      where: {
        user_id: user_id,
        room_id: room_id
      }
    });

    await participant.destroy();

    const participants = await Participant.findAll({
      where: { room_id: room_id }
    });

    const user = await User.findOne({
      where: { id: user_id }
    });

    if (participants.length == 0) {

      const chatRoom = await Chatroom.findOne({
        where: { id: room_id }
      });

      await chatRoom.destroy();
      
      WebSocketChatRoom.emitChatRoom(req)

      return res.json({
        message: 'Chatroom destroyed'
      })
    }
    
    WebSocketChatRoom.emitLeaveRoom(req, room_id, user)
    WebSocketChatRoom.emitChatRoom(req)

    return res.json({
      message: 'Successfully leave a room'
    })
  },
}

module.exports = ChatRoomController;
