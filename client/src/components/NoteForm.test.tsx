import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NoteForm from './NoteForm';
import { Note } from './../types';

describe('NoteForm Component', () => {
  const mockOnNoteCreated = jest.fn();
  const mockOnNoteUpdated = jest.fn();
  const mockOnCancelEdit = jest.fn();

  const defaultProps = {
    onNoteCreated: mockOnNoteCreated,
    onNoteUpdated: mockOnNoteUpdated,
    onCancelEdit: mockOnCancelEdit,
    noteToEdit: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the form with default values for creating a note', () => {
    render(<NoteForm {...defaultProps} />);

    expect(screen.getByText('Create Note')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter title')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter note content')).toHaveValue('');
    expect(screen.getByLabelText('Category')).toHaveValue('Other');
  });

  test('renders the form with values for editing a note', () => {
    const noteToEdit: Note = {
        _id: '1',
        title: 'Test Note',
        content: 'This is a test note.',
        category: 'Work',
        sentiment: 'Neutral',
        summary: '',
        createdAt: '',
        updatedAt: ''
    };

    render(<NoteForm {...defaultProps} noteToEdit={noteToEdit} />);

    expect(screen.getByText('Edit Note')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter title')).toHaveValue('Test Note');
    expect(screen.getByPlaceholderText('Enter note content')).toHaveValue('This is a test note.');
    expect(screen.getByLabelText('Category')).toHaveValue('Work');
  });

  test('displays an error message when title and content are empty', async () => {
    render(<NoteForm {...defaultProps} />);

    fireEvent.click(screen.getByText('Create Note'));

    expect(await screen.findByText('Title and content are required')).toBeInTheDocument();
  });

  test('calls onNoteCreated when creating a new note', async () => {
    render(<NoteForm {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText('Enter title'), { target: { value: 'New Note' } });
    fireEvent.change(screen.getByPlaceholderText('Enter note content'), { target: { value: 'This is a new note.' } });
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Personal' } });

    fireEvent.click(screen.getByText('Create Note'));

    expect(mockOnNoteCreated).toHaveBeenCalled();
  });

  test('calls onNoteUpdated when updating an existing note', async () => {
    const noteToEdit: Note = {
        _id: '1',
        title: 'Test Note',
        content: 'This is a test note.',
        category: 'Work',
        sentiment: 'Neutral',
        summary: '',
        createdAt: '',
        updatedAt: ''
    };

    render(<NoteForm {...defaultProps} noteToEdit={noteToEdit} />);

    fireEvent.change(screen.getByPlaceholderText('Enter title'), { target: { value: 'Updated Note' } });
    fireEvent.click(screen.getByText('Update Note'));

    expect(mockOnNoteUpdated).toHaveBeenCalled();
  });

  test('calls onCancelEdit when canceling edit mode', () => {
    const noteToEdit: Note = {
        _id: '1',
        title: 'Test Note',
        content: 'This is a test note.',
        category: 'Work',
        sentiment: 'Neutral',
        summary: '',
        createdAt: '',
        updatedAt: ''
    };

    render(<NoteForm {...defaultProps} noteToEdit={noteToEdit} />);

    fireEvent.click(screen.getByText('Cancel'));

    expect(mockOnCancelEdit).toHaveBeenCalled();
  });

  test('resets the form when canceling a new note', () => {
    render(<NoteForm {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText('Enter title'), { target: { value: 'New Note' } });
    fireEvent.change(screen.getByPlaceholderText('Enter note content'), { target: { value: 'This is a new note.' } });

    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.getByPlaceholderText('Enter title')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter note content')).toHaveValue('');
    expect(screen.getByLabelText('Category')).toHaveValue('Other');
  });
});