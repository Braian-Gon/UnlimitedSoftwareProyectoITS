import { useEffect, useMemo, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";

export default function TablaValidar() {
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
      width:'70px'
    },
    {
      name:"Correo",
      selector: row => row.correo,
      sortable: true,
      width:'250px',
      wrap: true,
    },
    {
      name:"Tipo de Marca",
      selector: row => row.tipo,
      sortable: true,
    },
    {
      name:"Fecha y Hora",
      selector: row => row.fecha_hora,
      sortable: true,

    },
    {
      name:"Observación",
      selector: row => row.observacion,
      wrap: true,
    },
    {
      name:"Eliminar",
      cell: row=> (<button className="boton-eliminar" onClick={() => handleEliminar({'id':row.id})}><i className="bi bi-trash"></i> Eliminar</button>),
      ignoreRowClick: true,
      width:'140px',
    },
    {
      name:"Validar",
      cell: row=> (<button className="boton-validar" onClick={() => handleValidar(row.id)}><i className="bi bi-check-circle"></i> Validar</button>),
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
      when: row => row.tipo === 'Entrada',
      style: {
        backgroundColor: '#02C77E',
        color: 'white',
        '&:hover': {
          backgroundColor: '#46a049',
        },
      },
    },
     {
      when: row => row.tipo === 'Salida',
      style: {
        backgroundColor: '#FA7B70',
        color: 'white',
        '&:hover': {
          backgroundColor: '#da190b',
        },
      },
    },
    {
      when: row => row.tipo === 'Pausa',
      style: {
        backgroundColor: '#3D91F5',
        color: 'white',
        '&:hover': {
          backgroundColor: '#0b7dda',
        },
      },
    },
    {
      when: row => row.tipo === 'Regreso',
      style: {
        backgroundColor: '#FFBA52',
        color: 'white',
        '&:hover': {
          backgroundColor: '#e68a00',
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
    },
  }, 'dark');
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
  async function getMarcaEquipoReporte () {
    const response = await fetch('http://localhost:3000/api/marcas-equipo-reportadas', {
        method:'GET',
        withCredentials:true,
        credentials: 'include',
    })
    return response.json()
      }

  useEffect(() =>{
    getMarcaEquipoReporte()
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

  async function borrarMarca (data) {
      const response = await fetch('http://localhost:3000/api/borrar-marca', {
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
    borrarMarca(id)
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

  const handleValidar = (id) => {
    navegar(`/validar/marca/${id}`)
  }

  return (
    <div className="contenedor-tabla-validar">
      <div className="respuesta">
        {respuesta && <p className={error ? "titulo-error" : "titulo-validar"}> {respuesta} </p>}
      </div>
      <div className="campo-input-crear derecha">
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
