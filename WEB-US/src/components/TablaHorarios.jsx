import { useEffect, useMemo, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";

export default function TablaHorarios() {
    const [data, setData] = useState([{}])
    const [filterText, setFilterText] = useState('');
    const [error, setError] = useState(false)
    const [respuesta, setRespuesta] = useState('')
    const navegar = useNavigate()

    const columnas = [
    {
      name:"Nombre",
      selector: row => row.nombre,
      sortable: true,
    },
    {
      name:"Entrada",
      selector: row => row.entrada,
      sortable: true,
    },
    {
      name:"Salida",
      selector: row => row.salida,
      sortable: true,
    },
    {
      name:"Pausa",
      selector: row => row.pausa,
      sortable: true,
    },
    {
      name:"Eliminar",
      cell: row=> (<button className="boton-eliminar" onClick={() => handleEliminar({'nombre':row.nombre})}><i className="bi bi-trash"></i> Eliminar</button>),
      ignoreRowClick: true,
      width:'140px',
    },
    {
      name:"Validar",
      cell: row=> (<button className="boton-validar" onClick={() => handleGestionar(row.nombre)}><i className="bi bi-gear"></i> Modificar</button>),
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
        background: '#02C77E',
        '&:hover':{backgroundColor:'#46a049'},
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
    async function getHorarios () {
        const response = await fetch('http://localhost:3000/api/obtener-horarios-c', {
            method:'GET',
            withCredentials:true,
            credentials: 'include',
    })
    return response.json()
      }
    useEffect(() =>{
            getHorarios()
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
                console.log(response)
                setData(response)
              }
              
            })
            .catch((error)=>{
              console.log(error)
                navegar('/error')
            })
          }, [respuesta])
    const handleGestionar = (id) => {
    navegar(`/horarios/${id}`)
  }

  async function borrarHorario (data) {
      const response = await fetch('http://localhost:3000/api/eliminar-horario', {
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
  const handleEliminar = (nombre) => {
      setRespuesta('')
      setError(false)
    borrarHorario(nombre)
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
  return (
    <div className="contenedor-tabla-validar">
      <div className="respuesta">
        {respuesta && <p className={error ? "titulo-error" : "titulo-validar"}> {respuesta} </p>}
      </div>
      <div className="campo-input-crear">
        <Link to='/crear/horario'><button className="boton-crear" ><i className="bi bi-stopwatch"></i> Crear Horario</button></Link>
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
          customStyles={customStyles}
          theme="solarized"
          noDataComponent= { <p a className="no-data">No hay registros para mostrar</p>  }
          responsive={true}
          />
      </div>
    </div>
  )
}
