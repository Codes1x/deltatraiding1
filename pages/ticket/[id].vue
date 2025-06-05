<script setup lang="ts">
import { useWebAppViewport } from 'vue-tg'
import { useTicketsStore } from '~/stores/tickets';
import { useRoute } from 'vue-router';
import { useTgWebAppStore } from '@/stores/tgWebApp';
const appViewport = useWebAppViewport()
const ticketsStore = useTicketsStore()
const route = useRoute()
const tgWebAppStore = useTgWebAppStore();
// Получаем параметр id из route.params
const ticketId = route.params.id;
const activeTicketData = computed(() => ticketsStore.getActiveTicket)

const newMessage = ref('')
const isLoadingSendMessage = ref(false);

const sendMessage = async () => {
    if (activeTicketData.value && newMessage.value.length > 0) {
        isLoadingSendMessage.value = true;
        try {
            // Получаем ID текущего пользователя
            const currentUser = tgWebAppStore.user;
            if (!currentUser || currentUser.id === undefined || currentUser.id === null) {
                alert('Error: Could not get current user ID. Please try again.');
                isLoadingSendMessage.value = false;
                return;
            }

            const lastMessage = activeTicketData.value.messages_info
                .filter(el => el.sender !== activeTicketData?.value?.client)
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            [0];

            const lastMessageId = lastMessage ? lastMessage.id : undefined;

            const payload = {
                dialog_id: activeTicketData.value.dialog_info.id,
                content: newMessage.value,
                sender: currentUser.id,
                reply_to: lastMessageId
            }
            console.log('pages/ticket/[id].vue - sendMessage payload:', JSON.stringify(payload, null, 2));

            const result = await ticketsStore.newMessage(payload)
            
            if (result.success) {
                newMessage.value = '';
                console.log('Attempting to refresh ticket data after sending message...');
                await fetchData();
            } else {
                alert(`Error sending message: ${result.error || 'Failed to send message'}`);
            }
        } catch (error) {
            console.error('sendMessage error: ', error)
            alert('An unexpected error occurred while sending the message.');
        } finally {
            isLoadingSendMessage.value = false;
        }
    }
}
// get Ticket data
const isDataLoaded = ref(false)
const fetchData = async () => {
    console.log('fetchData called for ticket ID:', ticketId);
    isDataLoaded.value = false
    try {
        if (ticketId) {
            // Сначала обновляем весь список тикетов с сервера
            await ticketsStore.fetchTickets(); 
            // Затем устанавливаем активный тикет из обновленного списка
            const payload = { ticketId: ticketId.toString() }
            await ticketsStore.fetchActiveTickets(payload)
            console.log('fetchData - activeTicketData from store after fetch:', JSON.stringify(activeTicketData.value, null, 2));
        }
    } catch (error) {
        console.error('fetchData ticket error:', error)
    } finally {
        isDataLoaded.value = true
        console.log('fetchData finished for ticket ID:', ticketId);
    }
}

const handleViewportChange = () => {
    // console.log('change ', window.innerHeight)
    const ticketContent = document.querySelector('.ticket__input') as HTMLElement;
    if (ticketContent) {
        ticketContent.style.paddingBottom = window.visualViewport?.height! < appViewport.viewportHeight.value ? "350px" : "0px";
    }
};

onMounted(() => {
    fetchData()
    appViewport.onViewportChanged(handleViewportChange);
});
onUnmounted(() => {
    const modalContent = document.querySelector('.ticket__input') as HTMLElement;
    if (modalContent) modalContent.style.paddingBottom = "0px";
});
</script>

<template>
    <section class="ticket">
        <TicketHeader />

        <div v-if="isDataLoaded" class="ticket__content">

            <TicketMessage v-for="message in activeTicketData?.messages_info"
                :you="activeTicketData.client === message.sender" :message>{{ message.content }}
            </TicketMessage>

        </div>

        <div v-else class="ticket__content">
            <CommonLoader :small="true" />
        </div>
        <div class="ticket__input">
            <input v-model="newMessage" class="message" type="text" placeholder="Start typing..." :disabled="isLoadingSendMessage">

            <div class="buttons" @click="!isLoadingSendMessage && sendMessage()">
                <button class="send" :disabled="isLoadingSendMessage">
                    <CommonLoader v-if="isLoadingSendMessage" :small="true" style="width: 18px; height: 15px;" />
                    <svg v-else width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M2.42505 1.85076L3.27282 6.72543H8.50371C8.94869 6.72543 9.30942 7.08615 9.30942 7.53114C9.30942 7.97612 8.94869 8.33685 8.50371 8.33685H3.27282L2.42505 13.2115L15.6793 7.53114L2.42505 1.85076ZM1.77733 7.53114L0.783533 1.81683C0.703193 1.35488 0.852671 0.882719 1.18423 0.551162C1.60082 0.134575 2.22908 0.0135787 2.77059 0.245657L17.1686 6.4162C17.6145 6.60735 17.9037 7.0459 17.9037 7.53114C17.9037 8.01637 17.6145 8.45493 17.1686 8.64608L2.77059 14.8166C2.22908 15.0487 1.60082 14.9277 1.18423 14.5112C0.852671 14.1795 0.703193 13.7074 0.783533 13.2454L1.77733 7.53114Z"
                            fill="#95B71D" />
                    </svg>
                </button>
            </div>
        </div>
    </section>
</template>

<style scoped>
/** tickets */
.ticket {
    /* height: 100vh; */
    display: flex;
    flex-direction: column;
}

.ticket__content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    max-height: calc(100vh - 220px);
    margin-bottom: 0;
}

.ticket__input {
    width: 100%;
    display: flex;
    height: 52px;
    background-color: #FFFFFF;
    justify-content: end;
    margin-bottom: 0;
    /* Убираем margin-bottom, если он не нужен */
    box-shadow: 0 0 5px #727371;


    box-shadow: 0 0 5px #727371;
}

.ticket__input .message {
    height: 100%;
    border: none;
    box-sizing: border-box;
    padding-left: 10px;
    font-size: 18px;
    color: #3D3D3D;
}

.ticket__input .buttons {
    height: 100%;
}

.ticket__input .buttons .send {
    height: 100%;
    padding: 12px;
    border: none;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    transition: ease-in-out 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ticket__input .buttons .send:hover {
    opacity: 0.8;
}
</style>