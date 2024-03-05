import React, { useState , useEffect  } from "react";
import Button from '@mui/material/Button';
import {
  DataGrid,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import axios from 'axios';
import {getPatientRecord} from "../utils/PatientMapper"
import {Link } from "react-router-dom";

function EditToolbar(props) {

  return (
    <GridToolbarContainer>
      <Link to="/patientDetailPage">
        <Button color="primary">
          Hasta Detay
        </Button>
      </Link>
    </GridToolbarContainer>
  );
}

export default function HospitalDetailWithPatient(props) {
  const [rows, setRows] = useState([]);
  const [visibleTable, setVisibleTable] = useState(false);
  const rowSelected = (selectedRowKey) => {
    debugger;
  };

  async function listHospitalRecord(hospitalId) {
    axios.get(`http://localhost:8080/patient/getPatientByHospital/${hospitalId}`)
      .then((response) => {
        debugger;
        setRows(getPatientRecord(response.data.patientList));
        if(response.data.patientList.length > 0){
          setVisibleTable(true);
        }else{
          setVisibleTable(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    if(props.hospitalId !== undefined){
      listHospitalRecord(props.hospitalId);
    }
  }, [props.hospitalId])

  const columns = [
    {
      field: "patientFirstName",
      headerName: "Hasta Adı",
      width: 150,
      type: "text",
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "patientLastName",
      headerName: "Hasta Soyadı",
      width: 150,
      type: "text",
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "patientGender",
      headerName: "Hasta Cinsiyet",
      type: "number",
      align: "left",
      width: 150,
      headerAlign: "left",
      editable: false,
    },
    {
      field: "patientAge",
      headerName: "Hasta Yaşı",
      type: "number",
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "patientTc",
      headerName: "Hasta TC",
      type: "text",
      align: "left",
      headerAlign: "left",
      width: 100,
      editable: false,
    },
    {
      field: "patientAdress",
      headerName: "Hasta Adresi",
      width: 150,
      type: "text",
      editable: false,
    },
    {
      field: "patientComplaint",
      headerName: "Hasta Şikayeti",
      type: "text",
      width: 120,
      editable: false,
    },
    {
      field: "hospitalName",
      headerName: "Hastane Adı",
      align: "left",
      type: "text",
      width: 180,
      editable: false,
    },
    {
      field: "hospitalId",
      headerName: "Hastane Id",
      align: "left",
      type: "number",
      editable: false,
      width: 80,
    },
  ];

  return (
    visibleTable && (
    <div>
      <DataGrid item
        rows={rows}
        columns={columns}
        editMode="row"
        onRowSelectionModelChange={rowSelected}
        slots={{
          toolbar: EditToolbar,
        }}
      />
    </div>)
  );
}