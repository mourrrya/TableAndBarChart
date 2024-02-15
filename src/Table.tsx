import {
  createColumnHelper,
  flexRender,
  Header,
  RowData,
  SortDirection,
  Table,
  Table as TableProps,
} from "@tanstack/react-table";
import { groupBy } from "lodash";
import React, { Fragment } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { Product } from "./Interface";

interface ITableProps {
  table: Table<Product>;
}

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    onChangeProductSelection: (id: number, value: boolean) => void;
  }
}

const productColumn = createColumnHelper<Product>();

const AppTable: React.FC<ITableProps> = ({ table }) => {
  return <CustomTable table={table} />;
};
export default AppTable;

const CustomTable = ({ table }: { table: TableProps<any> }) => {
  return (
    <table className="w-full">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr
            key={headerGroup.id}
            className="bg-slate-500 text-white text-sm capitalize text-left"
          >
            {headerGroup.headers.map((header) => (
              <Fragment key={header.id}>
                <TableHeader header={header} />
              </Fragment>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <Fragment key={row.id}>
            <TableRow row={row} />
          </Fragment>
        ))}
      </tbody>
    </table>
  );
};

const TableHeader = ({ header }: { header: Header<any, any> }) => {
  const renderSortingIcon = () => {
    const sortType = {
      asc: <MdKeyboardArrowUp size={20} />,
      desc: <MdKeyboardArrowDown size={20} />,
    };
    return sortType[header.column.getIsSorted() as SortDirection] ?? false;
  };

  return (
    <th key={header.id} colSpan={header.colSpan} className="border">
      <div
        className={`flex items-center select-none font-normal p-1.5 justify-between ${
          header.column.getCanSort() && "cursor-pointer"
        }`}
        onClick={header.column.getToggleSortingHandler()}
      >
        {flexRender(header.column.columnDef.header, header.getContext())}
        {renderSortingIcon()}
      </div>
    </th>
  );
};

const TableRow = ({ row }: { row: any }) => {
  return (
    <tr className="even:bg-gray-100 text-sm">
      {row.getVisibleCells().map((cell: any) => (
        <td key={cell.id} className="border p-2">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

export const buildProductTable = (selectedProductList: Product[]) => {
  return [
    productColumn.accessor("id", {
      header: "Select",
      cell: ({ getValue, table }) => {
        const productGroupById = groupBy(selectedProductList, "id");
        const isChecked = !!productGroupById[getValue()];

        return (
          <div className="w-full text-center">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => {
                table.options.meta?.onChangeProductSelection(
                  getValue(),
                  e.target.checked
                );
              }}
            />
          </div>
        );
      },
      enableSorting: false,
    }),
    productColumn.accessor("title", {
      header: "Product",
      cell: ({ getValue }) => getValue(),
    }),
    productColumn.accessor("brand", {
      header: "Brand",
      cell: ({ getValue }) => getValue(),
    }),
    productColumn.accessor("category", {
      header: "Category",
      cell: ({ getValue }) => <span className="capitalize">{getValue()}</span>,
    }),
    productColumn.accessor("rating", {
      header: "Ratting",
      cell: ({ getValue }) => getValue(),
    }),
    productColumn.accessor("price", {
      header: "Price",
      cell: ({ getValue }) =>
        getValue().toLocaleString("en-IN", {
          style: "currency",
          currency: "USD",
        }),
    }),
  ];
};
