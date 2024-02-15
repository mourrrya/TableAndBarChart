import axios from "axios";
import { pageLimit } from "./ProductReducerContext";

export const getProduct = ({ search = "", skip = 0 }) => {
  return axios.get(
    `https://dummyjson.com/products/search?q=${search}&limit=${pageLimit}&skip=${skip}`
  );
};
