import { Link } from "react-router-dom";


export default function BotonesSupervisor() {

  return (
    <div className="campo-botones campo-botones-supervisor">
      <Link to='/validar'>
        <button className="salida">Validar Marcas</button>
      </Link>
      <Link to='/reporte'>
      <button className="pausa">Ver Mis Reportes</button>
      </Link>
    </div>
  )
}
