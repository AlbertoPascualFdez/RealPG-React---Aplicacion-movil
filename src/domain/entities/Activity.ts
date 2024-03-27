export interface Activity{
    id:number,
    name:string,
    totalTime:number
    category: string
    sessions: Session[]
}

export interface Session{
    date: string,
    minutes: number
}

export interface Category{
    name:string,
    minutes:number
}