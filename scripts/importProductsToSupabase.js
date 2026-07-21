require("dotenv").config();
const fs = require("fs");
const path = require("path");
const supabase = require("../config/supabase");

async function run() {
  const jsonPath = path.join(__dirname, "../data/products.json");
  
  console.log("Reading products from:", jsonPath);
  
  const products = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  console.log("Total products to import:", products.length);
  
  const BATCH_SIZE = 100;
  let imported = 0;
  let skipped = 0;
  
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} products)`);
    
    for (const product of batch) {
      try {
        // Check if product already exists
        const { data: existing } = await supabase
          .from("products")
          .select("id")
          .eq("id", product.id)
          .single();
        
        if (existing) {
          skipped++;
          console.log(`Skipped duplicate: ${product.id}`);
          continue;
        }
        
        // Insert product with simple schema
        const { error } = await supabase
          .from("products")
          .insert([{
            id: product.id,
            name: product.name,
            description: product.description || null,
            price: product.price,
            category: product.category,
            subcategory: product.subcategory || null,
            image: product.image,
            brand: product.brand || null,
            stock: product.stock || 0,
            active: product.active !== false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
        
        if (error) {
          console.error(`Failed to insert ${product.id}:`, error.message);
          continue;
        }
        
        imported++;
        console.log(`Imported: ${product.id}`);
        
      } catch (err) {
        console.error(`Error processing ${product.id}:`, err.message);
      }
    }
  }
  
  console.log("\n=== Import Complete ===");
  console.log(`Imported: ${imported}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total processed: ${imported + skipped}`);
}

run().catch(console.error);
