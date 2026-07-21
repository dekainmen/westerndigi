const supabase = require("../config/supabase");

module.exports = {
  async createOrder(orderData) {
    const { data, error } = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();
    
    if (error) throw error;
    
    // Return flat object matching old KV format
    return {
      order_id: data.order_id,
      user_id: data.user_id,
      amount: data.amount,
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
      gateway_response: data.gateway_response
    };
  },

  async getOrder(orderId) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    // Return flat object matching old KV format
    return {
      order_id: data.order_id,
      user_id: data.user_id,
      amount: data.amount,
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
      gateway_response: data.gateway_response
    };
  },

  async updateOrder(orderId, updateData) {
    const { data, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("order_id", orderId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Return flat object matching old KV format
    return {
      order_id: data.order_id,
      user_id: data.user_id,
      amount: data.amount,
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
      gateway_response: data.gateway_response
    };
  }
};
