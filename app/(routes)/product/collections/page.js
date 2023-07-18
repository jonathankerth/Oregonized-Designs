'use client'

import { useEffect, useState } from 'react'
import Navbar from '../../../../components/navbar.js'
import Footer from '../../../../components/footer.js'
import shopifyAPIHandler from '../../../../api/shopify.js'

import Client from 'shopify-buy'

// Initialize Client
const client = Client.buildClient({
  domain: 'your-shop-name.myshopify.com',
  storefrontAccessToken: 'your-storefront-access-token',
})

function ProductsPage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    client.product.fetchAll().then((products) => {
      setProducts(products)
    })
  }, [])

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.title}</h2>
          <img src={product.images[0]?.src} alt={product.title} />
          <p>{product.description}</p>
          <p>${product.variants[0].price}</p>
          <a href={product.onlineStoreUrl}>View Product</a>
        </div>
      ))}
    </div>
  )
}

export default ProductsPage
