const express = require('express');
const router = express.Router();
const Room = require('../models/room');
const Player = require('../models/player');
const RoomPlayer = require('../models/roomPlayer');

router.post('/create', async (req, res) => {
  try {
    const { roomId, maxPlayers } = req.body;
    const room = await Room.create({ roomId, maxPlayers });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Error creating room' });
  }
});

router.post('/join', async (req, res) => {
  try {
    const { roomId, username } = req.body;
    const room = await Room.findOne({ where: { roomId } });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const player = await Player.findOne({ where: { username } });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    await RoomPlayer.create({ roomId, username });
    res.status(201).json({ message: 'Player joined room' });
  } catch (error) {
    res.status(500).json({ message: 'Error joining room' });
  }
});

// Leave a room
router.post('/leave', async (req, res) => {
  try {
    const { roomId, username } = req.body;
    await RoomPlayer.destroy({ where: { roomId, username } });
    res.status(200).json({ message: 'Player left room' });
  } catch (error) {
    res.status(500).json({ message: 'Error leaving room' });
  }
});

module.exports = router;