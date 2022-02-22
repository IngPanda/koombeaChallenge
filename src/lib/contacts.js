const BaseJoi = require('joi');
const JoiPhoneNumberExtensions = require('joi-phone-number-extensions');
const Joi = BaseJoi.extend(JoiPhoneNumberExtensions);

const validateField = (inputData) => {
    const schema = Joi.object({
        name: Joi.string().invalid('-').require(),
        date_birth : Joi.string().isoDate().require(),
        phone: Joi.phoneNumber().defaultRegion('US').type('MOBILE').format('E164').require(),
        address: Joi.require(),
        number_card: Joi.require(),
        email: Joi.string().email()
    });
    schema.validate(inputData);
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
    console.log(infoData);
    // TODO VALIDATE DATA
    const contactsData = [];
    for(let i=0;i<infoData.length;i++){
        const item =  infoData[i];
        contactsData.push({
            name: item[nameIndex],
            date_birth: item[dateBirthIndex],
            phone: item[phoneIndex],
            address: item[addressIndex],
            number_card: item[numberCardIndex],
            // franchise_card
            email: item[emailIndex],
            // status: infoData[nameIndex],
            file_id: fileId,
        });
    }
    return contactsData;
};

module.exports = { processDataFile };