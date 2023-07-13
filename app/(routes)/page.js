import React from "react";
import Products from "./product/[productId]/page.js";
import Footer from "../../components/footer.js";
import Navbar from "../../components/navbar.js";

export default function Home() {
	const imageUrl =
		"https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1372&q=80";
	return (
		<div className="min-h-screen bg-gray-100">
			<Navbar />
			<div
				style={{
					backgroundImage: `url(${imageUrl})`,
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
			<Footer />
		</div>
	);
}
