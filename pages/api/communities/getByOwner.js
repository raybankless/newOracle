// pages/api/communities/getByOwner.js
import dbConnect from '../../../utils/dbConnect';
import Community from '../../../models/Community';

export default async function handler(req, res) {
  const {
    query: { ownerWallet },
  } = req;

  await dbConnect();

  try {
    const communities = await Community.find({ ownerWallets: ownerWallet });
    if (!communities.length) {
      return res.status(404).json({ success: false, message: 'No communities found for this owner.' });
    }
    res.status(200).json({ success: true, data: communities });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
