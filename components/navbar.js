import React from "react";
import Link from "next/link";

export default function Navbar() {
	return (
		<nav className="bg-gray-800/70 p-6">
			<div className="container mx-auto flex items-center justify-between text-xl">
				<div>
					<Link href="../product" className="text-white mx-3">
						Products
					</Link>
					<Link href="../about" className="text-white mx-3">
						About
					</Link>
				</div>
				<div>
					<Link href="../cart" className="text-white mx-3 ">
						Cart
					</Link>
				</div>
			</div>
		</nav>
	);
}
