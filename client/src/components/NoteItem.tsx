// client/src/components/NoteItem.tsx
import React, { useState } from 'react';
import { Note } from '../types';
import { deleteNote } from '../services/api';
import './NoteItem.css';

interface NoteItemProps {
  note: Note;
  onEditClick: (note: Note) => void;
  onDeleteComplete: () => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onEditClick, onDeleteComplete }) => {
  const [expanded, setExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        setIsDeleting(true);
        await deleteNote(note._id);
        onDeleteComplete();
      } catch (err) {
        setError('Failed to delete note');
        console.error(err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditClick(note);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return 'green';
      case 'Negative': return 'red';
      default: return 'gray';
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`note-item ${expanded ? 'expanded' : ''}`} onClick={toggleExpand}>
      {error && <div className="error-message">{error}</div>}
      
      <div className="note-header">
        <h3 className="note-title">{note.title}</h3>
        <div className="note-meta">
          <span className="note-category">{note.category}</span>
          {note.sentiment && (
            <span 
              className="note-sentiment"
              style={{ color: getSentimentColor(note.sentiment) }}
            >
              {note.sentiment}
            </span>
          )}
        </div>
      </div>
      
      <div className="note-content">
        {expanded ? note.content : `${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}`}
      </div>
      
      {expanded && note.summary && (
        <div className="note-summary">
          <h4>Summary</h4>
          <p>{note.summary}</p>
        </div>
      )}
      
      <div className="note-footer">
        <span className="note-date">
          Updated: {formatDate(note.updatedAt)}
        </span>
        
        <div className="note-actions">
          <button 
            className="edit-button"
            onClick={handleEdit}
            disabled={isDeleting}
          >
            Edit
          </button>
          <button 
            className="delete-button"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;