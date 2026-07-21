const userService = require("../services/user.service");

exports.getProfile = async (req, res) => {
  try {
    const profile = await userService.getProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Failed to get profile" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profile = await userService.updateProfile(req.user.id, req.body);
    res.json(profile);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

exports.listAddresses = async (req, res) => {
  try {
    const addresses = await userService.listAddresses(req.user.id);
    res.json(addresses);
  } catch (err) {
    console.error("List addresses error:", err);
    res.status(500).json({ error: "Failed to list addresses" });
  }
};

exports.createAddress = async (req, res) => {
  try {
    const address = await userService.createAddress(req.user.id, req.body);
    res.json(address);
  } catch (err) {
    console.error("Create address error:", err);
    res.status(500).json({ error: "Failed to create address" });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const address = await userService.updateAddress(req.params.id, req.body);
    res.json(address);
  } catch (err) {
    console.error("Update address error:", err);
    res.status(500).json({ error: "Failed to update address" });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    await userService.deleteAddress(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete address error:", err);
    res.status(500).json({ error: "Failed to delete address" });
  }
};
