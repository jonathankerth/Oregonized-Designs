import { clients } from "@shopify/shopify-api";

// Initialize Shopify client
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Shop from which we're fetching data
const shop = "oregonizeddesignco.myshopify.com";

// StorefrontClient takes in the shop url and the Storefront Access Token for that shop.
const storefrontClient = new clients.Storefront({
	domain: shop,
	storefrontAccessToken,
});

// Define API route handler
export default async function shopifyAPIHandler(req, res) {
	// Handle the API request
	try {
		// Use client.query and pass your query as `data`
		const products = await storefrontClient.query({
			data: `{
				products (first: 3) {
					edges {
						node {
							id
							title
						}
					}
				}
			}`,
		});

		// Return the response
		res.status(200).json({ products });
	} catch (error) {
		// Handle errors
		res.status(500).json({ error: "An error occurred" });
	}
}
