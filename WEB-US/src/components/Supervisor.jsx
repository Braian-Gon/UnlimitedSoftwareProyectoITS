import BotonesSupervisor from "./BotonesSupervisor";
import TablaSupervisor from "./TablaSupervisor";

export default function Supervisor() {
  return (
    <div className="contenedor-menu">
      <h1 className="titulo-menu">Menú de Supervisor</h1>
      <div className="contenedor-supervisor">
        <TablaSupervisor />
        <BotonesSupervisor />
      </div>
    </div>
  )
}
