import React, { useState , useEffect  } from "react";
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
import { getHospitalRecord, deleteHospitalRequest,hospitalNewRecord} from "../utils/HospitalMapper";
import HospitalDetailWithPatient from "./HospitalDetailWithPatient";
import { toast } from "react-toastify";

function EditToolbar() {
  return (
    <GridToolbarContainer>
      <Button color="primary">
        Hastane Detay Tablosu
      </Button>
    </GridToolbarContainer>
  );
}

export default function HospitalDetail() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [selectedHospital, setSelectedHospital] = useState();
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
    const updatedRow = { ...newRow };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    updateHospitalRecord(updatedRow);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const rowSelected = (selectedRowKey) => {
    setSelectedHospital(selectedRowKey[0]);
  };

  async function listHospitalRecord() {
    try {
      const response = await axios.get("http://localhost:8080/hospital/getAllHospital");
      setRows(getHospitalRecord(response.data.hospitalList));
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteHospitalRecord(hospitalId) {
    try {
      let request = deleteHospitalRequest(hospitalId);
      const response = await axios.post("http://localhost:8080/hospital/deleteHospital", request);
      if(response.data.success){
        toast.success("Silme İşlemi Başarılı");
      }else{
        toast.error("Silme İşlemi yapılırken hata alındı" + response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Silme İşlemi yapılırken hata alındı" + error);
    }
  }

  async function updateHospitalRecord(newRecord) {
    try {
      let request = hospitalNewRecord(newRecord);
      const response = await axios.post("http://localhost:8080/hospital/addHospital", request);
      if (response.data.success) {
        toast.success("Güncelleme İşlemi Başarılı");
      } else {
        toast.error(
          "Güncelleme İşlemi yapılırken hata alındı" + response.data.message
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    listHospitalRecord();
  }, [])

  const columns = [
    {
      field: 'hospitalName',
      headerName: 'Hastane Adı',
      type: 'text',
      width: 220,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'hospitalAdress',
      headerName: 'Hastane Adresi',
      type: 'text',
      width: 180,
      editable: true,
    },
    {
      field: 'hospitalType',
      headerName: 'Hastane Türü',
      width: 220,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Diş Hastanesi', 'Göz Hastanesi', 'Genel Hastane','Diğer'],
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
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
          width: "55%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <DataGrid item
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
          }} />
          <br/>
          <HospitalDetailWithPatient hospitalId={selectedHospital}/>
      </Box>
    </div>
  );
}