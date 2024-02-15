import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Suspense, lazy, useEffect, useMemo } from "react";
import "./App.css";
import { BarChartLoading, GlobalLoading, TableLoading } from "./Loading";
import { Pagination } from "./Pagination";
import { useProductContext } from "./ProductReducerContext";
import { SearchProduct } from "./SearchProduct";
import { buildProductTable } from "./Table";
import { getProduct } from "./api";
const BarChart = lazy(() => import("./Chart"));
const AppTable = lazy(() => import("./Table"));

function App() {
  const { productState, dispatchProduct } = useProductContext();
  const { productList, loading, selectedProductList } = productState;
  const columns = useMemo(
    () => buildProductTable(selectedProductList),
    [productList, selectedProductList]
  );
  const table = useReactTable({
    data: productList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id.toString(),

    meta: {
      onChangeProductSelection: (id, value) => {
        dispatchProduct({
          type: "ON_CHANGE_PRODUCT_SELECTION",
          payload: { id, value },
        });
      },
    },
  });

  useEffect(() => {
    dispatchProduct({ type: "ON_LOAD", payload: { loading: true } });
    getProduct({}).then((res) => {
      dispatchProduct({ type: "FETCH_PRODUCTS", payload: res.data });
    });
  }, []);

  return (
    <div className="flex p-8 items-center gap-8">
      {loading && <GlobalLoading />}
      <div className="space-y-2 flex-1 self-start">
        <Suspense fallback={<TableLoading />}>
          <div className="flex justify-between">
            <h1 className="text-2xl">Products</h1>
            <SearchProduct />
          </div>
          <AppTable table={table} />
          <Pagination />
        </Suspense>
      </div>
      <div className="flex-1">
        <Suspense fallback={<BarChartLoading />}>
          <BarChart selectedProducts={selectedProductList} />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
