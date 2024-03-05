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

export function getPatientRecord(response){
    if(response !== null || response !== undefined){
        const hospitalRecord = response.map((item) =>({
            id : item.patientId,
            patientFirstName : item.patientFirstName,
            patientLastName : item.patientLastName ,
            patientGender : mapToGenderStr(item.patientGender),
            patientAge : item.patientAge,
            patientTc : item.patientTc ,
            patientAdress : item.patientAdress ,
            patientComplaint : item.patientComplaint,
            hospitalName : item.hospital.hospitalName,
            hospitalId : item.hospital.hospitalId
        }));
        return hospitalRecord;
    }
}

export function deletePatientRequest(id){
    const request = {
        patientId: id
    }
    return request;
}

export function patientUpdateRecord(item){
        const request = {
          patient: {
            patientId: item.id,
            patientFirstName: item.patientFirstName,
            patientLastName: item.patientLastName,
            patientGender: mapStrToGenderInt(item.patientGender),
            patientAge: item.patientAge,
            patientTc: item.patientTc,
            patientAdress: item.patientAdress,
            patientComplaint: item.patientComplaint,
            hospital : {
                hospitalId : item.hospitalId,
            }

          },
        };
        return request;
}

function mapStrToGenderInt(params){
    let gender = 1;
    if(params === "Kadın"){
        gender = 1;
    }else if(params === "Erkek"){
        gender = 2;
    }
    return gender;
}

function mapToGenderStr(params) {
    let gender = "";
    if(params === 1){
        gender = "Kadın";
    }else if(params === 2){
        gender = "Erkek";
    }
    return gender;
}