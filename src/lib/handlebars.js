const  { DateTime } = require("luxon");
const  { decrypt } = require('./utils');

const helpers = {};

helpers.timeformat = (savedTimestamp) => {
    return DateTime.fromFormat(savedTimestamp, 'yyyy-MM-dd').toFormat('yyyy MMMML dd')
};

helpers.desencrycard = (cardnumber) => {
    return decrypt(cardnumber);
};

module.exports = helpers;