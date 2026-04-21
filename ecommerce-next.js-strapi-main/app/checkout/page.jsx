'use client'
import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '../_context/CartContext'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import GovernorateApis from '../_utils/GovernorateApis'
import OrderApis from '../_utils/OrderApis'
import CartApis from '../_utils/CartApis'

function Checkout() {
	const { cart, setCart } = useContext(CartContext)
	const { user } = useUser()
	const router = useRouter()

	const [governorates, setGovernorates] = useState([])
	const [selectedGovernorate, setSelectedGovernorate] = useState(null)
	const [shippingCost, setShippingCost] = useState(0)
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		phone: '',
		address: '',
		paymentMethod: 'cash_on_delivery'
	})

	// Calculate subtotal
	const subtotal = cart.reduce((sum, item) => {
		const price = item?.product?.attributes?.salePrice || item?.product?.attributes?.originalPrice || item?.product?.attributes?.price || 0
		return sum + price
	}, 0)

	const total = subtotal + shippingCost

	useEffect(() => {
		// Fetch governorates on mount
		GovernorateApis.getGovernorates().then(res => {
			console.log('Governorates:', res.data.data)
			setGovernorates(res.data.data || [])
		}).catch(error => {
			console.error('Error fetching governorates:', error)
		})
	}, [])

	const handleGovernorateChange = (e) => {
		const govId = e.target.value
		const selected = governorates.find(g => g.id === govId || g.documentId === govId)
		setSelectedGovernorate(selected)
		setShippingCost(selected?.attributes?.shippingCost || 0)
	}

	const handleInputChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		})
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!selectedGovernorate) {
			alert('Please select a governorate')
			return
		}

		if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address) {
			alert('Please fill in all required fields')
			return
		}

		setLoading(true)

		try {
			// Prepare product IDs
			const productIds = cart.map(item => item?.product?.documentId || item?.product?.id)

			// Create order
			const orderData = {
				data: {
					firstName: formData.firstName,
					lastName: formData.lastName,
					email: user?.primaryEmailAddress?.emailAddress,
					phone: formData.phone,
					address: formData.address,
					governorate: selectedGovernorate.documentId || selectedGovernorate.id,
					products: productIds,
					subtotal: subtotal,
					shippingCost: shippingCost,
					total: total,
					paymentMethod: formData.paymentMethod,
					paymentStatus: formData.paymentMethod === 'cash_on_delivery' ? 'pending' : 'pending',
					orderStatus: 'pending'
				}
			}

			const orderRes = await OrderApis.createOrder(orderData)
			console.log('Order created:', orderRes)

			// Clear cart
			for (const item of cart) {
				await CartApis.deleteCartItem(item?.id)
			}
			setCart([])

			// Redirect based on payment method
			if (formData.paymentMethod === 'cash_on_delivery') {
				router.push('/payment-confirm?status=success&payment_method=cod')
			} else {
				// TODO: Stripe integration
				alert('Card payment integration coming soon!')
			}
		} catch (error) {
			console.error('Error creating order:', error)
			alert('Failed to create order. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const deleteCartItem = (id) => {
		CartApis.deleteCartItem(id).then((res) => {
			if (res) setCart((oldCart) => oldCart.filter(item => item.id !== id))
		}).catch(error => {
			console.log('error', error)
		})
	}

	if (!user) {
		router.push('/sign-in')
		return null
	}

	if (cart.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
					<button onClick={() => router.push('/')} className="bg-primary text-white px-6 py-2 rounded">
						Continue Shopping
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">Checkout</h1>

				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Left Column: Checkout Form */}
						<div className="md:col-span-2 space-y-6">
							<div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
								<h2 className="text-2xl font-serif font-bold mb-6 text-etta-burgundy border-b pb-2">Delivery Information</h2>

								<div className="space-y-4">
									{/* Name Fields */}
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium mb-1">First Name *</label>
											<input
												type="text"
												name="firstName"
												value={formData.firstName}
												onChange={handleInputChange}
												required
												className="w-full border border-gray-300 rounded px-3 py-2"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium mb-1">Last Name *</label>
											<input
												type="text"
												name="lastName"
												value={formData.lastName}
												onChange={handleInputChange}
												required
												className="w-full border border-gray-300 rounded px-3 py-2"
											/>
										</div>
									</div>

									{/* Phone */}
									<div>
										<label className="block text-sm font-medium mb-1">Phone Number *</label>
										<input
											type="tel"
											name="phone"
											value={formData.phone}
											onChange={handleInputChange}
											required
											placeholder="e.g. 01012345678"
											className="w-full border border-gray-300 rounded px-3 py-2"
										/>
									</div>

									{/* Address */}
									<div>
										<label className="block text-sm font-medium mb-1">Address *</label>
										<textarea
											name="address"
											value={formData.address}
											onChange={handleInputChange}
											required
											rows={3}
											placeholder="Street, Building, Apartment"
											className="w-full border border-gray-300 rounded px-3 py-2"
										/>
									</div>

									{/* Governorate */}
									<div>
										<label className="block text-sm font-medium mb-1">Governorate *</label>
										<select
											onChange={handleGovernorateChange}
											required
											className="w-full border border-gray-300 rounded px-3 py-2"
											defaultValue=""
										>
											<option value="" disabled>Select Governorate</option>
											{governorates.map(gov => (
												<option key={gov.documentId || gov.id} value={gov.documentId || gov.id}>
													{gov.attributes?.name} - {gov.attributes?.shippingCost} EGP Shipping
												</option>
											))}
										</select>
									</div>

									{/* Payment Method */}
									<div>
										<label className="block text-sm font-medium mb-2">Payment Method *</label>
										<div className="space-y-2">
											<label className="flex items-center gap-2 cursor-pointer">
												<input
													type="radio"
													name="paymentMethod"
													value="cash_on_delivery"
													checked={formData.paymentMethod === 'cash_on_delivery'}
													onChange={handleInputChange}
													className="w-4 h-4"
												/>
												<span>Cash on Delivery</span>
											</label>
											<label className="flex items-center gap-2 cursor-pointer opacity-50">
												<input
													type="radio"
													name="paymentMethod"
													value="credit_card"
													disabled
													className="w-4 h-4"
												/>
												<span>Credit Card (Coming Soon)</span>
											</label>
										</div>
									</div>
								</div>
							</div>

							{/* Right Column: Order Summary */}
							<div className="bg-white p-8 rounded-2xl shadow-xl h-fit sticky top-28 border border-gray-100">
								<h2 className="text-xl font-serif font-bold mb-6 text-etta-burgundy">Order Summary</h2>



								{/* Cart Items */}
								<div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
									{cart.map(item => {
										const attrs = item?.product?.attributes
										const price = attrs?.salePrice || attrs?.originalPrice || attrs?.price || 0
										return (
											<div key={item.id} className="flex gap-3 pb-3 border-b">
												<div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0">
													{attrs?.banner?.data?.attributes?.url && (
														<img
															src={`http://localhost:1337${attrs.banner.data.attributes.url}`}
															alt={attrs?.title}
															className="w-full h-full object-cover rounded"
														/>
													)}
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex justify-between items-start">
														<p className="font-medium text-sm truncate pr-2">{attrs?.title}</p>
														<button
															onClick={() => deleteCartItem(item.id)}
															type="button"
															className="text-gray-400 hover:text-red-500"
														>
															<span className="sr-only">Remove</span>
															<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
																<path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
															</svg>

														</button>
													</div>
													<p className="text-sm text-gray-500">{price} EGP</p>
												</div>
											</div>
										)
									})}
								</div>

								{/* Totals */}
								<div className="space-y-2 border-t pt-4">
									<div className="flex justify-between text-sm">
										<span>Subtotal</span>
										<span>{subtotal.toFixed(2)} EGP</span>
									</div>
									<div className="flex justify-between text-sm">
										<span>Shipping</span>
										<span>{shippingCost > 0 ? `${shippingCost.toFixed(2)} EGP` : 'Select governorate'}</span>
									</div>
									<div className="flex justify-between text-lg font-bold border-t pt-2">
										<span>Total</span>
										<span>{total.toFixed(2)} EGP</span>
									</div>
								</div>

								{/* Submit Button */}
								<button
									type="submit"
									disabled={loading || !selectedGovernorate}
									className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-bold hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{loading ? 'Processing...' : 'Complete Order'}
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Checkout