import { useNotes } from '../context/NotesContext';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeFilter, setActiveFilter, activeFolder, setActiveFolder }) {
  const { folders, notes, addFolder, removeFolder } = useNotes();
  const { logout } = useAuth();

  const handleAddFolder = async () => {
    const name = prompt('Folder name:');
    if (!name) return;
    const colors = ['#ef4444', '#3b82f6', '#eab308', '#22c55e', '#a855f7'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    await addFolder(name, color);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>Notes</h1>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <nav className="sidebar-nav">
        <button
          className={activeFilter === 'all' ? 'active' : ''}
          onClick={() => { setActiveFilter('all'); setActiveFolder(null); }}
        >
          All notes
          <span className="count">{notes.filter(n => !n.deleted).length}</span>
        </button>

        <button
          className={activeFilter === 'favorites' ? 'active' : ''}
          onClick={() => { setActiveFilter('favorites'); setActiveFolder(null); }}
        >
          Favourites
          <span className="count">{notes.filter(n => n.isFavorite && !n.deleted).length}</span>
        </button>

        <button
          className={activeFilter === 'locked' ? 'active' : ''}
          onClick={() => { setActiveFilter('locked'); setActiveFolder(null); }}
        >
          Locked notes
          <span className="count">{notes.filter(n => n.isLocked && !n.deleted).length}</span>
        </button>

        <button
          className={activeFilter === 'deleted' ? 'active' : ''}
          onClick={() => { setActiveFilter('deleted'); setActiveFolder(null); }}
        >
          Recycle bin
          <span className="count">{notes.filter(n => n.deleted).length}</span>
        </button>
      </nav>

      <div className="sidebar-folders">
        <div className="folders-header">
          <span>Folders</span>
          <button onClick={handleAddFolder}>+</button>
        </div>
        {folders.map((folder) => (
          <div
            key={folder._id}
            className={`folder-item ${activeFolder === folder._id ? 'active' : ''}`}
            onClick={() => { setActiveFolder(folder._id); setActiveFilter('folder'); }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: folder.color, display: 'inline-block' }}></span>
            <span>{folder.name}</span>
            <button
              className="delete-folder-btn"
              onClick={(e) => { e.stopPropagation(); removeFolder(folder._id); }}
            >×</button>
          </div>
        ))}
      </div>
    </div>
  );
}