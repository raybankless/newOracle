// pages/api/events/[eventId].js - find the event with the given eventId
import dbConnect from '../../../utils/dbConnect';
import Event from '../../../models/Event';

export default async function handler(req, res) {
  const {
    query: { eventId },
  } = req;

  await dbConnect();

  try {
    const event = await Event.findById(eventId); // Use Mongoose to find the event by its ID

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, event });
  } catch (error) {
    res.status(400).json({ success: false, error: error.toString() });
  }
}
