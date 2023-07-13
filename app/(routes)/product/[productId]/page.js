export default function Product({ product }) {
	return (
		<div className="border border-gray-300 p-4 rounded-md">
			<div className="flex justify-between items-center mt-4">
				<button className="py-2 px-4 bg-green-500 text-white text-sm rounded-lg">
					Add to cart
				</button>
			</div>
			<div className="flex justify-between items-center mt-4">
				<button className="py-2 px-4 bg-green-500 text-white text-sm rounded-lg">
					Add to cart
				</button>
			</div>
			<div className="flex justify-between items-center mt-4">
				<button className="py-2 px-4 bg-green-500 text-white text-sm rounded-lg">
					Add to cart
				</button>
			</div>
		</div>
	);
}
