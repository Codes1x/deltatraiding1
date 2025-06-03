export interface ITicketType {
    id: number,
    name: string,
    color: string,
    additional_fields: number,
    attachment_required: boolean,
    created_at: Date,
    updated_at: Date
}

export interface ITicket {
    id: string,
    dialog_info: IDialogInfo,
    messages_info: IMessagesInfo[],
    attachment_info: string,
    subject: string,
    status: string,
    priority: string,
    created_at: Date,
    updated_at: Date,
    ticket_type: number,
    moderator: number,
    client: number,
    technical_support_officer: number,
    product: number
}

interface IDialogInfo {
    created_at: Date
    id: string
    ticket: string
}

export interface IMessagesInfo {
    id: number,
    content: string,
    is_read: boolean,
    date_time_read: Date,
    created_at: Date,
    date_time_response: Date,
    duration_response: any,
    dialog: string,
    sender: number,
    reply_to: number
}

export interface INewTicketResponse {
    ticket_type: number,
    subject: string,
    client: number
}

export interface 