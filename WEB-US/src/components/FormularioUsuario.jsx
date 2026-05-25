import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function FormularioUsuario({id}) {
    const [opciones, setOpciones] = useState('');
    const [opcionesSupervisor, setOpcionesSupervisor] = useState('');
    const [datos, setDatos] = useState({'id':'', "correo":'', "rol": '', "supervisor":'',"horario":'', 'supervisor_id': ''})
    const navegar = useNavigate()
    const { register, handleSubmit, reset} = useForm()

        async function obtenerHorario () {
            const response = await fetch('http://localhost:3000/api/obtener-horarios', {
                method:'GET',
                withCredentials:true,
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json'
            }
            })
            return response.json()
        }
        async function obtenerSupervisor () {
            const response = await fetch('http://localhost:3000/api/obtener-supervisores', {
                method:'GET',
                withCredentials:true,
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json'
            }
            })
            return response.json()
        }
        async function obtenerUsuario (data) {
            const response = await fetch(`http://localhost:3000/api/obtener-usuario/?id=${data}`, {
                method:'GET',
                withCredentials:true,
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json'
            }
            })
            return response.json()
        }
        async function actualizarUsuario (data) {
        const response = await fetch('http://localhost:3000/api/actualizar-empleado', {
            method:'PUT',
            withCredentials:true,
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
        },
            body: JSON.stringify(data)
        })
        return response.json()
    }
        useEffect(()=>{ 
          obtenerHorario()
            .then((response)=>{
                if (response.status === 200 && response.title === 'Logout') {
                    localStorage.removeItem("rol")
                    navegar('/login')
                }
                else if(response.status === 410){
                    console.log(response.detail)
                    localStorage.removeItem("rol")
                    navegar('/login') 
                } else if(response.status){
                  alert(response.detail)
                  navegar('/')
                }
                else{
                    setOpciones(response)
                    console.log(opciones)
                }
            })
            .catch((error) => {
              alert(error)
            })
        obtenerSupervisor()
        .then((response)=>{
            if (response.status === 200 && response.title === 'Logout') {
                localStorage.removeItem("rol")
                navegar('/login')
            }
            else if(response.status === 410){
                console.log(response.detail)
                localStorage.removeItem("rol")
                navegar('/login') 
            } else if(response.status){
                alert(response.detail)
                navegar('/')
            }
            else{
                setOpcionesSupervisor(response)
                console.log(opciones)
            }
        })
        .catch((error) => {
            alert(error)
        })
        obtenerUsuario(parseInt(id))
        .then((response)=>{
            if (response.status === 200 && response.title === 'Logout') {
                localStorage.removeItem("rol")
                navegar('/login')
            }
            else if(response.status === 410){
                console.log(response.detail)
                localStorage.removeItem("rol")
                navegar('/login') 
            } else if(response.status){
              alert(response.detail)
              navegar('/')
            }
            else{
                setDatos(response)
                reset()
            }
        })
        .catch((error) => {
          alert(error)
        })
}, [])

    const enviar = (data) => {
      data['id']= id
      console.log(data)
      actualizarUsuario(data)
            .then((response)=>{
                if (response.status === 200 && response.title === 'Logout') {
                localStorage.removeItem("rol")
                navegar('/login')
            }
            else if(response.status === 410){
                console.log(response.detail)
                localStorage.removeItem("rol")
                navegar('/login') 
            }
            else if(response.status === 200){
                console.log(response.detail)
                alert(response.detail)
                navegar('/')
            }
            else {
                console.log(response.detail)
                alert(response.detail)
            }
            
        })
        .catch((error) => {
            console.log(error)
            navegar('/error')
        })
    }

  return (
    <div >
      <form className="formulario-validar" onSubmit={handleSubmit(enviar)}>
        <legend>Formulario Gestión de Usuario</legend>
        <div className="campo">
            <label htmlFor="id">Marca ID:</label>
            <input id="id" type="text"  value={datos.id} disabled />
        </div>
        <div className="campo">
            <label htmlFor="correo">Correo:</label>
            <input id="correo" type="email" defaultValue={datos.correo} {...register('correo')} />
        </div>
        <div className="campo">
            <label htmlFor="rol">Rol:</label>
            <input id="rol" type="text" value={datos.rol} disabled {...register('rol')}/>
        </div>
        <div className="campo">
            <label htmlFor="contraseña">Contraseña:</label>
            <input id="contraseña" type="password" {...register('contraseña')}/>
        </div>
        { datos.rol === 'Funcionario' &&
            <div className="campo">
            <label htmlFor="horario">Horario:</label>
            <select id="horario" defaultValue={datos.horario} {...register('horario')}>
                <option value="">Ninguno</option>
                { opciones &&
                opciones.map((opcion)=>{
                    return (
                        <option key={opcion.nombre} value={opcion.nombre}>{opcion.nombre}</option>
                    )
                }) }
            </select>
        </div>}
        { datos.rol === 'Funcionario' &&
            <div className="campo">
            <label htmlFor="supervisor">Supervisor:</label>
            <select id="supervisor" defaultValue={datos.supervisor_id} {...register('supervisor_id')}>
                <option value="">Ninguno</option>
                { opcionesSupervisor &&
                opcionesSupervisor.map((opcions)=>{
                    return (
                        <option key={opcions.id} value={opcions.id}>{opcions.correo}</option>
                    )
                }) }
            </select>
        </div>}
        <div className="campo-boton">
          <button className="boton-eliminar boton-fijo" type="reset">Reiniciar</button>
          <button className="boton-validar boton-fijo" type="submit">Guardar</button>
        </div>
      </form>
    </div>
  )
}
