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
                    throw new Error("Access token is missing");
                }
                const headers: Record<string, string> = {
                    Authorization: `JWT ${accessToken}`,
                }

                const formData = new FormData()
                formData.append('message', payload.message.toString())
                formData.append('ticket_type_id', payload.ticket_type_id.toString())
                formData.append('subject', payload.subject.toString())

                const url = `https://stage.api.delta-trade.app/api/v1/support/tickets/`
                const response = (await $fetch(url, {
                    method: 'POST',
                    headers,
                    body: formData,
                })) as INewTicketResponse

                return response
            } catch (error) {
                console.error('fetchTickets ', error)
                return error
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
                    throw new Error("Access token is missing");
                }
                const headers: Record<string, string> = {
                    Authorization: `JWT ${accessToken}`,
                }

                const formData = new FormData()
                formData.append('dialog_id', payload.dialog_id)
                formData.append('sender', payload.sender ? payload.sender.toString() : '')
                formData.append('content', payload.content)
                formData.append('reply_to', payload.reply_to ? payload.reply_to.toString() : '')

                const url = `https://stage.api.delta-trade.app/api/v1/support/tickets/create_message/`
                const response = (await $fetch(url, {
                    method: 'POST',
                    headers,
                    body: formData,
                }))

                return response
            } catch (error) {
                console.error('newMessage ', error)
                return error
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