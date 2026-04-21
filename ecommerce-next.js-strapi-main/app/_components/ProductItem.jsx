'use client'
import React from 'react'
import Image from 'next/image'
import { List } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

function ProductItem({ product }) {
	const attrs = product?.attributes;
	const isOnSale = attrs?.onSale && attrs?.salePrice;
	const displayPrice = isOnSale ? attrs?.salePrice : (attrs?.originalPrice || attrs?.price);
	const originalPrice = attrs?.originalPrice || attrs?.price;
	const discountPercent = isOnSale ? Math.round((1 - attrs?.salePrice / originalPrice) * 100) : 0;

	return (
		<motion.div
			whileHover={{ y: -8 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
			className="h-full"
		>
			<Link href={`/product-details/${product?.documentId || product?.id}`} className='group block h-full bg-transparent'>
				<div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
					{/* Main Image */}
					<Image
						src={`http://localhost:1337${attrs?.banner?.data?.attributes?.url}`}
						alt={attrs?.title}
						fill
						className='object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out'
					/>

					{/* Dark overlay on hover */}
					<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

					{/* Sale Badge - Minimalist */}
					{isOnSale && (
						<div className="absolute top-3 left-3 z-10 bg-etta-burgundy text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
							Sale
						</div>
					)}

					{/* Discount Pill */}
					{isOnSale && (
						<div className="absolute bottom-3 right-3 z-10 bg-white/90 backdrop-blur-sm text-etta-burgundy text-xs font-bold px-2 py-1 rounded">
							-{discountPercent}%
						</div>
					)}
				</div>

				<div className='bg-transparent'>
					<div className="flex justify-between items-start mb-1">
						<h2 className='text-base font-serif font-medium text-etta-black line-clamp-1 group-hover:text-etta-burgundy transition-colors'>
							{attrs?.title}
						</h2>
					</div>

					<div className="flex items-center gap-3">
						<span className='text-sm font-bold text-gray-900'>
							{displayPrice} EGP
						</span>
						{isOnSale && (
							<span className='text-xs text-gray-400 line-through decoration-red-400'>
								{originalPrice} EGP
							</span>
						)}
					</div>

					{/* Category Tag - Optional, simplified */}
					<p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
						{attrs?.category}
					</p>
				</div>
			</Link>
		</motion.div>
	)
}

export default ProductItem