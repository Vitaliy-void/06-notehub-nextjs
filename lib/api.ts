import axios from "axios";
import type { AxiosInstance } from "axios";
import type { Note, NoteTag } from "@/types/note";

const API = "https://notehub-public.goit.study/api";
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN as string | undefined;

if (!token) {
  console.warn("NEXT_PUBLIC_NOTEHUB_TOKEN is not set. API requests will fail.");
}

const http: AxiosInstance = axios.create({
  baseURL: API,
  headers: token ? { Authorization: `Bearer ${token}` } : undefined,
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteBody {
  title: string;
  content?: string;
  tag: NoteTag;
}

export async function fetchNotes(
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search = "" } = params;
  const res = await http.get<FetchNotesResponse>("/notes", {
    params: { page, perPage, ...(search ? { search } : {}) },
  });
  return res.data;
}

export async function createNote(body: CreateNoteBody): Promise<Note> {
  const res = await http.post<Note>("/notes", body);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await http.delete<Note>(`/notes/${id}`);
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await http.get<Note>(`/notes/${id}`);
  return res.data;
}
