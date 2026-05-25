import { useParams } from "react-router-dom";
import Encabezado from "./Encabezado";
import Footer from "./Footer";
import FormularioHorario from "./FormularioHorario";
import BotonVolverHorario from "./BotonVolverHorario"

export default function GestionHorario() {
  const nombre = useParams().nombre
  return (
    <div className="inicio">
    <Encabezado />
    <BotonVolverHorario />
    <FormularioHorario nombre={nombre}/>
    <Footer />
    </div>
  )
}
