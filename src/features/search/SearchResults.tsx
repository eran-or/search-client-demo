import { useLoaderData } from "react-router-dom";
import type {LoaderFunction} from "react-router-dom"
import {fetchResults, addSearchQuery} from '../../base/services/api'
import {Result} from '../../base/services/db'
import Paggination from "../paggination/Paggination";

type LoaderData = {
  totalResults: number;
  items: Result[];
  responseTime: number;
}
const itemsPerPage = 4 
export const loader: LoaderFunction = async ({
  request,
  params
}) => {
  const url = new URL(request.url)
  const searchParams = new URLSearchParams(url.search)
  const q = searchParams.get('q')
  const page = Number(searchParams.get('page') || 1)
  const offset = page<=1? 0 : itemsPerPage * (page - 1) 
  addSearchQuery(q)
  const resutls = q&& await fetchResults({q, limit:itemsPerPage, offset:offset})
  return resutls
}

export default function SearchResults() {
  const data = useLoaderData() as LoaderData;
  const items = data.items

const handleClick = (link:string)=>{
  window.location.assign(link)
}
  return <div>
    <div className="my-10 mx-5 text-slate-400">About {data.totalResults} results in {data.responseTime.toFixed(5)} seconds</div>
    {items.map((item, i)=>{
      return <div onClick={()=>handleClick(item.link)} className="mx-5 mb-2 max-w-[500px]" key={i}>
        <a href={item.link}>{item.link}</a>
        <h2 className="text-blue-400">{item.title}</h2>
        <p>{item.description}</p>
      </div>
    })}
    <Paggination itemsPerPage={itemsPerPage} totalItems={data.totalResults} />
  </div>;
}
