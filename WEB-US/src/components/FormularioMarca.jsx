import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

export default function FormularioMarca({id}) {
    const [datos, setDatos] = useState({'id':'', "correo":'', "tipo": '', "observacion":'',"fecha_hora":''})
    const { register, handleSubmit, reset} = useForm()
    const navegar = useNavigate()

    async function obtenerMarca (data) {
        const response = await fetch(`http://localhost:3000/api/obtener-marca/?id=${data}`, {
            method:'GET',
            withCredentials:true,
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
        }
        })
        return response.json()
    }
    useEffect(()=>{ 
      obtenerMarca(parseInt(id))
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
              navegar('/validar')
            }
            else{
                setDatos(response[0])
                reset()
            }
        })
        .catch((error) => {
          alert(error)
        })
    }, [])
    async function verificarMarca (data) {
        const response = await fetch('http://localhost:3000/api/verificar-marca', {
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

    const enviar = (data) => {
      data['id']= id
      console.log(data)
        verificarMarca(data)
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
                navegar('/validar')
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
        <legend>Formulario Validar Marca</legend>
        <div className="campo">
            <label htmlFor="id">Marca ID:</label>
            <input id="id" type="text"  value={datos.id} disabled />
        </div>
        <div className="campo">
            <label htmlFor="correo">Correo:</label>
            <input id="correo" type="email" value={datos.correo} disabled />
        </div>
        <div className="campo">
            <label htmlFor="tipo">Tipo:</label>
            <input id="tipo" type="text" value={datos.tipo} disabled />
        </div>
        <div className="campo">
            <label htmlFor="fecha_hora">Fecha y Hora:</label>
            <input id="fecha_hora" defaultValue={datos.fecha_hora} type="datetime-local" {...register('fecha_hora')}/>
        </div>
        <div className="campo">
            <label htmlFor="observacion">Observación:</label>
            <textarea id="observacion" maxLength="200" defaultValue={datos.observacion} {...register('observacion')} />
        </div>
        <div className="campo-boton">
          <button className="boton-eliminar boton-fijo" type="reset">Reiniciar</button>
          <button className="boton-validar boton-fijo" type="submit">Verificar</button>
        </div>
      </form>
    </div>
  )
}
