import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function FormularioCrearUsuario() {
    const [opciones, setOpciones] = useState('');
    const [opcionesSupervisor, setOpcionesSupervisor] = useState('');
    const [select, setSelect] = useState('Funcionario');
    const navegar = useNavigate()
    const { register, handleSubmit} = useForm()

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

    async function crearUsuario (data) {
        const response = await fetch('http://localhost:3000/api/crear-empleado', {
            method:'POST',
            withCredentials:true,
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
        },
            body: JSON.stringify(data)
        })
        return response.json()
    }
    const enviar = (data) =>{
      data['rol'] = select
      crearUsuario(data)
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
                navegar('/')
            }
            
        })
        .catch(() => {
            navegar('/error')
        })
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
}, [])
  return (
    <div >
      <form className="formulario-validar" onSubmit={handleSubmit(enviar)}>
        <legend>Formulario Creación de Usuario</legend>
        <div className="campo">
            <label htmlFor="correo">Correo:</label>
            <input id="correo" type="email" {...register('correo')} required/>
        </div>
        <div className="campo">
            <label htmlFor="rol">Rol:</label>
            <select id="rol" value={select} onChange={(e)=>setSelect(e.target.value)} >
                <option value="Funcionario">Funcionario</option>
                <option value="Supervisor">Supervisor</option>
            </select>
        </div>
        <div className="campo">
            <label htmlFor="contraseña">Contraseña:</label>
            <input id="contraseña" type="password" {...register('contraseña')} required min='5'/>
        </div>
        { select === 'Funcionario' &&
            <div className="campo">
            <label htmlFor="horario">Horario:</label>
            <select id="horario" {...register('horario')}>
                <option value="">Ninguno</option>
                { opciones &&
                opciones.map((opcion)=>{
                    return (
                        <option key={opcion.nombre} value={opcion.nombre}>{opcion.nombre}</option>
                    )
                }) }
            </select>
        </div>}
        { select === 'Funcionario' &&
            <div className="campo">
            <label htmlFor="supervisor">Supervisor:</label>
            <select id="supervisor" {...register('supervisor_id')}>
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
