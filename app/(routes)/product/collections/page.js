'use client'
import { useEffect, useState } from 'react'

const GRAPHQL_ENDPOINT =
  'https://oregonizeddesignco.myshopify.com/api/2023-07/graphql.json'
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
      }`

      console.log('About to send request to Shopify...')

      try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: {
            'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        })

        console.log('Received response from Shopify:', response)

        const jsonResponse = await response.json()

        console.log('JSON response:', jsonResponse)

        if (!response.ok || jsonResponse.errors) {
          const errorMessage = jsonResponse.errors
            ? jsonResponse.errors[0].message
            : 'Network response was not ok'
          throw new Error(errorMessage)
        }

        setProducts(jsonResponse.data.products.edges.map((edge) => edge.node))
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
