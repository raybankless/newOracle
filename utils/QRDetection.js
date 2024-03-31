// utils/QRDetection.js
import { useSigner } from "@thirdweb-dev/react";

export const QRDetection = async (qrData, currentWallet) => {
  if (!qrData || !currentWallet) {
    console.error("QR data or wallet address is missing");
    return null;
  }

  try {

    if (qrData.action !== "contribute" || !qrData.eventId) {
      console.error("Invalid QR data");
      return null;
    }

    console.log("Event ID from QR:", qrData.eventId);

    // Assume `useSigner` hook is used outside and signer object is passed as an argument
    const signer = useSigner();
    const signature = await signer.signMessage(`Adding contribution to event with ID: ${qrData.eventId}`);
    console.log("Contribution signature:", signature);

    // Update the allowListed field in the database for this event
    const response = await fetch(`/api/events/updateEvent/${qrData.eventId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        update: { $push: { allowListed: currentWallet } },
      }),
    });

    const data = await response.json();
    if (data.success) {
      console.log("Allowlist updated successfully", data.event);
    } else {
      console.error("Failed to update allowlist", data.message);
    }

    return qrData.eventId;
  } catch (error) {
    console.error("Error processing QR data:", error);
    return null;
  }
};
