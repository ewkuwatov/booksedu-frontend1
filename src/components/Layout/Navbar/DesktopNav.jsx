import { Link } from 'react-router-dom'
import { Languages, PhoneCall, User } from 'lucide-react'
import ProfileMenu from './ProfileMenu'
import ContactMenu from './ContactMenu'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

const DesktopNav = ({ logo, user, handleLogout }) => {
  const { t, i18n } = useTranslation()
  const [openProfile, setOpenProfile] = useState(false)
  const [openContact, setOpenContact] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    setShowLangMenu(false)
    localStorage.setItem('lang', lng)
  }
  return (
    <div className="navigation">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      {user && (
        <div className="navMenu">
          <Link to="/InProcess">{t('universities')}</Link>
          <Link to="/InProcess">{t('directions')}</Link>
          <Link to="/InProcess">{t('news')}</Link>
          <Link to="/InProcess">{t('online_test')}</Link>
          <Link to="/InProcess">{t('articles')}</Link>
        </div>
      )}

      <div className="profilNav">
        <div
          className="language"
          onClick={() => setShowLangMenu(!showLangMenu)}
        >
          <Languages size={24} strokeWidth={1.75} />
          <p>{t('languages')}</p>
          {showLangMenu && (
            <div className="langMenu">
              <button onClick={() => changeLanguage('en')}>
                {t('English')}
              </button>
              <button onClick={() => changeLanguage('ru')}>
                {t('Russian')}
              </button>
              <button onClick={() => changeLanguage('uz')}>{t('Uzbek')}</button>
            </div>
          )}
        </div>
        <div
          className="contact"
          onClick={() => {
            setOpenContact(!openContact)
            setOpenProfile(false)
          }}
        >
          <PhoneCall size={24} strokeWidth={1.75} />
          <p>{t('contact')}</p>
        </div>
        {!user && (
          <div className="LoginNav">
            <Link className="loginBtn" to="/login">
              {t('login')}
            </Link>
          </div>
        )}
        {user && (
          <>
            <div
              className="profile"
              onClick={() => {
                setOpenProfile(!openProfile)
                setOpenContact(false)
              }}
            >
              <User size={24} strokeWidth={1.75} />
              <p>{t('profile')}</p>
            </div>
            {openProfile && (
              <ProfileMenu user={user} handleLogout={handleLogout} />
            )}
          </>
        )}

        {openContact && <ContactMenu />}
      </div>
    </div>
  )
}

export default DesktopNav
