import React, { useState , useEffect  } from "react";
import {
  FormControl,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  Button
} from '@mui/material';
import Textarea from '@mui/joy/Textarea';
import { Grid } from "@mui/material";
import axios from 'axios';
import { hospitalTypeComboMapper,hospitalNewRecord } from "../utils/HospitalMapper";

export default function Hospital() {


  const initialValues = {
    hospitalName: "",
    hospitalAdress: "",
    hospitalType: "1",
};

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
  debugger;
    event.preventDefault();
    console.log(formValues);
    let request = hospitalNewRecord(formValues);
    debugger;
    axios.post('http://localhost:8080/hospital/addHospital', request)
    .then(function (response) {
      debugger;
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};


useEffect(() => {
  axios.get('http://localhost:8080/hospitalTypes/getHospitalTypeAll')
  .then(response => {
    setHospitalType(hospitalTypeComboMapper(response.data.data));
  })
  .catch(error => {
    console.error(error);
  });
}, [])

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container alignItems="center" justify="center" direction="column" >
          <h1>Hastane Kaydet Ekranı</h1>
          <Grid item >
            <TextField
              id="hospitalName"
              name="hospitalName"
              label="Hastane Adı"
              type="text"
              required
              value={formValues.hospitalName}
              onChange={handleInputChange}
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
              required
              value={formValues.hospitalAdress}
              onChange={handleInputChange}
            />
          </Grid>
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
              >
                {hospitalType.map((item) => (
                  <MenuItem key={item.key} value={item.key}>
                    {item.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
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
