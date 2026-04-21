'use client'
import React, { useContext } from 'react'
import { ShoppingCart, BadgeCheck, AlertOctagon, Tag } from 'lucide-react'
import SkeletonProductInfo from './SkeletonProductInfo'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import CartApis from '../../../_utils/CartApis'
import { CartContext } from '../../../_context/CartContext'

function ProductInfo({ product }) {
	const { user } = useUser();
	const router = useRouter();
	const { cart, setCart } = useContext(CartContext)

	const attrs = product?.attributes;
	const isOnSale = attrs?.onSale && attrs?.salePrice;
	const displayPrice = isOnSale ? attrs?.salePrice : (attrs?.originalPrice || attrs?.price);
	const originalPrice = attrs?.originalPrice || attrs?.price;
	const discountPercent = isOnSale ? Math.round((1 - attrs?.salePrice / originalPrice) * 100) : 0;

	const handleAddToCart = () => {
		if (!user) {
			router.push('/sign-in')
		} else {
			const data = {
				data: {
					username: user.fullName,
					email: user.primaryEmailAddress.emailAddress,
					products: [product?.documentId || product?.id]
				}
			}
			CartApis.addToCart(data).then(res => {
				console.log('cart created successfully', res.data.data)
				setCart(oldCart => [
					...oldCart,
					{
						id: res?.data?.data?.id,
						product
					}
				])
			}).catch(error => {
				console.log('error', error)
			})
		}
	}

	return (
		<div>
			{product?.id ?
				<div className="space-y-4">
					<h2 className='text-2xl font-bold'>{attrs?.title}</h2>
					<span className='inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full'>
						{attrs?.category}
					</span>

					<p className='text-gray-600 mt-4'>{attrs?.description}</p>

					{/* Price Section */}
					<div className="flex items-center gap-4 mt-6">
						<h2 className='text-3xl font-bold text-primary'>
							{displayPrice} EGP
						</h2>
						{isOnSale && (
							<>
								<span className='text-xl text-gray-400 line-through'>
									{originalPrice} EGP
								</span>
								<span className='flex items-center gap-1 bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-bold'>
									<Tag className='w-4 h-4' />
									-{discountPercent}% OFF
								</span>
							</>
						)}
					</div>

					<button
						onClick={() => handleAddToCart()}
						className='flex gap-2 p-3 px-6 text-white rounded-lg bg-primary hover:bg-teal-600 transition-colors mt-6'
					>
						<ShoppingCart /> Add To Cart
					</button>
				</div>
				:
				<SkeletonProductInfo />
			}
		</div>
	)
}

export default ProductInfo