import { useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
export default function TablaFuncionario({resultado}) {
    const [data, setData] = useState([{}])
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
      name:"Tipo de Marca",
      selector: row => row.tipo,
      sortable: true,
      width:'150px'
    },
    {
      name:"Fecha y Hora",
      selector: row => row.fecha_hora,
      sortable: true,
      width:'200px'
    },
    {
      name:"Observación",
      selector: row => row.observacion,
      width:'400px',
      wrap: true,
    },
  ]
    const navegar = useNavigate()

     async function getMarca () {
        const response = await fetch('http://localhost:3000/api/mis-marcas', {
            method:'GET',
            withCredentials:true,
            credentials: 'include',
        })
        return response.json()
    }
    useEffect(() =>{
      getMarca()
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
    }, [resultado])

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
  return (
    <div className="contenedor-tabla"> 
      <div className="tabla">
        <DataTable
          columns={columnas}
          data={data}
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