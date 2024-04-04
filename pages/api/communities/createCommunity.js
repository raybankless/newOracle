// pages/api/communities/createCommunity.js
import dbConnect from '../../../utils/dbConnect';
import Community from '../../../models/Community';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === 'POST') {
    try {
      console.log(req.body)
      const community = await Community.create(req.body); // Create a new community with the data provided in the request body
      res.status(201).json({ success: true, data: community });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}