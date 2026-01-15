
const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4000;

// Middleware to parse JSON bodies
app.use(express.json());

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
    
    // Check if no showrooms found for the pincode
    if (filteredShowrooms.length === 0) {
        return res.send("Invalid pincode: we do not serve this pincode, can you please provide me with another one");
    }
    
    res.send(formatShowroomNames(filteredShowrooms));
});

// API to compare two dates
// Expects POST body with: date1 and date2 in format dd/mm/yyyy
// Returns 1 if date1 <= date2, else returns 0
app.post('/compare-dates', (req, res) => {
    const { date1, date2 } = req.body;
    
    if (!date1 || !date2) {
        return res.status(400).json({ error: 'Both date1 and date2 are required in request body in dd/mm/yyyy format' });
    }
    
    try {
        // Parse dates from dd/mm/yyyy format
        const parseDate = (dateStr) => {
            const [day, month, year] = dateStr.split('/');
            return new Date(year, month - 1, day);
        };
        
        const parsedDate1 = parseDate(date1);
        const parsedDate2 = parseDate(date2);
        
        // Check if dates are valid
        if (isNaN(parsedDate1.getTime()) || isNaN(parsedDate2.getTime())) {
            return res.status(400).json({ error: 'Invalid date format. Use dd/mm/yyyy' });
        }
        
        // Compare dates: return 1 if date1 <= date2, else return 0
        const result = parsedDate1 <= parsedDate2 ? 1 : 0;
        res.json({ result });
        
    } catch (error) {
        res.status(400).json({ error: 'Error parsing dates. Please use dd/mm/yyyy format' });
    }
});

// API to check home test availability for a given pincode
// Returns 1 if home test is available, 0 if not available
app.get('/check_home_test/:pin', (req, res) => {
    const pincode = req.params.pin;
    
    if (!pincode) {
        return res.status(400).json({ error: 'Pincode is required as query parameter' });
    }
    
    // List of pincodes that have home test availability
    const homeTestAvailablePincodes = ['110001', '560001'];
    
    // Check if the provided pincode has home test availability
    const result = homeTestAvailablePincodes.includes(pincode) ? 1 : 0;
    
    res.json({ result });
});

// Wrapper function to format showroom names
function formatShowroomNames(showroomsList) {
    return showroomsList.map(showroom => showroom.name).join(', ');
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
