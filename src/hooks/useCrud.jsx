import { useEffect, useState, useCallback } from 'react'

export function useCrud({ fetchAll, add, update, remove, initialForm }) {
  const [openForm, setOpenForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialForm)

  const fetchAllMemo = useCallback(fetchAll, [])
  const addMemo = useCallback(add, [])
  const updateMemo = useCallback(update, [])
  const removeMemo = useCallback(remove, [])

  useEffect(() => {
    fetchAllMemo()
  }, [fetchAllMemo])

  const resetForm = () => {
    setForm(initialForm)
    setEditingId(null)
  }

  const startEditing = (item) => {
    setEditingId(item.id)
    setForm(item)
    setOpenForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (editingId) await updateMemo(editingId, form)
    else await addMemo(form)

    await fetchAllMemo()
    resetForm()
    setOpenForm(false)
  }

  const handleDelete = async (id) => {
    await removeMemo(id)
    await fetchAllMemo()
  }

  return {
    form,
    setForm,
    openForm,
    setOpenForm,
    editingId,
    startEditing,
    handleSubmit,
    handleDelete,
    resetForm,
  }
}
