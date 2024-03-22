// pages/api/events/create.js
import dbConnect from '../../../utils/dbConnect';
import Event from '../../../models/Event';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const event = new Event(req.body);
      await event.save();
      res.status(201).json({ success: true, event });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
