import { defineStore } from 'pinia'
import type { INewTicketResponse, ITicket, ITicketType } from '~/types/tickets';

export const useTicketsStore = defineStore('tickets', {
    state: () => ({
        ticketsTypes: [] as ITicketType[],
        tickets: [] as ITicket[],
        activeTicket: {} as ITicket
    }),
    actions: {
        async fetchTicketsType() {
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken
                if (!accessToken) {
                    throw new Error("Access token is missing");
                }
                const headers: Record<string, string> = {
                    Authorization: `JWT ${accessToken}`,
                }

                const url = `https://stage.api.delta-trade.app/api/v1/support/tickets/types/`
                const response = (await $fetch(url, {
                    method: 'GET',
                    headers,
                }))
                this.ticketsTypes = response as ITicketType[]

                return response
            } catch (error) {
                this.ticketsTypes = []
                console.error('fetchTicketsType ', error)
                return error
            }
        },
        async fetchTickets() {
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken
                if (!accessToken) {
                    throw new Error("Access token is missing");
                }
                const headers: Record<string, string> = {
                    Authorization: `JWT ${accessToken}`,
                }
                // status $date-time created_at
                const url = `https://stage.api.delta-trade.app/api/v1/support/tickets/`
                const response = (await $fetch(url, {
                    method: 'GET',
                    headers,
                }))
                this.tickets = response as ITicket[]

                return response
            } catch (error) {
                this.tickets = []
                console.error('fetchTickets ', error)
                return error
            }
        },
        async newTicket(payload: { message: string, ticket_type_id: string, subject: string }) {
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken
                if (!accessToken) {
                    return { success: false, error: "Access token is missing" };
                }
                const headers: Record<string, string> = {
                    Authorization: `JWT ${accessToken}`,
                    'Content-Type': 'application/json',
                }

                const bodyPayload = {
                    message: payload.message,
                    ticket_type_id: payload.ticket_type_id,
                    subject: payload.subject
                };
                console.log('stores/tickets.ts - newTicket - JSON body:', JSON.stringify(bodyPayload, null, 2));

                const url = `https://stage.api.delta-trade.app/api/v1/support/tickets/`
                const response = (await $fetch(url, {
                    method: 'POST',
                    headers,
                    body: bodyPayload,
                })) as INewTicketResponse

                return { success: true, data: response };
            } catch (error: any) {
                console.error('newTicket store error raw: ', error);
                console.error('newTicket store error.data: ', error.data);
                const errorMessage = error.data?.detail || error.data?.message || error.message || 'Failed to create ticket';
                return { success: false, error: errorMessage };
            }
        },
        async fetchActiveTickets(payload: { ticketId: string }) {
            const ticket = this.tickets.find(el => el.id === payload.ticketId);
            // console.log('found ', ticket)
            if (ticket) {
                this.activeTicket = ticket;
            }
            // console.log('found  this.activeTicket', this.activeTicket)
        },
        async newMessage(payload: { dialog_id: string, sender?: number, content: string, reply_to?: number }) {
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken
                if (!accessToken) {
                    return { success: false, error: "Access token is missing" };
                }
                // ПРЕДПОЛОЖЕНИЕ: ID пользователя (sender) должен быть доступен.
                // Если payload.sender не предоставлен, нужно решить, как его получать (например, из auth store).
                // Для демонстрации, если sender не пришел, вернем ошибку, так как он обязателен по схеме.
                if (payload.sender === undefined || payload.sender === null) {
                    console.error('newMessage error: sender is missing in payload');
                    return { success: false, error: "Sender ID is missing" };
                }

                const headers: Record<string, string> = {
                    Authorization: `JWT ${accessToken}`,
                    'Content-Type': 'application/json', // Явно указываем Content-Type
                }

                const bodyPayload: any = {
                    dialog_id: payload.dialog_id,
                    sender: payload.sender, // Используем sender из payload
                    content: payload.content,
                }
                if (payload.reply_to !== undefined && payload.reply_to !== null) { // Отправляем reply_to только если оно есть и не null
                    bodyPayload.reply_to = payload.reply_to;
                }
                console.log('stores/tickets.ts - newMessage - JSON body:', JSON.stringify(bodyPayload, null, 2));

                const url = `https://stage.api.delta-trade.app/api/v1/support/tickets/create_message/`
                const response = (await $fetch(url, {
                    method: 'POST',
                    headers,
                    body: bodyPayload, // Отправляем объект напрямую
                }))

                return { success: true, data: response };
            } catch (error: any) {
                console.error('newMessage store error raw: ', error);
                console.error('newMessage store error.data: ', error.data);
                const errorMessage = error.data?.detail || error.data?.message || error.message || 'Failed to send message';
                return { success: false, error: errorMessage };
            }
        }
    },
    getters: {
        getTicketsTypes(state) {
            if (state.ticketsTypes.length > 0) {
                return state.ticketsTypes
            }
            return []
        },
        getTickets(state) {
            if (state.tickets.length > 0) {
                return state.tickets
            }
            return []
        },
        getActiveTicket(state) {
            if (state.activeTicket) {
                return state.activeTicket
            }
            return null
        }
    },
})