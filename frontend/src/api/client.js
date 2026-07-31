import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

const client = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export const getDesigner = () => client.get("/designer/").then((r) => r.data);

export const getCraftHighlights = () =>
  client.get("/craft-highlights/").then((r) => r.data.results ?? r.data);

export const getCollections = () =>
  client.get("/collections/").then((r) => r.data.results ?? r.data);

export const getCollection = (slug) =>
  client.get(`/collections/${slug}/`).then((r) => r.data);

export const getArtisticElement = (id) =>
  client.get(`/elements/${id}/`).then((r) => r.data);

export const submitEnquiry = (payload) =>
  client.post("/enquiries/", payload).then((r) => r.data);

export default client;
