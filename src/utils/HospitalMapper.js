export function hospitalTypeComboMapper(response){
    if(response !== null){
        const hospitalType = response.map((item) => ({
            value : item.name,
            key : item.id
        }));
        return hospitalType;
    }
}

export function hospitalNewRecord(formValues){
    if(formValues.id === undefined || formValues.id === null){
        const request = {
            hospital:{
                hospitalName : formValues.hospitalName,
                hospitalAdress : formValues.hospitalAdress,
                hospitalType : formValues.hospitalType
            }
        }
        return request;
    }else{
        const request = {
            hospital:{
                hospitalId : formValues.id,
                hospitalName : formValues.hospitalName,
                hospitalAdress : formValues.hospitalAdress,
                hospitalType : maptoNumberHosptailType(formValues.hospitalType)
            }
        }
        return request;
    }
    
}

export function hospitalComboMapper(response){
    if(response !== null){
        const hospital = response.map((item) => ({
            value : item.hospitalName,
            key : item.hospitalId
        }));
        return hospital;
    }
}

export function getHospitalRecord(response){
    if(response !== null){
        const hospitalRecord = response.map((item) =>({
            id : item.hospitalId,
            hospitalName : item.hospitalName,
            hospitalAdress : item.hospitalAdress ,
            hospitalType : maptoStrHosptailType(item.hospitalType)

        }));
        return hospitalRecord;
    }
}

export function deleteHospitalRequest(id){
    const request = {
        id: id
    }
    return request;
}

function maptoStrHosptailType(hospitalType){
    let strHospitalType = "";
    switch(hospitalType){
        case 1:
            strHospitalType = "Diş Hastanesi"
            break;
        case 2 : 
            strHospitalType = "Göz Hastanesi"
            break;
        case 3:
            strHospitalType = "Genel Hastane"
            break;
        case 4:
            strHospitalType = "Diğer"
            break;
        default :
            return strHospitalType;
    }
    return strHospitalType;
}

function maptoNumberHosptailType(hospitalType){
    let numberHospitalType = 0;
    switch(hospitalType){
        case "Diş Hastanesi":
            numberHospitalType = 1
            break;
        case "Göz Hastanesi" : 
            numberHospitalType = 2
            break;
        case "Genel Hastane":
            numberHospitalType = 3
            break;
        case "Diğer":
            numberHospitalType = 4
            break;
        default : 
            return numberHospitalType;
    }
    return numberHospitalType;
}

