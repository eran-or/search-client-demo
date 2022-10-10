import {db, Result, SearchEntry} from './db' 
import {searchSorter} from '../../base/services/search'
const getSlice = <T>(items:T[], limit:number, offset:number):T[] => {

  
  return items.slice(offset, offset+limit)
}
export const fetchResults = async ({q, limit, offset}:{q: string, limit:number, offset:number}) => {
  return (async () => {
    const t0 = performance.now();
    const results = await db.results.toCollection().toArray()
    const items = searchSorter<Result>(results, q, {key:"title"})
    const t1 = performance.now();
    const slice = items.slice(offset, offset+limit)
     return {totalResults: items.length, items:slice, responseTime: (t1-t0)*(1/1000)}
  })()
};

export const getSearchItems = async () => {
    let collection: { [key: string]: SearchEntry } = {};
    return (
        await db.queries.toCollection().toArray((arr) => arr)
      ).reduce((acc: SearchEntry[], next: SearchEntry) => {
        if (!collection[next.query]) {
          next.showClock = true;
          collection[next.query] = next;
          acc.push(next);
        }
        return acc;
      }, [])
}

export const deleteSearchItem = async (value:string) => {
    let deleteCount = db.queries.where("query").equalsIgnoreCase(value).delete()
    return  deleteCount   
}


export const addSearchQuery = (q:string) => {
    db.queries.put({query:q})
}