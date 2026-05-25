import { useParams } from "react-router-dom"
import Encabezado from "./Encabezado"
import Footer from "./Footer"
import BotonVolverInicio from "./BotonVolverInicio"
import FormularioUsuario from "./FormularioUsuario"
export default function GestionarUsuario() {
    const id = useParams().id
  return (
    <div className="inicio">
        <Encabezado />
        <BotonVolverInicio />
        <div>
        <FormularioUsuario id={id}/>
        </div>
        <Footer />
    </div>
  )
}
