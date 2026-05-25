import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function LogOut() {
    const navegar = useNavigate()
    const [error, setError] = useState('')

     async function logout () {
        const response = await fetch('http://localhost:3000/api/logout', {
            method:'GET',
            withCredentials:true,
            credentials: 'include',
        })
        return response.json()
    }

    const handleLogout = () =>{
        logout()
        .then(()=>{
                   localStorage.removeItem("rol")
                   navegar('/login')
                
                
            })
            .catch((error) => {
                setError(error)
            })
    }

  return (
    <div>
    <button className="boton-logout" onClick={handleLogout}><i className="bi bi-person-circle"></i><br></br>Cerrar Sesión</button>
    { error && alert(error)}
    </div>
  )
}
