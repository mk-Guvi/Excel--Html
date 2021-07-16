import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import './App.css'

function App() {
  const [items, setItems] = useState([])
  const [headers, setHeaders] = useState([])
  const [table, setTable] = useState(false)
  const [errors, setErrors] = useState(false)

  const readFile = (file) => {
    if (!file.name.split('.').pop() === 'xslx') {
      return setErrors(true)
    }
    
    setTable(false)//for making the table not visible

    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader()//JS fileReader
      fileReader.readAsArrayBuffer(file)
      
      fileReader.onload = (e) => {
        const bufferArray = e.target.result//bufferArray data
        
        const workbook = XLSX.read(bufferArray, { type: 'buffer' })//Reading the data which is in bufferArray
        const workSheetName = workbook.SheetNames[0]//Getting the WorkSheetName
        const workSheet = workbook.Sheets[workSheetName]//Provideing the sheetName to be read
        
       const data = XLSX.utils.sheet_to_json(workSheet)//converting the array buffer Data into Json
        resolve(data)
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
    promise
      .then((data) => {
        setErrors(false)
        setItems(data)
        setHeaders(Object.keys(data[0]))
      })
      .catch(() => {
        setErrors(true)
      })
  }

  const displayError = () => {
    if (errors) {
      return (
        <div className="alert alert-danger" role="alert">
          Select the Correct File
        </div>
      )
    }
  }

  const designTable = (table) => {
    return table && items.length === 0 ? (
      <div className="alert alert-danger" role="alert">
          No File Chosen or Empty File
        </div>
    ) : (
      
      <table style={{ display: !table && 'none' }} className="table table-bordered">
        <thead>
          <tr>
            {headers.map((item, index) => (
              <th className="table-info fw-bold font-monospace"scope="col" key={index}>
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              {headers.map((header, index) => (
                <td className="font-monospace"key={index}>{item[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const displayTable = () => {
   setTable(!table)
  }

  return (
    <div className="container mt-5">
      <h3 className="mb-5 fs-1 fw-bold font-monospace">Excel File To Html Tables </h3>
      <div className="input-group">
        <input
          type="file"
          className="form-control"
          onChange={(e) => {
            const file = e.target.files[0]
            readFile(file)
          }}
          id="inputGroupFile04"
          aria-describedby="inputGroupFileAddon04"
          aria-label="Upload"
        />
        <button
          onClick={displayTable}
          className="btn btn-outline-secondary"
          disabled={errors ? true : false}
          type="button"
          id="inputGroupFileAddon04"
        >
          Submit
        </button>
      </div>
      <br/>
      {displayError()}
      
      {designTable(table)}
    </div>
  )
}

export default App
