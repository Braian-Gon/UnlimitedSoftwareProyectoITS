import { Link } from "react-router-dom";

export default function BotonVolverHorario() {
  return (
    <div>
      <Link to='/horarios'>
        <button className="boton-volver"><i className="bi bi-backspace-fill"></i> Volver</button>
      </Link>
    </div>
  )
}
