import BotonVolverInicio from "./BotonVolverInicio";
import Encabezado from "./Encabezado";
import Footer from "./Footer";
import TablaReportesAdmin from "./TablaReportesAdmin";

export default function ReportesAdministrador() {
  return (
    <div className="inicio">
          <Encabezado />
          <BotonVolverInicio />
          <h1 className="titulo-menu titulo-menu-secundario">Reportes</h1>
          <TablaReportesAdmin />
          <Footer />
        </div>
  )
}
