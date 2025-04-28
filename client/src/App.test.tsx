import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import * as api from './services/api';

jest.mock('./services/api');

describe('App Component', () => {
  const mockNotes = [
    {
      _id: '1',
      title: 'First Note',
      content: 'This is the first note.',
      category: 'Work',
      sentiment: 'Positive',
      summary: '',
      createdAt: '2025-04-28T10:12:27.909Z',
      updatedAt: '2025-04-28T10:12:27.909Z',
    },
    {
      _id: '2',
      title: 'Second Note',
      content: 'This is the second note.',
      category: 'Personal',
      sentiment: 'Neutral',
      summary: '',
      createdAt: '2025-04-28T11:12:27.909Z',
      updatedAt: '2025-04-28T11:12:27.909Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (api.getNotes as jest.Mock).mockResolvedValue(mockNotes);
    (api.searchNotes as jest.Mock).mockResolvedValue([mockNotes[0]]);
    (api.naturalLanguageSearch as jest.Mock).mockResolvedValue({ results: [mockNotes[1]] });
  });

  test('renders the app and fetches notes on load', async () => {
    render(<App />);

    expect(screen.getByText('Notes App')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(async () => {
      await waitFor(() => {
        expect(screen.getByText('First Note')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Second Note')).toBeInTheDocument();
      });
    });
  });

  test('displays an error message if fetching notes fails', async () => {
    (api.getNotes as jest.Mock).mockRejectedValue(new Error('Failed to fetch notes'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch notes')).toBeInTheDocument();
    });
  });

  test('searches notes in basic mode', async () => {
    render(<App />);

    const searchInput = screen.getByPlaceholderText('Search notes...');
    fireEvent.change(searchInput, { target: { value: 'First' } });
    fireEvent.submit(searchInput);

    await waitFor(() => {
      expect(screen.getByText('First Note')).toBeInTheDocument();
      });
  
      await waitFor(() => {
        expect(screen.queryByText('Second Note')).not.toBeInTheDocument();
    });
  });

  test('searches notes in NLQ mode', async () => {
    render(<App />);

    const toggleButton = screen.getByText('Use NLQ');
    fireEvent.click(toggleButton);

    const searchInput = screen.getByPlaceholderText('Try: Find my work notes from last week');
    fireEvent.change(searchInput, { target: { value: 'Find my personal notes' } });
    fireEvent.submit(searchInput);

    await waitFor(() => {
      expect(screen.getByText('Second Note')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText('First Note')).not.toBeInTheDocument();
    });
  });

  test('creates a new note and refreshes the list', async () => {
    (api.getNotes as jest.Mock).mockResolvedValue([...mockNotes, {
      _id: '3',
      title: 'New Note',
      content: 'This is a new note.',
      category: 'Ideas',
      sentiment: 'Neutral',
      summary: '',
      createdAt: '2025-04-28T12:12:27.909Z',
      updatedAt: '2025-04-28T12:12:27.909Z',
    }]);

    render(<App />);

    const createButton = screen.getByText('Create Note');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('New Note')).toBeInTheDocument();
    });
  });

  test('edits a note and refreshes the list', async () => {
    render(<App />);

    const editButton = screen.getAllByText('Edit')[0];
    fireEvent.click(editButton);

    const titleInput = screen.getByPlaceholderText('Enter title');
    fireEvent.change(titleInput, { target: { value: 'Updated Note' } });

    const updateButton = screen.getByText('Update Note');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText('Updated Note')).toBeInTheDocument();
    });
  });

  test('deletes a note and refreshes the list', async () => {
    (api.getNotes as jest.Mock).mockResolvedValue([mockNotes[1]]);

    render(<App />);

    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('First Note')).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Second Note')).toBeInTheDocument();
    });
  });
});