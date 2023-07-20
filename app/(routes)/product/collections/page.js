'use client'
import { useEffect, useState } from 'react'
import dotenv from 'dotenv'

dotenv.config()

const GRAPHQL_ENDPOINT =
  'https://oregonizeddesignco.myshopify.com/api/2023-07/graphql.json'

const STOREFRONT_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_FRONT_ACCESS_TOKEN

function ProductsPage() {
  const [collections, setCollections] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCollections() {
      const collectionQuery = `
        query getCollections {
          collections(first: 10) {
            edges {
              node {
                id
                handle
              }
            }
          }
        }
      `

      const productQuery = `
        query getProducts($collectionIds: [ID!]!) {
          nodes(ids: $collectionIds) {
            ... on Collection {
              id
              title
              products(first: 10) {
                edges {
                  node {
                    id
                    title
                    priceRange {
                      minVariantPrice {
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

      console.log('About to send request to Shopify...')

      try {
        // Fetch collections
        const collectionResponse = await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: {
            'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: collectionQuery }),
        })

        const collectionJsonResponse = await collectionResponse.json()

        if (!collectionResponse.ok || collectionJsonResponse.errors) {
          const errorMessage = collectionJsonResponse.errors
            ? collectionJsonResponse.errors[0].message
            : 'Network response was not ok'
          throw new Error(errorMessage)
        }

        // Extract collection IDs
        const collectionIds = collectionJsonResponse.data.collections.edges.map(
          (edge) => edge.node.id
        )

        // Fetch products for each collection
        const productResponse = await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: {
            'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: productQuery,
            variables: { collectionIds },
          }),
        })

        const productJsonResponse = await productResponse.json()

        if (!productResponse.ok || productJsonResponse.errors) {
          const errorMessage = productJsonResponse.errors
            ? productJsonResponse.errors[0].message
            : 'Network response was not ok'
          throw new Error(errorMessage)
        }

        // Combine collection and product data
        const collectionsWithData =
          collectionJsonResponse.data.collections.edges.map((edge) => {
            const collectionData = edge.node
            const products = productJsonResponse.data.nodes
              .find((node) => node.id === collectionData.id)
              .products.edges.map((edge) => edge.node)
            return { ...collectionData, products }
          })

        setCollections(collectionsWithData)
      } catch (err) {
        console.error('There was a problem fetching collections:', err)
        setError(err.message)
      }
    }

    fetchCollections()
  }, [])

  if (error) {
    return <div>Error loading collections: {error}</div>
  }

  return (
    <div>
      <h1 className="mt-6 mb-6">Collections</h1>
      {collections.map((collection) => (
        <div key={collection.id}>
          <h2>{collection.handle}</h2>
          {collection.products.map((product) => (
            <div key={product.id}>
              <h3>{product.title}</h3>
              <p>Price: {product.priceRange.minVariantPrice.amount}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default ProductsPage
