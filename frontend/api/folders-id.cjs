const jwt = require('jsonwebtoken');
const { connectDB, Folder } = require('./_db.cjs');

const getUser = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch { return null; }
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();
  const user = getUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const { id } = req.query;

  if (req.method === 'PUT') {
    const folder = await Folder.findOneAndUpdate(
      { _id: id, userId: user.id },
      req.body,
      { new: true }
    );
    return res.json(folder);
  }

  if (req.method === 'DELETE') {
    await Folder.findOneAndDelete({ _id: id, userId: user.id });
    return res.json({ message: 'Folder deleted' });
  }

  res.status(405).end();
};