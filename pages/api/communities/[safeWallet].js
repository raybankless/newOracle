// pages/api/communities/[safeWallet].js

import dbConnect from '../../../utils/dbConnect';
import Community from '../../../models/Community';

export default async function handler(req, res) {
  const {
    query: { safeWallet },
  } = req;

  await dbConnect();

  try {
    const community = await Community.findOne({ safeWallet });
    if (!community) {
      return res.status(404).json({ success: false });
    }
    res.status(200).json({ success: true, data: community });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
