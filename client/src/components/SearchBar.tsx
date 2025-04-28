import React, { useState } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  searchMode: 'basic' | 'nlq';
  onToggleMode: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchMode, onToggleMode }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} role="form">
        <div className="search-input-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              searchMode === "basic"
                ? "Search notes..."
                : "Try: Find my work notes from last week"
            }
            className="search-input"
          />

          {searchQuery && (
            <button
              type="button"
              className="clear-button"
              onClick={handleClear}
            >
              ×
            </button>
          )}
        </div>

        <div className="search-controls">
          <button type="submit" className="search-button">
            Search
          </button>

          <button
            type="button"
            className="toggle-mode-button"
            onClick={onToggleMode}
          >
            {searchMode === "basic" ? "Use NLQ" : "Basic Search"}
          </button>
        </div>
      </form>

      {searchMode === "nlq" && (
        <div className="nlq-help">
          <p>Try natural language queries like:</p>
          <ul>
            <li>"Find my work notes from last week"</li>
            <li>"Show me all positive notes about ideas"</li>
            <li>"Find notes written today"</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;