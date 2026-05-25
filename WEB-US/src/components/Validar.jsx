import Encabezado from "./Encabezado"
import Footer from "./Footer"
import TablaValidar from "./TablaValidar"
import BotonVolverInicio from "./BotonVolverInicio"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
export default function Validar() {
    const sesion = localStorage.getItem('rol')
    const navegar = useNavigate()
    useEffect(()=>{
      if(sesion !== 'Supervisor'){
        return navegar('/')
    }
    })
    
  return (
    <div className="inicio">
      <Encabezado />
      <BotonVolverInicio />
      <h1 className="titulo-menu titulo-menu-secundario">Validar Marcas</h1>
      <TablaValidar />
      <Footer />
    </div>
  )
}
