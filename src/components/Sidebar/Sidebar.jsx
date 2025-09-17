// src/components/Sidebar/Sidebar.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  BiChevronLeft,
  BiChevronRight,
  BiHome,
  BiLogOut,
  BiMenu,
  BiChevronDown,
  BiChevronUp,
  BiPackage,
  BiSolidUserVoice,
} from 'react-icons/bi'
// ❌ Eliminado: AuthContext, usePermisos
import './Sidebar.css'

const Sidebar = ({ onToggleCollapse }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
      if (window.innerWidth > 768) {
        setIsMobileOpen(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Mantener abierto el submenu si estás en /gestion-bodega
  useEffect(() => {
    if (['/gestion-bodega'].includes(location.pathname)) {
      setIsSubmenuOpen(true)
    }
  }, [location.pathname])

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen)
    } else {
      const newCollapsed = !isCollapsed
      setIsCollapsed(newCollapsed)
      if (onToggleCollapse) onToggleCollapse(newCollapsed)
    }
  }

  const toggleSubmenu = () => setIsSubmenuOpen(prev => !prev)
  const handleLinkClick = () => {
    if (isMobile) setIsMobileOpen(false)
  }

  // Como ya no hay login ni sesión, esto solo te lleva al home.
  const handleLogout = () => {
    navigate('/home')
  }

  return (
    <div className='sidebar-container'>
      {isMobile && (
        <div className='mobile-menu-button' onClick={toggleSidebar}>
          <BiMenu size={30} />
        </div>
      )}

      <nav
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${
          isMobileOpen ? 'open' : ''
        }`}
      >
        <div className='sidebar-top'>
          <div className='logo-wrapper'>
            <img src='/Genika.webp' alt='Logo Empresa' className='logo-image' />
            <p
              className={`sidebar-subtitle ${
                isCollapsed && !isMobileOpen ? 'hide-text' : ''
              }`}
            >
              <span className='by-text'>By:</span>{' '}
              <span className='fastway-text'>Fastwaysas</span>
            </p>
          </div>
        </div>

        <div className='sidebar-links'>
          <h6>Menú</h6>
          <ul>
            {/* 🏠 Home (/home) */}
            <li className={location.pathname === '/home' ? 'active' : ''}>
              <Link to='/home' onClick={handleLinkClick}>
                <BiSolidUserVoice size={20} />
                <span
                  className={`${
                    isCollapsed && !isMobileOpen ? 'hide-text' : ''
                  }`}
                >
                  Home
                </span>
              </Link>
            </li>

            {/* Bodega (submenu con una sola opción) */}
            <li className={`has-submenu ${isSubmenuOpen ? 'open' : ''}`}>
              <div className='submenu-toggle' onClick={toggleSubmenu}>
                <div className='submenu-title'>
                  <BiHome size={20} />
                  <span
                    className={`${
                      isCollapsed && !isMobileOpen ? 'hide-text' : ''
                    }`}
                  >
                    Bodega
                  </span>
                </div>
                <span className='chevron-icon'>
                  {isSubmenuOpen ? (
                    <BiChevronUp size={16} />
                  ) : (
                    <BiChevronDown size={16} />
                  )}
                </span>
              </div>

              <ul className='submenu'>
                <li
                  className={
                    location.pathname === '/gestion-bodega' ? 'active' : ''
                  }
                >
                  <Link to='/gestion-bodega' onClick={handleLinkClick}>
                    <BiPackage size={18} />
                    <span>Inventario</span>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div className='sidebar-bottom'>
          <div className='profile-logout'>
            <button className='logout' onClick={handleLogout} title='Inicio'>
              <BiLogOut size={24} />
            </button>
          </div>

          {/* ❌ Eliminado el bloque de usuario (no hay Auth) */}
        </div>
      </nav>

      {!isMobile && (
        <div className='toggle-tab' onClick={toggleSidebar}>
          {isCollapsed ? (
            <BiChevronRight size={24} />
          ) : (
            <BiChevronLeft size={24} />
          )}
        </div>
      )}
    </div>
  )
}

export default Sidebar
