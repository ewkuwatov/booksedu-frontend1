import { useDispatch, useSelector } from 'react-redux'
import { selectAuth, selectKafedra } from '../../../store'
import { useCrud } from '../../../hooks/useCrud'
import {
  fetchAddKafedrasThunk,
  fetchAllKafedrasThunk,
  fetchUpdateKafedrasThunk,
} from '../../../features/admins/kafedraSlice'
import { useEffect, useState } from 'react'
import Button from '../../../components/UI/Button'
import Input from '../../../components/UI/Input'
import { useTranslation } from 'react-i18next'
import { usePagination } from '../../../hooks/usePagination'

const AdminKafedra = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { items: kafedras } = useSelector(selectKafedra)
  const { user } = useSelector(selectAuth)
  const [filtered, setFiltered] = useState([])

  const {
    form,
    setForm,
    openForm,
    setOpenForm,
    editingId,
    startEditing,
    handleSubmit,
    resetForm,
  } = useCrud({
    initialForm: {
      name: '',
      university_id: user?.university_id ?? null,
    },
    fetchAll: () => dispatch(fetchAllKafedrasThunk()).unwrap(),
    add: (data) => dispatch(fetchAddKafedrasThunk(data)).unwrap(),
    update: (id, data) =>
      dispatch(fetchUpdateKafedrasThunk({ id, updated: data })).unwrap(),
  })

  useEffect(() => {
    dispatch(fetchAllKafedrasThunk()).unwrap()
  }, [dispatch])

  useEffect(() => {
    if (kafedras.length > 0 && user?.university_id) {
      setFiltered(
        kafedras.filter((k) => k.university_id === user.university_id)
      )
    }
  }, [kafedras, user])

  // === ПАГИНАЦИЯ ===
  const { page, maxPage, currentData, next, prev, goTo } = usePagination(
    filtered,
    10
  )

  return (
    <div>
      <h1>{t('kafedras')}</h1>

      <Button
        onClick={() => {
          resetForm()
          setOpenForm(true)
        }}
      >
        {t('add')}
      </Button>

      {openForm && (
        <form onSubmit={handleSubmit}>
          <Input
            value={form.name}
            placeholder={t('kafedra_name')}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Button type={'submit'}>{editingId ? t('save') : t('add')}</Button>

          <Button
            type="button"
            onClick={() => {
              resetForm()
              setOpenForm(false)
            }}
          >
            {t('back')}
          </Button>
        </form>
      )}

      <table className="kafedra-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{t('kafedras')}</th>
            <th>{t('action')}</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((k, index) => (
            <tr key={k.id}>
              <td>{index + 1}</td>
              <td>{k.name}</td>
              <td>
                <Button onClick={() => startEditing(k)}>{t('edit')}</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* ПАГИНАЦИЯ */}
      <div className="pagination">
        <button onClick={prev} disabled={page === 1}>
          ←
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
          →
        </button>
      </div>
    </div>
  )
}

export default AdminKafedra
