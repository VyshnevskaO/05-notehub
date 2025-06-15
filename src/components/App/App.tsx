import css from "./App.module.css"
import NoteList from "../NoteList/NoteList"
import SearchBox from "../SearchBox/SearchBox"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { fetchNotes } from "../../services/noteService"
import { useState } from "react"
import Pagination from "../Pagination/Pagination"
import { useDebouncedCallback } from "use-debounce"
import NoteModal from "../NoteModal/NoteModal"



export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
 
  const { data } = useQuery({
    queryKey: ['notesList', currentPage, searchQuery],
    queryFn: () => fetchNotes({ page: currentPage, query: searchQuery }),
    placeholderData: keepPreviousData,
  })

  const handleInputChange=(value: string) => {
    setInputValue(value);
    updateSearchQuery(value);
}

  const updateSearchQuery = useDebouncedCallback((value:string)=> {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 300
);

  const totalPages = data?.totalPages ?? 0;


  return (
 
   <div className={css.app}>
	   <header className={css.toolbar}>
       <SearchBox value={inputValue} onChange={handleInputChange} />
       {totalPages > 1 && <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />}
        <button className={css.button} onClick={openModal}>Create note +</button>
        {isModalOpen && <NoteModal onClose={closeModal} />}
      </header>
      {data?.notes && data.notes.length > 0 && <NoteList noteList={data?.notes} />}
      
        
   </div>
  )
}