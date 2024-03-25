// pages/api/events/[currentWallet].js - get the events where currentWallet is the creatorWallet
import dbConnect from '../../utils/dbConnect';
import Event from '../../models/Event';

export default async function handler(req, res) {
  const { query: { currentWallet } } = req;

  await dbConnect();

  if (req.method === 'GET') {
    try {
      const events = await Event.find({ creatorWallet: currentWallet });
      res.status(200).json({ success: true, data: events });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    // Handle any other HTTP method
    res.status(405).end(); // Method Not Allowed
  }
}
