require('dotenv').config();

const usingENV = (req, res) => {
    const APIID = process.env.API_ID;
    return APIID
}
module.exports = usingENV;