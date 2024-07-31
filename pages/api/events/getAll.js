// pages/api/events/getAll.js
import dbConnect from '../../../utils/dbConnect';
import Event from '../../../models/Event';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const events = await Event.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch events', error: error.message });
  }
}