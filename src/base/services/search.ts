
interface Options{
    key:string;
    contains?: boolean
}

export function searchSorter<T>(items:T[], value:string, options:Options):T[] {
     return items.reduce((acc:T[], next:T)=>{
        if(options.contains){
            if((next[options.key as keyof T] as string).toLocaleLowerCase().includes(value.toLocaleLowerCase())){
                acc.push(next)
            }
        }else{
            if((next[options.key as keyof T] as string).toLocaleLowerCase().startsWith(value.toLocaleLowerCase())){
                acc.push(next)
            }
        }
        return acc
    },[])
}  