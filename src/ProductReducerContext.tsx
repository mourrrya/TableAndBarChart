import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";
import { Product, ProductAPI } from "./Interface";

export const pageLimit = 10;

interface ProductState {
  productList: Product[];
  selectedProductList: Product[];
  loading: boolean;
  pageLoading: boolean;
  searchLoading: boolean;
  pageNumberAt: number;
  totalPages: number;
  searchedProduct: string;
}

interface ProductCtxValue {
  productState: ProductState;
  dispatchProduct: Dispatch<ProductAction>;
}

const ProductCtx = createContext<ProductCtxValue | null>(null);

const productState: ProductState = {
  productList: [],
  searchedProduct: "",
  selectedProductList: [],
  pageNumberAt: 1,
  totalPages: 1,
  loading: false,
  pageLoading: false,
  searchLoading: false,
};

type ProductAction =
  | {
      type: "ON_LOAD";
      payload: {
        loading?: boolean;
        pageLoading?: boolean;
        searchLoading?: boolean;
      };
    }
  | { type: "FETCH_PRODUCTS"; payload: ProductAPI }
  | {
      type: "ON_SEARCH_PRODUCTS";
      payload: { productRes: ProductAPI; searchedText: string };
    }
  | {
      type: "ON_CHANGE_PAGE";
      payload: { productRes: ProductAPI; pageNumberAt: number };
    }
  | {
      type: "ON_CHANGE_PRODUCT_SELECTION";
      payload: { id: number; value: boolean };
    };

const productReducer = (
  state: ProductState,
  action: ProductAction
): ProductState => {
  switch (action.type) {
    case "FETCH_PRODUCTS": {
      const selectedProductList = [...Array(5)].map(
        (_, index) => action.payload.products[index]
      );

      return {
        ...state,
        productList: action.payload.products,
        selectedProductList,
        totalPages: action.payload.total / action.payload.limit,
        loading: false,
      };
    }

    case "ON_SEARCH_PRODUCTS": {
      const { limit, products, total } = action.payload.productRes;
      return {
        ...state,
        productList: products,
        totalPages: total / limit,
        searchedProduct: action.payload.searchedText,
        searchLoading: false,
      };
    }

    case "ON_CHANGE_PRODUCT_SELECTION": {
      const isChecked = action.payload.value;
      const selectedProductList = [...state.selectedProductList];
      if (isChecked) {
        const productIndex = state.productList.findIndex(
          (product) => product.id === action.payload.id
        );
        selectedProductList.splice(
          productIndex,
          0,
          state.productList[productIndex]
        );
      } else {
        const productIndex = selectedProductList.findIndex(
          ({ id }) => id === action.payload.id
        );
        selectedProductList.splice(productIndex, 1);
      }
      return { ...state, selectedProductList };
    }

    case "ON_LOAD":
      return { ...state, ...action.payload };

    case "ON_CHANGE_PAGE":
      return {
        ...state,
        pageNumberAt: action.payload.pageNumberAt,
        productList: action.payload.productRes.products,
        pageLoading: false,
      };

    default:
      return { ...state };
  }
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [product, dispatchProduct] = useReducer(productReducer, productState);

  return (
    <ProductCtx.Provider value={{ productState: product, dispatchProduct }}>
      {children}
    </ProductCtx.Provider>
  );
};

export const useProductContext = () => {
  const productContext = useContext(ProductCtx);
  if (!productContext) {
    throw new Error(" Please use the context inside parent scope");
  }
  return productContext;
};
