const { User, Participant, Chatroom } = require('../models/Model');
const day = require('dayjs');
const jwt = require('jsonwebtoken');
const WebSocketChatRoom = require('../websockets/WebSocketChatRoom');

const AuthController = {

  login: async (req, res) => {

    const { email, password } = req.body;
    
    const isUserExist = await User.findOne({ 
      where: {
        email: email,
      },
      include: [
        {
          model: Participant,
          as: 'user_participant'
        }
      ]
    });

    if (!isUserExist) {
      return res.status(401).json({
        'message': 'Username or password is incorrect'
      })
    }

    if (password != isUserExist.password) {
      return res.status(401).json({
        'message': 'Username or password is incorrect'
      })
    }

    const userData = {
      id: isUserExist.id,
      email: isUserExist.email,
      room_id: isUserExist.user_participant ? isUserExist.user_participant.room_id : null
    };

    const token = jwt.sign({
      'exp': day().add(1, 'day').unix(),
      'iat': day().unix(),
      'sub': isUserExist.id,
    }, process.env.JWT_SECRET);

    isUserExist.update({
      jwtoken: token
    })

    return res.json({
      token: token,
      data: userData
    })
  },

  me: async (req, res) => {

    const { id } = req.body;
    
    const user = await User.findOne({ 
      where: {
        id: id,
      },
      include: [
        {
          model: Participant,
          as: 'user_participant'
        }
      ]
    });

    return res.json({
      token: user.jwtoken,
      data: {
        id: user.id,
        email: user.email,
        room_id: user.user_participant ? user.user_participant.room_id : null
      }
    })
  },

  refresh: async (req, res) => {

    const { id } = req.body;
    
    const user = await User.findOne({
      where: {
        id: id,
      }
    });

    const token = jwt.sign({
      'exp': day().add(1, 'day').unix(),
      'iat': day().unix(),
      'sub': user.id,
    }, process.env.JWT_SECRET);

    user.update({
      jwtoken: token
    })

    return res.json({
      token: user.jwtoken
    })
  },

  invalidate: async (req, res) => {

    const { id } = req.body;
    
    const user = await User.findOne({
      where: {
        id: id,
      }
    });

    user.update({
      jwtoken: null
    })

    return res.json({
      message: "Success"
    })
  },

  logout: async (req, res) => {

    const { id } = req.body;
    
    const user = await User.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Participant,
          as: 'user_participant'
        }
      ]
    });

    user.update({
      jwtoken: null
    })
    
    const participant = await Participant.findOne({
      where: {
        user_id: id
      }
    });

    if (participant) {
      await participant.destroy();

      const participants = await Participant.findAll({
        where: { room_id: participant.room_id }
      });

      if (participants.length == 0) {

        const chatRoom = await Chatroom.findOne({
          where: { id: participant.room_id }
        });

        await chatRoom.destroy();

        WebSocketChatRoom.emitChatRoom(req)

        return res.json({
          message: 'Chatroom destroyed'
        })
      }

      WebSocketChatRoom.emitLeaveRoom(req, participant.room_id, user)
      WebSocketChatRoom.emitChatRoom(req)
    }

    return res.json({
      message: "Successfully logout"
    })
  }
}

module.exports = AuthController;