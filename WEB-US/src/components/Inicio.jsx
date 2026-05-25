import { useEffect } from "react"
import Funcionario from "./Funcionario"
import Supervisor from "./Supervisor"
import Administrador from "./Administrador"
import 'bootstrap-icons/font/bootstrap-icons.css'
import Footer from "./Footer"
import Encabezado from "./Encabezado"
import { useNavigate } from "react-router-dom"

export default function Inicio() {
    const sesion = localStorage.getItem('rol')
    const navegar =useNavigate()
    useEffect(()=>{
      if(sesion !== 'Funcionario' && sesion !== 'Supervisor' && sesion !== 'Administrador' ){
        navegar('/login')
      }
    })
  return (
    <div className="inicio">
      <Encabezado />
      <div className="contenedor-principal">
        {sesion === 'Funcionario' && <Funcionario />}
        {sesion === 'Supervisor' && <Supervisor />}
        {sesion === 'Administrador' && <Administrador />}
      </div>
      <Footer />
    </div>
  )
}
