export interface IPurchase {
    id: number,
    user: number,
    product: {
        id: number,
        name: string,
        category: {
            id: 19,
            title: string,
            name: string,
            description: string,
        },
        price: string,
        description: string,
        product_payment_type: string,
        duration: string,
        product_icon: null,
        product_image: null,
        enabled: boolean,
        slug: string
    },
    expires_at: string
}

export interface IPurchaseResponse {
    count: number,
    current: number,
    next: number
    previous: number
    results: IPurchase[]
}