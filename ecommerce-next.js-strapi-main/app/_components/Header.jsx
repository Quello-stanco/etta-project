'use client'
import React, { useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { UserButton } from "@clerk/nextjs";
import { ShoppingCart } from 'lucide-react'
import { CartContext } from '../_context/CartContext';
import CartApis from '../_utils/CartApis';
import Cart from '../_components/Cart';
import { motion } from 'framer-motion';

function Header() {
	// const [isLoggedIn, setIsLoggedIn] = useState(false) // Removed manual check
	const [openCart, setOpenCart] = useState(false)
	const { cart, setCart } = useContext(CartContext)
	const [scrolled, setScrolled] = useState(false);
	const pathname = usePathname();
	const { user } = useUser(); // Moved up

	useEffect(() => {
		// setIsLoggedIn(window?.location?.href.toString().includes('sign-in')) // Removed

		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [])

	useEffect(() => {
		user && getCartItems();
	}, [user])

	const getCartItems = () => {
		CartApis.getUserCartItems(user.primaryEmailAddress.emailAddress).then(res => {
			console.log('response from cart items', res?.data?.data)

			const newCartItems = res?.data?.data.map(citem => {
				const productData = citem?.attributes?.products?.[0] || citem?.attributes?.products?.data?.[0]
				return {
					id: citem.id,
					product: productData
				}
			})

			setCart(newCartItems)
		})
	}

	// Scroll direction logic
	const [lastScrollY, setLastScrollY] = useState(0);
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			// Show/Hide based on scroll direction
			if (currentScrollY > lastScrollY && currentScrollY > 100) {
				setIsVisible(false); // Hide on scroll down
			} else {
				setIsVisible(true);  // Show on scroll up
			}

			setLastScrollY(currentScrollY);
			setScrolled(currentScrollY > 20);
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, [lastScrollY]);

	// Dynamic styles based on visibility and page
	// If NOT visible (scrolled down), we hide it.
	// If visible, we check if it should be solid or transparent.

	const isHomePage = pathname === '/';
	// Solid if scrolled > 20px OR if not on homepage
	const isSolid = scrolled || !isHomePage;

	const headerClass = isSolid
		? 'bg-etta-soft-gray shadow-md py-4'
		: 'bg-transparent py-6';

	// Text color logic:
	// If solid background -> Dark text
	// If transparent (Home top) -> White text
	const textColorClass = isSolid
		? 'text-etta-black'
		: 'text-white';

	// Transform style for hiding/showing
	const transformStyle = isVisible ? 'translate-y-0' : '-translate-y-full';

	// Animate header visibility using variants
	const headerVariants = {
		visible: { y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
		hidden: { y: "-100%", transition: { duration: 0.3, ease: "easeInOut" } },
	};

	// Shared button style
	const buttonClass = "block rounded-none border border-etta-burgundy bg-etta-burgundy px-6 py-2.5 text-sm font-medium text-white transition hover:bg-white hover:text-etta-burgundy";

	const { isLoaded } = useUser(); // Get loading state

	return (
		<motion.header
			initial="visible"
			animate={isVisible ? "visible" : "hidden"} // Toggle between visible and hidden variants
			variants={headerVariants}
			className={`fixed w-full top-0 z-50 transition-colors duration-300 ${headerClass}`}
		>
			<div className="flex items-center justify-between max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
				<a href="/" className={`text-3xl font-serif font-bold tracking-widest transition-colors duration-300 ${textColorClass}`}>
					étta
				</a>

				<div className="flex items-center justify-end flex-1 md:justify-between">
					<nav aria-label="Global" className="hidden md:block ml-12">
						<ul className="flex items-center gap-8 text-sm font-medium">
							{['Home', 'Collections', 'About', 'Contact'].map((item) => (
								<li key={item}>
									<a
										className={`transition hover:underline decoration-etta-gold decoration-2 underline-offset-4 ${textColorClass} hover:text-etta-gold`}
										href={item === 'Collections' ? '/collections' : '/'}
									>
										{item}
									</a>
								</li>
							))}
						</ul>
					</nav>

					<div className="flex items-center gap-4">
						{!isLoaded ? (
							// Loading skeleton or placeholder
							<div className="w-24 h-10 bg-gray-200/50 rounded animate-pulse"></div>
						) : !user ?
							<div className="sm:flex sm:gap-4">
								<motion.a
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className={buttonClass}
									href="/sign-in"
								>
									Login
								</motion.a>

								<motion.a
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className={`${buttonClass} hidden sm:block`}
									href="/"
								>
									Register
								</motion.a>
							</div>
							:
							<div className='flex items-center gap-6'>
								<motion.div
									whileHover={{ scale: 1.1 }}
									className={`flex gap-1 cursor-pointer relative ${textColorClass}`}
									onClick={() => setOpenCart(!openCart)}
								>
									<ShoppingCart />
									{cart?.length > 0 && (
										<span className="absolute -top-2 -right-2 bg-etta-gold text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full text-etta-burgundy">
											{cart?.length}
										</span>
									)}
								</motion.div>
								<UserButton afterSignOutUrl="/" appearance={{
									elements: {
										avatarBox: "w-9 h-9 border-2 border-etta-gold"
									}
								}} />
								{openCart && <Cart />}
							</div>
						}

						<button
							className={`block rounded p-2.5 transition md:hidden ${textColorClass}`}
						>
							<span className="sr-only">Toggle menu</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-5 h-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</motion.header>
	)
}

export default Header