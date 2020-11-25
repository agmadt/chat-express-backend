const ChatRoomRepository = require('../repositories/ChatroomRepository')
const WebSocket = require('ws');

const WebSocketChatRoom = {
  emitChatRoom: async(req) => {

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
    
    req.app.get('wss').clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'CHATROOMS',
          chatrooms: chatroomsArr
        }));
      }
    });
  },
  emitChatMessage: async(req, user, roomID, message) => {
    req.app.get('wss').clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'CHAT_MESSAGE',
          room_id: roomID,
          user: user,
          message: message
        }));
      }
    });
  },
  emitJoinRoom: async(req, roomID, user) => {

    const chatRoom = await ChatRoomRepository.findByID(roomID);
    let participants = [];

    for (let j = 0; j < chatRoom.chatroom_users.length; j++) {
      const participant = chatRoom.chatroom_users[j];
      participants.push({
        id: participant.id,
        email: participant.email,
        owner: participant.participants.owner
      })
    }
    
    req.app.get('wss').clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'JOIN_ROOM',
          participants: participants,
          room_id: roomID,
          user: {
            id: user.id,
            email: user.email
          }
        }));
      }
    });
  },
  emitLeaveRoom: async(req, roomID, user) => {

    const chatRoom = await ChatRoomRepository.findByID(roomID);
    let participants = [];

    for (let j = 0; j < chatRoom.chatroom_users.length; j++) {
      const participant = chatRoom.chatroom_users[j];
      participants.push({
        id: participant.id,
        email: participant.email,
        owner: participant.participants.owner
      })
    }
    
    req.app.get('wss').clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'LEAVE_ROOM',
          participants: participants,
          room_id: roomID,
          user: {
            id: user.id,
            email: user.email
          }
        }));
      }
    });
  },
}
  
  module.exports = WebSocketChatRoom;
  