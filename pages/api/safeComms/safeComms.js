// api/safeComms/safeComms.js
/*import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Use CORS to allow cross-origin requests
app.use(express.json());

app.get('/api/safes/:ownerAddress', async (req, res) => {
  const { ownerAddress } = req.params;
  const url = `https://safe-transaction-optimism.safe.global/v1/owners/${ownerAddress}/safes/`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching safes: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data); // Send the fetched safes back to the client
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
*/