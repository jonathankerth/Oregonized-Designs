import React from 'react'

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
      const response = await fetch('http://localhost:300/shopify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: ADD_TO_CART_MUTATION,
          variables: { variantId, quantity },
        }),
      })

      const jsonResponse = await response.json()

      if (jsonResponse.errors && jsonResponse.errors.length > 0) {
        console.error('Detailed Error:', jsonResponse.errors[0].message)
        throw new Error(jsonResponse.errors[0].message)
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
