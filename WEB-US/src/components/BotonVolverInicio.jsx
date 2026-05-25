import { Link } from "react-router-dom";

export default function BotonVolverInicio() {
  return (
    <div>
      <Link to='/'>
        <button className="boton-volver"><i className="bi bi-backspace-fill"></i> Volver</button>
      </Link>
    </div>
  )
}
