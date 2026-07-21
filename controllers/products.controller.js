const productRepository = require("../repositories/product.repository");

/**
 * GET ALL / FILTER PRODUCTS
 */
exports.getProducts = async (req, res) => {
  try {

    const { category } = req.query;

    // Fetch products from Supabase
    let products =
      await productRepository.getAllProducts();

    if (!products) {
      return res.json([]);
    }

    /**
     * Category filter
     */
    if (category) {

      products =
        products.filter(p =>
          p.category
            ?.toLowerCase()
            .includes(
              category.toLowerCase()
            )
        );
    }

    res.json(products);

  } catch (err) {

    console.error(
      "PRODUCT FETCH ERROR:",
      err
    );

    res.status(500).json({
      error: "Failed to fetch products"
    });
  }
};

/**
 * GET SINGLE PRODUCT BY ID
 */
exports.getProduct = async (req, res) => {
  try {

    const productId = req.params.id;

    console.log("Fetching product:", productId);

    const product = await productRepository.getProductById(productId);

    if (!product) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    res.json(product);

  } catch (err) {

    console.error("SINGLE PRODUCT ERROR:", err);

    res.status(500).json({
      error: "Failed to fetch product"
    });
  }
};
