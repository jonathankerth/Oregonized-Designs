import React from "react";
import Link from "next/link";

export default function Navbar() {
	return (
		<nav className="bg-gray-800 p-6">
			<div className="container mx-auto flex items-center justify-between">
				<div>
					<Link href="..//about" className="text-white mx-3">
						About
					</Link>
				</div>
			</div>
		</nav>
	);
}
