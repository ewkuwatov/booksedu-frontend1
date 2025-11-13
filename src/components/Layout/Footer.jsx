import { PhoneCall, AtSign, MapPin } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebook,
  faInstagram,
  faTelegram,
} from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/logo_2_23C1EHF.png'

const Footer = () => {
  const { t } = useTranslation()
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Категории */}
        <div className="footer-section">
          <h3 className="footer-title">{t('categories')}</h3>
          <ul className="footer-list">
            <li>
              <Link to="/universities">{t('universities')}</Link>
            </li>
            <li>
              <Link to="/in-process">{t('directions')}</Link>
            </li>
            <li>
              <Link to="/in-process">{t('news')}</Link>
            </li>
            <li>
              <Link to="/">{t('online_test')}</Link>
            </li>
            <li>
              <Link to="/">{t('articles')}</Link>
            </li>
          </ul>
        </div>

        {/* Контакты */}
        <div className="footer-section">
          <h3 className="footer-title">{t('contact')}</h3>
          <ul className="footer-list contact-list">
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

        {/* Логотип и соцсети */}
        <div className="footer-section footer-brand">
          <Link to="/" className="footer-logo">
            <img src={logo} alt="Logo" />
          </Link>
          <div className="footer-socials">
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
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Edu.uz. {t('all_rights_reserved')}
        </p>
      </div>
    </footer>
  )
}

export default Footer
