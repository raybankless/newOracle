// /pages/api/events/modifyDB/[eventId].js
import dbConnect from "../../../../utils/dbConnect";
import Event from "../../../../models/Event";

export default async function handler(req, res) {
  console.log("req 1 ", req.body);
  console.log("req 2 ", req.query);
  const {
    query: { eventId },
    body: { action, ...updateData },
  } = req;

  
  await dbConnect();

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    switch (action) {
      case "addContributor":
        
        const addResult = await addContributor(eventId, req.body);
        if (!addResult.success) {
          return res.status(400).json(addResult);
        }
        return res.status(200).json(addResult);
        break;
      case "updateContribution":
        const updateResult = await updateContribution(eventId, updateData);
        if (!updateResult.success) {
          return res.status(400).json(updateResult);
        }
        return res.status(200).json(updateResult);
        break;
      case "updateTxHash":
        const txHashResult = await updateTxHash(eventId, updateData);
        if (!txHashResult.success) {
          return res.status(400).json(txHashResult);
        }
        return res.status(200).json(txHashResult);
        break;
      case "addCommunity": //adds a safeWallet (defining a community) to the event
        const communityResult = await addCommunity(eventId, req.body);
        console.log("community result : ", communityResult);
        if (!communityResult.success) {
          return res.status(400).json(communityResult);
        }
        return res.status(200).json(communityResult);
        break;
      default:
        return res
          .status(400)
          .json({ success: false, message: "Invalid action specified" });
    }
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
          },
        },
      },
      {
        new: true, // Return the modified document
        runValidators: true, // Ensure schema validations run on update
      },
    );

    if (!updateResult) {
      return { success: false, message: "Event not found or update failed" };
    }

    return { success: true, event: updateResult };
  } catch (error) {
    console.error("Error adding contributor:", error);
    return { success: false, message: error.toString() };
  }
}

async function updateContribution(eventId, { wallet, measurement, unit }) {
  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, "allowListed.wallet": wallet },
      {
        $set: {
          "allowListed.$.measurement": measurement,
          "allowListed.$.unit": unit,
        },
      },
      { new: true },
    );

    if (!updatedEvent) {
      return { success: false, message: "Contributor or event not found" };
    }

    return { success: true, event: updatedEvent };
  } catch (error) {
    console.error("Error updating contribution:", error);
    return { success: false, message: error.toString() };
  }
}

async function updateTxHash(eventId, { txHash }) {
  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId },
      { txHash: txHash }, // Ensure your schema supports this field
      { new: true },
    );

    if (!updatedEvent) {
      return { success: false, message: "Event not found" };
    }

    return { success: true, event: updatedEvent };
  } catch (error) {
    console.error("Error updating transaction hash:", error);
    return { success: false, message: error.toString() };
  }
}

async function updateProof() {}

async function addCommunity(eventId, { safeWallet }) {
  try {
    console.log("Attempting to add community with safeWallet:", safeWallet);
    const updateResult = await Event.findByIdAndUpdate(
      eventId,
      { $push: { community: safeWallet } }, // Use $set if community is not an array
      { new: true, runValidators: true }
    );

    if (!updateResult) {
      return { success: false, message: "Event not found or update failed" };
    } 

    return { success: true, event: updateResult };
  } catch (error) {
    console.error("Error adding community:", error);
    return { success: false, message: error.toString() };
  }
}