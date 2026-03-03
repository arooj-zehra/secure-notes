import { useState, useRef } from 'react';
import { useNotes } from '../context/NotesContext';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';

export default function Dashboard() {
  const { notes, loading } = useNotes();
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeFolder, setActiveFolder] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [search, setSearch] = useState('');
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('wallpaper') || null);
  const wallpaperInputRef = useRef(null);

  const getFilteredNotes = () => {
    let filtered = notes;
    if (activeFilter === 'all') filtered = notes.filter(n => !n.deleted);
    else if (activeFilter === 'favorites') filtered = notes.filter(n => n.isFavorite && !n.deleted);
    else if (activeFilter === 'locked') filtered = notes.filter(n => n.isLocked && !n.deleted);
    else if (activeFilter === 'deleted') filtered = notes.filter(n => n.deleted);
    else if (activeFilter === 'folder') filtered = notes.filter(n => n.folderId === activeFolder && !n.deleted);

    if (search) {
      filtered = filtered.filter(n =>
        n.title?.toLowerCase().includes(search.toLowerCase()) ||
        n.content?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filtered;
  };

  const handleWallpaperChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
   reader.onload = (event) => {
    const base64 = event.target.result;
    setWallpaper(base64);
    localStorage.setItem('wallpaper', base64);
  };
  reader.readAsDataURL(file);
  };

  const handleNoteClick = (note) => {
    if (note.isLocked) return;
    setSelectedNote(note);
    setShowEditor(true);
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setSelectedNote(null);
  };

  const filteredNotes = getFilteredNotes();

  return (
    <div className="dashboard">
      <Sidebar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        activeFolder={activeFolder}
        setActiveFolder={setActiveFolder}
      />

      <div
        className="main-content"
        style={wallpaper ? {
          backgroundImage: `url(${wallpaper})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : {}}
      >
        <div className="main-header">
          <div className="header-left">
            <h2>
              {activeFilter === 'all' && 'All notes'}
              {activeFilter === 'favorites' && 'Favourites'}
              {activeFilter === 'locked' && 'Locked notes'}
              {activeFilter === 'deleted' && 'Recycle bin'}
              {activeFilter === 'folder' && 'Folder'}
            </h2>
            <span className="note-count">{filteredNotes.length}</span>
          </div>
          <div className="header-right">
            <input
              className="search-input"
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="wallpaper-btn"
              onClick={() => wallpaperInputRef.current.click()}
              title="Set wallpaper"
            >
              {wallpaper ? 'Change wallpaper' : 'Set wallpaper'}
            </button>
            {wallpaper && (
              <button
                className="wallpaper-btn remove"
                onClick={() => { setWallpaper(null); localStorage.removeItem('wallpaper'); }}
                title="Remove wallpaper"
              >
                Remove
              </button>
            )}
            <input
              ref={wallpaperInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleWallpaperChange}
            />
            <button className="new-note-btn" onClick={handleNewNote}>+</button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading notes...</div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">
            <p>No notes here yet.</p>
            <button onClick={handleNewNote}>Create your first note</button>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onClick={() => handleNoteClick(note)}
              />
            ))}
          </div>
        )}
      </div>

      {showEditor && (
        <NoteEditor
          note={selectedNote}
          onClose={handleCloseEditor}
        />
      )}

      <button className="fab" onClick={handleNewNote}>+</button>
    </div>
  );
}