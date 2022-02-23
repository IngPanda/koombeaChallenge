const Joi = require('joi');
const myCustomJoi = Joi.extend(require('joi-phone-number'))
const creditCardType = require("credit-card-type");
const db = require('../database');
const { readCsv, deleteFile, encrypt } = require('../lib/utils');
/**
 * Used to process the contact data if they meet the validations
 * @param {object[]} inputData 
 * @param {string[]} emails 
 * @returns vallidate
 */
const validateField = (inputData, emails) => {
    
    const schema = Joi.object({
        name: Joi.string().invalid('-').required(),
        date_birth : Joi.string().isoDate().required(),
        phone: myCustomJoi.string().phoneNumber({ defaultCountry: 'BE', format: 'e164' }).required(),
        address: Joi.string().required(),
        status: Joi.string().required(),
        number_card: Joi.string().required(),
        email: Joi.string().email().required(),
        franchise_card: Joi.string().required(),
        file_id: Joi.number(),
    });
    const validate = schema.validate(inputData);
    if(!validate.error)
        if(emails.includes(inputData.email))
            return { error: { message: 'the email must be unique' }};
    return validate;
};

/**
 * used to extract the data from the stored file
 * @param {object[]} datFile 
 * @param {number} fileId 
 * @param {number} userId 
 * @returns 
 */
const processDataFile = async (datFile,fileId,userId) => {
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
    const contactsDataJson = [];
    for(let i=0;i<infoData.length;i++){
        const item =  infoData[i];
        var visaCards = creditCardType(item[numberCardIndex]);
        const dataToValidate = {
            name: item[nameIndex],
            date_birth: item[dateBirthIndex],
            phone: item[phoneIndex],
            address: item[addressIndex],
            number_card: encrypt(item[numberCardIndex]),
            franchise_card: visaCards.length ? visaCards[0].niceType : null,
            email: item[emailIndex],
                status: 'Ok',
            file_id: fileId,   
        };
        const error = validateField(dataToValidate,contactsDataJson.map(d=>d.email));
        const dataM = [
            item[nameIndex],
            item[dateBirthIndex],
            item[phoneIndex],
            item[addressIndex],
            item[numberCardIndex],
            visaCards.length ? visaCards[0].niceType : '-',
            item[emailIndex],
            error.error ? 'Error -'+ error.error.message.replace(/[^a-z0-9 \.,_-]/gim,"") : 'Ok',
            fileId,   
        ];
        contactsData.push(dataM);
        contactsDataJson.push(dataToValidate);
    }
    
    await db.pool.batch(
        "INSERT INTO contacts (name,date_birth,phone,address,number_card,franchise_card,email,status,file_id) VALUE (?,?,?,?,?,?,?,?,?)"
        ,contactsData).then(res => {
            console.log(res.affectedRows); 
          }).catch(error => { console.log(error)});
    
    await db.pool.query("UPDATE files SET status = 'processing' WHERE id = ?; ",[fileId]);    
    return contactsData;
};
/**
 * Start processing the data
 * @param {number} fileId 
 * @param {number} userId 
 * @returns 
 */
const processFile = async (fileId,userId) => {
    let files = await db.pool.query("select * from files where user_id = ? AND id = ?",[userId, fileId]);
    let file = files.filter((data, index) => index !== 'meta');
    if(!file.length) return 0;
    const csvData = await readCsv(file[0].path);
    await processDataFile(csvData,fileId);
    return fileId;
}; 

module.exports = { processFile };