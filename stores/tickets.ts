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
        async newTicket(payload: { message: string, attachment?: string, ticket_type_id: string, subject: string }) {
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken
                if (!accessToken) {
                    // throw new Error("Access token is missing");
                    return { success: false, error: "Access token is missing" };
                }
                const headers: Record<string, string> = {
                    Authorization: `JWT ${accessToken}`,\
                }

                const formData = new FormData()
                formData.append('message', payload.message.toString())
                formData.append('ticket_type_id', payload.ticket_type_id.toString())
                formData.append('subject', payload.subject.toString())
                if (payload.attachment) {
                    formData.append('attachment', payload.attachment);
                }

                const url = `https://stage.api.delta-trade.app/api/v1/support/tickets/`
                const response = (await $fetch(url, {
                    method: 'POST',
                    headers,
                    body: formData,
                })) as INewTicketResponse

                return { success: true, data: response };
            } catch (error: any) {
                console.error('newTicket error: ', error)
                const errorMessage = error.data?.detail || error.message || 'Failed to create ticket';
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
            ///api/v1/support/tickets/{id}/reply_message/
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken
                if (!accessToken) {
                    // throw new Error("Access token is missing");
                    return { success: false, error: "Access token is missing" };
                }
                const headers: Record<string, string> = {
                    Authorization: `JWT ${accessToken}`,\
                }

                const formData = new FormData()
                formData.append('dialog_id', payload.dialog_id)
                // API ожидает sender как часть JWT, а не в теле запроса для /create_message/
                // formData.append('sender', payload.sender ? payload.sender.toString() : '')
                formData.append('content', payload.content)
                if (payload.reply_to) { // Отправляем reply_to только если оно есть
                    formData.append('reply_to', payload.reply_to.toString());
                }

                const url = `https://stage.api.delta-trade.app/api/v1/support/tickets/create_message/`
                const response = (await $fetch(url, {
                    method: 'POST',
                    headers,
                    body: formData,
                }))

                return { success: true, data: response };
            } catch (error: any) {
                console.error('newMessage error: ', error)
                const errorMessage = error.data?.detail || error.message || 'Failed to send message';
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