import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function HistorialFuncionario() {
    const [ horasT, setHorasT] = useState('')
    const [ minutosT, setMinutosT] = useState('')
    const [ horasP, setHorasP ] = useState('')
    const [ minutosP, setMinutosP ] = useState('')
    const navegar = useNavigate()
    async function obtenerHora() {
        const response = await fetch('http://localhost:3000/api/hora-semana', {
            method:'GET',
            withCredentials:true,
            credentials: 'include',
            headers: {
            'Content-Type': 'text/plain'
        },
            
        })
        return response.json()
    }
    async function obtenerPausa() {
        const response = await fetch('http://localhost:3000/api/pausa-semana', {
            method:'GET',
            withCredentials:true,
            credentials: 'include',
            headers: {
            'Content-Type': 'text/plain'
        },
        })
        return response.json()
    }

    useEffect(()=> {
        obtenerHora()
        .then((response)=> {
            if (response.status === 200 && response.title === 'Logout') {
                localStorage.removeItem("rol")
                navegar('/login')
            }
            else if(response.status === 410){
                console.log(response.detail)
                localStorage.removeItem("rol")
                navegar('/login') 
            }
            const horas = Math.floor(parseInt(response.trabajo) / 60);
            const minutosRestantes = parseInt(response.trabajo) % 60;
            console.log(minutosRestantes)
            setHorasT(horas)
            setMinutosT(minutosRestantes)
        })
        obtenerPausa()
        .then((response)=> {
            if (response.status === 200 && response.title === 'Logout') {
                localStorage.removeItem("rol")
                navegar('/login')
            }
            else if(response.status === 410){
                localStorage.removeItem("rol")
                navegar('/login') 
            }
            const pausas = Math.floor(parseInt(response.pausa) / 60);
            const minutosPausa = parseInt(response.pausa) % 60;
            setHorasP(pausas)
            setMinutosP(minutosPausa)
        })
    }, [])

  return (
    <div className="historial-menu">
        <h3>Resumen Semanal</h3>
        <br />
        { <p className="historial">Horas Trabajadas: {horasT} horas {minutosT} minutos. </p> } 
        { <p className="historial">Pausas realizadas: {horasP} horas {minutosP} minutos. </p> } 
    </div>
  )
}