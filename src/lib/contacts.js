const Joi = require('joi');
const myCustomJoi = Joi.extend(require('joi-phone-number'))
const creditCardType = require("credit-card-type");

const validateField = (inputData) => {
    const schema = Joi.object({
        name: Joi.string().invalid('-').required(),
        date_birth : Joi.string().isoDate().required(),
        phone: myCustomJoi.string().phoneNumber({ defaultCountry: 'BE', format: 'e164' }).required(),
        address: Joi.required(),
        number_card: Joi.required(),
        email: Joi.string().email().required(),
        franchise_card: Joi.string().required(),
        file_id: Joi.number(),
    });
    const validate = schema.validate(inputData);
    return validate;
};

const processDataFile = async (datFile,fileId,userId) => {
    if(!processDataFile.length) return [];

    //let contacts = await db.pool.query("select c.* from contacts c,files f where c.file_id = f.id AND f.user_id = ?",[userId]);
    //let contactsData = contacts.filter((data, index) => index !== 'meta')[0];
    // Pending ffunction
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
        var visaCards = creditCardType(item[numberCardIndex]);
        const dataM = {
            name: item[nameIndex],
            date_birth: item[dateBirthIndex],
            phone: item[phoneIndex],
            address: item[addressIndex],
            number_card: item[numberCardIndex],
            franchise_card: visaCards.length ? visaCards[0].niceType : null,
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