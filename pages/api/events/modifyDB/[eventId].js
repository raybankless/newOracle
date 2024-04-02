// /pages/api/events/updateEvent/[eventId].js
import dbConnect from '../../../../utils/dbConnect';
import Event from '../../../../models/Event';

export default async function handler(req, res) {
  const {
    query: { eventId },
    body: { action, ...updateData },
  } = req;

  await dbConnect();

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    let updatedEvent;

    switch (action) {
      case 'addContributor':
      const result = await addContributor(eventId, req.body);
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
      break;
      case 'updateContribution':
        // Logic for updating contribution details
        updatedEvent = await updateContribution(eventId, updateData);
        break;
      case 'mintEvent':
        // Logic for minting the event
        updatedEvent = await mintEvent(eventId, updateData);
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid action specified' });
    }

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: 'Event not found or update failed' });
    }

    res.status(200).json({ success: true, message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function addContributor(eventId, { wallet }) {
  // Implementation for adding a contributor
  try {
    console.log("addContributor : ", eventId, wallet);
    const updateResult = await Event.findOneAndUpdate(
      { _id: eventId },
      {
        $push: {
          allowListed: {
            wallet: wallet,
            measurement: 0, // Initial value, assuming it gets updated later
            unit: "", // Initial value, assuming it gets updated later
            proof: [], // Initial empty array, assuming it gets filled later
          }
        }
      },
      {
        new: true, // Return the modified document
        runValidators: true // Ensure schema validations run on update
      }
    );

    if (!updateResult) {
      return { success: false, message: 'Event not found or update failed' };
    }

    return { success: true, event: updateResult };
  } catch (error) {
    console.error("Error adding contributor:", error);
    return { success: false, message: error.toString() };
  }
}

async function updateContribution(eventId, { wallet, measurement, unit, proof }) {
  // Implementation for updating a contribution
}

async function mintEvent(eventId, data) {
  // Implementation for minting the event
}