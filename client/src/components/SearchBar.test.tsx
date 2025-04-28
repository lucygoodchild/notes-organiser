import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();
  const mockOnToggleMode = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the search bar with basic mode placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} searchMode="basic" onToggleMode={mockOnToggleMode} />);

    expect(screen.getByPlaceholderText('Search notes...')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Use NLQ')).toBeInTheDocument();
  });

  test('renders the search bar with NLQ mode placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} searchMode="nlq" onToggleMode={mockOnToggleMode} />);

    expect(screen.getByPlaceholderText('Try: Find my work notes from last week')).toBeInTheDocument();
    expect(screen.getByText('Basic Search')).toBeInTheDocument();
  });

  test('calls onSearch when the search form is submitted', () => {
    render(<SearchBar onSearch={mockOnSearch} searchMode="basic" onToggleMode={mockOnToggleMode} />);

    const input = screen.getByPlaceholderText('Search notes...');
    fireEvent.change(input, { target: { value: 'Test Query' } });

    fireEvent.submit(screen.getByRole('form'));

    expect(mockOnSearch).toHaveBeenCalledWith('Test Query');
  });

  test('clears the search query when the clear button is clicked', () => {
    render(<SearchBar onSearch={mockOnSearch} searchMode="basic" onToggleMode={mockOnToggleMode} />);

    const input = screen.getByPlaceholderText('Search notes...');
    fireEvent.change(input, { target: { value: 'Test Query' } });

    const clearButton = screen.getByText('×');
    fireEvent.click(clearButton);

    expect(input).toHaveValue('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  test('calls onToggleMode when the toggle mode button is clicked', () => {
    render(<SearchBar onSearch={mockOnSearch} searchMode="basic" onToggleMode={mockOnToggleMode} />);

    const toggleButton = screen.getByText('Use NLQ');
    fireEvent.click(toggleButton);

    expect(mockOnToggleMode).toHaveBeenCalled();
  });

  test('renders NLQ help section when in NLQ mode', () => {
    render(<SearchBar onSearch={mockOnSearch} searchMode="nlq" onToggleMode={mockOnToggleMode} />);

    expect(screen.getByText('Try natural language queries like:')).toBeInTheDocument();
    expect(screen.getByText('"Find my work notes from last week"')).toBeInTheDocument();
    expect(screen.getByText('"Show me all positive notes about ideas"')).toBeInTheDocument();
    expect(screen.getByText('"Find notes written today"')).toBeInTheDocument();
  });
});