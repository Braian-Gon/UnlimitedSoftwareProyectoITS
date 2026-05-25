import LogOut from "./LogOut"
import { Link } from "react-router-dom"
export default function Encabezado() {
  return (
    <div>
      <header className="encabezado">
             <Link to='/'><img src="/us-logo.png" alt="Logo Unlimited Software" className="logo-header"/></Link> 
              <LogOut />
        </header>
        <hr className="linea" />
    </div>
  )
}
