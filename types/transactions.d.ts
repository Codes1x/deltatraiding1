export interface DropdownItem {
    label: string;
    value: string;
    icon: string;
}

export interface ITransactionsResponse {
    next: number,
    previous: number,
    current: number,
    count: number,
    results: ITransaction[]
}

export interface ITransaction {
    id: number,
    transaction_type: string,
    amount: string,
    description: string,
    transaction_status: string,
    created_at: Date,
    from_account: number,
    to_account: string,
    invoice: string,
    withdrawal_request: string
}