'use client'
import { useState, useEffect, Fragment } from 'react'
import Image from 'next/image'
import dotenv from 'dotenv'
import BuyButton from '../../../components/buyButton'
import Navbar from '@/components/navbar'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/20/solid'

dotenv.config()

const GRAPHQL_ENDPOINT =
  'https://oregonizeddesignco.myshopify.com/api/2023-07/graphql.json'

const STOREFRONT_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_FRONT_ACCESS_TOKEN

function Product({ productId }) {
  const [loading, setLoading] = useState(true)
  const [collections, setCollections] = useState([])
  const [error, setError] = useState(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

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

  const filters = [
    { name: 'Category', id: 'category' },
    { name: 'Color', id: 'color' },
    { name: 'Size', id: 'size' },
  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  return (
    <div className="bg-gray-100 p-2">
      <Navbar />
      <div className="bg-white">
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 flex z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition-translate-x ease-in-out duration-300"
              enterFrom="translate-x-0"
              enterTo="translate-x-100%"
              leave="transition-translate-x ease-in-out duration-300"
              leaveFrom="translate-x-100%"
              leaveTo="translate-x-0"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-shrink-0 px-4 flex items-center">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                    alt="Workflow"
                  />
                </div>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <div className="px-2 space-y-1">
                    {filters.map((filter) => (
                      <a
                        key={filter.name}
                        href={filter.id}
                        className="text-gray-900 hover:bg-gray-50 group flex items-center px-2 py-2 text-base font-medium rounded-md"
                      >
                        {filter.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
          </Dialog>
        </Transition.Root>
        <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="border-b border-gray-200 pb-10">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              New Arrivals
            </h1>
            <p className="mt-4 text-base text-gray-500">
              Checkout out the latest release of Basic Tees, new and improved
              with four openings!
            </p>
          </div>
          <div className="pt-12 lg:grid lg:grid-cols-4 lg:gap-x-8 xl:grid-cols-5">
            <aside className="lg:col-span-1">
              <h2 className="sr-only">Filters</h2>
              <button
                type="button"
                className="inline-flex items-center lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="text-sm font-medium text-gray-700">
                  Filters
                </span>
                <PlusIcon
                  className="ml-1 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
              </button>
              <div className="hidden lg:block mt-10">
                <div className="space-y-10">
                  {filters.map((filter) => (
                    <Disclosure as="div" key={filter.id} className="space-y-4">
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex justify-between items-center text-base font-medium text-gray-900">
                            <span>{filter.name}</span>
                            <ChevronDownIcon
                              className={classNames(
                                open ? '-rotate-180' : 'rotate-0',
                                'h-5 w-5 transform'
                              )}
                              aria-hidden="true"
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="space-y-4">
                            <ul className="text-sm font-medium text-gray-900 space-y-4">
                              {/* Items go here */}
                            </ul>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </div>
              </div>
            </aside>
            <div className="lg:col-span-3 xl:col-span-4">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="bg-white p-4 my-4 rounded shadow-lg"
                >
                  <div className="flex overflow-x-auto space-x-4">
                    {collection.products.map((product) => (
                      <div
                        key={product.id}
                        className="flex-none w-full border-t mt-4 pt-4"
                      >
                        <img
                          src={product.images.edges[0].node.src}
                          alt={product.title}
                          className="w-full h-64 object-cover mb-4"
                        />
                        <h3 className="text-2xl font-medium">
                          {product.title}
                        </h3>
                        <p className="text-gray-600 mt-2">
                          Price: ${product.priceRange.minVariantPrice.amount}
                        </p>
                        <BuyButton productId={product.id} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Product
