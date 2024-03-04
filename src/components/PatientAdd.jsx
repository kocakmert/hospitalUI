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
    let request = patientNewRecord(formValues);
    addPatient(request);
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
          <h2>Hasta Kayıt Ekranı</h2>
          <Grid item>
            <TextField
              id="patientFirstName"
              name="patientFirstName"
              label="Hasta Adı"
              type="text"
              required
              value={formValues.patientFirstName}
              onChange={handleInputChange}
            />
            <TextField
              id="patientLastName"
              name="patientLastName"
              label="Hasta Soyadı"
              type="text"
              required
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
                  value={0}
                  control={<Radio size="small" />}
                  label="Kadın"
                />
                <FormControlLabel
                  key="male"
                  value={1}
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
              required
              value={formValues.patientAge}
              onChange={handleInputChange}
            />
            <TextField
              id="patientTc"
              name="patientTc"
              label="Hasta TC"
              type="text"
              required
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
              required
              value={formValues.patientAdress}
              onChange={handleInputChange}
            />
          </Grid>
          <br />
          <Grid item>
            <Textarea
              id="patientComplaint"
              name="patientComplaint"
              placeholder="Hasta Şikayeti"
              size="lg"
              type="text"
              required
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
