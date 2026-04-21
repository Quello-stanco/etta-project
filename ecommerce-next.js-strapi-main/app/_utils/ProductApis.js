const { default: axiosClient } = require("./axiosClient");
const { unwrapResponse } = require("./strapiAdapter");

const getLatestProducts = () => axiosClient.get('/products?populate=*').then(res => unwrapResponse(res));
const getProductById = (id) => axiosClient.get(`/products/${id}?populate=*`).then(res => unwrapResponse(res));

const getProductsByCategory = (category) => axiosClient.get(`/products?filters[category][$eq]=${category}&populate=*`).then(res => unwrapResponse(res));

export default {
	getLatestProducts,
	getProductById,
	getProductsByCategory
}