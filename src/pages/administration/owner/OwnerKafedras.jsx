import { useDispatch, useSelector } from 'react-redux'
import { useCrud } from '../../../hooks/useCrud'
import { selectKafedra, selectUniver } from '../../../store'
import {
  fetchAddKafedrasThunk,
  fetchAllKafedrasThunk,
  fetchDeleteKafedrasThunk,
  fetchUpdateKafedrasThunk,
} from '../../../features/admins/kafedraSlice'
import { useEffect, useState } from 'react'
import { fetchAllUniverThunk } from '../../../features/admins/univerSlice'
import Input from '../../../components/UI/Input'
import { usePagination } from '../../../hooks/usePagination'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, Pencil, Trash } from 'lucide-react'

const OwnerKafedras = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { items: kafedras } = useSelector(selectKafedra)
  const { items: univers } = useSelector(selectUniver)

  const [filterUniver, setFilterUniver] = useState('')

  const {
    form,
    setForm,
    openForm,
    setOpenForm,
    editingId,
    startEditing,
    handleSubmit,
    handleDelete,
    resetForm,
  } = useCrud({
    initialForm: { name: '', university_id: null },
    fetchAll: () => dispatch(fetchAllKafedrasThunk()).unwrap(),
    add: (data) => dispatch(fetchAddKafedrasThunk(data)).unwrap(),
    update: (id, data) =>
      dispatch(fetchUpdateKafedrasThunk({ id, updated: data })).unwrap(),
    remove: (id) => dispatch(fetchDeleteKafedrasThunk(id)).unwrap(),
  })

  useEffect(() => {
    dispatch(fetchAllUniverThunk()).unwrap()
  }, [dispatch])

  const filtered = filterUniver
    ? kafedras.filter((d) => d.university_id === Number(filterUniver))
    : kafedras

  // === ПАГИНАЦИЯ ===
  const { page, maxPage, currentData, next, prev, goTo } = usePagination(
    filtered,
    10
  )

  return (
    <div className="kafedra-admin">
      {/* Кнопка добавить */}
      <button
        onClick={() => {
          resetForm()
          setOpenForm(true)
        }}
        className="primary-btn"
      >
        {t('add')}
      </button>

      {/* МОДАЛКА */}
      {openForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="kafedra-form">
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t('kafedra_name')}
            />

            <select
              value={form.university_id ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  university_id: e.target.value ? Number(e.target.value) : null,
                })
              }
            >
              <option value="">{t('unattached')}</option>
              {univers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>

            <button type={'submit'}>{editingId ? t('save') : t('add')}</button>
            <button
              type="button"
              onClick={() => {
                resetForm()
                setOpenForm(false)
              }}
            >
              {t('back')}
            </button>
          </form>
        </div>
      )}

      {/* ФИЛЬТР */}
      <div className="filter-block">
        <select
          value={filterUniver}
          onChange={(e) => setFilterUniver(e.target.value)}
        >
          <option value="">{t('all_univers')}</option>
          {univers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      {/* ТАБЛИЦА */}
      <table className="kafedra-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{t('kafedras')}</th>
            <th>{t('universities')}</th>
            <th>{t('action')}</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((k, index) => (
            <tr key={k.id}>
              <td>{(page - 1) * 10 + index + 1}</td>
              <td>{k.name}</td>
              <td>
                {univers.find((u) => u.id === k.university_id)?.name || '-'}
              </td>
              <td>
                <button onClick={() => startEditing(k)}><Pencil /></button>
                <button onClick={() => handleDelete(k.id)}>
                  <Trash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ПАГИНАЦИЯ */}
      <div className="pagination">
        <button onClick={prev} disabled={page === 1}>
          <ChevronLeft />
        </button>

        {[...Array(maxPage)].map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i + 1)}
            className={page === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}

        <button onClick={next} disabled={page === maxPage}>
          <ChevronRight />
        </button>
      </div>
    </div>
  )
}

export default OwnerKafedras
