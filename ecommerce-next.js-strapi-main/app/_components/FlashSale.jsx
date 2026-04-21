'use client'
import React, { useEffect, useState } from 'react'
import ProductList from './ProductList'
import ProductApis from '../_utils/ProductApis'
import { Tag } from 'lucide-react'

function FlashSale() {
    const [productList, setProductList] = useState([])

    useEffect(() => {
        getFlashSaleProducts()
    }, [])

    const getFlashSaleProducts = () => {
        ProductApis.getLatestProducts().then(res => {
            // Filter for onSale products locally or ideally via API if configured
            const allProducts = res?.data?.data || []
            const saleItems = allProducts.filter(item => item?.attributes?.onSale)
            setProductList(saleItems)
        })
    }

    if (!productList || productList.length === 0) return null;

    return (
        <div className="px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8 max-w-screen-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 rounded-full">
                    <Tag className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                    Flash Sale
                </h2>
            </div>

            <ProductList productList={productList} />
        </div>
    )
}

export default FlashSale
