const supabase = require("../config/supabase");

module.exports = {
  async createPayment(paymentData) {
    const { data, error } = await supabase
      .from("payments")
      .insert([paymentData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getPayment(paymentId) {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("id", paymentId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updatePayment(paymentId, updateData) {
    const { data, error } = await supabase
      .from("payments")
      .update(updateData)
      .eq("id", paymentId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
