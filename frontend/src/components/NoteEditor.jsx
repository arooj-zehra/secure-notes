import { useState, useEffect, useRef } from 'react';
import { useNotes } from '../context/NotesContext';

const ToolbarButton = ({ onClick, title, children, active }) => (
  <button
    className={`toolbar-btn ${active ? 'active' : ''}`}
    onClick={onClick}
    title={title}
    type="button"
  >
    {children}
  </button>
);

export default function NoteEditor({ note, onClose }) {
  const { addNote, editNote } = useNotes();
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      if (editorRef.current) {
        editorRef.current.innerHTML = note.content || '';
      }
    } else {
      setTitle('');
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
    }
  }, [note]);

  const exec = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const content = editorRef.current.innerHTML;
      if (note) {
        await editNote(note._id, { title, content });
      } else {
        await addNote({ title, content });
      }
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="editor-overlay">
      <div className="editor">
        <div className="editor-header">
          <input
            className="editor-title"
            type="text"
            placeholder="Untitled note"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="editor-actions">
            <button className="save-btn" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="toolbar">
          <div className="toolbar-group">
            <ToolbarButton onClick={() => exec('bold')} title="Bold"><b>B</b></ToolbarButton>
            <ToolbarButton onClick={() => exec('italic')} title="Italic"><i>I</i></ToolbarButton>
            <ToolbarButton onClick={() => exec('underline')} title="Underline"><u>U</u></ToolbarButton>
            <ToolbarButton onClick={() => exec('strikeThrough')} title="Strikethrough"><s>S</s></ToolbarButton>
          </div>
          <div className="toolbar-divider" />
          <div className="toolbar-group">
            <ToolbarButton onClick={() => exec('formatBlock', 'H1')} title="Heading 1">H1</ToolbarButton>
            <ToolbarButton onClick={() => exec('formatBlock', 'H2')} title="Heading 2">H2</ToolbarButton>
            <ToolbarButton onClick={() => exec('formatBlock', 'H3')} title="Heading 3">H3</ToolbarButton>
            <ToolbarButton onClick={() => exec('formatBlock', 'P')} title="Paragraph">P</ToolbarButton>
          </div>
          <div className="toolbar-divider" />
          <div className="toolbar-group">
            <ToolbarButton onClick={() => exec('insertUnorderedList')} title="Bullet list">• List</ToolbarButton>
            <ToolbarButton onClick={() => exec('insertOrderedList')} title="Numbered list">1. List</ToolbarButton>
          </div>
          <div className="toolbar-divider" />
          <div className="toolbar-group">
            <ToolbarButton onClick={() => exec('justifyLeft')} title="Align left">Left</ToolbarButton>
            <ToolbarButton onClick={() => exec('justifyCenter')} title="Align center">Center</ToolbarButton>
            <ToolbarButton onClick={() => exec('justifyRight')} title="Align right">Right</ToolbarButton>
          </div>
          <div className="toolbar-divider" />
          <div className="toolbar-group">
            <ToolbarButton onClick={() => exec('undo')} title="Undo">↩</ToolbarButton>
            <ToolbarButton onClick={() => exec('redo')} title="Redo">↪</ToolbarButton>
          </div>
        </div>

        <div
          ref={editorRef}
          className="editor-content"
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Start writing..."
        />
      </div>
    </div>
  );
}