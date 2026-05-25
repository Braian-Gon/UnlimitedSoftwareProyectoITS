
import { useState } from "react";
import IngresoMarca from "./IngresoMarca";
import TablaFuncionario from "./TablaFuncionario";

export default function Funcionario() {
  const [resultado, setResultado] = useState('')

  return (
    <div className="contenedor-menus">
      <h1 className="titulo-menu titulo-funcionario" >Menú de Funcionario</h1>
       <div className="campos">
      {<TablaFuncionario resultado = {resultado}/>}
      {<IngresoMarca resultado = {resultado} setResultado = {setResultado} />}
        </div>
    </div>
  )
}
