'use client'

import { useState } from 'react'

export default function CustomOrderPage() {
  const [orderData, setOrderData] = useState({
    name: '',
    email: '',
    details: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const { name, email, details } = orderData

      // Save the order data to Firebase Firestore
      await firestore.collection('orders').add({
        name,
        email,
        details,
      })

      // Clear the form
      setOrderData({ name: '', email: '', details: '' })

      // Optionally, you can display a success message to the user
    } catch (error) {
      // Handle the error
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setOrderData((prevData) => ({ ...prevData, [name]: value }))
  }

  return (
    <div>
      <h1>Custom Order Page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={orderData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={orderData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Details:
          <textarea
            name="details"
            value={orderData.details}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit Order</button>
      </form>
    </div>
  )
}
