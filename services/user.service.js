const supabase = require("../config/supabase");
const userRepository = require("../repositories/user.repository");

module.exports = {
  async signup(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;

    if (data.user) {
      await userRepository.createUser({
        id: data.user.id,
        email: data.user.email,
        ...userData
      });
    }

    return data;
  },

  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    return data;
  },

  async getProfile(userId) {
    const user = await userRepository.getUserById(userId);
    return user;
  },

  async updateProfile(userId, updateData) {
    const user = await userRepository.updateUser(userId, updateData);
    return user;
  },

  async listAddresses(userId) {
    const addresses = await userRepository.getAddressesByUserId(userId);
    return addresses;
  },

  async createAddress(userId, addressData) {
    const address = await userRepository.createAddress({
      user_id: userId,
      ...addressData
    });
    return address;
  },

  async updateAddress(addressId, updateData) {
    const address = await userRepository.updateAddress(addressId, updateData);
    return address;
  },

  async deleteAddress(addressId) {
    await userRepository.deleteAddress(addressId);
    return { success: true };
  }
};
