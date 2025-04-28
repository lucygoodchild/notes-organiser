import axios from 'axios';
import { Note, NoteFormData, SearchResult } from '../types';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

export const getNotes = async (): Promise<Note[]> => {
  const response = await api.get('/notes');
  return response.data;
};

export const getNote = async (id: string): Promise<Note> => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (noteData: NoteFormData): Promise<Note> => {
  const response = await api.post('/notes', noteData);
  return response.data;
};

export const updateNote = async (id: string, noteData: Partial<NoteFormData>): Promise<Note> => {
  const response = await api.put(`/notes/${id}`, noteData);
  return response.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await api.delete(`/notes/${id}`);
};

export const searchNotes = async (query: string): Promise<Note[]> => {
  const response = await api.get(`/notes/search/${query}`);
  return response.data;
};

export const naturalLanguageSearch = async (query: string): Promise<SearchResult> => {
  const response = await api.post('/nlq', { query });
  return response.data;
};