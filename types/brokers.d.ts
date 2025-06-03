export interface IBroker {
    id: number,
    broker_id?: number,
    name: string,
    metatrader_version: number,
    cent: boolean
}

export interface IBrokerSimple {
    id: number,
    name: string,
}