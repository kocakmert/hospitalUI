import React, { useState , useEffect  } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
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
import {
  randomId,
} from '@mui/x-data-grid-generator';
import axios from 'axios';
import { getHospitalRecord, deletehospitalRequest,hospitalNewRecord} from "../utils/HospitalMapper";
import HospitalDetailWithPatient from "./HospitalDetailWithPatient";

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function HospitalDetail() {
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
    debugger;
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

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    updateHospitalRecord(updatedRow);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };


  const rowSelected = (selectedRowKey) => {
    debugger;
  };

  async function listHospitalRecord() {
    axios
      .get("http://localhost:8080/hospital/getAllHospital")
      .then((response) => {
        setRows(getHospitalRecord(response.data.data));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function deleteHospitalRecord(hospitalId) {
    let request = deletehospitalRequest(hospitalId);
    debugger;
    axios
      .post("http://localhost:8080/hospital/deleteHospital", request)
      .then(function (response) {
        debugger;
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function updateHospitalRecord(newRecord) {
    let request = hospitalNewRecord(newRecord);
    debugger;
    axios
      .post("http://localhost:8080/hospital/addHospital", request)
      .then(function (response) {
        debugger;
        console.log(response);
      })
      .catch(function (error) {
        debugger
        console.log(error);
      });
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
          <HospitalDetailWithPatient/>
      </Box>
    </div>
  );
}