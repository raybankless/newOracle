// models/Event.js
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: String,
  description: String,
  scopeOfWork: [String],
  startDate: Date,
  endDate: Date,
  location: String,
  headerImage: String,
  creatorWallet: String,
  closed: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model('Event', eventSchema);
