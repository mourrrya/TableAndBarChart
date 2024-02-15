import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { MicroLoading } from "./Loading";
import { pageLimit, useProductContext } from "./ProductReducerContext";
import { getProduct } from "./api";

export const Pagination = () => {
  const { productState, dispatchProduct } = useProductContext();
  const { pageNumberAt, pageLoading, totalPages, searchedProduct } =
    productState;

  const onchangePage = (move: number) => {
    dispatchProduct({ type: "ON_LOAD", payload: { pageLoading: true } });
    getProduct({
      search: searchedProduct,
      skip: (pageNumberAt - 1 + move) * pageLimit,
    }).then((res) => {
      dispatchProduct({
        type: "ON_CHANGE_PAGE",
        payload: { productRes: res.data, pageNumberAt: pageNumberAt + move },
      });
    });
  };

  return (
    <div className="flex gap-2 justify-end items-center">
      <button
        disabled={pageNumberAt === 1}
        className="disabled:text-gray-300"
        onClick={() => onchangePage(-1)}
      >
        <MdArrowBackIos className="" />
      </button>
      <span>Page</span>
      <span className="w-2">
        {pageLoading ? <MicroLoading /> : pageNumberAt}
      </span>
      <button
        disabled={pageNumberAt === totalPages}
        className="disabled:text-gray-300"
        onClick={() => onchangePage(1)}
      >
        <MdArrowForwardIos />
      </button>
    </div>
  );
};
