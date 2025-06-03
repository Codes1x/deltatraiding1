export interface IProduct {
  id: number
  name: string
  category: IProductCategory
  price: string
  description: string
  product_payment_type: string
  duration: string
  product_icon: string
  product_image: string
  enabled: boolean,
  name_related_trading_system: string,
  purchase_id: number,
  slug: string
}

export interface IProductResponce {
  next: null
  previous: null
  current: 1
  count: 1
  results: IProduct[]
}

interface IProductCategory {
  id: number
  title: string
  name: string
  description: string
}

export interface IProductInvoiceResponce {
  invoice: {
    id: number,
    amount: string,
    currency: string,
    extra: string,
    status: string
  },
  product: {
    id: number,
    name: string,
    category: {
      id: number,
      title: string,
      name: string,
      description: string
    },
    price: string,
    description: string,
    product_payment_type: string,
    duration: string,
    product_icon: string,
    product_image: string,
    enabled: true
  },
  address: string,
  expiration_time: number,
  standart: string,
  total_balance: string
}