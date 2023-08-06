'use client'
import { useEffect, useState } from 'react'

const GRAPHQL_ENDPOINT =
  'https://oregonizeddesignco.myshopify.com/api/2023-07/graphql.json'

const STOREFRONT_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_FRONT_ACCESS_TOKEN

const Checkout = () => {
  const [cart, setCart] = useState(null)
  const [cartId, setCartId] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCartId(window.location.search.replace('?cartId=', ''))
    }
  }, [])

  useEffect(() => {
    async function fetchCartDetails() {
      if (!cartId) {
        return // Don't fetch cart details if cartId is not available
      }

      const cartQuery = `
        query getCart($cartId: ID!) {
          cart(id: $cartId) {
            // ... (rest of your query remains the same)
          }
        }
      `

      try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: {
            'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: cartQuery,
            variables: { cartId },
          }),
        })

        const jsonResponse = await response.json()
        setCart(jsonResponse.data.cart)
      } catch (error) {
        console.error('Error fetching cart details:', error)
      }
    }

    fetchCartDetails()
  }, [cartId])

  if (!cart && cartId) {
    // Display loading or an error message
    return <div>Loading...</div>
  }

  const handleContinueShopping = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Checkout Page
        </h1>

        <div className="mt-10">
          <button
            type="button"
            onClick={handleContinueShopping}
            className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

export default Checkout
