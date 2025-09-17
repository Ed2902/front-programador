// src/App.jsx
import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

// Páginas
import Home from './pages/Home/Home'
import GestionBodega from './pages/GestionBodega/GestionBodega'

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal */}
        <Route path='/' element={<Navigate to='/home' />} />

        {/* Rutas disponibles */}
        <Route path='/home' element={<Home />} />
        <Route path='/gestion-bodega' element={<GestionBodega />} />

        {/* Catch-all para rutas no encontradas */}
        <Route
          path='*'
          element={
            <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>
              Página no encontrada
            </h2>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
