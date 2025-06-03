import type { IProduct } from "./products"

export interface ISubscribesResponse {
    success: boolean,
    detail: string
}

export interface ISubscribesResponseArray {
    expires_at: string,
    id: number,
    product: IProduct,
    user: number,
    is_configured: boolean,
    paid_for: boolean,
    account_balance: number
    auto_trade: boolean,
    profit_all: number
    profit_all_percent: number
}

export interface ITSWithVPS {
    tradingSystem: ISubscribesResponseArray,
    vps: ISubscribesResponseArray[]
}