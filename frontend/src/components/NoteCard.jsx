import { useNotes } from '../context/NotesContext';

const stripHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export default function NoteCard({ note, onClick }) {
  const { favoriteNote, lockNote, removeNote } = useNotes();

  return (
    <div className="note-card" onClick={onClick}>
      <div className="note-card-header">
        <h3>{note.title || 'Untitled note'}</h3>
        <div className="note-card-actions" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => favoriteNote(note._id)} title="Favourite">
            {note.isFavorite ? '★' : '☆'}
          </button>
          <button onClick={() => lockNote(note._id)} title="Lock">
            {note.isLocked ? 'lock' : 'unlock'}
          </button>
          <button onClick={() => removeNote(note._id)} title="Delete">✕</button>
        </div>
      </div>
      {note.isLocked ? (
        <p className="locked-text">This note is locked.</p>
      ) : (
        <p className="note-preview">{stripHtml(note.content)?.slice(0, 150)}</p>
      )}
    </div>
  );
}