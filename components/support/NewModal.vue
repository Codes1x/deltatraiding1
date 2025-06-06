<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineEmits, computed } from 'vue'
import { useTicketsStore } from '~/stores/tickets'
import type { ITicketType, IUserProductPurchase } from '~/types/tickets'

interface IOption {
  label: string
  value: any // Может быть строкой (id типа) или числом (id продукта)
}

const ticketsStore = useTicketsStore()
const emit = defineEmits(['close'])

const selectedTicketOption = ref<IOption>()
const ticketTypes = ref<ITicketType[]>([])
const ticketTypeDropdownItems = computed<IOption[]>(() =>
  ticketTypes.value.map(item => ({
    label: String(item.name),
    value: String(item.id),
  })),
)

const selectedProductOption = ref<IOption>()
const products = computed(() => ticketsStore.getNonConfiguredSystems)
const productDropdownItems = computed<IOption[]>(() =>
  products.value.map(item => ({
    label: String(item.product),
    value: item.id,
  })),
)

const selectedTicketType = computed<ITicketType | undefined>(() => {
    if (!selectedTicketOption.value) return undefined
    return ticketTypes.value.find(t => String(t.id) === selectedTicketOption.value!.value)
})

const isProductRequired = computed<boolean>(() => {
    return selectedTicketType.value?.additional_fields === 1;
})

const ticketMessage = ref('')
const isLoading = ref(false)

const sendTicketMessage = async () => {
    if (ticketMessage.value.length < 3) {
        return alert('Сообщение должно содержать не менее 3 символов.')
    }
    if (!selectedTicketOption.value) {
        return alert('Пожалуйста, выберите тип тикета.')
    }
    if (isProductRequired.value && !selectedProductOption.value) {
        return alert('Пожалуйста, выберите продукт.')
    }

    isLoading.value = true
    try {
        const payload: any = {
            message: ticketMessage.value,
            ticket_type_id: selectedTicketOption.value.value,
            subject: selectedTicketOption.value.label,
        }
        if (isProductRequired.value && selectedProductOption.value) {
            payload.product_id = selectedProductOption.value.value;
        }

        console.log('NewModal.vue - payload before sending:', JSON.stringify(payload, null, 2))
        const result = await ticketsStore.newTicket(payload)

        if (result.success) {
            alert('Ticket created successfully!')
            ticketMessage.value = ''
            emit('close')
        } else {
            alert(`Error: ${result.error || 'Failed to create ticket'}`)
        }
    } catch (error) {
        console.error('sendTicketMessage error: ', error)
        alert('An unexpected error occurred.')
    } finally {
        isLoading.value = false
    }
}
/** Dropdown Items */
const isDataLoaded = ref(false)
const fetchData = async () => {
  try {
    isDataLoaded.value = false
    const response = (await ticketsStore.fetchTicketsType()) as ITicketType[]
    ticketTypes.value = response;

    if (ticketTypeDropdownItems.value.length > 0) {
        selectedTicketOption.value = ticketTypeDropdownItems.value[0]
    }

    // Также загружаем системы, которые могут понадобиться
    await ticketsStore.fetchNonConfiguredSystems();

  } catch (error) {
    console.error('fetchData ', error)
  } finally {
    isDataLoaded.value = true
  }
}

// Функция корректировки отступа для input при появлении клавиатуры
const adjustInputPadding = () => {
  const form = document.querySelector('.ticket__input') as HTMLElement
  if (form && window.Telegram?.WebApp?.viewportHeight) {
    form.style.paddingBottom = window.visualViewport?.height! < window.Telegram.WebApp.viewportHeight ? '350px' : '0px'
  }
}

onMounted(() => {
  fetchData()
  window.Telegram?.WebApp?.onEvent('viewportChanged', adjustInputPadding)
  adjustInputPadding()
})

onBeforeUnmount(() => {
  const form = document.querySelector('.ticket__input') as HTMLElement
  if (form) form.style.paddingBottom = '0px'
  window.Telegram?.WebApp?.offEvent('viewportChanged', adjustInputPadding)
})
</script>

<template>
  <div class="deposit__modal" @click.self="!isLoading && emit('close')">
    <div class="deposit__modal-content">
      <h2>{{ $t('Create ticket') }}</h2>
      <div class="deposit__form">
        <div v-if="isDataLoaded && !isLoading" class="support__items">
          <CommonDropdown v-model="selectedTicketOption" :items="ticketTypeDropdownItems" />
          <CommonDropdown v-if="isProductRequired" v-model="selectedProductOption" :items="productDropdownItems" placeholder="Select a product" />
        </div>
        <div v-else class="support__items">
          <CommonLoader :small="true" />
        </div>
        <div class="ticket__content">
          <div class="ticket__input">
            <input
              v-model="ticketMessage"
              class="message"
              type="text"
              placeholder="Start typing..."
              :disabled="isLoading"
            />

            <div class="buttons">
              <button class="send" @click="sendTicketMessage" :disabled="isLoading">
                <CommonLoader v-if="isLoading" :small="true" style="width: 18px; height: 15px" />
                <svg v-else width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2.42505 1.85076L3.27282 6.72543H8.50371C8.94869 6.72543 9.30942 7.08615 9.30942 7.53114C9.30942 7.97612 8.94869 8.33685 8.50371 8.33685H3.27282L2.42505 13.2115L15.6793 7.53114L2.42505 1.85076ZM1.77733 7.53114L0.783533 1.81683C0.703193 1.35488 0.852671 0.882719 1.18423 0.551162C1.60082 0.134575 2.22908 0.0135787 2.77059 0.245657L17.1686 6.4162C17.6145 6.60735 17.9037 7.0459 17.9037 7.53114C17.9037 8.01637 17.6145 8.45493 17.1686 8.64608L2.77059 14.8166C2.22908 15.0487 1.60082 14.9277 1.18423 14.5112C0.852671 14.1795 0.703193 13.7074 0.783533 13.2454L1.77733 7.53114Z"
                    fill="#95B71D"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css">
.deposit__modal {
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(7.7px);
  z-index: 999;
  align-items: center;
  justify-content: end;

  box-sizing: border-box;
  flex-direction: column;
  display: none;
}

.deposit__modal.active {
  display: flex;
}

.deposit__modal-content {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -35px 65px 0 rgba(0, 0, 0, 0.27);
  background: #171722;
  /* padding: 16px 13px 20px 13px; */
  width: 100%;
  padding-bottom: 20px;
  height: 60%;
}

.deposit__modal-content h2 {
  margin: 16px auto;
  font-weight: 700;
  font-size: 20px;
  text-align: center;
  color: #fff;
}

.support__items {
  width: auto;
}

.support__items > .dropdown {
  margin: 0;
  width: -webkit-fill-available;
}
</style>
