export interface IRobotInfo {
    type: string,
    product_id: string,
    timestamp: number,
    msg_version: number,
    data:
    {
        account_info: IAccountInfo,
        robot_settings:
        {
            status_code: number,
            chanel: number,
            auto_trade: number,
            stop_trade: number
        },
        expert_settings:
        {
            stop_marg_level: number,
            stop_drawdown_level: number,
            close_marg_level: number,
            close_drawdown_level: number,
            LotRisk: number
        },
        trading_info:
        {
            bid_price: number,
            ask_price: number,
            profit_float: number,
            master_info_ts: number,
            staus_tradeallow: number
        },
        orders: IRobotOrder[],
        statistics_info:
        {
            today: IStatisticValue,
            yesterday: IStatisticValue,
            days_7: IStatisticValue,
            days_30: IStatisticValue,
            all_time: IStatisticValue
        },
        in_work_seconds: number,
        version: string
    },
    sign: string
}

export interface IRobotOrder {
    order_id: number,
    symbol: string,
    order_type: string,
    open_time: number,
    open_price: number,
    lots: number,
    stop_loss: number,
    take_profit: number,
    swap: number,
    profit: number,
    comission: number,
    magic: number,
    comment: string,
    open_type: number
}

export interface IStatisticValue {
    amount: number,
    percent: number
}

export interface ICandleSticks {
    type: string,
    product_id: string,
    timestamp: number,
    data:
    {
        broker: string,
        symbol: string,
        period: number,
        candles: ICandle[]
    }
}

export interface ICandle {
    time: number,
    open: number,
    high: number,
    low: number,
    close: number,
    tick_volume: number
}

export interface IRobotCurrentStats {
    today: IStatisticValue,
    yesterday: IStatisticValue,
    days_7: IStatisticValue,
    days_30: IStatisticValue,
    all_time: IStatisticValue
}

export interface IAccountInfo {
    account_num: number,
    broker: string,
    server_name: string,
    account_currency: string,
    symbol_point: number,
    symbol_digits: number,
    is_cent: number,
    account_balance_usd: number,
    account_balance: number,
    account_equity: number,
    account_margin_level: number,
    funds_in_trade: number,
    work_balance: number,
    paid_balance: number,
    account_balance_real: number,
    account_equity_real: number,
    account_margin_level_real: number,
    funds_in_trade_real: number
}

export interface IProfitChart {
    date: string,
    account_balance: number,
    amount_day: number,
    percent_day: number,
    amount_all: number,
    percent_all: number
}