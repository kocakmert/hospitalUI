export function patientNewRecord(formValues){
    const request = {
        patient:{
            patientFirstName : formValues.patientFirstName,
            patientLastName : formValues.patientLastName,
            patientGender : formValues.patientGender,
            patientTc : formValues.patientTc,
            patientAge : formValues.patientAge,
            patientAdress : formValues.patientAdress,
            patientComplaint : formValues.patientComplaint,
            hospital : {
                "hospitalId": formValues.hospital,
            }
        }
    }
    return request;
}
