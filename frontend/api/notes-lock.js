const jwt = require('jsonwebtoken');
const { connectDB, Note } = require('./_db');

const getUser = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch { return null; }
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();
  const user = getUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const { id } = req.query;
  const note = await Note.findOne({ _id: id, userId: user.id });
  note.isLocked = !note.isLocked;
  await note.save();
  res.json(note);
};