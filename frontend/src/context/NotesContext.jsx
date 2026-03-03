import { createContext, useState, useContext, useEffect } from 'react';
import { getNotes, createNote, updateNote, deleteNote, toggleFavorite, toggleLock, getFolders, createFolder, deleteFolder } from '../services/api';
import { encrypt, decrypt } from '../utils/encryption';
import { useAuth } from './AuthContext';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotes();
      fetchFolders();
    }
  }, [user]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await getNotes();
      const decrypted = res.data.map((note) => ({
        ...note,
        content: decrypt(note.content)
      }));
      setNotes(decrypted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const res = await getFolders();
      setFolders(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addNote = async (noteData) => {
    const encrypted = { ...noteData, content: encrypt(noteData.content) };
    const res = await createNote(encrypted);
    const newNote = { ...res.data, content: noteData.content };
    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  };

  const editNote = async (id, noteData) => {
    const encrypted = { ...noteData, content: encrypt(noteData.content) };
    const res = await updateNote(id, encrypted);
    const updated = { ...res.data, content: noteData.content };
    setNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
    return updated;
  };

  const removeNote = async (id) => {
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  const favoriteNote = async (id) => {
    await toggleFavorite(id);
    setNotes((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isFavorite: !n.isFavorite } : n))
    );
  };

  const lockNote = async (id) => {
    await toggleLock(id);
    setNotes((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isLocked: !n.isLocked } : n))
    );
  };

  const addFolder = async (name, color) => {
    const res = await createFolder({ name, color });
    setFolders((prev) => [...prev, res.data]);
  };

  const removeFolder = async (id) => {
    await deleteFolder(id);
    setFolders((prev) => prev.filter((f) => f._id !== id));
  };

  return (
    <NotesContext.Provider value={{
      notes, folders, loading,
      addNote, editNote, removeNote,
      favoriteNote, lockNote,
      addFolder, removeFolder, fetchNotes
    }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);