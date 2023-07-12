import Link from "next/link";
import Image from "next/image";
import ProductCard from "./product/page.js";

export default function Home({ products }) {
	return (
		<div className="min-h-screen py-10 bg-gray-100">
			<div className="container mx-auto px-5">
				<h1 className="text-5xl font-bold text-center mb-10">
					Oregonized Design
				</h1>

				<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-5">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</div>
	);
}

export async function getStaticProps() {
	const products = await getAllProducts();
	return {
		props: {
			products,
		},
		revalidate: 60,
	};
}
