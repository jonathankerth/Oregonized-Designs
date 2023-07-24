import Link from 'next/link'

export default function About() {
  return (
    <div className="min-h-screen py-10 bg-gray-100">
      <div className="container mx-auto px-5">
        <h1 className="text-5xl font-bold text-center mb-10">
          About Oregonized Design
        </h1>

        <p className="text-center text-xl mb-10">
          Oregonized Design Co. is dedicated to offering high-quality products
          that capture the unique and beautiful aesthetic inspired by the state
          of Oregon. Our mission is to celebrate and share the beauty of
          Oregon&apos;s natural landscapes and vibrant cityscapes through our
          designs. Oregonized Design Co.is a small business based in Portland,
          created by Sidney Gallardo and Jonathan Kerth.
        </p>

        <div className="flex justify-center">
          <Link
            href="/"
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
