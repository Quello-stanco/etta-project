'use client'
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'

function Hero() {
	return (
		<section className="relative h-screen flex items-center justify-center overflow-hidden">
			{/* Background Image */}
			<div
				className="absolute inset-0 z-0 w-full h-full bg-cover bg-center bg-no-repeat"
				style={{ backgroundImage: "url('/background.jpg')" }}
			>
				{/* Dark Overlay for readability */}
				<div className="absolute inset-0 bg-etta-black/40 mix-blend-multiply"></div>
			</div>

			<div className="relative z-10 max-w-screen-xl px-4 py-32 mx-auto text-center">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
				>
					<h1 className="text-4xl font-serif font-bold text-etta-white sm:text-9xl tracking-wide drop-shadow-md">
						étta
					</h1>

					<p className="mt-6 text-lg text-gray-200 sm:text-2xl/relaxed max-w-2xl mx-auto font-light">
						Discover an exclusive collection of accessories designed to accentuate your elegance.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.4, duration: 0.5 }}
					className="flex flex-wrap justify-center gap-6 mt-10"
				>
					<Link
						className="group relative inline-flex items-center overflow-hidden border border-etta-gold px-12 py-4 focus:outline-none focus:ring bg-etta-gold text-etta-burgundy font-bold uppercase tracking-widest hover:text-white"
						href="/#product-section"
					>
						<span className="absolute inset-x-0 bottom-0 h-[2px] bg-etta-burgundy transition-all group-hover:h-full group-hover:bg-etta-burgundy -z-10"></span>
						Shop Now
					</Link>

					<Link
						className="group relative inline-flex items-center overflow-hidden border border-white px-12 py-4 focus:outline-none focus:ring text-white font-bold uppercase tracking-widest hover:bg-white hover:text-etta-burgundy transition-colors"
						href="/about"
					>
						Our Story
					</Link>
				</motion.div>
			</div>
		</section>
	)
}

export default Hero