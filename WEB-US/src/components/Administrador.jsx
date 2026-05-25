import BotonesAdministrador from "./BotonesAdministrador";
import TablaUsuarios from "./TablaUsuarios";


export default function Administrador() {
  return (
    <div className="contenedor-menus">
      <h1 className="titulo-menu titulo-funcionario" >Menú de Administrador</h1>
      <div className="campos">
        <TablaUsuarios />
        <BotonesAdministrador />
      </div>
      
    </div>
  )
}
