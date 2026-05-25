import { Link } from "react-router-dom";
import AsistenciaDiaria from "./AsistenciaDiaria";

export default function BotonesAdministrador() {
  return (
    <div className="campo-administrador">
      <AsistenciaDiaria />
    <div className="campo-botones">
      <Link to='/horarios'>
      <button className="pausa">Horarios</button>
      </Link>
      <Link to='/reporte/export'>
      <button className="salida">Reportes</button>
      </Link>
    </div>
    </div>
  )
}
