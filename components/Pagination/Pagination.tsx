"use client";
import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

export interface PaginationProps {
  pageCount: number;   // total pages
  currentPage: number; // 1-based
  onPageChange: (page: number) => void;
}

export default function Pagination({ pageCount, currentPage, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null;
  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      previousLabel={"<"}
      nextLabel={">"}
      containerClassName={css.pagination}
      pageClassName={css.page}
      activeClassName={css.active}
      previousClassName={css.prev}
      nextClassName={css.next}
      disabledClassName={css.disabled}
    />
  );
}
