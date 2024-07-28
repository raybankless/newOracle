const updatePercentFee = async () => {
  try {
    console.log("Starting updatePercentFee function");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    console.log("Signer address:", signerAddress);

    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    // Additional check: Get the current percent fee
    const currentFee = await contract.getPercentFee();
    console.log(
      "Current percent fee:",
      ethers.utils.formatUnits(currentFee, 18),
    );

    // Convert the percentage to the correct format (18 decimal places)
    // Ensure the input is treated as a percentage (e.g., 10 for 10%)
    const percentFeeInWei = ethers.utils.parseUnits(
      (parseFloat(newPercentFee) / 100).toString(),
      18,
    );
    console.log("New percent fee in wei:", percentFeeInWei.toString());

    if (percentFeeInWei.gt(ethers.utils.parseUnits("1", 18))) {
      throw new Error("Percentage fee cannot exceed 100%");
    }

    // Additional check: Estimate gas
    const gasEstimate =
      await contract.estimateGas.updatePercentFee(percentFeeInWei);
    console.log("Estimated gas:", gasEstimate.toString());

    // Try to send the transaction
    // If it fails due to permissions, it will throw an error
    const tx = await contract.updatePercentFee(percentFeeInWei, {
      gasLimit: gasEstimate.mul(120).div(100), // Add 20% buffer to the estimate
    });
    console.log("Transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);

    // Refresh the contract info after updating
    await fetchContractInfo();

    console.log("Percentage fee updated successfully");
  } catch (err) {
    console.error("Error updating percentage fee:", err);
    if (err.error && err.error.data) {
      console.error("Error data:", err.error.data);
    }
    if (err.message.includes("Ownable: caller is not the owner")) {
      setError(
        "You are not the contract owner. Only the owner can update the percentage fee.",
      );
    } else {
      setError(
        err.message || "An error occurred while updating the percentage fee",
      );
    }
  }
};
