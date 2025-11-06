"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import css from "./page.module.css";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  initialPage: number;
  initialSearch: string;
  perPage: number;
}

export default function NotesClient({ initialPage, initialSearch, perPage }: Props) {
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [searchDebounced] = useDebounce(search, 500);
  const [isModal, setIsModal] = useState(false);

  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(sp.toString());
    params.set("page", String(page));
    if (searchDebounced) params.set("search", searchDebounced);
    else params.delete("search");
    router.replace(`/notes?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchDebounced]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", page, perPage, searchDebounced],
    queryFn: () => fetchNotes({ page, perPage, search: searchDebounced }),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(v) => {
            setPage(1);
            setSearch(v);
          }}
        />
        {totalPages > 1 && (
          <Pagination pageCount={totalPages} currentPage={page} onPageChange={setPage} />
        )}
        <button className={css.button} onClick={() => setIsModal(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p style={{ padding: 16 }}>Loading…</p>}
      {isError && (
        <p style={{ padding: 16, color: "crimson" }}>
          {(error as Error)?.message ?? "Request error"}
        </p>
      )}

      {notes.length ? <NoteList items={notes} /> : !isLoading && <p style={{ padding: 16 }}>No notes yet</p>}

      <Modal isOpen={isModal} onClose={() => setIsModal(false)}>
        <NoteForm onCancel={() => setIsModal(false)} />
      </Modal>
    </div>
  );
}
