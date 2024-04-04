// server.js 
/*
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 3001; // Make sure this port is different from your React app's port

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.get('/api/safes/:ownerAddress', async (req, res) => {
  const { ownerAddress } = req.params;
  // Ensure you're using the correct URL for the Safe Transaction Service API
  const url = `https://safe-transaction-optimism.safe.global/api/v1/owners/${ownerAddress}/safes`;

  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Error fetching safes: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data); // Send the fetched data back to the client
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
*/