'use client'

import { useState, useEffect } from 'react'
import BuyButton from '../../../../components/buyButton'
import Image from 'next/image'

const GRAPHQL_ENDPOINT =
  'https://oregonizeddesignco.myshopify.com/api/2023-07/graphql.json'

const STOREFRONT_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_FRONT_ACCESS_TOKEN

function ProductDetail({ productId }) {
  const [product, setProduct] = useState(null)

  useEffect(() => {
    if (!productId) return

    const shopifyProductId = `gid://shopify/Product/${productId}`

    async function fetchProductData() {
      try {
        const productQuery = `
          query getProduct($id: ID!) {
            node(id: $id) {
              ... on Product {
                id
                title
                images(first: 1) {
                  edges {
                    node {
                      src
                    }
                  }
                }
                priceRange {
                  minVariantPrice {
                    amount
                  }
                }
              }
            }
          }
        `

        const response = await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: {
            'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: productQuery,
            variables: { id: shopifyProductId },
          }),
        })

        const jsonResponse = await response.json()

        if (!response.ok || jsonResponse.errors) {
          const errorMessage = jsonResponse.errors
            ? jsonResponse.errors[0].message
            : 'Network response was not ok'
          throw new Error(errorMessage)
        }

        setProduct(jsonResponse.data.node)
      } catch (err) {
        console.error('There was a problem fetching the product:', err)
      }
    }

    if (productId) {
      fetchProductData()
    }
  }, [productId])

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto my-10">
      <h1 className="text-4xl font-bold mb-6">{product.title}</h1>
      <div className="flex">
        <div style={{ width: 640, height: 480 }}>
          <Image
            src={product.images.edges[0].node.src}
            alt={product.title}
            width={640}
            height={480}
            layout="fixed" // Added layout property
            className="w-full h-64 object-cover mb-4"
          />
        </div>
        <div className="ml-6">
          <h3 className="text-2xl font-medium">{product.title}</h3>
          <p className="text-gray-600 mt-2">
            Price: ${product.priceRange.minVariantPrice.amount}
          </p>
          <BuyButton productId={product.id} />
        </div>
      </div>
    </div>
  )
}
export async function getServerSideProps(context) {
  const { params } = context
  const productId = params.productId
  return {
    props: { productId }, // will be passed to the page component as props
  }
}

export default ProductDetail
