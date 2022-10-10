import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
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
  const offsetRef = useRef(0);
  const startRef = useRef(0);
  const endRef = useRef(0);

  useEffect(() => {
    offsetRef.current =
    ((new URLSearchParams(location.search).get("start") || 0) as number) * 1;
    console.log(offsetRef.current);
    startRef.current = Math.floor(offsetRef.current / itemsPerPage) + 1;
    endRef.current = rangeSize;
    setRangeSlice(range(startRef.current, endRef.current));
  }, [setRangeSlice, rangeSize, itemsPerPage]);


  const adjacentPage = (num: number) => {
    const end = endRef.current;
    const start = startRef.current;
    function updateRange() {
      startRef.current += num;
      endRef.current += num;
      setRangeSlice(range(startRef.current, endRef.current));
    }
    setCurrentPage(currentPage + num);
    if (end < totalPages && num > 0) {
      updateRange();
    }
    if (start > 1 && num < 0) {
      updateRange();
    }
  };

  const handleClick = (num: number) => {
    console.log("handleClick");
    
    setCurrentPage(num);

    const diff = num - currentPage;
    const end = endRef.current + diff;
    const start = startRef.current + diff;

    if (num > currentPage) {
      if (end <= totalPages) {
        endRef.current = endRef.current + diff;
        startRef.current = startRef.current + diff;
        setRangeSlice(range(start, end));
      } else {
        startRef.current = totalPages - rangeSize + 1;
        endRef.current = totalPages;
        setRangeSlice(range(startRef.current, endRef.current));
      }
    }
    if (num < currentPage) {
      if (start >= 1) {
        startRef.current = startRef.current + diff;
        endRef.current = endRef.current + diff;
        setRangeSlice(range(startRef.current, endRef.current));
      } else {
        startRef.current = 1;
        endRef.current = rangeSize;
        setRangeSlice(range(startRef.current, endRef.current));
      }
    }
  };
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  return (
    <div className="flex items-center justify-center">
      <div className="min-w-[100px]">
        {currentPage > 1 && (
          <Link to={location.search} className="mx-5 cursor-pointer" onClick={() => adjacentPage(-1)}>
            Previous
          </Link>
        )}
      </div>
      <div className="flex">
        {rangeSlice.map((num, i) => {
          return (
            <Link
              key={i}
              to={location.search}
              className="padding mx-1"
              onClick={() => handleClick(num)}
            >
              {currentPage === num ? (
                <div className="text-slate-400 bold">{num}</div>
              ) : (
                <div>{num}</div>
              )}
            </Link>
          );
        })}
      </div>
      <div className="min-w-[100px]">
        {currentPage < totalPages && (
          <Link to={location.search} className="mx-5 cursor-pointer" onClick={() => adjacentPage(1)}>
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
