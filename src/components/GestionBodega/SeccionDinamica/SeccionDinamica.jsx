// src/components/SeccionDinamica/SeccionDinamica.jsx
import './SeccionDinamica.css'
import Analitica from '../analitica/Analitica'

const SeccionDinamica = ({ selectedSection }) => {
  let contenido

  switch (selectedSection) {
    case 'Dashboard':
      contenido = <Analitica />
      break
    default:
      contenido = <h2>Hola</h2>
  }

  return <div className='gestion-bodega-seccion'>{contenido}</div>
}

export default SeccionDinamica
