export interface IStats {
    all_time: {
        amount: number,
        percent: number
    },
    days_30: {
        amount: number,
        percent: number
    },
    days_7: {
        amount: number,
        percent: number
    },
    yesterday: {
        amount: number,
        percent: number
    },
    today: {
        amount: number,
        percent: number
    },
    robots_count: number,
    referrals_count: number,
    start_date: string,
    deals_count: number,
    days_from_start: number,
    balance_start: number,
    balance_replenish: number,
    balance_withdraw: number
}