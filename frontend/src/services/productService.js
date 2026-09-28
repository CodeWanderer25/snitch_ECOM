import axios from "axios";

const API_URL = "http://localhost:3000/api/products";

export const getMyProducts = async () => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await axios.get(`${API_URL}/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data.data.getProduct;
};

export const getAllProducts = async () => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });

  return response.data.data.getProduct;
};

export const deleteProduct = async (productId) => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await axios.delete(`${API_URL}/${productId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });

  return response.data;
};
