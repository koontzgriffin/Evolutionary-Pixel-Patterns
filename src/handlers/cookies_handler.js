
const defaultValidInactiveNeighborhoods  = ['000101000', '000101001', '000101100', '000101101', '000101111', '001100001', '001100101', '001100110', '001100111', '001101000', '001101001', '001101100', '001101101', '001101111', '010000010', '010000011', '010000101', '010000110', '010000111', '011000010', '011000011', '011000101', '011000110', '011000111', '011001101', '100001111', '100001101', '100001100', '100001011', '100101000', '100101001', '100101101', '100101100', '100101111', '101000010', '101000011', '101000101', '101000110', '101000111', '101001011', '101001100', '101001101', '101001111', '101100001', '101100101', '101100110', '101100111', '101101000', '101101001', '101101100', '101101101', '101101111', '110000010', '110000011', '110000101', '110000110', '110000111', '110100001', '110100101', '110100110', '110100111', '111000010', '111000011', '111000101', '111000110', '111000111', '111001011', '111001100', '111001101', '111001111', '111100001', '111100101', '111101000', '111100111', '111100110', '111101001', '111101101', '111101100', '011001111', '011001011', '011001100'];
const defaultValidActiveNeighborhoods = ['000010010','000111000','000011001','000011010','000011000','000010110','000010011','000011110','000110010','000110011','000110100','000111001','000111100','000111101','001011000','001011010','001111000','010010000','010010010','010010011','010010110','010011001','010110000','010110100','011010000','011010010','011010110','011110000','100110000','100110010','100110011','100111000','100111001','110010010','110010011','110010000','110010110','110011000','110011001','011010011','010011000','011110100','101111000','000110000','000010000'];

// Function to set the "allowedNeighborhoods" cookie
function setAllowedInactiveNeighborhoodsCookie(neighborhoodsArray, expiryDays = 30) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    const encodedNeighborhoods = encodeURIComponent(JSON.stringify(neighborhoodsArray));
    document.cookie = `allowedInactiveNeighborhoods=${encodedNeighborhoods}; expires=${expiryDate.toUTCString()}; path=/`;
}

// Function to get the "allowedNeighborhoods" cookie
function getAllowedInactiveNeighborhoodsCookie() {
    console.log("getting cookie...");
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'allowedInactiveNeighborhoods') {
            return JSON.parse(decodeURIComponent(value));
        }
    }
    console.log("no cookie found.");
    return defaultValidInactiveNeighborhoods; // Return default if the cookie is not found
}

// Function to set the "allowedNeighborhoods" cookie
function setAllowedActiveNeighborhoodsCookie(neighborhoodsArray, expiryDays = 30) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    const encodedNeighborhoods = encodeURIComponent(JSON.stringify(neighborhoodsArray));
    document.cookie = `allowedActiveNeighborhoods=${encodedNeighborhoods}; expires=${expiryDate.toUTCString()}; path=/`;
}

// Function to get the "allowedNeighborhoods" cookie
function getAllowedActiveNeighborhoodsCookie() {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'allowedActiveNeighborhoods') {
            return JSON.parse(decodeURIComponent(value));
        }
    }
    console.log("no cookie found.");
    return defaultValidActiveNeighborhoods; // Return default if the cookie is not found
}