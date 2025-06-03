export default defineEventHandler(async (event) => {
    const { symbol = 'BTCUSDT', interval = '1m' } = getQuery(event)
    const upperSymbol = String(symbol).toUpperCase()
    const fullUrl = `https://api.binance.com/api/v3/klines?symbol=${upperSymbol}&interval=${interval}&limit=100`
  
    console.log('[Proxy] Full request to Binance:', fullUrl)
  
    try {
        const response = await fetch(fullUrl)
      
        console.log('[Proxy] Response status:', response.status)
      
        if (!response.ok) {
          const text = await response.text()
          console.error('[Proxy] Binance error:', text)
          return {
            error: 'Binance API error',
            status: response.status,
            message: text,
            triedUrl: fullUrl,
          }
        }
      
        const data = await response.json()
        return data
      
      } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error))
        console.error('[Proxy] Failed to fetch:', err)
      
        return {
          error: 'Failed to fetch Binance data',
          message: err.message,
          triedUrl: fullUrl,
        }
      }      
  })
  