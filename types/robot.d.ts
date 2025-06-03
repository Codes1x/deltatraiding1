export interface IRobot {
    uid: string,
    product_id: number,
    symbol: string,
    symbols_list: string[],
    front_version: number,
    metatrader_version: number,
    account_num: number,
    account_currency: string,
    cent: boolean,
    robot_type: string,
    product_type: string,
    broker_name: string,
    broker_server: number,
    start_date: Date,
    online: boolean,
    server: IRobotServer,
    active: boolean,
    status: string,
    ignore_progress: boolean,
    cycle: number,
    deposit_trade: number,
    trade_limit: number,
    profit_limit: number,
    profit_limit_percent: number,
    trading_strategy: number,
    stop_trade: boolean,
    auto_trade: boolean,
    statistic: IRobotStatistic,
    chart_daily_profit: IRobotDailyProfit,
    check_password: boolean,
    stop_trade_reason: number,
    hub: string,
    api_key: string
}

export interface IRobotServer {
    id: 6660,
    vps_end_date: string,
    web_rdp_url: string,
    auto_recovery: boolean,
    auto_update: boolean,
    vps_type: number,
    metatrader_version: number,
    installed_metatrader_version: string,
    vps_uuid: any,
    uid_issued: boolean,
    uid_issued_at: any,
    account_id: number,
    package: any,
    port: number,
    ftp_port: any,
    ip: string,
    status: string,
    hostname: string,
    username: string,
    password: string,
    created: any,
    nextduedate: any,
    amount: string,
    check_updates_at: any,
    update_status: string,
    update_result: string,
    robot_activity_at: Date,
    container_status: string,
    setup_status: string,
    metatrader_restarted: boolean,
    started_at: Date,
    created_at: Date,
    updated_at: Date,
    notify_template: any,
    notify_date: any,
    guacamole_account: boolean,
    auth_token: string,
    auth_token_dt: Date,
    backup: any,
    expert_file: any,
    robot: number,
    cluster: number,
    vps_version: number
}

export interface IRobotStatistic {
    cycle_number: number,
    profit_today: number,
    profit_today_percent: number,
    profit_yesterday: number,
    profit_yesterday_percent: number,
    profit_week: number,
    profit_week_percent: number,
    profit_month: number,
    profit_month_percent: number,
    profit_cycle: number,
    profit_cycle_percent: number,
    profit_all: number,
    profit_all_percent: number,
    profit_limit_percent: number,
    profit_progress: number,
    in_trade_days: number,
    in_trade: number,
    account_margin: number,
    account_balance: number,
    account_equity: number,
    order_total_count: number,
    order_open_count: number,
    updated_at: Date
}

export interface IRobotDailyProfit {
    dates: [],
    profit: [],
    profit_daily: [],
    max_value: number
}

export interface IResponseOrdersHistory {
    pagination: {
        page_prev: number,
        page_next: number,
        page_count: number,
        has_prev: boolean,
        has_next: boolean
    },
    items: IOrderHistoryItem[]
}

export interface IOrderHistoryItem {
    product_id: number,
    account_num: number,
    account_balance: number,
    ticket: number,
    time: Date,
    deal_type: number,
    entry: number,
    magic: number,
    reason: number,
    position_id: number,
    volume: number,
    price: number,
    equity: number,
    commission: number,
    swap: number,
    profit: number,
    fee: number,
    sl: number,
    tp: number,
    symbol: number,
    comment: number,
    external_id: string,
    twr: number,
    successful_fee_expense_id: any,
    id: string
}

export interface IRobotSettings {
    product_id: number,
    time_trade: number,
    filter_time: boolean,
    bonus: number,
    shd_mrg_lv: number,
    shd_fund: number,
    stop_close: boolean,
    stop_drawdown_level: number,
    close_drawdown_level: number,
    stop_marg_level: number,
    close_marg_level: number,
    chart_start_date: string,
    broker: number,
    server_name: string
}

export interface IEnumItem {
    0: number;
    1: string;
}

export interface IRobotExpertSettings {
    name: string;
    display_name?: string;
    type: string;
    widget?: string;
    exclusiveMaximum?: number;  // - значение параметра не может быть больше этого
    exclusiveMinimum?: number;  // - значение параметра не может быть меньше этого
    gt?: number;                // - значение должно быть больше заданного
    lt?: number;                // - значение должно быть меньше заданного
    ge?: number;                // - значение должно быть больше или равно заданного
    le?: number;                // - значение должно быть меньше или равно заданного
    default: number;
    value: number;
    help_text: string;
    first_setup?: boolean;
    enum?: IEnumItem[]           // [1,2,3] or [[1, "type 1"],[2, "type 2"], [3, "type 3"]]
}