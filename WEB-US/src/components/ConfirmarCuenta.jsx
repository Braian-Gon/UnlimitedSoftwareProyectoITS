import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function ConfirmarCuenta() {
    const [ validar, setValidar ] = useState(false)
    const { token } = useParams()

    async function enviarToken (data) {
      const response = await fetch(`http://localhost:3000/api/confirmar-cuenta/?token=${data}`, {
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
        console.log(token)
        enviarToken(token)
            .then((response)=>{
                if (response.status === 200) {
                setValidar(true)
            }
                else {
                    console.log(response)
                setValidar('Error')
            }
            
        })
        .catch((error) => {
            console.log(error)
        })
    }, [])

  return (
    <div className="inicio">
        <header className="encabezado">
             <Link to='/login'><img src="/us-logo.png" alt="Logo Unlimited Software" className="logo-header"/></Link> 
        </header>
        <hr className="linea" />
        <h1 className="titulo-menu">Validación de Correo</h1>
        { !validar && <p className="validando">Validando su correo, espere por favor....</p> }
        { validar === true && <p className="validado">Correo validado, inicie sesión {<Link to ='/login'> aquí.</Link>}  </p> }
        { validar === 'Error' && <p className="no-validado">No se encontro la cuenta para activar.</p> }

    </div>
  )
}
