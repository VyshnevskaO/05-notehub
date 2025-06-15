import axios from "axios";
import type Note from "../types/note";

interface FetchNotesProps {
    page: number;
    query?: string;
}

interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

interface CreateNoteProps {
  title: string;
  content?: string;
  tag: string;
}



const API_KEY = import.meta.env.VITE_NOTEHUB_TOKEN as string;

export const fetchNotes = async ({ page, query }: FetchNotesProps): Promise<FetchNotesResponse> => {
    const url = new URL("https://notehub-public.goit.study/api/notes");
    url.searchParams.append("page", `${page}`);
    url.searchParams.append("perPage", "12");
    if (query) {
      url.searchParams.append("search", query);
    }
  
    const res = await axios.get<FetchNotesResponse>(`${url}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
  
    return res.data;
};
  

export const createNote = async ({ title, content, tag }: CreateNoteProps): Promise<void> => {
  await axios.post(
    "https://notehub-public.goit.study/api/notes",
    {
      title,
      content,
      tag,
    },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await axios.delete<Note>(`https://notehub-public.goit.study/api/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return res.data;
};
