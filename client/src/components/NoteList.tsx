// client/src/components/NoteList.tsx
import React from 'react';
import { Note } from '../types';
import NoteItem from './NoteItem';
import './NoteList.css';

interface NoteListProps {
  notes: Note[];
  onEditClick: (note: Note) => void;
  onNoteDeleted: () => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onEditClick, onNoteDeleted }) => {
  if (notes.length === 0) {
    return (
      <div className="no-notes">
        <p>No notes found. Create a new note to get started!</p>
      </div>
    );
  }

  return (
    <div className="notes-list">
      {notes.map(note => (
        <NoteItem 
          key={note._id}
          note={note}
          onEditClick={onEditClick}
          onDeleteComplete={onNoteDeleted}
        />
      ))}
    </div>
  );
};

export default NoteList;