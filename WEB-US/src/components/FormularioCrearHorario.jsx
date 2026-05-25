import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

export default function FormularioCrearHorario() {
  const { register, handleSubmit } = useForm()
  const navegar = useNavigate()
  const sesion = localStorage.getItem('rol')
  useEffect(()=>{
    if(sesion !== 'Administrador'){
      return navegar('/')
  }
  })

  async function crearHorario (data) {
        const response = await fetch('http://localhost:3000/api/crear-horario', {
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
      crearHorario(data)
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
                navegar('/horarios')
            }
            
            else {
                console.log(response.detail)
                alert(response.detail)
                navegar('/horarios')
            }
            
        })
        .catch(() => {
            navegar('/error')
        })
    }

  return (
    <div>
      <form className="formulario-validar" onSubmit={handleSubmit(enviar)}>
        <legend>Formulario Creación de Horario</legend>
        <div className="campo">
            <label htmlFor="nombre">Nombre:</label>
            <input id="nombre" type="text" {...register('nombre')} required/>
        </div>
        <div className="campo">
            <label htmlFor="entrada">Entrada:</label>
            <input id="entrada" type="time" {...register('entrada')} required/>
        </div>
        <div className="campo">
            <label htmlFor="salida">Salida:</label>
            <input id="salida" type="time" {...register('salida')} required/>
        </div>
        <div className="campo">
            <label htmlFor="pausa">Pausa:</label>
            <input id="pausa" type="number" {...register('pausa')} min='0'/>
        </div>
        <div className="campo-boton">
          <button className="boton-eliminar boton-fijo" type="reset">Reiniciar</button>
          <button className="boton-validar boton-fijo" type="submit">Guardar</button>
        </div>
      </form>
    </div>
  )
}
