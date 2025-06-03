<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <div class="home__buttons">
    <NuxtLink :to="localePath('/transaction')" class="icon__button">
      <span class="icon">
        <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M18 17V11M15 14H21M21 6H1M21 8V4.2C21 3.0799 21 2.51984 20.782 2.09202C20.5903 1.7157 20.2843 1.40974 19.908 1.21799C19.4802 1 18.9201 1 17.8 1H4.2C3.0799 1 2.51984 1 2.09202 1.21799C1.7157 1.40973 1.40973 1.71569 1.21799 2.09202C1 2.51984 1 3.0799 1 4.2V11.8C1 12.9201 1 13.4802 1.21799 13.908C1.40973 14.2843 1.71569 14.5903 2.09202 14.782C2.51984 15 3.0799 15 4.2 15H11"
            stroke="white" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>

      {{ $t('deposit') }}
    </NuxtLink>

    <NuxtLink :to="localePath('/shop')" class="icon__button">
      <span class="icon">
        <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M18.5 18V11M10.5 18V7.99998M2.5 18L2.5 14M11.9067 3.02749L17.0751 4.96565M9.29877 3.40091L3.70023 7.59981M19.5607 4.43932C20.1464 5.02511 20.1464 5.97486 19.5607 6.56065C18.9749 7.14643 18.0251 7.14643 17.4393 6.56065C16.8536 5.97486 16.8536 5.02511 17.4393 4.43932C18.0251 3.85354 18.9749 3.85354 19.5607 4.43932ZM3.56066 7.43932C4.14645 8.02511 4.14645 8.97486 3.56066 9.56065C2.97487 10.1464 2.02513 10.1464 1.43934 9.56065C0.853553 8.97486 0.853553 8.02511 1.43934 7.43932C2.02513 6.85354 2.97487 6.85354 3.56066 7.43932ZM11.5607 1.43932C12.1464 2.02511 12.1464 2.97486 11.5607 3.56064C10.9749 4.14643 10.0251 4.14643 9.43934 3.56064C8.85355 2.97486 8.85355 2.02511 9.43934 1.43932C10.0251 0.853538 10.9749 0.853538 11.5607 1.43932Z"
            stroke="white" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>

      {{ $t('Buy system') }}
    </NuxtLink>
  </div>
</template>

<style scoped>
.home__buttons {
  display: flex;
  justify-content: center;
  gap: 50px;
  align-items: center;
  margin-top: 15px;
}

.icon__button {
  transition: 0.2s ease-in all;
}

.icon__button:hover .icon svg path {
  stroke: #95b71d;
}
</style>
