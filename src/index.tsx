import ReactDOM from "react-dom/client";
import App from "./App";
import { ProductProvider } from "./ProductReducerContext";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ProductProvider>
    <App />
  </ProductProvider>
);
