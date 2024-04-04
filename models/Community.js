// models/Community.js
import mongoose from 'mongoose';

const CommunitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  safeWallet: {
    type: String,
    required: true,
    unique: true,
  },
  ownerWallets: [String],
  webLink: String,
});

module.exports = mongoose.models.Community || mongoose.model('Community', CommunitySchema);
