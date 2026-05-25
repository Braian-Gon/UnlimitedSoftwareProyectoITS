import { useEffect, useMemo, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
 import exportFromJSON from 'export-from-json';

export default function TablaReportesAdmin() {
    const fechaActual = new Date().toLocaleDateString()
    const [data, setData] = useState([{}])
    const [filterText, setFilterText] = useState('');
    const navegar = useNavigate()
    const fileName = 'reportes ' + fechaActual
    const exportType = exportFromJSON.types.csv;
    const handleExport = () => {
        exportFromJSON({ data, fileName, exportType });
      };
    const columnas = [
        {
          name:"ID",
          selector: row => row.id,
          sortable: true,
          width:'70px'
        },
        {
          name:"Supervisor",
          selector: row => row.scorreo,
          sortable: true,
          wrap:true,
        },
        {
          name:"Funcionario",
          selector: row => row.fcorreo,
          sortable: true,
          wrap:true,
        },
        {
          name:"Trabajo",
          selector: row => row.horas_trabajadas,
          sortable: true,
        },
        {
          name:"Trabajo M",
          selector: row => row.horas_maximas,
        },
        {
          name:"Pausa",
          selector: row => row.pausa_realizadas,
        },
        {
          name:"Pausa M",
          selector: row => row.pausas_maximas,
        },
        {
          name:"Asistencias",
          selector: row => row.asistencia,
        },
        {
          name:"Fecha",
          selector: row => row.fecha_reporte,
          width:'170px',
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

    async function getAllReportes () {
        const response = await fetch('http://localhost:3000/api/reportes-todos', {
            method:'GET',
            withCredentials:true,
            credentials: 'include',
    })
    return response.json()
      }
    useEffect(() =>{
        getAllReportes()
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
        }, [])

  return (
    <div className="contenedor-tabla-validar">
      <div className="campo-input-crear">
          <button className="boton-crear boton-exportar" onClick={handleExport}>Exportar a CSV</button>
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
