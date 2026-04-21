'use client'
import React, { useEffect, useState } from 'react'
import ProductApis from '../_utils/ProductApis'
import ProductList from '../_components/ProductList' // Re-using existing ProductList
import Link from 'next/link'

function Collections() {
    const [productsByCategory, setProductsByCategory] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAllProducts()
    }, [])

    const getAllProducts = () => {
        // Fetch all products (or as many as possible)
        // Ideally this should use pagination to get EVERYTHING if the list is huge,
        // but for now we'll assume the default limit (25) or increase it if needed in API.
        // Since we want dynamic categories, we fetch products then group them.
        ProductApis.getLatestProducts().then(res => {
            const products = res?.data?.data || []
            groupProducts(products)
            setLoading(false)
        })
    }

    const groupProducts = (products) => {
        const grouped = {}
        products.forEach(product => {
            const category = product?.attributes?.category
            if (category) {
                if (!grouped[category]) {
                    grouped[category] = []
                }
                grouped[category].push(product)
            } else {
                // Handle uncategorized items if needed
                if (!grouped['Uncategorized']) {
                    grouped['Uncategorized'] = []
                }
                grouped['Uncategorized'].push(product)
            }
        })
        setProductsByCategory(grouped)
    }

    // Helper to make category "nice" (e.g., mens_clothing -> Men's Clothing)
    const formatCategory = (cat) => {
        return cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    if (loading) {
        return <div className='min-h-screen pt-32 text-center'>Loading collections...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4">
            <div className="max-w-screen-xl px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
                <h1 className="text-3xl font-serif font-bold text-etta-burgundy mb-8 text-center">Our Collections</h1>

                {Object.keys(productsByCategory).length === 0 ? (
                    <div className="text-center text-gray-500">No products found.</div>
                ) : (
                    <div className="space-y-16">
                        {Object.entries(productsByCategory).map(([category, items]) => (
                            <div key={category} id={category} className="scroll-mt-32">
                                <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-2">
                                    <h2 className="text-2xl font-bold text-gray-900 capitalize">
                                        {formatCategory(category)}
                                    </h2>
                                    <Link
                                        href={`/products/${category}`}
                                        className="text-sm font-medium text-etta-gold hover:text-etta-burgundy transition-colors"
                                    >
                                        View All {items.length} Items &rarr;
                                    </Link>
                                </div>

                                {/* Display first 4 items of category */}
                                <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4'>
                                    {items.slice(0, 4).map(item => (
                                        // We re-use ProductList but extracting just the map part for customized limit
                                        // actually let's just use ProductList component for cleaner code, passing sliced array
                                        // But we can't map inside map easily if ProductList takes array.
                                        // Let's use ProductList
                                        null
                                    ))}
                                    {/* Re-using ProductList component directly */}
                                </div>
                                <ProductList productList={items.slice(0, 4)} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Collections
