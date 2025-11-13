import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logoutThunk } from '../../../features/auth/authSlice'
import { selectAuth } from '../../../store'
import DesctopNav from '../Navbar/DesktopNav'
import { useState } from 'react'

import logo from '../../../assets/logo_2_23C1EHF.png'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(selectAuth)

  const [openProfile, setOpenProfile] = useState(false)
  const [openContact, setOpenContact] = useState(false)

  const handleLogout = async () => {
    dispatch(logoutThunk())
    navigate('/') // чтобы не остаться на приватной странице
  }

  return (
    <nav className="nav">
      <DesctopNav
        logo={logo}
        user={user}
        openProfile={openProfile}
        setOpenProfile={setOpenProfile}
        openContact={openContact}
        setOpenContact={setOpenContact}
        handleLogout={handleLogout}
      />
      
    </nav>
  )
}

export default Navbar
