import api from "./api";

const iceCreamService = {
  getAllIceCreams: async () => {
    const response = await api.get("/icecreams");
    return response.data;
  },

  getIceCreamById: async (id) => {
    const response = await api.get(`/icecreams/${id}`);
    return response.data;
  },
};

export default iceCreamService;
