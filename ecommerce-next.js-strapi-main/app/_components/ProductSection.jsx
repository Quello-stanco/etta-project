'use client'
import React, { useEffect, useState } from 'react'
import ProductList from './ProductList'
import ProductApis from '../_utils/ProductApis'
import { ArrowRight } from 'lucide-react'
function ProductSection() {
	const [productList, setProductList] = useState([])
	useEffect(() => {
		getLatestProducts_();
	}, [])
	const getLatestProducts_ = () => {
		ProductApis.getLatestProducts().then(res => {
			console.log(res.data.data);
			setProductList(res.data.data)
		})
	}

	return (

		<div className='px-8 md:px-16 py-12' id="product-section">
			<h2 className='font-serif font-bold text-3xl my-8 text-etta-burgundy'>Brand New Collection
				<span className='font-normal text-sm float-right text-etta-black flex items-center cursor-pointer hover:text-etta-gold transition-colors uppercase tracking-widest'>
					View All <ArrowRight className='h-4 ml-2' />
				</span>
			</h2>
			<ProductList productList={productList} />
		</div>
	)
}

export default ProductSection