import { fetch } from "@shopify/shopify-api";

// Initialize Shopify client
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Shop from which we're fetching data
const shop = "oregonizeddesignco.myshopify.com";

// Define API route handler
export default async function shopifyAPIHandler(req, res) {
	// Handle the API request
	try {
		// Make the API request to fetch products
		const response = await fetch({
			query: `
        {
          products(first: 3) {
            edges {
              node {
                id
                title
              }
            }
          }
        }
      `,
			storefrontAccessToken,
			url: `https://${shop}/api/2021-07/graphql.json`,
		});

		const data = await response.json();
		const products = data.data.products.edges.map((edge) => edge.node);

		// Return the response
		res.status(200).json({ products });
	} catch (error) {
		// Handle errors
		res.status(500).json({ error: "An error occurred" });
	}
}
