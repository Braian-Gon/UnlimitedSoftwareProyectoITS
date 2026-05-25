import { useNavigate } from "react-router-dom"
import FormularioCrearUsuario from "./FormularioCrearUsuario"
import Encabezado from "./Encabezado"
import BotonVolverInicio from "./BotonVolverInicio"
import Footer from "./Footer"
import { useEffect } from "react"

export default function VentanaFormulario() {
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
        <BotonVolverInicio />
        <FormularioCrearUsuario />
        <Footer />
    </div>
  )
}
