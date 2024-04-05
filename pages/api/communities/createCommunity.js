import dbConnect from '../../../utils/dbConnect';
import Community from '../../../models/Community';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === 'POST') {
    try {
      // Check if a community with the same safeWallet already exists
      const existingCommunity = await Community.findOne({ safeWallet: req.body.safeWallet });
      if (existingCommunity) {
        return res.status(409).json({ success: false, error: 'Community already exists with the provided safeWallet.' });
      }

      // If no existing community is found, proceed to create a new one
      const community = await Community.create(req.body);
      res.status(201).json({ success: true, data: community });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
