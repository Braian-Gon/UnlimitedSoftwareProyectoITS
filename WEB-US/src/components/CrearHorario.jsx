import { useNavigate } from "react-router-dom"
import BotonVolverHorario from "./BotonVolverHorario"
import FormularioCrearHorario from "./FormularioCrearHorario"
import Encabezado from "./Encabezado"
import Footer from "./Footer"
import { useEffect } from "react"

export default function CrearHorario() {
    const sesion = localStorage.getItem('rol')
    const navegar = useNavigate()
    useEffect(()=>{
      if(sesion !== 'Administrador'){
        return navegar('/')
    }
    })
  return (
    <div className="inicio">
        <Encabezado />
        <BotonVolverHorario />
        <FormularioCrearHorario />
        <Footer />
    </div>
  )
}
