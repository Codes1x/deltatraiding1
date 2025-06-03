<script setup lang="ts"></script>

<template>
  <div class="profile__notification">
    <div class="profile__notification-head">
      Notification
      <div class="line" />
    </div>

    <div class="profile__notification-items">
      <div class="profile__notification-item">
        <span>Select notification</span>

        <label class="switch">
          <input type="checkbox">
          <span class="slider round" />
        </label>
      </div>

      <div class="profile__notification-item">
        <span>Select notification</span>

        <label class="switch">
          <input type="checkbox">
          <span class="slider round" />
        </label>
      </div>

      <div class="profile__notification-item">
        <span>Select notification</span>

        <label class="switch">
          <input type="checkbox">
          <span class="slider round" />
        </label>
      </div>

      <div class="profile__notification-item">
        <span>Select notification</span>

        <label class="switch">
          <input type="checkbox">
          <span class="slider round" />
        </label>
      </div>

      <div class="profile__notification-item">
        <span>{{ $t('Select notification') }}</span>

        <label class="switch">
          <input type="checkbox">
          <span class="slider round" />
        </label>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.profile__notification-head {
  font-size: 16px;
  display: flex;
  gap: 13px;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 25px;
  padding: 0 13px;
}

.profile__notification-head .line {
  width: 100%;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
}

.profile__notification-items {
  padding: 0 13px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile__notification-item {
  font-size: 14px;
  font-weight: 300;
  display: flex;
  justify-content: space-between;


}

.profile__notification-item span {
  color: rgba(255, 255, 255, 0.5);
}
</style>