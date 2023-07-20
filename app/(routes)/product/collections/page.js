'use client'
import { useEffect, useState } from 'react'
import shopify from '@shopify/shopify-api' // Assuming you've installed the package

// Constants for Shopify store
const SHOP_DOMAIN = 'oregonizeddesignco.myshopify.com'
const API_VERSION = '2023-07' // Use the latest API version you provided
const GRAPHQL_ENDPOINT = `https://oregonizeddesignco.myshopify.com/api/2023-07/graphql.json`
const STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProducts() {
      const query = `
      {
        products(first: 10) {
          edges {
            node {
              id
              title
              description
              onlineStoreUrl
              images(first: 1) {
                edges {
                  node {
                    src
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    priceV2 {
                      amount
                    }
                  }
                }
              }
            }
          }
        }
      }
      `

      try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
          },
          body: JSON.stringify({ query }),
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const { data } = await response.json()
        setProducts(data.products.edges.map((edge) => edge.node))
      } catch (err) {
        console.error('There was a problem fetching products:', err)
        setError(err.message)
      }
    }

    fetchProducts()
  }, [])

  if (error) {
    return <div>Error loading products: {error}</div>
  }

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.title}</h2>
          <img src={product.images.edges[0]?.node.src} alt={product.title} />
          <p>{product.description}</p>
          <p>${product.variants.edges[0]?.node.priceV2.amount}</p>
          <a href={product.onlineStoreUrl}>View Product</a>
        </div>
      ))}
    </div>
  )
}

export default ProductsPage
