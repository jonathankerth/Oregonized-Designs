'use client'
import { useEffect, useState } from 'react'
import { CheckIcon, ClockIcon } from '@heroicons/react/outline'

// Set your GraphQL endpoint and storefront access token
const GRAPHQL_ENDPOINT =
  'https://oregonizeddesignco.myshopify.com/api/2023-07/graphql.json'
const STOREFRONT_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_FRONT_ACCESS_TOKEN

export default function Cart() {
  const [cart, setCart] = useState(null)

  useEffect(() => {
    async function fetchCartDetails() {
      const cartId = 'YOUR_CART_ID' // Replace with your actual cart ID

      const cartQuery = `
        query getCart($cartId: ID!) {
          cart(id: $cartId) {
            id
            attributes {
              key
              value
            }
            buyerIdentity {
              email
              phone
            }
            checkoutUrl
            cost {
              totalAmount
              currencyCode
            }
            createdAt
            discountAllocations {
              allocatedAmount
              discountCode
            }
            discountCodes
            note
            totalQuantity
            updatedAt
            lines(first: 10) {
              edges {
                node {
                  id // Add the ID field for product identification
                  title
                  variant {
                    priceV2 {
                      amount
                      currencyCode
                    }
                    image {
                      src
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
  }, [])

  const products = cart?.lines?.edges?.map((edge) => edge.node) || []

  const handleRemoveFromCart = async (productId) => {
    const updatedProducts = products.filter(
      (product) => product.id !== productId
    )
    setCart({
      ...cart,
      lines: { edges: updatedProducts.map((product) => ({ node: product })) },
    })
  }

  const handleCheckout = () => {
    window.location.href = '/cart/checkout'
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        <form className="mt-12">
          <section aria-labelledby="cart-heading">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-b border-t border-gray-200"
            >
              {products.map((product) => (
                <li key={product.id} className="flex py-6">
                  <div className="flex-shrink-0">
                    <img
                      src={product.variant.image.src}
                      alt={product.title}
                      className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                    <div>
                      <div className="flex justify-between">
                        <h4 className="text-sm">
                          <a
                            href={product.href}
                            className="font-medium text-gray-700 hover:text-gray-800"
                          >
                            {product.title}
                          </a>
                        </h4>
                        <p className="ml-4 text-sm font-medium text-gray-900">
                          {product.variant.priceV2.amount}{' '}
                          {product.variant.priceV2.currencyCode}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.attributes?.value}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-1 items-end justify-between">
                      <p className="flex items-center space-x-2 text-sm text-gray-700">
                        {product.inStock ? (
                          <>
                            In stock
                            <CheckIcon
                              className="h-5 w-5 flex-shrink-0 text-green-500"
                              aria-hidden="true"
                            />
                          </>
                        ) : (
                          <>
                            Will ship in {product.leadTime}
                            <ClockIcon
                              className="h-5 w-5 flex-shrink-0 text-gray-300"
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </p>
                      <div className="ml-4">
                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(product.id)}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <section aria-labelledby="summary-heading" className="mt-10">
            <h2 id="summary-heading" className="sr-only">
              Order summary
            </h2>

            <div>
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-900">
                    Subtotal
                  </dt>
                  <dd className="ml-4 text-base font-medium text-gray-900">
                    $96.00
                  </dd>
                </div>
              </dl>
              <p className="mt-1 text-sm text-gray-500">
                Shipping and taxes will be calculated at checkout.
              </p>
            </div>

            <div className="mt-10">
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Checkout
              </button>
            </div>

            <div className="mt-6 text-center text-sm">
              <p>
                or
                <a
                  href="/"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </p>
            </div>
          </section>
        </form>
      </div>
    </div>
  )
}
