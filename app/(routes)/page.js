import React from "react";
import Link from "next/link";
import Products from "./product/[productId]/page.js";
import Footer from "../../components/footer.js";
import Navbar from "../../components/navbar.js";

export default function Home() {
	const imageUrlTop =
		"https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8fA%3D%3D&auto=format&fit=crop&w=1372&q=80";

	const imageUrlBottom =
		"https://images.unsplash.com/photo-1530053364863-7afc6bcdca88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80";

	const categories = ["Sweatshirts", "Gifts", "Shirts", "Socks"];

	return (
		<div className="min-h-screen bg-gray-100">
			<Navbar />
			<div
				style={{
					backgroundImage: `url(${imageUrlTop})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					height: "400px",
				}}
				className="relative"
			>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
					<h2 className="text-5xl text-black font-bold">
						Welcome to Oregonized Design
					</h2>
					<p className="text-xl text-black">
						Discover our latest collection of unique and stylish clothing
					</p>
				</div>
			</div>
			<div className="container mx-auto px-5">
				<div className="bg-white opacity-90">
					<Products />
				</div>
			</div>
			<div
				style={{
					backgroundImage: `url(${imageUrlBottom})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					height: "400px",
				}}
				className="relative"
			>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
					<Link href="./product/sale">
						<button className="py-4 px-8 bg-green-500 text-xl text-white font-bold rounded-lg">
							Shop Sales Now
						</button>
					</Link>
				</div>
			</div>
			<div className="container mx-auto px-5 my-10">
				<h2 className="text-3xl font-bold text-center mb-6">
					Shop By Category
				</h2>
				<div className="grid grid-cols-4 gap-4">
					{categories.map((category) => (
						<div
							key={category}
							className="block p-6 border border-gray-300 rounded-lg text-center hover:bg-gray-200 transition-colors duration-200"
						>
							<Link href={`/products/${category.toLowerCase()}`}>
								{category}
							</Link>
						</div>
					))}
				</div>
			</div>
			<Footer />
		</div>
	);
}
