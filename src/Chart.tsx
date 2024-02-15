import { FC } from "react";
import Plot from "react-plotly.js";
import { Product } from "./Interface";

interface BarChartProps {
  selectedProducts: Product[];
}

const BarChart: FC<BarChartProps> = ({ selectedProducts }) => {
  const chartData: Plotly.Data[] = [
    {
      x: selectedProducts.map((product) => product.title),
      y: selectedProducts.map((product) => product.price),
      type: "bar",
    },
  ];

  return (
    <Plot
      data={chartData}
      layout={{
        height: 400,
        title: "Product Price Chart",
        "yaxis.title": "Price",
        "xaxis.title": "Product",
      }}
    />
  );
};

export default BarChart;
