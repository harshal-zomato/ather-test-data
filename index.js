
const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4000;

// Mock Data
// 20 mock data objects for 5 unique pincodes
// Includes 'home test' for 2 pincodes (110001 and 560001)
const showrooms = [
    // Pincode 110001
    { name: 'home test', pincode: '110001' },
    { name: 'Delhi Central Motors', pincode: '110001' },
    { name: 'Connaught Place Wheels', pincode: '110001' },
    { name: 'Capital City Cars', pincode: '110001' },

    // Pincode 560001
    { name: 'home test', pincode: '560001' },
    { name: 'Bangalore Brigade Road Auto', pincode: '560001' },
    { name: 'MG Road Showroom', pincode: '560001' },
    { name: 'Cubbon Park Motors', pincode: '560001' },

    // Pincode 400001
    { name: 'Mumbai Fort Motors', pincode: '400001' },
    { name: 'Marine Drive Auto', pincode: '400001' },
    { name: 'Churchgate Wheels', pincode: '400001' },
    { name: 'Colaba Causeway Cars', pincode: '400001' },

    // Pincode 600001
    { name: 'Chennai Parry\'s Corner Auto', pincode: '600001' },
    { name: 'George Town Motors', pincode: '600001' },
    { name: 'Marina Beach Showroom', pincode: '600001' },
    { name: 'Fort St. George Wheels', pincode: '600001' },

    // Pincode 700001
    { name: 'Kolkata Dalhousie Motors', pincode: '700001' },
    { name: 'Esplanade Auto', pincode: '700001' },
    { name: 'New Market Wheels', pincode: '700001' },
    { name: 'Eden Gardens Cars', pincode: '700001' }
];

app.get('/showrooms/:pin', (req, res) => {
    const pin = req.params.pin;
    const filteredShowrooms = showrooms.filter(showroom => showroom.pincode === pin);
    
    // Always return a JSON array, even if empty
    res.json(filteredShowrooms);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
