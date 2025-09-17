// src/pages/Home/Home.jsx
import Sidebar from '../../components/Sidebar/Sidebar'
import './Home.css'

export default function Home() {
  return (
    <section className='layout'>
      <Sidebar />
      <div className='body'>
        <h2>Hola</h2>
      </div>
    </section>
  )
}
