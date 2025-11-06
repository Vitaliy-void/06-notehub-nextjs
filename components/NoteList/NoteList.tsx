"use client";
import Link from "next/link";
import css from "./NoteList.module.css";
import type { Note } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";

export interface NoteListProps {
  items: Note[];
}

export default function NoteList({ items }: NoteListProps) {
  const qc = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });

  if (!items.length) return null;

  return (
    <ul className={css.list}>
      {items.map((n) => (
        <li key={n.id} className={css.listItem}>
          <h2 className={css.title}>{n.title}</h2>
          <p className={css.content}>{n.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{n.tag}</span>
            <Link className={css.link} href={`/notes/${n.id}`}>View details</Link>
            <button className={css.button} disabled={isPending} onClick={() => mutate(n.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
