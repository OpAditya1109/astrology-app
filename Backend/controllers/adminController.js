const Admin = require("../models/Admin");

// Credit admin wallet
const creditAdminWallet = async ({ amount, description, referenceId }) => {
  try {
    // Assuming there is only one admin
    let admin = await Admin.findOne();
    if (!admin) {
      // Create default admin if not exists
      admin = await Admin.create({ email: "admin@yourapp.com" });
    }

    // Update wallet
    admin.wallet.balance += amount;
    admin.wallet.transactions.push({
      type: "credit",
      amount,
      description,
      referenceId,
    });

    await admin.save();
    return admin;
  } catch (err) {
    console.error("Error crediting admin wallet:", err);
    throw err;
  }
};

module.exports = { creditAdminWallet };
