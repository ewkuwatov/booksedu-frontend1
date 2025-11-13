import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectAuth, selectUniver } from '../store'
import { fetchAllUniverThunk } from '../features/admins/univerSlice'

const UniversityUser = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { user } = useSelector(selectAuth)
  const { items: univers } = useSelector(selectUniver)

  useEffect(() => {
    if (!user) return
    dispatch(fetchAllUniverThunk()).unwrap()
  }, [user])

  if (!univers || univers.length === 0) return null

  // Берём последние 6
  const latestUniversities = univers.slice(-6).reverse()
  return (
    <div className="university">
      <h2>{t('universities')}</h2>
      <div className="univer-container">
        <div className="univerCard">
          {latestUniversities.map((u) => (
            <article className="card" key={u.id}>
              <div className="cardHead">
                <div className="univerName">
                  <strong>{u.name}</strong>
                  <p>{u.address}</p>
                </div>
              </div>
              <div className="cardBody">
                <p className="univerDescrip">{u.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="moreUnivers">
          <Link to="/universities" className="moreBtn">
            {t('university')} {/* Здесь можно выбрать подходящий ключ */}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UniversityUser
