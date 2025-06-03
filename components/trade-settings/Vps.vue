<script setup lang="ts">
import type { IRobotServer } from '@/types/robot.d.ts'
defineProps<{
  vpsData: IRobotServer
}>()

</script>

<template>
  <div class="trade-vps">
    <div class="trade-vps__head">
      VPS
      <div class="line" />
    </div>

    <div class="trade-vps__menu">
      <div class="trade-vps__name">
        {{ $t('Name vps') }} <span class="status">{{ vpsData.status === 'Active' ? $t('Work') : $t('off') }}</span>
      </div>

      <!-- <div class="trade-vps__buttons">
        <button class="refresh">
          <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.0532 17.2687C9.45234 18.3331 12.3098 18.2753 14.7568 16.8625C18.8223 14.5153 20.2152 9.31679 17.868 5.2513L17.618 4.81829M3.1451 13.7514C0.797888 9.68593 2.19083 4.48741 6.25631 2.1402C8.7033 0.727435 11.5608 0.669628 13.9599 1.73399M1 13.8351L3.73205 14.5671L4.4641 11.8351M16.5492 7.16712L17.2813 4.43507L20.0133 5.16712"
              stroke="#878787" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <label class="switch">
          <input type="checkbox" :checked="vpsData.auto_recovery">
          <span class="slider round" />
        </label>
      </div> -->
    </div>




  </div>
</template>

<style lang="css" scoped>
.trade-vps {
  padding: 13px;
}

.trade-vps__head {
  font-size: 14px;
  display: flex;
  gap: 13px;
  align-items: center;
}

.trade-vps__head .line {
  width: 100%;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
}

.trade-vps__menu {
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
}

.trade-vps__name {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.trade-vps__name span {
  background-color: #95B71D;
  height: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  font-size: 10px;
  border-radius: 3px;
}

.trade-vps__buttons {
  display: flex;
  align-items: center;
  gap: 20px;
}

.trade-vps__buttons .refresh {
  background-color: transparent;
  outline: none;
  border: 0;
  cursor: pointer;
  transition: ease-in-out 0.2s;
}

.trade-vps__buttons .refresh svg path {
  transition: ease-in-out 0.2s;
}

.trade-vps__buttons .refresh:hover svg path {
  stroke: white;
}

.trade-vps__connect {
  display: flex;
  align-items: center;
  margin-top: 25px;
  gap: 15px;
}

.trade-vps__connect button {
  background-color: #95B71D;
  font-size: 12px;
  font-weight: 500;
  padding: 11px 15px;
  border-radius: 3px;
  outline: none;
  border: none;
  cursor: pointer;
  transition: ease-in-out 0.2s;
}

.trade-vps__connect button:hover {
  opacity: 0.7;
}

.trade-vps__connect button:disabled {
  cursor: none;
  background-color: #878787;
}
</style>
