// client/src/components/NoteForm.tsx
import React, { useState, useEffect } from 'react';
import { NoteFormData, Note } from '../types';
import { createNote, updateNote } from '../services/api';
import './NoteForm.css';

interface NoteFormProps {
  onNoteCreated: () => void;
  onNoteUpdated: () => void;
  onCancelEdit: () => void;
  noteToEdit: Note | null;
}

const NoteForm: React.FC<NoteFormProps> = ({ 
  onNoteCreated, 
  onNoteUpdated, 
  onCancelEdit, 
  noteToEdit 
}) => {
  const initialFormState: NoteFormData = {
    title: '',
    content: '',
    category: 'Other'
  };

  const [formData, setFormData] = useState<NoteFormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (noteToEdit) {
      setFormData({
        title: noteToEdit.title,
        content: noteToEdit.content,
        category: noteToEdit.category
      });
    } else {
      setFormData(initialFormState);
    }
  }, [noteToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      if (noteToEdit) {
        await updateNote(noteToEdit._id, formData);
        onNoteUpdated();
      } else {
        await createNote(formData);
        setFormData(initialFormState);
        onNoteCreated();
      }
    } catch (err) {
      setError('Failed to save note');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (noteToEdit) {
      onCancelEdit();
    } else {
      setFormData(initialFormState);
    }
    setError(null);
  };

  return (
    <div className="note-form-container">
      <h2>{noteToEdit ? 'Edit Note' : 'Create Note'}</h2>
      
      <form onSubmit={handleSubmit} className="note-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Ideas">Ideas</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Enter note content"
            rows={6}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={handleCancel} 
            className="cancel-button"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : noteToEdit ? 'Update Note' : 'Create Note'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;