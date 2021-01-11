export type Product = {
    id: string,
    productName: string,
    specialOffer: number,
    normalPrice: number,
    imageName: string,
    imagePath: string,
    description: string,
    amount: number
}

export type Cart = {
    products: Product[],
    totalSpecialPrice: number,
    totalPrice: number,
    count: number
}