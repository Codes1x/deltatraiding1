<script setup>
import { useTgWebAppStore } from '@/stores/tgWebApp'
import useClipboard from 'vue-clipboard3'

const { toClipboard } = useClipboard()

const tgWebAppStore = useTgWebAppStore()
const userData = computed(() => tgWebAppStore.getUser)
const editNameMode = ref(false)

const isCopied = ref(false)
const copyId = () => {
  const id = userData.value.username
  toClipboard(id)
  setTimeout(() => {
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  }, 0)
}
</script>

<template>

  <div v-if="userData" class="profile__head">

    <div class="profile__avatar">
      <img :src="userData?.photo_url" :alt="userData?.username" >
    </div>

    <div class="profile__info">
      <div class="profile__id">
        <button @click="copyId">{{ userData?.username }}
          <span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"
              data-v-4bdfb072="">
              <path
                d="M2.2 6.2C1.82725 6.2 1.64087 6.2 1.49385 6.1391C1.29783 6.05791 1.14209 5.90217 1.0609 5.70615C1 5.55913 1 5.37275 1 5V2.28C1 1.83196 1 1.60794 1.08719 1.43681C1.16389 1.28628 1.28628 1.16389 1.43681 1.08719C1.60794 1 1.83196 1 2.28 1H5C5.37275 1 5.55913 1 5.70615 1.0609C5.90217 1.14209 6.05791 1.29783 6.1391 1.49385C6.2 1.64087 6.2 1.82725 6.2 2.2M5.08 9H7.72C8.16804 9 8.39206 9 8.56319 8.91281C8.71372 8.83611 8.83611 8.71372 8.91281 8.56319C9 8.39206 9 8.16804 9 7.72V5.08C9 4.63196 9 4.40794 8.91281 4.23681C8.83611 4.08628 8.71372 3.96389 8.56319 3.88719C8.39206 3.8 8.16804 3.8 7.72 3.8H5.08C4.63196 3.8 4.40794 3.8 4.23681 3.88719C4.08628 3.96389 3.96389 4.08628 3.88719 4.23681C3.8 4.40794 3.8 4.63196 3.8 5.08V7.72C3.8 8.16804 3.8 8.39206 3.88719 8.56319C3.96389 8.71372 4.08628 8.83611 4.23681 8.91281C4.40794 9 4.63196 9 5.08 9Z"
                stroke="#B2E500" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" data-v-4bdfb072=""/>
            </svg>
          </span>
        </button>
      </div>

      <div class="profile__name">

        <template v-if="userData?.first_name || userData?.last_name">
          <input v-if="editNameMode" type="text" :value="userData?.first_name + ' ' + userData?.last_name" >
          <span v-else>{{ userData?.first_name }} {{ userData?.last_name }}</span>
        </template>
        <template v-else>
          <input type="text" :value="userData?.username" >
          <span>{{ userData?.username }}</span>
        </template>

        <button class="edit" @click="editNameMode = !editNameMode">
          <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.99999 12H13M1 12H2.11636C2.44248 12 2.60555 12 2.759 11.9645C2.89504 11.933 3.0251 11.8811 3.1444 11.8106C3.27896 11.7312 3.39426 11.6201 3.62486 11.3978L12 3.3266C12.5523 2.79436 12.5523 1.93142 12 1.39918C11.4477 0.866939 10.5523 0.86694 10 1.39918L1.62484 9.47041C1.39424 9.69264 1.27894 9.80376 1.19648 9.93343C1.12338 10.0484 1.0695 10.1737 1.03684 10.3049C1 10.4527 1 10.6099 1 10.9242V12Z"
              stroke="#B2E500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </div>


  </div>

</template>

<style lang="css" scoped>
.profile__head {
  display: flex;
  padding: 20px;
  gap: 22px;
  align-items: end;
  font-size: 20px;
  font-weight: 500;
}

.profile__head .edit {
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  transition: ease-in-out 0.2s;
}

.profile__head .edit:hover {
  opacity: 0.8;
}

.profile__avatar {
  width: 77px;
  height: 77px;
  min-width: 77px;
  min-height: 77px;
  border-radius: 100%;
  overflow: hidden;
}

.profile__avatar img {
  width: 100%;
  height: 100%;
}

.profile__info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.profile__name {
  display: flex;
  gap: 15px;
  align-items: center;
}

.profile__name input {
  font-size: 18px;
  width: auto;
  min-width: auto;
  max-width: 150px;
  padding: 5px;
}

.profile__id button {
  background: transparent;
  border: none;
  box-shadow: none;
  display: flex;
  gap: 5px;
  align-items: baseline;
  cursor: pointer;
}

.profile__id button span svg {
  width: 16px;
  height: 20px;
  fill: #B2E500;
}
</style>
