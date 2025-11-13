import { Link } from 'react-router-dom'
import { Menu, X, PhoneCall, AtSign, MapPin, Languages } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebook,
  faInstagram,
  faTelegram,
} from '@fortawesome/free-brands-svg-icons'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const PhoneHeader = ({ logo }) => {
  const { t, i18n } = useTranslation()
  const [openNav, setOpenNav] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    setShowLangMenu(false)
  }

  return (
    <div className="phoneHeader">
      <div className="phoneTopBar">
        {/* Лого */}
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>

        {/* Кнопка */}
        <button onClick={() => setOpenNav(!openNav)} className="menuBtn">
          {openNav ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Overlay */}
      {openNav && <div className="overlay" onClick={() => setOpenNav(false)} />}

      {/* Навигация */}
      <div className={`sideMenu ${openNav ? 'open' : ''}`}>
        <div className="menuHeader">
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </div>
          <button onClick={() => setOpenNav(false)} className="menuBtn">
            <X size={28} />
          </button>
        </div>

        {/* Language Switch */}
        <div
          className="language"
          onClick={() => setShowLangMenu(!showLangMenu)}
        >
          <Languages size={24} strokeWidth={1.75} />
          <p>{t('languages')}</p>
          {showLangMenu && (
            <div className="langMenu">
              <button onClick={() => changeLanguage('en')}>EN</button>
              <button onClick={() => changeLanguage('ru')}>RU</button>
              <button onClick={() => changeLanguage('uz')}>UZ</button>
            </div>
          )}
        </div>

        <ul className={`menuLinks ${openNav ? 'open' : ''}`}>
          <li>
            <Link to="/universities" onClick={() => setOpenNav(false)}>
              {t('universities')}
            </Link>
          </li>
          <li>
            <Link to="/in-process" onClick={() => setOpenNav(false)}>
              {t('directions')}
            </Link>
          </li>
          <li>
            <Link to="/in-process" onClick={() => setOpenNav(false)}>
              {t('news')}
            </Link>
          </li>
          <li>
            <Link to="/" onClick={() => setOpenNav(false)}>
              {t('online_test')}
            </Link>
          </li>
          <li>
            <Link to="/" onClick={() => setOpenNav(false)}>
              {t('articles')}
            </Link>
          </li>
        </ul>

        <div className="menuFooter">
          <h3 className="footerTitle">{t('contact')}</h3>
          <ul className="contactList">
            <li>
              <PhoneCall size={18} />
              <span>
                <p>{t('phone_label')}</p>
                <p>(+998 71) 246-10-81</p>
              </span>
            </li>
            <li>
              <AtSign size={18} />
              <span>
                <p>{t('email_label')}</p>
                <p>press@edu.uz</p>
              </span>
            </li>
            <li>
              <MapPin size={18} />
              <span>
                <p>{t('address_label')}</p>
                <p>Tashkent, Uzbekistan</p>
              </span>
            </li>
          </ul>
        </div>

        <div className="menuSocials">
          <a href="#">
            <FontAwesomeIcon icon={faTelegram} />
          </a>
          <a href="#">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="#">
            <FontAwesomeIcon icon={faFacebook} />
          </a>
        </div>

        <div className="footerBottom">
          <p>
            © {new Date().getFullYear()} Edu.uz. {t('all_rights_reserved')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PhoneHeader
