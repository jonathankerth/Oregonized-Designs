import React from "react";
import Products from "./product/[productId]/page.js";
import Cart from "./cart/page.js";
import Footer from "../../components/footer.js";
import Navbar from "../../components/navbar.js";

export default function Home() {
	return (
		<div className="min-h-screen  bg-gray-100">
			<Navbar />
			<div>
				<div className="container mx-auto px-5">
					<h1 className="text-5xl font-bold text-center mb-10">
						Oregonized Design
					</h1>

					<Products />
				</div>
			</div>
			<Footer />
		</div>
	);
}
