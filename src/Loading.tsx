import { LuLoader2 } from "react-icons/lu";
export function GlobalLoading() {
  return (
    <div className="flex fixed top-0 left-0 justify-center items-center w-full h-full bg-black opacity-50 z-50">
      <span className="text-white">Product fetching...</span>
    </div>
  );
}
export function TableLoading() {
  return <span>Table loading...</span>;
}

export function BarChartLoading() {
  return <span>Price Chart loading...</span>;
}

export function MicroLoading() {
  return <LuLoader2 className="animate-spin" />;
}
