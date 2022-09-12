import { atom } from "jotai";
import { UserState } from '@/models/models'

type UserInfo = {
    aciklama: string;
    bonus: number;
    cinsiyet: number;
    email: string;
    gsm: string;
    adi: string;
    soyadi: string;
    password: string;
    cariID: number;
}

// User States
export const userStateAtom = atom<UserState>({
    data: '',
    message: '',
    status: false
})

export const userInfoStateAtom = atom<UserInfo>({
    aciklama: '',
    bonus: 0,
    cinsiyet: 0,
    email: '',
    gsm: '',
    adi: '',
    soyadi: '',
    password: '',
    cariID: -1  // -1 means empty cariID
})

// Pages State
export const categoriesAtom = atom([])
export const productsAtom = atom([])
export const basketAtom = atom<Number>(0)

