import Dexie, { Table } from 'dexie';
import seed from './data.json' 

export interface SearchEntry {
  id?: number;
  query: string;
  showClock?: boolean;
}

export interface Result {
    link:string;
    title:string;
    description: string;
  }
export class MySubClassedDexie extends Dexie {
  
  queries!: Table<SearchEntry>;
  results!: Table<Result>
   

  constructor() {
    super('myDatabase');
    this.on("populate", function(transaction) {
      const data = seed.payload
      data.map(_=>db.results.add(_))
    })
    this.version(1).stores({
        queries: '++id, query' // Primary key and indexed props
    });
    this.version(1).stores({
        results: '++id, link, title, description' // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();
db.open();

