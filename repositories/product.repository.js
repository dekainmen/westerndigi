const supabase = require("../config/supabase");

module.exports = {
  async getAllProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*");
    
    if (error) throw error;
    
    // Transform database rows to match old JSON format
    return data.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      subcategory: product.subcategory,
      image: product.image
    }));
  },

  async getProductById(productId) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    // Transform to match old JSON format
    return {
      id: data.id,
      name: data.name,
      price: data.price,
      category: data.category,
      subcategory: data.subcategory,
      image: data.image
    };
  }
};
