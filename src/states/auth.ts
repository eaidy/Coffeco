import { atom } from "jotai";

// Models
export type UserState = {
    data: string;
    message: string;
    status: boolean;
}

export type Categories = {
    status: boolean;
    message: string;
    data: Array<Object>;
}

export type Category = {
    categoriID: number,
    category: string,
    sort: number
}

// User State
export const userStateAtom = atom<UserState>({
    data: '',
    message: '',
    status: false
})

// Pages State
export const categoriesAtom = atom([])
export const productsAtom = atom([])
export const productAtom = atom({})


