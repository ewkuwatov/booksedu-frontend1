import { useState, useMemo } from 'react' 

export function usePagination(items, perPage = 10) {
  const [page, setPage] = useState(1)

  const maxPage = Math.ceil(items.length / perPage) 

  const currentData = useMemo(() => {
    const start = (page - 1) * perPage
    return items.slice(start, start + perPage)
  }, [items, page, perPage]) 

  const next = () => setPage((p) => Math.min(p + 1, maxPage))
  const prev = () => setPage((p) => Math.max(p - 1, 1))
  const goTo = (p) => setPage(Math.min(Math.max(p, 1), maxPage)) 
  
  return {
    page,
    maxPage,
    currentData,
    next,
    prev,
    goTo, 
  }
}