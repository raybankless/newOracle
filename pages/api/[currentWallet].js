// pages/api/events/[walletAddress].js
import dbConnect from '../../utils/dbConnect';
import Event from '../../models/Event';

export default async function handler(req, res) {
  const { query: { currenWallet } } = req;

  await dbConnect();

  if (req.method === 'GET') {
    try {
      const events = await Event.find({ creatorWallet: currenWallet });
      res.status(200).json({ success: true, data: events });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    // Handle any other HTTP method
    res.status(405).end(); // Method Not Allowed
  }
}
