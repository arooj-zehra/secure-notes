const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');
const auth = require('../middleware/auth');

// Get all folders
router.get('/', auth, async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user.id });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create folder
router.post('/', auth, async (req, res) => {
  try {
    const { name, color } = req.body;
    const folder = new Folder({ userId: req.user.id, name, color });
    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update folder
router.put('/:id', auth, async (req, res) => {
  try {
    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    res.json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete folder
router.delete('/:id', auth, async (req, res) => {
  try {
    await Folder.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Folder deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;