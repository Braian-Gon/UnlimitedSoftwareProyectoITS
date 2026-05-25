import { useEffect, useMemo, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";

export default function TablaReporteSupervisor() {

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
      width:'70px',
    },
    {
      name:"Correo",
      selector: row => row.correo,
      sortable: true,
    },
    {
      name:"Trabajo",
      selector: row => row.horas_trabajadas,
      sortable: true,
      width:'120px',
    },
    {
      name:"Trabajo M",
      selector: row => row.horas_maximas,
      width:'120px',
    },
    {
      name:"Pausa",
      selector: row => row.pausa_realizada,
      width:'120px',
    },
    {
      name:"Pausa M",
      selector: row => row.pausas_maximas,
      width:'120px',
    },
    {
      name:"Asistencias",
      selector: row => row.asistencia,
      width:'120px',
    },
    {
      name:"Fecha",
      selector: row => row.fecha_reporte,
    },
    {
      name:"Eliminar",
      cell: row=> (<button className="boton-eliminar" onClick={() => handleEliminar({'id':row.id})}><i className="bi bi-trash"></i> Eliminar</button>),
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

    async function getReportes () {
        const response = await fetch('http://localhost:3000/api/obtener-mis-reportes', {
            method:'GET',
            withCredentials:true,
            credentials: 'include',
    })
    return response.json()
      }
      useEffect(() =>{
        getReportes()
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

  async function borrarReporte (data) {
    const response = await fetch('http://localhost:3000/api/borrar-reporte', {
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
    borrarReporte(id)
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

  async function generarReportes() {
    const response = await fetch('http://localhost:3000/api/generar-reportes', {
        method:'POST',
        withCredentials:true,
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json'
    }
    },)
    return response.json()
  }
  const handleGenerarReportes = () => {
      setRespuesta('')
      setError(false)
    generarReportes()
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
          <button className="boton-crear boton-reporte" onClick={handleGenerarReportes}><i className="bi bi-clipboard2-check" ></i> Generar reporte semanal</button>
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
          />
      </div>
    </div>
  )
}
