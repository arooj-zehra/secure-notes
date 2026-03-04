const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI, { family: 4 });
  isConnected = true;
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }
}, { timestamps: true });

const folderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  color: { type: String, default: '#ffffff' }
}, { timestamps: true });

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
  title: { type: String, default: 'Untitled note' },
  content: { type: String, default: '' },
  isFavorite: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Folder = mongoose.models.Folder || mongoose.model('Folder', folderSchema);
const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);

module.exports = { connectDB, User, Folder, Note };