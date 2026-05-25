import { useParams } from "react-router-dom"
import Encabezado from "./Encabezado"
import Footer from "./Footer"
import FormularioMarca from "./FormularioMarca"
import BotonVolverValidar from "./BotonVolverValidar"
export default function ValidarMarca() {
  const id = useParams().id
  return (
    <div className="inicio">
      <Encabezado />
      <BotonVolverValidar />
      <div>
        <FormularioMarca id={id}/>
      </div>
      <Footer />
    </div>
  )
}
