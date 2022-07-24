import { atom } from "jotai";
import { UserState } from '@/models/models'

// User State
export const userStateAtom = atom<UserState>({
    data: '',
    message: '',
    status: false
})

// Pages State
export const categoriesAtom = atom([])
export const productsAtom = atom([])
export const basketAtom = atom<Number>(0)

