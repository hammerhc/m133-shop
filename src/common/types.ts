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
    totalPrice: number,
    count: number
}