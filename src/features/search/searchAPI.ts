import {searchSorter} from '../../base/services/search'
export interface Result {
  link:string;
  title:string;
  description: string;
}
export const fetchResults = ({q, limit, offset}:{q: string, limit:number, offset:number}) => {
  return (async () => {
    const t0 = performance.now();
    const results = await fetch('/data.json').then(res=>res.json())
    const items = searchSorter<Result>(results.payload, q, {key:"title"})
    const t1 = performance.now();
     return {totalResults: items.length, items, responseTime: (t1-t0)*(1/1000)}
  })()
};

