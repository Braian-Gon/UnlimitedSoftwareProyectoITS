import 'bootstrap-icons/font/bootstrap-icons.css'
import { useForm } from "react-hook-form"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Form() {
    const navegar = useNavigate()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState(null)
    
    async function login (data) {
        const response = await fetch('http://localhost:3000/api/login', {
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

    const enviar = (data) => {
        login(data)
            .then((response)=>{
                if(response.status === 200){
                   localStorage.setItem("rol",response.detail)
                   navegar('/')
                }else {
                   setError(response.detail)
                   console.log(error)
                }
                
            })
            .catch(() => {
                navegar('/error')
            })
    }

    
  return (
    <div className='form-container'>
        <img src="/us-logo.png" alt="Logo US" />
        <form className="formulario" onSubmit={handleSubmit(enviar)}>
            { error && <p className='mensaje-error' > {error} </p> }
            <div className="campo">
                <input
                    type="email" 
                    required
                    {...register('correo')}
                />
                <i className="bi bi-person-circle"></i>
                <label>Ingresa tu Correo</label>
            </div>
            <div className="campo">
                
                <input
                    type="password" 
                    required
                    {...register('contraseña')}
                />
                <i className="bi bi-unlock2"></i>
                <label>Ingresa tu Contraseña</label>
            </div>
            <div className="campo-boton">
                <button className="boton-enviar" type="submit">Iniciar Sesión</button>
            </div>
        </form>
      
    </div>
  )
}
