// Standart Models
export type Product = {
    productID: number;
    productName: string;
    shortDescription: string;
    description: string;
    sku: string;
    price: number;
    photo: string;
    salePrice: number;
    bonus: number;
    status: boolean;
    campaignNote: string;
    maxOrder: number;
    minOrder: number;
}

export type ResponseModel = {
    status: boolean;
    message: string;
    data: Object;
}

export type Variant = {
    description: string;
    price: number;
    bonus: number;
    salePrice: number;
    priceID: number;
    parentID: number;
}

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

export type RegisterFormModel = {
    // Login: string;
    Adi: string;
    Soyadi: string;
    Cep: string;
    Email: string;
    Password: string;
    RePassword: string;
}

export type ProductBasketModel = {
    ProductID: number;
    Qty: number;
    Variants: string;
}

// Derived Models
export type Variants = Array<Variant>
