import css from "./App.module.css"
import NoteList from "../NoteList/NoteList"
import SearchBox from "../SearchBox/SearchBox"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { fetchNotes } from "../../services/noteService"
import { useState } from "react"
import Pagination from "../Pagination/Pagination"
import { useDebounce } from "use-debounce" 
import NoteModal from "../NoteModal/NoteModal"

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 300); 

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data } = useQuery({
    queryKey: ['notesList', currentPage, debouncedSearchQuery],
    queryFn: () => fetchNotes({ page: currentPage, query: debouncedSearchQuery }),
    placeholderData: keepPreviousData,
  });

  const handleInputChange = (value: string) => {
    setSearchQuery(value);      
    setCurrentPage(1);           
  }

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={handleInputChange} />
        {totalPages > 1 && <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />}
        <button className={css.button} onClick={openModal}>Create note +</button>
        {isModalOpen && <NoteModal onClose={closeModal} />}
      </header>

      {data?.notes && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  )
}
