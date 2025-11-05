import axios from "axios";
import type { AxiosInstance } from "axios";
import type { Note, NoteTag } from "@/types/note";

const API = "https://notehub-public.goit.study/api";
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN as string | undefined;

if (!token) {
  // попередження: без токена запити падатимуть
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
  data: Note[];
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}

export interface CreateNoteBody {
  title: string;
  content?: string;
  tag: NoteTag;
}

export interface CreateNoteResponse { data: Note; }
export interface DeleteNoteResponse { data: Note; }
export interface FetchNoteResponse { data: Note; }

export async function fetchNotes(params: FetchNotesParams = {}): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search = "" } = params;
  const resp = await http.get<FetchNotesResponse>("/notes", {
    params: { page, perPage, ...(search ? { search } : {}) },
  });
  return resp.data;
}

export async function createNote(body: CreateNoteBody): Promise<CreateNoteResponse> {
  const resp = await http.post<CreateNoteResponse>("/notes", body);
  return resp.data;
}

export async function deleteNote(id: string): Promise<DeleteNoteResponse> {
  const resp = await http.delete<DeleteNoteResponse>(`/notes/${id}`);
  return resp.data;
}

export async function fetchNoteById(id: string): Promise<FetchNoteResponse> {
  const resp = await http.get<FetchNoteResponse>(`/notes/${id}`);
  return resp.data;
}
