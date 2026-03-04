import jwt from 'jsonwebtoken';
import { connectDB, Note } from './_db.js';

const getUser = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  try { return jwt.verify(token, process.env.JWT_SECRET); }
  catch { return null; }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();
  const user = getUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  const { id } = req.query;

  if (req.method === 'PUT') {
    const note = await Note.findOneAndUpdate({ _id: id, userId: user.id }, req.body, { new: true });
    return res.json(note);
  }
  if (req.method === 'DELETE') {
    await Note.findOneAndUpdate({ _id: id, userId: user.id }, { deleted: true });
    return res.json({ message: 'Note moved to recycle bin' });
  }
  res.status(405).end();
}