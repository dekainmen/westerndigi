const supabase = require("../config/supabase");

module.exports = {
  async createUser(userData) {
    const { data, error } = await supabase
      .from("profiles")
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserById(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUser(userId, updateData) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async createAddress(addressData) {
    const { data, error } = await supabase
      .from("addresses")
      .insert([addressData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAddressesByUserId(userId) {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId);
    
    if (error) throw error;
    return data;
  },

  async updateAddress(addressId, updateData) {
    const { data, error } = await supabase
      .from("addresses")
      .update(updateData)
      .eq("id", addressId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteAddress(addressId) {
    const { data, error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", addressId);
    
    if (error) throw error;
    return data;
  }
};
