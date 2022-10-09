import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  useNavigate,
  useLoaderData,
  Form,
} from "react-router-dom";
import { AiOutlineClockCircle } from "react-icons/ai";
import { TiDelete } from 'react-icons/ti'

import type { LoaderFunction } from "react-router-dom";
import { debounce } from "debounce";
import { fetchResults } from "./searchAPI";
import SearchBox from "../auto-complete/SearchBox";
import { deleteSearchItem, getSearchItems, SearchEntry } from "../../base/services/db";
import { searchSorter } from "../../base/services/search";

type LoaderData = {
  q: string;
  items: SearchEntry[];
};
export const loader: LoaderFunction = async ({ request, params }) => {
  
  
  const url = new URL(request.url);
  const q = new URLSearchParams(url.search).get("q") as string;
  let value = (q || "").trim();
  if (value) {
    let items: SearchEntry[] = await (
      await fetchResults({ q: value, limit: 10, offset: 0 })
    ).items
      .map((_) => ({ query: _.title }))
      .slice(0, 10);
    let historyEntries = await getSearchItems();
    let slice = searchSorter(historyEntries, value, { key: "query" }).slice(-3);
    const data: LoaderData = {
      q: value,
      items: [...slice, ...items].slice(0, 10),
    };

    return data;
  } else {
    return { q: "", items: [] };
  }
};

function SearchForm() {
  const navigate = useNavigate();
  const data = useLoaderData() as LoaderData;

  const ref = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<SearchEntry[]>(data.items);
  const [isOpen, setIsOpen] = useState(false);
  const deleteRef = useRef<HTMLDivElement>(null);

  const handleChange = debounce(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const q = e.target.value.trim();
      if (q && !isOpen) {
        setIsOpen(true);
      }

      (async () => {
        const items: SearchEntry[] = q
          ? (await fetchResults({ q, limit: 10, offset: 0 })).items
              .map((_) => ({ query: _.title }))
              .slice(0, 10)
          : [];

        let historyEntries = await getSearchItems();
        historyEntries = searchSorter(historyEntries, q, { key: "query" });
        const slice = q
          ? historyEntries?.slice(-3)
          : historyEntries?.slice(-10);
        setItems([...slice, ...items].slice(0, 10));
      })();
    },
    500
  );

  useEffect(() => {
    let value = (data as { q: string }).q || "";
    value = value.trim();
    const input = ref.current as HTMLInputElement;
    input.value = value;
    input.focus();
    // eslint-disable-next-line
  }, []);

  const handleClick = async (value: string, e?:React.MouseEvent<HTMLElement>) => {
    let isDelete = deleteRef.current?.contains((e?.target as HTMLElement))
    setIsOpen(false);
    if(!isDelete){
      return navigate(`/search?q=${value}`);
    }else{
      const deleteCount = await deleteSearchItem(value)
      if(deleteCount){
        setItems(items.filter(item=>item.query!==value))
      }
    }
  };
  
  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const isBoxClicked = boxRef.current?.contains(e.relatedTarget)
    if(!isBoxClicked){
      setIsOpen(false);
    }
  };
  const handleInputClick = async (e: React.MouseEvent<Element, MouseEvent>) => {
    const input = ref.current as HTMLInputElement;
    if (!input.value && !data.items.length) {
      let historyEntries = await getSearchItems();
      historyEntries = historyEntries?.slice(-10);
      setItems(historyEntries);
    }
    setIsOpen(true);
  };
  
  const handleKeyPress = (e:React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.code === "Enter"){
      setIsOpen(false);
    }
  }
  
  return (
    <Form
      method="get"
      action="/search"
      id="search-form"
      role="search"
      className="mx-5 mt-5"
    >
      <SearchBox
        onClick={handleInputClick}
        onChange={handleChange}
        ref={ref}
        boxRef={boxRef}
        show={isOpen}
        onBlur={handleOnBlur}
        onKeyPress={handleKeyPress}
      >
        {items.length ? (
          items.map((item, i) => {
            const value = item["query"];

            return (
              <Fragment key={i}>
                {item.showClock ? (
                  <div
                    tabIndex={0}
                    onClick={(e) => handleClick(value, e)}
                    className="flex items-center cursor-pointer"
                  >
                    <AiOutlineClockCircle className="text-gray-400" />{" "}
                    <div className="text-violet-400 ml-1">{value}</div>
                    <div  className="ml-auto" ref={deleteRef}><TiDelete/></div>
                  </div>
                ) : (
                  <div
                    tabIndex={0}
                    onClick={() => handleClick(value)}
                    className="flex items-center cursor-pointer"
                  >
                    {value}
                  </div>
                )}
              </Fragment>
            );
          })
        ) : (
          <div>No results</div>
        )}
      </SearchBox>
    </Form>
  );
}

export default SearchForm;
