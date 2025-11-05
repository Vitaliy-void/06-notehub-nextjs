import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

const PER_PAGE = 12;

export default async function NotesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const page = Math.max(1, Number(searchParams.page ?? "1"));
  const search = (searchParams.search ?? "").trim();

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ["notes", page, PER_PAGE, search],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search }),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient initialPage={page} initialSearch={search} perPage={PER_PAGE} />
    </HydrationBoundary>
  );
}
