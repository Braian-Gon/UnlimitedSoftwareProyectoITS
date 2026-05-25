import { useEffect, useMemo, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
export default function TablaUsuarios() {
  const [data, setData] = useState([{}])
  const [filterText, setFilterText] = useState('');
  const [error, setError] = useState(false)
  const [respuesta, setRespuesta] = useState('')
  const navegar = useNavigate()

  const columnas = [
    {
      name:"ID",
      selector: row => row.id,
      sortable: true,
      width:'65px'
    },
    {
      name:"Correo",
      selector: row => row.correo,
      sortable: true,
      width:'150px',
      wrap: true,
    },
    {
      name:"Rol",
      selector: row => row.rol,
      sortable: true,
      wrap: true,
    },
    {
      name:"Horario",
      selector: row => row.horario,
      sortable: true,
      width:'110px',
      wrap: true,
    },
    {
      name:"Supervisor",
      selector: row => row.supervisor,
      sortable: true,
      width:'140px',
      wrap: true,
    },
    {
      name:"Estado",
      selector: row => row.estado,
      sortable: true,
      wrap: true,
    },
    {
      name:"Eliminar",
      cell: row=> (<button className="boton-eliminar" onClick={() => handleEliminar({'id':row.id})}><i className="bi bi-trash"></i> Eliminar</button>),
      ignoreRowClick: true,
      width:'140px',
    },
    {
      name:"Gestionar",
      cell: row=> (<button className="boton-validar" onClick={() => handleGestionar(row.id)}><i className="bi bi-person-gear"></i> Gestionar</button>),
      ignoreRowClick: true,
  
      width:'140px',
    },
  ]
    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
    };
    const conditionalRowStyles = [
    {
      when: row => row.estado === 'Activo',
      style: {
        backgroundColor: '#02C77E',
        color: 'white',
        '&:hover': {
          backgroundColor: '#46a049',
        },
      },
    },
     {
      when: row => row.estado === 'Inactivo',
      style: {
        backgroundColor: '#FA7B70',
        color: 'white',
        '&:hover': {
          backgroundColor: '#da190b',
        },
      },
    },
  ]
    createTheme('solarized', {
      text: {
        primary: 'white',
        secondary: 'white',
      },
      background: {
        default: '#3b82f6',
      },
      action: {
        button: 'rgba(0,0,0,.54)',
        hover: 'rgba(0,0,0,.08)',
        disabled: 'rgba(0,0,0,.12)',
      },}, 'dark');

      const customStyles = {
    header: {
      style: {
        fontFamily: 'Questrial, sans-serif',
        fontSize: '20 px',
      },
    },
    rows: {
      style: {
        fontFamily: 'Questrial, sans-serif',
        fontSize: '20 px',
      },
    },
    cells: {
      style: {
        fontFamily: 'Questrial, serif', 
      },
    },
  };

  const filteredData = useMemo(() => {
    if (!filterText) {
        return data;
    }
    return data.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(filterText.toLowerCase())
        )
    );
}, [data, filterText]);

    const handleClear = () =>{
            setFilterText('')
        }
    
    async function getUsuarios () {
        const response = await fetch('http://localhost:3000/api/empleados', {
            method:'GET',
            withCredentials:true,
            credentials: 'include',
    })
    return response.json()
      }

    useEffect(() =>{
        getUsuarios()
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
          else if(response.status === 405){
                setData([])
          } else{
            setData(response)
          }
          
        })
        .catch((error)=>{
          console.log(error)
            navegar('/error')
        })
      }, [respuesta])

    async function borrarUsuario (data) {
      const response = await fetch('http://localhost:3000/api/eliminar-empleado', {
          method:'PUT',
          withCredentials:true,
          credentials: 'include',
          headers: {
          'Content-Type': 'application/json'
      },
          body: JSON.stringify(data)
      },)
      return response.json()
  }
  const handleEliminar = (id) => {
      setRespuesta('')
      setError(false)
    borrarUsuario(id)
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
      else if(response.status === 200){
          setRespuesta(response.detail)   
      }
      else {
        setRespuesta(response.detail)
        setError(true)
      }
    })
    
    .catch(()=>navegar('/error'))
  }

  const handleGestionar = (id) => {
    navegar(`/usuario/${id}`)
  }

  return (
    <div className="contenedor-tabla">
      <div className="respuesta">
        {respuesta && <p className={error ? "titulo-error" : "titulo-validar"}> {respuesta} </p>}
      </div>
      <div className="campo-input-crear">
        <Link to='/crear/usuario'>
          <button className="boton-crear"><i className="bi bi-person-plus"></i> Crear Usuario</button>
        </Link>
        <div className="campo-input">
          <input className="buscador" type="text" value={filterText} onChange={(e) => setFilterText(e.target.value)} placeholder="Buscar" />
          {<button className="boton-limpiar" onClick={handleClear}>X</button>}
        </div>
      </div>
        
      <div className="tabla">
        <DataTable
          columns={columnas}
          data={filteredData}
          pagination
          paginationComponentOptions={paginationComponentOptions}
          paginationPerPage={10}
          conditionalRowStyles={conditionalRowStyles}
          customStyles={customStyles}
          theme="solarized"
          noDataComponent= { <p a className="no-data">No hay registros para mostrar</p>  }
          responsive={true}
          />
      </div>
    </div>
  )
}
