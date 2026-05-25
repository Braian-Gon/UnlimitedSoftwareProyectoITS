import BotonVolverInicio from "./BotonVolverInicio";
import Encabezado from "./Encabezado";
import Footer from "./Footer";
import TablaReporteSupervisor from "./TablaReporteSupervisor";

export default function ReporteSupervisor() {
  return (
    <div className="inicio">
      <Encabezado />
      <BotonVolverInicio />
      <h1 className="titulo-menu titulo-menu-secundario">Reporte Semanal</h1>
      <TablaReporteSupervisor />
      <Footer />
    </div>
  )
}
