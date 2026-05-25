import { Navigate, Route, Routes} from "react-router-dom"
import Form from "./components/Form"
import Inicio from "./components/Inicio"
import './index.css'
import ErrorDeConexion from "./components/ErrorDeConexion"
import Validar from "./components/Validar"
import ValidarMarca from "./components/ValidarMarca"
import GestionarUsuario from "./components/GestionarUsuario"
import VentanaFormulario from "./components/VentanaFormulario"
import Horarios from "./components/Horarios"
import GestionHorario from "./components/GestionHorario"
import CrearHorario from "./components/CrearHorario"
import ConfirmarCuenta from "./components/ConfirmarCuenta"
import ReporteSupervisor from "./components/ReporteSupervisor"
import ReportesAdministrador from "./components/ReportesAdministrador"

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Form />} />
        <Route path="/confirmar-cuenta/:token" element={<ConfirmarCuenta />} />
        <Route path="/" element={<Inicio />} />
        <Route path="/error" element={<ErrorDeConexion />} />
        <Route path="/validar" element={ <Validar /> } />
        <Route path="/reporte" element={ <ReporteSupervisor /> } />
        <Route path="/validar/marca/:id" element={<ValidarMarca />} />
        <Route path="/usuario/:id" element={<GestionarUsuario />} />
        <Route path="/crear/usuario" element={ <VentanaFormulario /> } />
        <Route path="/horarios" element={ <Horarios /> } />
        <Route path="/reporte/export" element={ <ReportesAdministrador /> } />
        <Route path="/crear/horario" element={ <CrearHorario /> } />
        <Route path="/horarios/:nombre" element={ <GestionHorario /> } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
        
    </>
  )
}

export default App
