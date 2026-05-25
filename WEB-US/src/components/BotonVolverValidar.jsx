import { Link } from "react-router-dom";

export default function BotonVolverValidar() {
  return (
    <div>
      <Link to='/validar'>
        <button className="boton-volver"><i className="bi bi-backspace-fill"></i> Volver</button>
      </Link>
    </div>
  )
}
