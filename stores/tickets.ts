import { defineStore } from 'pinia'
import { useTgWebAppStore } from '@/stores/tgWebApp'
import type { INewTicketResponse, ITicket, ITicketType, IMessagesInfo, IUserProductPurchase } from '~/types/tickets';

export const useTicketsStore = defineStore('tickets', {
    state: () => ({
        ticketsTypes: [] as ITicketType[],
        tickets: [] as ITicket[],
        activeTicket: {} as ITicket,
        nonConfiguredSystems: [] as IUserProductPurchase[],
    }),
    actions: {
        async fetchTicketsType() {
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken

                if (!accessToken) {
                    throw new Error("Не авторизован в Telegram");
                }

                const headers: Record<string, string> = {
                    Authorization: `JWT ${accessToken}`,
                };

                const url = `https://stage.api.delta-trade.app/api/v1/support/tickets/types/`
                const response = await $fetch(url, {
                    method: 'GET',
                    headers,
                });

                this.ticketsTypes = response as ITicketType[];
                return response;
            } catch (error: any) {
                console.error('Ошибка при получении типов тикетов:', error);
                this.ticketsTypes = [];
                return {
                    success: false,
                    error: error.data?.detail || 'Ошибка при получении типов тикетов'
                };
            }
        },

        async fetchNonConfiguredSystems() {
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken

                if (!accessToken) {
                    throw new Error("Не авторизован в Telegram");
                }

                const headers: Record<string, string> = {
                    Authorization: `JWT ${accessToken}`,
                };

                const url = `https://stage.api.delta-trade.app/api/v1/purchases/non_configured_trading_systems/`
                const response = await $fetch<{ results: IUserProductPurchase[] }>(url, {
                    method: 'GET',
                    headers,
                });

                this.nonConfiguredSystems = response.results || [];
                return response.results;
            } catch (error: any) {
                console.error('Ошибка при получении несконфигурированных систем:', error);
                this.nonConfiguredSystems = [];
                return {
                    success: false,
                    error: error.data?.detail || 'Ошибка при получении несконфигурированных систем'
                };
            }
        },

        async fetchTickets() {
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken

                if (!accessToken) {
                    throw new Error("Не авторизован в Telegram");
                }

                const headers: Record<string, string> = {
                    Authorization: `JWT ${accessToken}`,
                };

                const url = `https://stage.api.delta-trade.app/api/v1/support/tickets/`
                const response = await $fetch<ITicket[]>(url, {
                    method: 'GET',
                    headers,
                });

                this.tickets = response;
                return response;
            } catch (error: any) {
                console.error('Ошибка при получении тикетов:', error);
                this.tickets = [];
                return {
                    success: false,
                    error: error.data?.detail || 'Ошибка при получении тикетов'
                };
            }
        },

        async newTicket(payload: {
            subject: string;
            message: string;
            ticket_type_id: string;
            attachment?: File | null;
            product_id?: number | null;
        }) {
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken

                if (!accessToken || !tgWebAppStore.user?.id) {
                    throw new Error("Не авторизован в Telegram");
                }

                const headers: Record<string, string> = {
                    'Authorization': `JWT ${accessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                };

                const body = {
                    subject: payload.subject,
                    message: payload.message,
                    ticket_type: Number(payload.ticket_type_id),
                    client: tgWebAppStore.user.id,
                    product: payload.product_id || null,
                };

                const url = `https://stage.api.delta-trade.app/api/v1/support/tickets/`
                const response = await $fetch(url, {
                    method: 'POST',
                    headers,
                    body,
                });

                return { success: true, data: response };
            } catch (error: any) {
                console.error('Ошибка при создании тикета:', error);
                return {
                    success: false,
                    error: error.data?.detail || 'Ошибка при создании тикета'
                };
            }
        },

        async fetchActiveTickets(payload: { ticketId: string }) {
            const ticket = this.tickets.find(el => el.id === payload.ticketId);
            if (ticket) {
                this.activeTicket = ticket;
            }
        },

        async newMessage(payload: {
            dialog_id: string,
            content: string,
            reply_to?: number
        }) {
            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken

                if (!accessToken || !tgWebAppStore.user?.id) {
                    throw new Error("Не авторизован в Telegram");
                }

                const headers: Record<string, string> = {
                    'Authorization': `JWT ${accessToken}`,
                    'Content-Type': 'application/json',
                };

                const bodyPayload = {
                    dialog_id: payload.dialog_id,
                    sender: tgWebAppStore.user.id,
                    content: payload.content,
                    ...(payload.reply_to && { reply_to: payload.reply_to })
                };

                const url = `https://stage.api.delta-trade.app/api/v1/support/tickets/create_message/`
                const response = await $fetch<IMessagesInfo>(url, {
                    method: 'POST',
                    headers,
                    body: bodyPayload,
                });

                // Обновляем состояние активного тикета
                if (this.activeTicket?.dialog_info?.id === payload.dialog_id) {
                    if (!this.activeTicket.messages_info) {
                        this.activeTicket.messages_info = [];
                    }
                    this.activeTicket.messages_info.push(response);
                }

                return { success: true, data: response };
            } catch (error: any) {
                console.error('Ошибка при отправке сообщения:', error);
                return {
                    success: false,
                    error: error.data?.detail || 'Ошибка при отправке сообщения'
                };
            }
        }
    },
    getters: {
        getTicketsTypes(state) {
            return state.ticketsTypes.length > 0 ? state.ticketsTypes : [];
        },
        getTickets(state) {
            return state.tickets.length > 0 ? state.tickets : [];
        },
        getActiveTicket(state) {
            return state.activeTicket || null;
        },
        getNonConfiguredSystems(state) {
            return state.nonConfiguredSystems.length > 0 ? state.nonConfiguredSystems : [];
        }
    },
});