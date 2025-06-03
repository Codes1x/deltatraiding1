
export const ORDER_TYPES = {
    BUY: 0,
    SELL: 1,
    BALANCE: 2,
    CREDIT: 3,
    CHARGE: 4,
    CORRECTION: 5,
    BONUS: 6,
    COMISSION: 7,
    COMISSION_DAILY: 7,
    COMISSION_MONTHLY: 9,
    COMISSION_AGENT_DAILY: 10,
    COMISSION_AGENT_MONTHLY: 11,
    INTEREST: 12,
    BUY_CANCELED: 13,
};

export const ORDER_TYPES_READEBLE = {
    [ORDER_TYPES.BUY]: 'Buy',
    [ORDER_TYPES.SELL]: 'Sell',
    [ORDER_TYPES.BALANCE]: 'Balance',
    [ORDER_TYPES.CREDIT]: 'Credit',
    [ORDER_TYPES.CHARGE]: 'Charge',
    [ORDER_TYPES.CORRECTION]: 'Correction',
    [ORDER_TYPES.COMISSION]: 'Comission',
    [ORDER_TYPES.COMISSION_DAILY]: 'Comission daily',
    [ORDER_TYPES.COMISSION_MONTHLY]: 'Comission monthly',
    [ORDER_TYPES.COMISSION_AGENT_DAILY]: 'Comission agent daily',
    [ORDER_TYPES.COMISSION_AGENT_MONTHLY]: 'Comission agent monthly',
    [ORDER_TYPES.INTEREST]: 'Interest',
    [ORDER_TYPES.BUY_CANCELED]: 'Buy canceled',
};