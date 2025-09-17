// src/pages/GestionBodega/GestionBodega.jsx
import { useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import MenuGestionBodega from '../../components/GestionBodega/MenuGestionBodega/MenuGestionBodega'
import SeccionDinamica from '../../components/GestionBodega/SeccionDinamica/SeccionDinamica'
import './GestionBodega.css'

const GestionBodega = () => {
  const [selectedSection, setSelectedSection] = useState('Dashboard') // empieza en Dashboard
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className={`layout ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className='main-content'>
        <MenuGestionBodega
          selectedSection={selectedSection}
          onSelectSection={setSelectedSection}
        />
        <SeccionDinamica selectedSection={selectedSection} />
      </div>
    </div>
  )
}

export default GestionBodega
