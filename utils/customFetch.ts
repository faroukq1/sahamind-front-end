import axios, { AxiosInstance } from "axios";

// Make sure this IP is correct and accessible from your device
const API_URL = "http://192.168.100.2:8000";

export const customFetch: AxiosInstance = axios.create({
  baseURL: API_URL,
});
