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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();
  const user = getUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method === 'GET') {
    const notes = await Note.find({ userId: user.id, deleted: false });
    return res.json(notes);
  }
  if (req.method === 'POST') {
    const { title, content, folderId } = req.body;
    const note = new Note({ userId: user.id, title, content, folderId });
    await note.save();
    return res.status(201).json(note);
  }
  res.status(405).end();
}