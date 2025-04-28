import React, { useState, useEffect } from 'react';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';
import SearchBar from './components/SearchBar';
import { Note } from './types';
import { getNotes, searchNotes, naturalLanguageSearch } from './services/api';
import './App.css';

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<'basic' | 'nlq'>('basic');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await getNotes();
      setNotes(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      return fetchNotes();
    }

    try {
      setLoading(true);
      let results;
      
      if (searchMode === 'basic') {
        results = await searchNotes(query);
      } else {
        const nlqResult = await naturalLanguageSearch(query);
        results = nlqResult.results;
      }
      
      setNotes(results);
      setError(null);
    } catch (err) {
      setError('Search failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteCreated = () => {
    fetchNotes();
  };

  const handleEditClick = (note: Note) => {
    setEditNote(note);
  };

  const handleCancelEdit = () => {
    setEditNote(null);
  };

  const handleNoteUpdated = () => {
    fetchNotes();
    setEditNote(null);
  };

  const handleNoteDeleted = () => {
    fetchNotes();
  };

  const toggleSearchMode = () => {
    setSearchMode(prevMode => prevMode === 'basic' ? 'nlq' : 'basic');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>My Smart Notes Organiser</h1>
      </header>
      
      <main className="app-main">
        <div className="sidebar">
          <div className="search-container">
            <SearchBar 
              onSearch={handleSearch} 
              searchMode={searchMode}
              onToggleMode={toggleSearchMode}
            />
          </div>
          
          <NoteForm 
            onNoteCreated={handleNoteCreated} 
            noteToEdit={editNote}
            onNoteUpdated={handleNoteUpdated}
            onCancelEdit={handleCancelEdit}
          />
        </div>
        
        <div className="notes-container">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <NoteList 
              notes={notes} 
              onEditClick={handleEditClick}
              onNoteDeleted={handleNoteDeleted}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;