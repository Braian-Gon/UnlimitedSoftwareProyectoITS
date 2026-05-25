import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import HistorialFuncionario from "./HistorialFuncionario";
export default function IngresoMarca({resultado, setResultado}) {
    const { register, handleSubmit, reset } = useForm()
    const [ error, setError ] = useState('');
    const navegar = useNavigate()
         
    async function registrarMarca (data) {
        const response = await fetch('http://localhost:3000/api/marca', {
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

    const enviarEntrada = (data) =>{
      data['tipo'] = 'Entrada'
      setError('')
      setResultado('Comprobando...')
      registrarMarca(data)
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
                setResultado(response.detail)
            }
            
            else {
                console.log(response.detail)
                setResultado('')
                setError(response.detail)
            }
            
        })
        .catch(() => {
            navegar('/error')
        })
        reset();
    }
    const enviarSalida = (data) =>{
      data['tipo'] = 'Salida'
      setError('')
      setResultado('Comprobando...')
      registrarMarca(data)
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
                setResultado(response.detail)
            }
            else {
                console.log(response.detail)
                setResultado('')
                setError(response.detail)
            }
            
        })
        .catch(() => {
            navegar('/error')
        })
        reset();
    }
    const enviarPausa = (data) =>{
      data['tipo'] = 'Pausa'
      setError('')
      setResultado('Comprobando...')
      registrarMarca(data)
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
                setResultado(response.detail)
            }
            else {
                console.log(response.detail)
                setResultado('')
                setError(response.detail)
            }
            
        })
        .catch((error) => {
            console.log(error)
            navegar('/error')
        })
        reset();
    }
    const enviarRegreso= (data) =>{
      data['tipo'] = 'Regreso'
      setError('')
      setResultado('Comprobando...')
      registrarMarca(data)
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
                setResultado(response.detail)
            }
            else {
                console.log(response.detail)
                setResultado('')
                setError(response.detail)
            }
            
        })
        .catch((error) => {
            console.log(error)
            navegar('/error')
        })
        reset();
    }

  return (
    <div>
       <div className="formulario-marca">
          <HistorialFuncionario />
          <form >
            <textarea placeholder="Observaciones" maxLength="200" {...register('observacion')}></textarea>
            <div className="campo-botones">
            <button className="entrada" type="submit" onClick={handleSubmit(enviarEntrada)}>Entrada</button>
            <button className="salida" type="submit" onClick={handleSubmit(enviarSalida)}>Salida</button>
            <button className="pausa" type="submit" onClick={handleSubmit(enviarPausa)}>Pausa</button>
            <button className="regreso" type="submit" onClick={handleSubmit(enviarRegreso)}>Regreso</button>
            </div>
          </form>
          { resultado && <p className="exito" >{resultado}</p> }
          { error && <p className="error" >{error}</p> }
        </div>
    </div>
  )
}
