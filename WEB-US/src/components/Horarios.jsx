import Encabezado from "./Encabezado"
import Footer from "./Footer"
import BotonVolverInicio from "./BotonVolverInicio"
import TablaHorarios from "./TablaHorarios"
export default function Horarios() {
  return (
    <div className="inicio">
          <Encabezado />
          <BotonVolverInicio />
          <h1 className="titulo-menu titulo-menu-secundario">Horarios</h1>
          <TablaHorarios />
          <Footer />
        </div>
  )
}
