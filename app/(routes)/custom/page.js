'use client'

import { useState } from 'react'
import Navbar from '../../../components/navbar.js'

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
    <div className="max-w-lg mx-auto p-4">
      <Navbar />
      <h1 className="text-center text-2xl font-bold mb-4">Custom Order Page</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          <span className="text-lg mb-2 block">Name:</span>
          <input
            type="text"
            name="name"
            value={orderData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-4">
          <span className="text-lg mb-2 block">Email:</span>
          <input
            type="email"
            name="email"
            value={orderData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-4">
          <span className="text-lg mb-2 block">Details:</span>
          <textarea
            name="details"
            value={orderData.details}
            onChange={handleChange}
            className="w-full p-2 border rounded h-32"
          ></textarea>
        </label>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Submit Order
        </button>
      </form>
    </div>
  )
}
