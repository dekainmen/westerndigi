const fs = require("fs");
const csv = require("csv-parser");

const products = [];

/* CATEGORY DETECTION */

function getCategory(type){

if(!type) return "Clothing";

type = type.toLowerCase();

/* JEWELLERY */

if(
type.includes("ring") ||
type.includes("necklace") ||
type.includes("earring") ||
type.includes("bracelet") ||
type.includes("bangle") ||
type.includes("jewellery")
){
return "Jewellery";
}

/* FOOTWEAR */

if(
type.includes("shoe") ||
type.includes("sandal") ||
type.includes("heel") ||
type.includes("wedge") ||
type.includes("flip")
){
return "Footwear";
}

/* ACCESSORIES */

if(
type.includes("bag") ||
type.includes("clutch") ||
type.includes("sling") ||
type.includes("handbag") ||
type.includes("sunglass")
){
return "Accessories";
}

/* DEFAULT */

return "Clothing";

}


/* SUBCATEGORY NORMALIZATION */

function getSubcategory(type){

if(!type) return "Other";

type = type.toLowerCase();

/* JEWELLERY */

if(type.includes("bracelet")) return "Bracelets";
if(type.includes("bangle")) return "Bangles";
if(type.includes("ring")) return "Rings";
if(type.includes("necklace")) return "Necklace";
if(type.includes("earring")) return "Earrings";

/* ACCESSORIES */

if(type.includes("sunglass")) return "Sunglasses";
if(type.includes("handbag")) return "Bags";
if(type.includes("bag")) return "Bags";
if(type.includes("clutch")) return "Clutches";
if(type.includes("sling")) return "Bags";

/* FOOTWEAR */

if(type.includes("shoe")) return "Shoes";
if(type.includes("sandal")) return "Sandals";
if(type.includes("heel")) return "Heels";
if(type.includes("wedge")) return "Wedges";
if(type.includes("flip")) return "Flipflops";

/* CLOTHING */

if(type.includes("top")) return "Topwear";
if(type.includes("dress")) return "Dresses";
if(type.includes("jacket")) return "Jackets";
if(type.includes("winter")) return "Winterwear";
if(type.includes("short")) return "Shorts";
if(type.includes("legging")) return "Leggings";
if(type.includes("track")) return "Trackpants";
if(type.includes("pant")) return "Bottomwear";
if(type.includes("jean")) return "Bottomwear";
if(type.includes("trouser")) return "Bottomwear";

return "Other";

}


/* READ CSV */

fs.createReadStream("./data/products.csv")

.pipe(csv())

.on("data", (row) => {

const type = row["Type"] || row["Product Type"] || "";

const product = {

id: row["Variant SKU"] || row["Handle"],

name: row["Title"],

price: Number(row["Variant Price"]),

category: getCategory(type),

subcategory: getSubcategory(type),

image: row["Image Src"]

};

products.push(product);

})

.on("end", () => {

fs.writeFileSync(
"./data/products.json",
JSON.stringify(products, null, 2)
);

console.log("Products converted:", products.length);

});