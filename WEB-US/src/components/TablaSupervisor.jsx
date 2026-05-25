import { useEffect, useMemo, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
export default function TablaSupervisor() {
    const [data, setData] = useState([{}])
    const [filterText, setFilterText] = useState('');

    const paginationComponentOptions = {
      rowsPerPageText: 'Filas por página',
      rangeSeparatorText: 'de',
      selectAllRowsItem: true,
      selectAllRowsItemText: 'Todos',
    };

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
      width:'150px'
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
      name:"Estado",
      selector: row => row.estado,
      sortable: true,
    },
  ]
    const navegar = useNavigate()

     async function getMarcaEquipo () {
        const response = await fetch('http://localhost:3000/api/marcas-equipo', {
            method:'GET',
            withCredentials:true,
            credentials: 'include',
        })
        return response.json()
    }
    useEffect(() =>{
      getMarcaEquipo()
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
    }, [])

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
  return (
    <div className="contenedor-tabla">
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
            />
          </div>
        </div>
  )
}
