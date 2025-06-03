<script setup lang="ts">
import type { IMessagesInfo } from '~/types/tickets';

defineProps<{
  first: boolean,
  name: string,
  role: string,
  you: boolean,
  message: IMessagesInfo
}>()
</script>

<template>
  <div class="ticket__message" :class="{ you }">
    <div class="ticket__message-avatar online" :class="{ disable: !first }">
      <img src="https://www.w3schools.com/howto/img_avatar.png" alt="">
    </div>

    <div class="ticket__message-item" :class="{ round: !first }">
      <div v-if="first" class="arrow">
        <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.9999 0C8.9999 0 3.26197 0 1.79991 0C0.337858 0 -6.00815e-05 1.5 1.34994 3C2.69993 4.5 8.50054 9.5 8.9999 11C9.49927 12.5 8.9999 0 8.9999 0Z"
            fill="#F2F2F7" />
        </svg>
      </div>

      <div class="left">
        <div class="name">
          {{ name }}
          <span>{{ role }}</span>
        </div>
        <div class="text">
          <slot />
        </div>
      </div>

      <div class="date">
        {{ new Date(message.created_at).toLocaleTimeString() }}
        <span v-if="you">
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.7931 1.00044L4.63338 8.87895L1.142 5.53963" stroke="#4F610C" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M16.7402 1L9.58006 8.87893L6.98395 6.42004" stroke="#4F610C" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="css">
.ticket__message {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  padding: 0 15px;
}

.ticket__message.you {
  justify-content: end;
}

.ticket__message.you .ticket__message-item {
  background-color: #95B71D;
}

.ticket__message.you .ticket__message-item .text,
.date {
  color: #fff;
}

.ticket__message-avatar {
  width: 29px;
  height: 29px;
  border-radius: 100%;
}

.ticket__message-avatar.disable {
  opacity: 0;
}

.ticket__message-avatar img {
  width: 100%;
  height: 100%;
}

.ticket__message-item {
  padding: 5px 10px;
  background-color: #F2F2F7;
  border-radius: 0 6px 6px 6px;
  display: flex;
  gap: 5px;
  position: relative;
}

.ticket__message-item.round {
  border-radius: 6px;
}

.ticket__message-item .arrow {
  position: absolute;
  top: -2px;
  left: -9px;
}

.ticket__message-item .left {
  padding-bottom: 15px;
}

.ticket__message-item .name {
  color: #2C2C2E;
  font-weight: bold;
}

.ticket__message-item .name span {
  font-size: 15px;
  font-weight: 400;
  color: #666668;
}

.ticket__message-item .text {
  color: #2C2C2E;
  margin-top: 5px;
  font-size: 17px;
}

.ticket__message-item .date {
  display: flex;
  align-items: end;
  justify-content: end;
  font-size: 15px;
  font-weight: 300;
  color: #666668;
  gap: 5px;
}

.ticket__message-avatar img {
  border-radius: 100%;
}

.ticket__message-avatar.online {
  position: relative;
}

.ticket__message-avatar.online:after {
  position: absolute;
  content: '';
  width: 10px;
  height: 10px;
  background-color: #34C759;
  bottom: -5px;
  right: -5px;
  border-radius: 100%;
  border: 1px solid #fff;
  box-sizing: border-box;
}
</style>