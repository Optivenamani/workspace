import axios from "axios";

const instance = axios.create({
  baseURL: "https://209.38.246.14:8080/api",
});

export const createSiteVisitRequest = async (data, token) => {
  try {
    const response = await instance.post("/site-visits", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating site visit request:", error);
    throw error;
  }
};
