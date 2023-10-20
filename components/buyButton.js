import React from 'react'

const GRAPHQL_ENDPOINT =
  'https://oregonizeddesignco.myshopify.com/api/2023-07/graphql.json'
const STOREFRONT_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_FRONT_ACCESS_TOKEN

const ADD_TO_CART_MUTATION = `
  mutation addToCart($variantId: ID!, $quantity: Int!) {
    checkoutCreate(input: {
      lineItems: [{ variantId: $variantId, quantity: $quantity }]
    }) {
      checkout {
        id
        webUrl
      }
      userErrors {
        message
      }
    }
  }
`

const BuyButton = ({ variantId }) => {
  async function addToCart(variantId, quantity = 1) {
    try {
      const formattedVariantId = `gid://shopify/ProductVariant/${variantId}`
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: ADD_TO_CART_MUTATION,
          variables: { variantId: formattedVariantId, quantity },
        }),
      })

      const jsonResponse = await response.json()

      if (jsonResponse.errors && jsonResponse.errors.length > 0) {
        console.error('Detailed Error:', jsonResponse.errors[0].message)
        throw new Error(jsonResponse.errors[0].message)
      }

      if (!jsonResponse.data.checkoutCreate.checkout) {
        console.error('Checkout object is null')
        return
      }

      window.location.href = jsonResponse.data.checkoutCreate.checkout.webUrl
    } catch (err) {
      console.error('There was a problem adding to cart:', err)
    }
  }

  return (
    <button
      onClick={() => addToCart(variantId)}
      className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
    >
      Add to Cart
    </button>
  )
}

export default BuyButton
