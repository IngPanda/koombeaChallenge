const Joi = require('joi');
const myCustomJoi = Joi.extend(require('joi-phone-number'));

const validateField = (inputData) => {
    const schema = Joi.object({
        name: Joi.string().invalid('-').required(),
        date_birth : Joi.string().isoDate().required(),
        phone: myCustomJoi.string().phoneNumber({ defaultCountry: 'BE', format: 'e164' }).required(),
        address: Joi.required(),
        number_card: Joi.required(),
        email: Joi.string().email()
    });
    const validate = schema.validate(inputData);
    return validate;
};

const processDataFile = async (datFile,fileId) => {
    if(!processDataFile.length) return [];
    let infoData = datFile;
    const headers = infoData.shift();
    const nameIndex = headers.indexOf('name');
    const dateBirthIndex = headers.indexOf('date_birth');
    const phoneIndex = headers.indexOf('phone');
    const addressIndex = headers.indexOf('address');
    const numberCardIndex = headers.indexOf('credit_card');
    const emailIndex = headers.indexOf('email');

    const contactsData = [];
    for(let i=0;i<infoData.length;i++){
        const item =  infoData[i];
        const dataM = {
            name: item[nameIndex],
            date_birth: item[dateBirthIndex],
            phone: item[phoneIndex],
            address: item[addressIndex],
            number_card: item[numberCardIndex],
            // franchise_card
            email: item[emailIndex],
            // status: infoData[nameIndex],
            file_id: fileId,
        };
        
        dataM.validate = validateField(dataM);
        contactsData.push(dataM);
        
    }
    console.log(contactsData.map(m=>m.validate));
    return contactsData;
};

module.exports = { processDataFile };