import React, { useState , useEffect  } from "react";
import {
  FormControl,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button
} from '@mui/material';
import Box from '@mui/material/Box';
import Textarea from '@mui/joy/Textarea';
import { Grid } from "@mui/material";
import axios from 'axios';
import {hospitalComboMapper } from "../utils/HospitalMapper";
import {patientNewRecord} from "../utils/PatientMapper"
import { toast } from "react-toastify";
export default function PatientAdd() {

  const initialValues = {
    patientFirstName: "",
    patientLastName : "" ,
    patientGender : 0,
    patientAge : "",
    patientTc : "",
    patientAdress: "",
    patientComplaint : "",
    hospital: 5,
};

const [formValues, setFormValues] = useState(initialValues);
const [hospitals , setHospital] = useState([]);

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
      let request = patientNewRecord(formValues);
      addPatient(request);
    }
};

const controlFormValue = (formValues) => {
  let controlValue = true;
  debugger;
  if(formValues.patientFirstName === null  || formValues.patientFirstName.trim() === '' ){
     toast.info("Hasta Adı Boş Girilemez");
     controlValue = false;
  }
  if(formValues.patientLastName === null  || formValues.patientLastName.trim() === '' ){
    toast.info("Hasta Soyadı Boş Girilemez");
    controlValue = false;
  }
  if(formValues.patientGender === null  || formValues.patientGender === '' ){
    toast.info("Hasta Cinsiyeti  Boş Girilemez");
    controlValue = false;
  }
  if(formValues.patientTc === null  || formValues.patientTc.trim() === '' ){
    toast.info("Hasta TC  Boş Girilemez");
    controlValue = false;
  }else if (formValues.patientTc.length !== 11){
    toast.info("Hastanın TC Numarası  11 Haneli Olmalı");
    controlValue = false;
  }
  if(formValues.patientAge === null  || formValues.patientAge === 0 ){
    toast.info("Hasta Yaşı  Boş Girilemez");
    controlValue = false;
  }
  if(formValues.patientAdress === null  || formValues.patientAdress.trim() === '' ){
    toast.info("Hasta Adresi  Boş Girilemez");
    controlValue = false;
  }
  if(formValues.patientComplaint === null  || formValues.patientComplaint.trim() === '' ){
    toast.info("Hasta Şikayeti  Boş Girilemez");
    controlValue = false;
  }
  return controlValue;
};

async function listHospitalCombo() {
    axios.get("http://localhost:8080/hospital/getAllHospital")
    .then((response) => {
      debugger;
      setHospital(hospitalComboMapper(response.data.hospitalList));
    })
    .catch((error) => {
      console.error(error);
    });
}

async function addPatient(request){
    axios.post('http://localhost:8080/patient/addPatient', request)
    .then(function (response) {
      if(response.data.success){
        toast.success("Kayıt İşlemi Başarılı");
      }else{
        toast.error("Kayıt İşlemi yapılırken hata alındı" + response.data.message);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

useEffect(() => {
  listHospitalCombo();
}, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container alignItems="center" justify="center" direction="column">
          <Box sx={{ p: 2, color: '#1976d2' }}> 
          <h2>Hasta Kayıt Formu</h2>
          </Box>
          <Grid item>
            <TextField
              id="patientFirstName"
              name="patientFirstName"
              label="Hasta Adı"
              type="text"
              value={formValues.patientFirstName}
              onChange={handleInputChange}
            />
            <TextField
              sx={{
                left : 20
              }}
              id="patientLastName"
              name="patientLastName"
              label="Hasta Soyadı"
              type="text"
              value={formValues.patientLastName}
              onChange={handleInputChange}
            />
          </Grid>
          <br />
          <br />
          <Grid item>
            <FormControl>
              <FormLabel>Hasta Cinsiyeti</FormLabel>
              <RadioGroup
                name="patientGender"
                value={formValues.gender}
                onChange={handleInputChange}
                row
              >
                <FormControlLabel
                  key="female"
                  value={1}
                  control={<Radio size="small" />}
                  label="Kadın"
                />
                <FormControlLabel
                  key="male"
                  value={2}
                  control={<Radio size="small" />}
                  label="Erkek"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <br />
          <Grid item>
            <TextField
              id="patientAge"
              name="patientAge"
              label="Hasta Yaşı"
              type="number"
              value={formValues.patientAge}
              onChange={handleInputChange}
            />
            <TextField
              sx={{
                left : 20
              }}
              id="patientTc"
              name="patientTc"
              label="Hasta TC"
              type="text"
              value={formValues.patientTc}
              onChange={handleInputChange}
            />
          </Grid>

          <br />
          <br />
          
          <Grid item>
            <Textarea
              id="patientAdress"
              name="patientAdress"
              placeholder="Hasta Adresi"
              size="lg"
              type="text"
              sx = {{
                marginRight : 30,
                width : "105%"
              }}
              value={formValues.patientAdress}
              onChange={handleInputChange}
            />
          </Grid>
          <br />
          <Grid item>
            <Textarea
              sx = {{
              marginRight : 30,
              width : "105%"
               }}
              id="patientComplaint"
              name="patientComplaint"
              placeholder="Hasta Şikayeti"
              size="lg"
              type="text"
              value={formValues.patientComplaint}
              onChange={handleInputChange}
            />
          </Grid>
          <br />
          <Grid item>
            <FormControl>
              <InputLabel>Hastane İsmi</InputLabel>
              <Select
                name="hospital"
                value={formValues.hospital}
                onChange={handleInputChange}
                label="Hastane İsmi"
                sx = {{
                  marginRight : 30,
                  width : "105%"
                   }}
              >
                {hospitals.map((item) => (
                  <MenuItem key={item.key} value={item.key}>
                    {item.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <br/>
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
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
