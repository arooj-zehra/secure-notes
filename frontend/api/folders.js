const jwt = require('jsonwebtoken');
const { connectDB, Folder } = require('./_db');

const getUser = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch { return null; }
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();
  const user = getUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method === 'GET') {
    const folders = await Folder.find({ userId: user.id });
    return res.json(folders);
  }

  if (req.method === 'POST') {
    const { name, color } = req.body;
    const folder = new Folder({ userId: user.id, name, color });
    await folder.save();
    return res.status(201).json(folder);
  }

  res.status(405).end();
};