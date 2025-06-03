<template>
    <div ref="chartContainer" class="chart-container"/>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import { createChart, CandlestickSeries, type ISeriesApi, type CandlestickData, type Time } from 'lightweight-charts'
  
  const POLYGON_API_KEY = '8lZ70jXhewhRe0WTyUve3kqnVF86gZOI'
  
  const chartContainer = ref<HTMLElement | null>(null)
  const chart = ref<ReturnType<typeof createChart> | null>(null)
  const candleSeries = ref<ISeriesApi<'Candlestick'> | null>(null)
  const socket = ref<WebSocket | null>(null)
  let resizeObserver: ResizeObserver | null = null
  
  interface PolygonXA {
    ev: 'XA'
    pair: string
    o: number
    c: number
    h: number
    l: number
    v: number
    s: number
    e: number
  }
  
  function transformPolygonCandle(data: PolygonXA): CandlestickData {
    return {
      time: Math.floor(data.s / 1000) as Time,
      open: data.o,
      high: data.h,
      low: data.l,
      close: data.c,
    }
  }
  
  function setupWebSocket() {
    socket.value = new WebSocket('wss://socket.polygon.io/crypto')
  
    socket.value.onopen = () => {
      socket.value?.send(JSON.stringify({ action: 'auth', params: POLYGON_API_KEY }))
      socket.value?.send(JSON.stringify({ action: 'subscribe', params: 'XA.BTC-USD' }))
    }
  
    socket.value.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data) as PolygonXA[]
      data.forEach((msg) => {
        if (msg.ev === 'XA') {
          candleSeries.value?.update(transformPolygonCandle(msg))
        }
      })
    }
  
    socket.value.onerror = (err) => console.error('WebSocket error:', err)
    socket.value.onclose = () => console.warn('WebSocket closed')
  }
  
  function initChart() {
    if (!chartContainer.value) return
  
    chart.value = createChart(chartContainer.value, {
      width: chartContainer.value.clientWidth,
      height: 300,
      layout: { background: { color: '#111' }, textColor: '#eee' },
      grid: {
        vertLines: { color: '#333' },
        horzLines: { color: '#333' },
      },
      timeScale: { timeVisible: true, secondsVisible: false },
    })
  
    // ИСПРАВЛЕНИЕ ЗДЕСЬ (по документации)
    candleSeries.value = chart.value.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })
  
    resizeObserver = new ResizeObserver(() => {
      chart.value?.applyOptions({ width: chartContainer.value!.clientWidth })
    })
  
    resizeObserver.observe(chartContainer.value)
  }
  
  onMounted(() => {
    initChart()
    setupWebSocket()
  })
  
  onBeforeUnmount(() => {
    socket.value?.close()
    chart.value?.remove()
    resizeObserver?.disconnect()
  })
  </script>
  
  <style scoped>
  .chart-container {
    width: 100%;
    height: 300px;
  }
  </style>
  