// pages/api/communities/updateCommunity.js
import dbConnect from '../../../../utils/dbConnect';
import Community from '../../../../models/Community';

export default async function handler(req, res) {
  const { method } = req;
  const { safeWallet } = req.query; // Assume safeWallet is passed as a query parameter
  const updateData = req.body;

  await dbConnect();

  if (method === 'PUT') {
    try {
      const updatedCommunity = await Community.findOneAndUpdate({ safeWallet }, updateData, {
        new: true,
        runValidators: true,
      });
      if (!updatedCommunity) {
        return res.status(404).json({ success: false, error: 'Community not found' });
      }
      res.status(200).json({ success: true, data: updatedCommunity });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
