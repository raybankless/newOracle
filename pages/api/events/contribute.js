// /pages/api/events/contribute/[eventId].js

import dbConnect from '../../../utils/dbConnect';
import Event from '../../../models/Event';

export default async function handler(req, res) {
  const { query: { eventId }, body } = req;

  await dbConnect();

  if (req.method === 'POST') {
    try {
      const updatedEvent = await Event.findByIdAndUpdate(
        eventId, 
        { $push: { allowListed: body } },
        { new: true }
      );
      if (!updatedEvent) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      res.status(200).json({ success: true, message: 'Contribution added successfully', event: updatedEvent });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}