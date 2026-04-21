import Image from 'next/image'
import React from 'react'

function Footer() {
	return (
		<footer className="mt-20 bg-etta-black text-white/80">
			<div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					<div>
						<h1 className="text-3xl font-serif font-bold text-white tracking-widest">étta</h1>
						<p className="max-w-xs mt-4 text-sm text-gray-400">
							Redefining elegance with our exclusive collection of premium accessories. Designed for those who appreciate the finer things.
						</p>
						<div className="flex mt-8 space-x-6 text-etta-gold">
							{/* Social Icons placeholders - simplifying for brevity */}
							<a href="#" className="hover:text-white transition-colors">Instagram</a>
							<a href="#" className="hover:text-white transition-colors">Facebook</a>
							<a href="#" className="hover:text-white transition-colors">Twitter</a>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
						<div>
							<p className="font-medium text-white">About</p>
							<nav className="flex flex-col mt-4 space-y-2 text-sm text-gray-400">
								<a className="hover:text-etta-gold hover:underline" href="/"> Our Story </a>
								<a className="hover:text-etta-gold hover:underline" href="/"> Careers </a>
								<a className="hover:text-etta-gold hover:underline" href="/"> Sustainability </a>
							</nav>
						</div>

						<div>
							<p className="font-medium text-white">Help</p>
							<nav className="flex flex-col mt-4 space-y-2 text-sm text-gray-400">
								<a className="hover:text-etta-gold hover:underline" href="/"> Shipping </a>
								<a className="hover:text-etta-gold hover:underline" href="/"> Returns </a>
								<a className="hover:text-etta-gold hover:underline" href="/"> FAQs </a>
							</nav>
						</div>

						<div>
							<p className="font-medium text-white">Legal</p>
							<nav className="flex flex-col mt-4 space-y-2 text-sm text-gray-400">
								<a className="hover:text-etta-gold hover:underline" href="/"> Privacy Policy </a>
								<a className="hover:text-etta-gold hover:underline" href="/"> Terms & Conditions </a>
							</nav>
						</div>

						<div>
							<p className="font-medium text-white">Contact</p>
							<nav className="flex flex-col mt-4 space-y-2 text-sm text-gray-400">
								<a className="hover:text-etta-gold hover:underline" href="/"> support@etta.com </a>
								<a className="hover:text-etta-gold hover:underline" href="/"> +1 234 567 890 </a>
							</nav>
						</div>
					</div>
				</div>
				<div className="pt-8 mt-12 border-t border-gray-800">
					<p className="text-xs text-center text-gray-500">
						&copy; 2024 étta. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	)
}

export default Footer