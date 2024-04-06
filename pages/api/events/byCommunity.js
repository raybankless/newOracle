// pages/api/events/byCommunity.js

import dbConnect from '../../../utils/dbConnect';
import Event from '../../../models/Event';

export default async function handler(req, res) {
  const { communityWallet } = req.query;

  await dbConnect();

  try {
    const events = await Event.find({ community: communityWallet }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
