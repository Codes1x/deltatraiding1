// Тип для Invoice (адрес пополнения)
export interface IInvoice {
    address: string;
    amount: string;
    currency: string;
    expiration_time: number;
    extra: Record<string, unknown>; // ✅ исправлено
    id: number;
    qr_code: string;
    standart: string;
    status: string;
}

// Тип для полного ответа на запрос пополнения
export interface IReplenishmentResponce {
    invoice: IInvoice;
    product: string;
    total_balance: number;
}

// Тип для элементов выпадающего списка (Dropdown)
export interface DropdownItem {
    label: string;
    value: string;
    icon: string;
}
