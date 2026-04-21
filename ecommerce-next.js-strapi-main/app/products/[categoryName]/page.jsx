'use client'
import React, { useEffect, useState } from 'react'
import ProductList from '../../_components/ProductList'
import ProductApis from '../../_utils/ProductApis'
import { usePathname } from 'next/navigation'

function CategoryProductList({ params }) {
    // params.categoryName comes from the dynamic route
    const { categoryName } = params;
    const [productList, setProductList] = useState([])

    useEffect(() => {
        getProductsByCategory()
    }, [categoryName])

    const getProductsByCategory = () => {
        ProductApis.getProductsByCategory(categoryName).then(res => {
            setProductList(res?.data?.data || [])
        })
    }

    // Format category name for display (e.g., 'mens_clothing' -> 'Mens Clothing')
    const decodeCategory = (cat) => {
        if (!cat) return '';
        return decodeURIComponent(cat).replace(/_/g, ' ');
    }

    return (
        <div className="px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8 max-w-screen-xl">
            <h2 className='text-3xl font-bold mb-8 capitalize'>{decodeCategory(categoryName)}</h2>
            <ProductList productList={productList} />
        </div>
    )
}

export default CategoryProductList
