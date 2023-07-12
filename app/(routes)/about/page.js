import Link from "next/link";

export default function About() {
	return (
		<div className="min-h-screen py-10 bg-gray-100">
			<div className="container mx-auto px-5">
				<h1 className="text-5xl font-bold text-center mb-10">
					About Oregonized Design
				</h1>

				<p className="text-center text-xl mb-10">
					Oregonized Design is a dropshipping company focused on providing
					high-quality products designed in the unique and beautiful aesthetic
					inspired by the state of Oregon. Our mission is to share the beauty of
					Orego&apos;s natural landscapes and vibrant cityscapes through our
					designs.
				</p>

				<div className="flex justify-center">
					<Link href="/">
						<a className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
							Back to Home
						</a>
					</Link>
				</div>
			</div>
		</div>
	);
}
