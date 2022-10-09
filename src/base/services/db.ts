import Dexie, { Table } from 'dexie';

export interface SearchEntry {
  id?: number;
  query: string;
  showClock?: boolean;
}

export class MySubClassedDexie extends Dexie {
  
  search!: Table<SearchEntry>; 

  constructor() {
    super('myDatabase');
    this.version(1).stores({
        search: '++id, query' // Primary key and indexed props
    });
  }
}


export const getSearchItems = async () => {
    let collection: { [key: string]: SearchEntry } = {};
    return (
        await db.search.toCollection().toArray((arr) => arr)
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
    let deleteCount = db.search.where("query").equalsIgnoreCase(value).delete()
    return  deleteCount   
}

export const db = new MySubClassedDexie();
