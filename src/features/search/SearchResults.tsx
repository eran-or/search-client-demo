import { useLoaderData } from "react-router-dom";
import type {LoaderFunction} from "react-router-dom"
import {fetchResults, Result} from './searchAPI'
import {db} from '../../base/services/db'

type LoaderData = {
  totalResults: number;
  items: Result[];
  responseTime: number;
}
export const loader: LoaderFunction = async ({
  request,
  params
}) => {
  const url = new URL(request.url)
  const q = new URLSearchParams(url.search).get('q') as string
  db.search.put({query:q}).then(res=>console.log(res)).catch(e=>console.log("error:",e))
  const resutls = q&&fetchResults({q, limit:7, offset:0})
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
  </div>;
}
