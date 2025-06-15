import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
import { deleteNote } from "../../services/noteService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation<Note, Error, number>({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notesList'] }); 
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });

  const handleDelete = (id: number) => {
    mutation.mutate(id);
  };

  return (
  <ul className={css.list}>{notes.map((note) => (
    <li key={note.id} className={css.listItem}>
      <h2 className={css.title}>{note.title}</h2>
      <p className={css.content}>{note.content}</p>
      <div className={css.footer}>
        <span className={css.tag}>{note.tag}</span>
          <button className={css.button} onClick={() => handleDelete(note.id)}>Delete</button>
      </div>
    </li>
      ))}
  </ul>
  );
}
