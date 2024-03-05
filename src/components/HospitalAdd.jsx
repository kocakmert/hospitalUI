import React, { useState , useEffect  } from "react";
import {
  FormControl,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  Button
} from '@mui/material';
import Box from '@mui/material/Box';
import Textarea from '@mui/joy/Textarea';
import { Grid } from "@mui/material";
import axios from 'axios';
import { hospitalTypeComboMapper,hospitalNewRecord } from "../utils/HospitalMapper";
import { toast } from "react-toastify";
import  {useNavigate}  from 'react-router-dom';
export default function Hospital() {
const initialValues = {
  hospitalName: "",
  hospitalAdress: "",
  hospitalType: "1",
};

const navigate = useNavigate();
const [formValues, setFormValues] = useState(initialValues);
const [hospitalType , setHospitalType] = useState([]);

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
        ...formValues,
        [name]: value,
    });
};

const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formValues);
    let controlTrue = controlFormValue(formValues);
    if(controlTrue){
      let request = hospitalNewRecord(formValues);
      addHospital(request);
    }
};

const controlFormValue = (formValues) => {
  let controlValue = true;
  if(formValues.hospitalName === null  || formValues.hospitalName.trim() === '' ){
     toast.info("Hastane İsmi Boş Girilemez");
     controlValue = false;
  }
  if(formValues.hospitalAdress === null  || formValues.hospitalAdress.trim() === '' ){
    toast.info("Hastane Adresi  Boş Girilemez");
    controlValue = false;
  }
  if(formValues.hospitalType === null  ){
    toast.info("Hastane Türü  Boş Girilemez");
    controlValue = false;
  }
  return controlValue;
};

async function addHospital(request){
  axios.post('http://localhost:8080/hospital/addHospital', request)
  .then(function (response) {
    if(response.data.success){
      toast.success("Kayıt İşlemi Başarılı");
      navigate('/hospitalDetailPage');
    }else{
      toast.error("Kayıt İşlemi yapılırken hata alındı" + response.data.message);
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

async function listHospitalTypeCombo() {
  axios.get('http://localhost:8080/hospitalTypes/getHospitalTypeAll')
  .then(response => {
    setHospitalType(hospitalTypeComboMapper(response.data.hospitalTypeList));
  })
  .catch(error => {
    console.error(error);
  });
}

useEffect(() => {
  listHospitalTypeCombo();
}, [])

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container alignItems="center" justify="center" direction="column" >
        <Box sx={{ p: 2, color: '#1976d2' }}> 
          <h2>Hasta Kayıt Formu</h2>
          </Box>
          <Grid item >
            <TextField
              id="hospitalName"
              name="hospitalName"
              label="Hastane Adı"
              type="text"
              value={formValues.hospitalName}
              onChange={handleInputChange}
              sx = {{
                width : "105%",
                marginRight : 25,

              }}
            />
          </Grid>
          <br />
          <Grid item>
            <Textarea
              id="hospitalAdress"
              name="hospitalAdress"
              placeholder="Hastane Adresi"
              size = "lg"
              type="text"
              value={formValues.hospitalAdress}
              onChange={handleInputChange}
              sx = {{
                width : "105%",
                marginRight : 28,

              }}
            />
          </Grid>
           <br />
           <br />
          <Grid item>
            <FormControl>
            <InputLabel>Hastane Türü</InputLabel>
              <Select
                name="hospitalType"
                variant="outlined"
                value={formValues.hospitalType}
                onChange={handleInputChange}
                label = "Hastane Türü"
                sx = {{
                  marginRight : 35,
                  width : "105%"
                   }}
              >
                {hospitalType.map((item) => (
                  <MenuItem key={item.key} value={item.key}>
                    {item.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <br />
          <br />
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{
                backgroundColor: "#1976d2",
                margin: "5px",
              }}
            >
              Kaydet
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
