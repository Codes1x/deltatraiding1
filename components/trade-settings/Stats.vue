<script setup lang="ts">
import { useRobotStore } from '@/stores/robot';

const robotStore = useRobotStore();

const StatsData = computed(() => robotStore.getRobotStats)
console.log('StatsData ', StatsData.value)
const isConnected = computed(() => robotStore.getWsStatus)
const currentStats = computed(() => robotStore.getWSStats)
console.log('currentStats ', currentStats.value)
const currentAccount = computed(() => robotStore.getWSAccount)
</script>

<template>
    <div class="trade-settings-stats">
        <div class="trade-settings-stats__header">
            {{ $t('Trading info') }}
        </div>
        <div class="trade-settings-stats__content">
            <ul class="trade-settings-stats__list">
                <li class="trade-settings-stats__item">
                    <span class="title">{{ $t('deposit') }}</span>
                    <div class="value"><span class="currency">$</span><span class="value">
                            {{ isConnected ? currentAccount?.account_balance_usd : (StatsData?.account_balance || 0) }}
                        </span></div>
                </li>

                <li class="trade-settings-stats__item">
                    <span class="title">{{ $t('Margin level') }}</span>
                    <div class="value"><span class="currency">$</span><span class="value">
                            {{ isConnected ? currentAccount?.account_margin_level : (StatsData?.account_margin || 0)
                            }}</span></div>
                </li>
                <li class="trade-settings-stats__item">
                    <span class="title">{{ $t('Drawdown') }}</span>
                    <div class="value"><span class="currency">$</span><span class="value">
                            {{ isConnected ? currentAccount?.funds_in_trade : 0 }}
                        </span></div>
                </li>
            </ul>
            <ul class="trade-settings-stats__list time">
                <li class="trade-settings-stats__item time">
                    <span class="title">{{ $t('Today') }}</span>
                    <span class="percent">
                        {{ isConnected ? currentStats?.today?.percent : (StatsData?.profit_today_percent || 0) }}
                    </span>
                    <div class="value"><span class="currency">$</span><span class="value">
                            {{ isConnected ? currentStats?.today?.amount : (StatsData?.profit_today || 0) }}
                        </span></div>
                </li>
                <li class="trade-settings-stats__item time">
                    <span class="title">{{ $t('Yesterday') }}</span>
                    <span class="percent">
                        {{ isConnected ? currentStats?.yesterday?.percent : (StatsData?.profit_yesterday_percent || 0)
                        }}%
                    </span>
                    <div class="value"><span class="currency">$</span><span class="value">
                            {{ isConnected ? currentStats?.yesterday?.amount : (StatsData?.profit_yesterday || 0) }}
                        </span></div>
                </li>
                <li class="trade-settings-stats__item time">
                    <span class="title">{{ $t('Week') }}</span>
                    <span class="percent">
                        {{ isConnected ? currentStats?.days_7?.percent : (StatsData?.profit_week_percent || 0)
                        }}%</span>
                    <div class="value"><span class="currency">$</span><span class="value">
                            {{ isConnected ? currentStats?.days_7?.amount : (StatsData?.profit_week || 0) }}
                        </span></div>
                </li>
                <li class="trade-settings-stats__item time">
                    <span class="title">{{ $t('Month') }}</span>
                    <span class="percent">
                        {{ isConnected ? currentStats?.days_30?.percent : (StatsData?.profit_month_percent || 0)
                        }}%</span>
                    <div class="value"><span class="currency">$</span><span class="value">
                            {{ isConnected ? currentStats?.days_30?.amount : (StatsData?.profit_month || 0) }}
                        </span></div>
                </li>
                <li class="trade-settings-stats__item time">
                    <span class="title">{{ $t('All time') }}</span>
                    <span class="percent">
                        {{ isConnected ? currentStats?.all_time?.percent : (StatsData?.profit_all_percent || 0)
                        }}%</span>
                    <div class="value"><span class="currency">$</span><span class="value">
                            {{ isConnected ? currentStats?.all_time?.amount : (StatsData?.profit_all || 0) }}
                        </span></div>
                </li>
            </ul>
            <ul class="trade-settings-stats__list info">
                <li class="trade-settings-stats__item">
                    <span class="title">{{ $t('Equity') }}</span>
                    <div class="value"><span class="currency">$</span><span class="value">
                            {{ isConnected ? currentAccount?.account_equity : (StatsData?.account_equity || 0) }}
                        </span></div>
                </li>
                <li class="trade-settings-stats__item">
                    <span class="title">{{ $t('Account number') }}</span>
                    <div class="value"><span class="currency">{{ isConnected ? currentAccount?.account_num : 0 }}</span>
                    </div>
                </li>
            </ul>
        </div>

    </div>
</template>

<style lang="css" scoped>
.trade-settings-stats {
    margin-top: 32px;
}

.trade-settings-stats__header {
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    gap: 13px;
    align-items: center;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 25px;
    padding: 0 13px;
}

.trade-settings-stats__content {
    background-color: rgba(217, 217, 217, 0.05);
    padding: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 5px;
}

.trade-settings-stats__list {
    padding: 0;
    margin: 0;
    list-style-type: none;
}

.trade-settings-stats__list.time {
    margin-top: 24px;
}

.trade-settings-stats__list.info {
    margin-top: 32px;
}

.trade-settings-stats__list li.trade-settings-stats__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.trade-settings-stats__list li.trade-settings-stats__item.time {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}

.trade-settings-stats__list li span {
    font-weight: 400;
    line-height: 150%;
}

.trade-settings-stats__list li span.title {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.65);
}

.trade-settings-stats__list li span.percent {
    font-weight: 400;
    font-size: 12px;
    text-align: center;
    color: #b2e500;
}

.trade-settings-stats__list li span.currency {
    font-size: 16px;
    color: #b2e500;
}

.trade-settings-stats__list li>.value {
    font-size: 20px;
    color: #fff;
    text-align: right;
}
</style>