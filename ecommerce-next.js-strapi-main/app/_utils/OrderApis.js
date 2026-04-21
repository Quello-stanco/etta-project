const { default: axiosClient } = require("./axiosClient");
const { unwrapResponse } = require("./strapiAdapter");

const createOrder = (data) => axiosClient.post("/orders", data).then(res => unwrapResponse(res));

export default {
  createOrder,
};
