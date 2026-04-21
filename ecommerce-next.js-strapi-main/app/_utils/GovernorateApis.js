const { default: axiosClient } = require("./axiosClient");
const { unwrapResponse } = require("./strapiAdapter");

const getGovernorates = () => axiosClient.get('/governorates?sort=name').then(res => unwrapResponse(res));

export default {
    getGovernorates
}
