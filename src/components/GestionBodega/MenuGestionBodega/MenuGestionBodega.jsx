// src/components/MenuGestionBodega/MenuGestionBodega.jsx
import './MenuGestionBodega.css'

const MenuGestionBodega = ({ selectedSection, onSelectSection }) => {
  const botones = [
    { label: 'Inventario', key: 'inventario' },
    { label: 'Movimientos', key: 'movimientos' },
    { label: 'En transfor...', key: 'transformaciones' },
    { label: 'Bodegas', key: 'bodegas' },
    { label: 'Productos', key: 'productos' },
    { label: 'Lotes', key: 'lotes' },
    { label: 'Dashboard', key: 'Dashboard' },
  ]

  return (
    <div className='menu-gestion-bodega'>
      {botones.map(btn => (
        <button
          key={btn.key}
          className={`menu-button ${
            selectedSection === btn.key ? 'active' : ''
          }`}
          onClick={() => onSelectSection(btn.key)}
        >
          {btn.label}
        </button>
      ))}
    </div>
  )
}

export default MenuGestionBodega
