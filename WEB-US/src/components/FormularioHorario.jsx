import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

export default function FormularioHorario({nombre}) {
    const [datos, setDatos] = useState({'nombre':'', "entrada":'', "salida": '', "pausa":''})
    const navegar = useNavigate()
    const { register, handleSubmit, reset} = useForm()

    async function obtenerHorario (data) {
      const response = await fetch(`http://localhost:3000/api/obtener-horario/?nombre=${data}`, {
          method:'GET',
          withCredentials:true,
          credentials: 'include',
          headers: {
          'Content-Type': 'application/json'
      }
      })
      
      return response.json()
    }

    async function actualizarHorario (data) {
        const response = await fetch('http://localhost:3000/api/actualizar-horario', {
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
      obtenerHorario(nombre)
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
      data['nombre_old']= nombre
      console.log(data)
        actualizarHorario(data)
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
            }
            
        })
        .catch((error) => {
            console.log(error)
            navegar('/error')
        })
    }


  return (
    <div>
      <form className="formulario-validar" onSubmit={handleSubmit(enviar)}>
        <legend>Formulario Gestión de Horario</legend>
        <div className="campo">
            <label htmlFor="nombre">Nombre:</label>
            <input id="nombre" type="text" defaultValue={datos.nombre} {...register('nombre')}/>
        </div>
        <div className="campo">
            <label htmlFor="entrada">Entrada:</label>
            <input id="entrada" type="time" defaultValue={datos.entrada} {...register('entrada')}/>
        </div>
        <div className="campo">
            <label htmlFor="salida">Salida:</label>
            <input id="salida" type="time" defaultValue={datos.salida} {...register('salida')}/>
        </div>
        <div className="campo">
            <label htmlFor="pausa">Pausa:</label>
            <input id="pausa" type="number" defaultValue={datos.pausa} {...register('pausa')}/>
        </div>
        <div className="campo-boton">
          <button className="boton-eliminar boton-fijo" type="reset">Reiniciar</button>
          <button className="boton-validar boton-fijo" type="submit">Guardar</button>
        </div>
      </form>
    </div>
  )
}
