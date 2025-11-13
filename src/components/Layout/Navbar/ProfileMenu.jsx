import { Link } from 'react-router-dom'
import { User, ShieldUser, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ProfileMenu = ({ user, handleLogout }) => {
  const { t } = useTranslation()

  return (
    <div className="profilNav">
      <ul>
        <li>
          <Link to="/admin-administration">
            <User />
            <p className="profileNavSpan">{t('profile')}</p>
          </Link>
        </li>
        {user && (
          <>
            <li>
              <Link to="/admin-panel">
                <ShieldUser />
                <p className="profileNavSpan">{t('admin_cabinet')}</p>
              </Link>
            </li>
            <hr />
            <li>
              <LogOut />
              <button onClick={handleLogout}>
                <p>{t('logout') || 'Logout'}</p>
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  )
}

export default ProfileMenu
