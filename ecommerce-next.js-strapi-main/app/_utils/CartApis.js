const { default: axiosClient } = require("./axiosClient");
const { unwrapResponse } = require("./strapiAdapter");

const addToCart = (payload) => axiosClient.post("/carts", payload).then(res => unwrapResponse(res));

const getUserCartItems = (email) =>
  axiosClient.get(
    `carts?populate[products][populate]=banner&filters[email][$eq]=${email}`
  ).then(res => unwrapResponse(res));

const deleteCartItem = (id) => axiosClient.delete(`/carts/${id}`).then(res => unwrapResponse(res));

export default {
  addToCart,
  getUserCartItems,
  deleteCartItem,
};

