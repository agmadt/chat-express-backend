const express = require('express');
const router = express.Router();
const passport = require('passport');

require('../app/helpers/Passport');

// controllers
const authController = require('../app/controllers/AuthController');
const chatRoomController = require('../app/controllers/ChatRoomController');
const chatController = require('../app/controllers/ChatController');

// Auth route
router.post('/login', authController.login);
router.post('/logout', passport.authenticate('jwt', {session: false}), authController.logout);
router.post('/me', passport.authenticate('jwt', {session: false}), authController.me);
router.post('/refresh', passport.authenticate('jwt', {session: false}), authController.refresh);
router.post('/invalidate', passport.authenticate('jwt', {session: false}), authController.invalidate);

// Chat route
router.post('/chats', chatController.store);

// Chat room route
router.get('/chatrooms', chatRoomController.index);
router.get('/chatrooms/:id', chatRoomController.show);
router.post('/chatrooms/leave', passport.authenticate('jwt', {session: false}), chatRoomController.leave);
router.post('/chatrooms/join', passport.authenticate('jwt', {session: false}), chatRoomController.join);
router.post('/chatrooms/create', passport.authenticate('jwt', {session: false}), chatRoomController.create);


module.exports = router;