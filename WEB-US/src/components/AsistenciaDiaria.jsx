import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function AsistenciaDiaria() {
    const [asistencia, setAsistencia] = useState(0)
    const [total, setTotal] = useState(0)
    const navegar = useNavigate()

    async function obtenerAsistencia() {
        const response = await fetch('http://localhost:3000/api/asistencias', {
            method:'GET',
            withCredentials:true,
            credentials: 'include',
            headers: {
            'Content-Type': 'text/plain'
        },
            
        })
        return response.json()
    }
    async function obtenerTotal() {
        const response = await fetch('http://localhost:3000/api/total', {
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
        obtenerAsistencia()
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
            setAsistencia(response.asistencias)
        })
        obtenerTotal()
        .then((response)=> {
            if (response.status === 200 && response.title === 'Logout') {
                localStorage.removeItem("rol")
                navegar('/login')
            }
            else if(response.status === 410){
                localStorage.removeItem("rol")
                navegar('/login') 
            }
            setTotal(response.total)
        })
    }, [])
  return (
    <div className="historial-menu historial-asistencia">
        <h3>Asistencia Funcionarios</h3>
        <br />
        { <p className="historial">Asistencia: {asistencia} de {total} Funcionarios. </p> } 
    </div>
  )
}
