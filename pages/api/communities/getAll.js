// pages/api/communities/getAll.js
import dbConnect from '../../../utils/dbConnect';
import Community from '../../../models/Community';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const communities = await Community.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ success: true, data: communities });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}