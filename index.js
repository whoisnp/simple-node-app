const express = require('express');
const os = require('os');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Function to get the private IP address
function getPrivateIp() {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        for (const iface of networkInterfaces[interfaceName]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'Private IP not found';
}

// Fetch the public IP address from AWS metadata
async function getPublicIp() {
    try {
        const response = await axios.get('http://169.254.169.254/latest/meta-data/public-ipv4', { timeout: 1000 });
        return response.data;
    } catch (err) {
        return 'Public IP not found';
    }
}

// Root endpoint
app.get('/', async (req, res) => {
    const privateIp = getPrivateIp();
    const publicIp = await getPublicIp();

    res.send(`
        <h1>Hello, World!</h1>
        <p>This is my Node.js app deployed on an EC2 instance.</p>
        <p>Private IP: ${privateIp}</p>
        <p>Public IP: ${publicIp}</p>
    `);
});

// Start the server
app.listen(PORT, async () => {
    const privateIp = getPrivateIp();
    const publicIp = await getPublicIp();

    console.log(`Server is running at:`);
    console.log(`Private IP: http://${privateIp}:${PORT}`);
    console.log(`Public IP: http://${publicIp}:${PORT}`);
});
