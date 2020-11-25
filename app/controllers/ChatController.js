const { Participant } = require('../models/Model')
const User = require('../models/User')
const WebSocketChatRoom = require('../websockets/WebSocketChatRoom')

const ChatController = {
  store: async(req, res) => {

    const  { user_id, room_id, message } = req.body
    
    const user = await User.findOne({
      where: { id: user_id }
    });

    WebSocketChatRoom.emitChatMessage(req, user, room_id, message);

    return res.json({
      message: "Message sent"
    })
  },
}

module.exports = ChatController;
