<script setup lang="ts"></script>

<template>
  <div class="profile__form">
    <div class="profile__form-group">
      <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1 4L9.16492 9.71544C9.82609 10.1783 10.1567 10.4097 10.5163 10.4993C10.8339 10.5785 11.1661 10.5785 11.4837 10.4993C11.8433 10.4097 12.1739 10.1783 12.8351 9.71544L21 4M5.8 17H16.2C17.8802 17 18.7202 17 19.362 16.673C19.9265 16.3854 20.3854 15.9265 20.673 15.362C21 14.7202 21 13.8802 21 12.2V5.8C21 4.11984 21 3.27976 20.673 2.63803C20.3854 2.07354 19.9265 1.6146 19.362 1.32698C18.7202 1 17.8802 1 16.2 1H5.8C4.11984 1 3.27976 1 2.63803 1.32698C2.07354 1.6146 1.6146 2.07354 1.32698 2.63803C1 3.27976 1 4.11984 1 5.8V12.2C1 13.8802 1 14.7202 1.32698 15.362C1.6146 15.9265 2.07354 16.3854 2.63803 16.673C3.27976 17 4.11984 17 5.8 17Z"
          stroke="#B2E500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <input type="email" :placeholder="$t('Your e-mail')">
    </div>

    <div class="profile__form-group">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M15 6.99994C15 6.48812 14.8047 5.9763 14.4142 5.58579C14.0237 5.19526 13.5118 5 13 5M13 13C16.3137 13 19 10.3137 19 7C19 3.68629 16.3137 1 13 1C9.68629 1 7 3.68629 7 7C7 7.27368 7.01832 7.54308 7.05381 7.80704C7.11218 8.24118 7.14136 8.45825 7.12172 8.59559C7.10125 8.73865 7.0752 8.81575 7.00469 8.9419C6.937 9.063 6.81771 9.18229 6.57913 9.42087L1.46863 14.5314C1.29568 14.7043 1.2092 14.7908 1.14736 14.8917C1.09253 14.9812 1.05213 15.0787 1.02763 15.1808C1 15.2959 1 15.4182 1 15.6627V17.4C1 17.9601 1 18.2401 1.10899 18.454C1.20487 18.6422 1.35785 18.7951 1.54601 18.891C1.75992 19 2.03995 19 2.6 19H5V17H7V15H9L10.5791 13.4209C10.8177 13.1823 10.937 13.063 11.0581 12.9953C11.1843 12.9248 11.2613 12.8987 11.4044 12.8783C11.5417 12.8586 11.7588 12.8878 12.193 12.9462C12.4569 12.9817 12.7263 13 13 13Z"
          stroke="#B2E500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <input type="password" :placeholder="$t('Your password')">
    </div>
  </div>
</template>

<style lang="css" scoped>
.profile__form {
  display: flex;
  gap: 15px;
  flex-direction: column;
  margin: 40px 0;
}

.profile__form-group {
  position: relative;
  max-width: 100%;
  padding: 0 13px;
}

.profile__form-group input {
  padding: 15px 15px 15px 60px;
  font-size: 12px;
  max-width: 100%;
  box-sizing: border-box;
}

.profile__form-group svg {
  top: 17px;
  left: 32px;
  position: absolute;
}
</style>