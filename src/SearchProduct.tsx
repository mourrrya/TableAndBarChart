import { ChangeEvent } from "react";
import { MicroLoading } from "./Loading";
import { pageLimit, useProductContext } from "./ProductReducerContext";
import { getProduct } from "./api";

type CallbackFunction = (e: ChangeEvent<HTMLInputElement>) => void;

export const SearchProduct = () => {
  const { productState, dispatchProduct } = useProductContext();
  const { pageNumberAt, searchLoading } = productState;

  const onchangeSearchInput = debounce((e: ChangeEvent<HTMLInputElement>) => {
    dispatchProduct({ type: "ON_LOAD", payload: { searchLoading: true } });
    getProduct({
      search: e.target.value,
      skip: (pageNumberAt - 1) * pageLimit,
    }).then((res) => {
      dispatchProduct({
        type: "ON_SEARCH_PRODUCTS",
        payload: { productRes: res.data, searchedText: e.target.value },
      });
    });
  }, 500);

  return (
    <div className="flex">
      <input
        type="text"
        placeholder="Search Product"
        className="outline-none border-b border-slate-400"
        onChange={(e) => onchangeSearchInput(e)}
      />
      <div className="w-5 pb-1 items-end border-b border-slate-400 flex">
        {searchLoading && <MicroLoading />}
      </div>
    </div>
  );
};

const debounce = (callback: CallbackFunction, wait: number) => {
  let timeoutId: any = null;
  return (e: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(e);
    }, wait);
  };
};
