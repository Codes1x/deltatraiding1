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
        async newTicket(payload: {
            subject: string;
            message: string;
            ticket_type_id: string;
            attachment?: File | null;
        }) {
            console.log('stores/tickets.ts - newTicket payload:', payload);

            const { subject, message, ticket_type_id, attachment } = payload;
            const authStore = useAuthStore();
            const user_id = authStore.user?.id;

            if (!user_id) {
                const errorMsg = 'User not authenticated';
                console.error('stores/tickets.ts - newTicket error:', errorMsg);
                return { success: false, error: errorMsg };
            }

            // The 'client' field is determined by the auth token on the backend.
            // It should not be in the request body.
            const body = {
                subject,
                message,
                ticket_type_id: String(payload.ticket_type_id),
            };

            // We don't handle attachments for now in JSON mode.
            // if (attachment) {
            //   // how to handle attachment with application/json?
            // }

            console.log('stores/tickets.ts - newTicket - JSON body:', body);
            
            try {
                const response: any = await fetchWithAuth(
                    '/api/v1/support/tickets/',
                    {
                        method: 'POST',
                        body: JSON.stringify(body),
                    }
                );

                return { success: true, data: response };

            } catch (error: any) {
                console.error('stores/tickets.ts - newTicket error:', error);
                // Attempt to parse the error response body
                const errorBody = await error.response?._data;
                const errorMessage = errorBody?.error || error.message || 'Failed to create ticket';
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
                })) as IMessagesInfo // Указываем, что ожидаем объект типа IMessagesInfo
                console.log('stores/tickets.ts - newMessage - Server Response:', JSON.stringify(response, null, 2));

                // Обновляем messages_info в активном тикете
                if (this.activeTicket && this.activeTicket.dialog_info && this.activeTicket.dialog_info.id === payload.dialog_id) {
                    if (!this.activeTicket.messages_info) {
                        this.activeTicket.messages_info = [];
                    }
                    this.activeTicket.messages_info.push(response);
                } else {
                    console.warn(
                        'stores/tickets.ts - newMessage - Active ticket dialog_id (',
                        this.activeTicket?.dialog_info?.id,
                        ') does not match payload.dialog_id (',
                        payload.dialog_id,
                        ') or activeTicket/dialog_info is not set. Message not pushed to activeTicket.messages_info directly.',
                    );
                }

                // Также обновляем сообщение в общем списке тикетов this.tickets
                const ticketInList = this.tickets.find(t => t.dialog_info && t.dialog_info.id === payload.dialog_id);
                if (ticketInList) {
                    if (!ticketInList.messages_info) {
                        ticketInList.messages_info = [];
                    }
                    // Добавляем, только если сообщение с таким ID еще не существует
                    if (!ticketInList.messages_info.some(m => m.id === response.id)) {
                        ticketInList.messages_info.push(response);
                    }
                } else {
                     console.warn(
                        'stores/tickets.ts - newMessage - Ticket with dialog_id (',
                        payload.dialog_id,
                        ') not found in this.tickets. Message not pushed to tickets list directly.',
                    );
                }

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