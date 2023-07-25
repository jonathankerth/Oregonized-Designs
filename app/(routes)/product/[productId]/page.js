'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import BuyButton from '../../../../components/buyButton'
import Image from 'next/image'

const GRAPHQL_ENDPOINT =
  'https://oregonizeddesignco.myshopify.com/api/2023-07/graphql.json'

const STOREFRONT_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_FRONT_ACCESS_TOKEN

function Product() {
  const [product, setProduct] = useState(null)
  const router = useRouter()
  const { productId } = router.query

  useEffect(() => {
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
            variables: { id: productId },
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
    <div>
      <h1 className="text-4xl font-bold mt-6 mb-6">{product.title}</h1>
      <div className="flex-none w-full border-t mt-4 pt-4">
        <Image
          src={product.images.edges[0].node.src}
          alt={product.title}
          width={640}
          height={480}
          className="w-full h-64 object-cover mb-4"
        />
        <h3 className="text-2xl font-medium">{product.title}</h3>
        <p className="text-gray-600 mt-2">
          Price: ${product.priceRange.minVariantPrice.amount}
        </p>
        <BuyButton productId={product.id} />
      </div>
    </div>
  )
}

export default Product
