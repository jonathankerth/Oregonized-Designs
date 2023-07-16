'use client'

import { useEffect, useState } from 'react'
import Navbar from '../../../../components/navbar.js'
import Footer from '../../../../components/footer.js'
import shopifyAPIHandler from '../../../../api/shopify.js'

export default function Collection() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    shopifyAPIHandler().then((response) => {
      setProducts(response.products)
    })
  }, [])

  return (
    <div>
      <Navbar />
      <div>Collections</div>
      <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
        {products.map((product) => (
          <div key={product.id}>
            <img src={product.images[0].src} alt={product.title} />
            <h2>{product.title}</h2>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  )
}
