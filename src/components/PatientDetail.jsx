import React, {useEffect  } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import axios from 'axios';
import {getPatientRecord, deletePatientRequest, patientUpdateRecord} from "../utils/PatientMapper";
import { toast } from "react-toastify";

function EditToolbar() {
  return (
    <GridToolbarContainer>
      <Button color="primary" >
        Hasta Detay Tablosu
      </Button>
    </GridToolbarContainer>
  );
}

export default function PatientDetail() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
    deleteHospitalRecord(id);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow};
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    updatePatientRecord(updatedRow);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const rowSelected = (selectedRowKey) => {
  };

  async function listPatientRecord() {
    try {
      const response = await axios.get("http://localhost:8080/patient/getAllPatient");
      setRows(getPatientRecord(response.data.patientList));
      console.log(getPatientRecord(response.data.patientList));
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteHospitalRecord(patientId) {
    try {
      let request = deletePatientRequest(patientId);
      const response = await axios.post("http://localhost:8080/patient/deletePatient", request);
      if(response.data.success){
        toast.success("Silme İşlemi Başarılı");
      }else{
        toast.error("Silme İşlemi yapılırken hata alındı" + response.data.message);
      }
    } catch (error) {
      toast.error("Silme İşlemi yapılırken hata alındı" + error);
      console.error(error);
    }
  }

  async function updatePatientRecord(newRecord) {
    try {
      let request = patientUpdateRecord(newRecord);
      const response = await axios.post("http://localhost:8080/patient/addPatient", request);
      if (response.data.success) {
        toast.success("Kayıt İşlemi Başarılı");
      } else {
        toast.error(
          "Kayıt İşlemi yapılırken hata alındı" + response.data.message
        );
      }
    } catch (error) {
      toast.error("Kayıt İşlemi yapılırken hata alındı" + error);
      console.log(error);
    }
  }

  useEffect(() => {
    listPatientRecord();
  }, []);

  const columns = [
    {
      field: "patientFirstName",
      headerName: "Hasta Adı",
      width: 150,
      type: "text",
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "patientLastName",
      headerName: "Hasta Soyadı",
      width: 150,
      type: "text",
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: 'patientGender',
      headerName: 'Hasta Cinsiyet',
      align: "left",
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Erkek', 'Kadın'],
    },
    {
      field: "patientAge",
      headerName: "Hasta Yaşı",
      type: "number",
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "patientTc",
      headerName: "Hasta TC",
      type: "text",
      align: "left",
      headerAlign: "left",
      width: 100,
      editable: true,
    },
    {
      field: "patientAdress",
      headerName: "Hasta Adresi",
      width: 150,
      type: "text",
      editable: true,
    },
    {
      field: "patientComplaint",
      headerName: "Hasta Şikayeti",
      type: "text",
      width: 120,
      editable: true,
    },
    {
      field: "hospitalName",
      headerName: "Hastane Adı",
      align: "left",
      type: "text",
      width: 180,
    },
    {
      field: "hospitalId",
      headerName: "Hastane Id",
      align: "left",
      type: "number",
      editable: false,
      width: 80,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div>
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          height: 500,
          width: "90%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <DataGrid
          item
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onRowSelectionModelChange={rowSelected}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        />
        <br />
      </Box>
    </div>
  );
}