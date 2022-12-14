import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function range(start: number, end: number) {
  let arr = [];
  while (start <= end) {
    arr.push(start);
    start++;
  }
  return arr;
}
type Props = {
  itemsPerPage: number;
  totalItems: number;
  rangeSize?: number;
  onClick?: (e: React.MouseEvent<HTMLElement>, pageNum: number) => void;
};
export default function Paggination({
  itemsPerPage = 5,
  totalItems = 0,
  rangeSize = 3,
  onClick,
}: Props) {
  const location = useLocation();
  const [rangeSlice, setRangeSlice] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const startRef = useRef(0);
  const endRef = useRef(0);
  const navigate = useNavigate();

  const setPageParam = (num: number) => {
    const searchParams = new URLSearchParams(location.search);
    const page = num + "";
    searchParams.set("page", page);
    const uri = location.pathname + "?" + searchParams.toString();
    navigate(uri);
  };

  useEffect(() => {
    console.log("useEffect, location is:", location);
    const page = Number(new URLSearchParams(location.search).get("page") || 1);
    if (page <= Math.floor(rangeSize / 2) + 1) {
      startRef.current = 1;
      endRef.current = rangeSize;
    } else {
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      if (totalPages >= page + Math.floor(rangeSize / 2)) {
        startRef.current = page - Math.ceil(rangeSize / 2) + 1;
        endRef.current = page + Math.floor(rangeSize / 2);
      }
    }

    setCurrentPage(page);
    setRangeSlice(range(startRef.current, endRef.current));
  }, [setRangeSlice, rangeSize, itemsPerPage, location, totalItems]);

  const adjacentPage = (num: number) => {
    setPageParam(num);
  };

  const handleClick = (num: number) => {
    setPageParam(num);
  };
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex items-center justify-center">
      <div className="min-w-[100px]">
        {currentPage > 1 && (
          <div
            className="mx-5 cursor-pointer"
            onClick={(e) => {
              const page = currentPage - 1;
              adjacentPage(page);
              onClick && onClick(e, page);
            }}
          >
            Previous
          </div>
        )}
      </div>
      <div className="flex">
        {rangeSlice.map((num, i) => {
          return (
            <div
              key={i}
              className="padding mx-1"
              onClick={(e) => {
                handleClick(num);
                onClick && onClick(e, num);
              }}
            >
              {currentPage === num ? (
                <div className="text-slate-400 bold">{num}</div>
              ) : (
                <div>{num}</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="min-w-[100px]">
        {currentPage < totalPages && (
          <div
            className="mx-5 cursor-pointer"
            onClick={(e) => {
              const page = currentPage + 1;
              adjacentPage(page);
              onClick && onClick(e, page);
            }}
          >
            Next
          </div>
        )}
      </div>
    </div>
  );
}
