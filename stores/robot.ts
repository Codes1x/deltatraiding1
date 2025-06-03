import { defineStore } from 'pinia'
import { useTgWebAppStore } from '@/stores/tgWebApp'
// import { sha256 } from 'crypto-js/sha256'
import HmacSHA256 from 'crypto-js/hmac-sha256'

import type { IResponseOrdersHistory, IRobot, IRobotExpertSettings, IRobotSettings, IRobotServer, IRobotStatistic, IRobotDailyProfit } from '~/types/robot';
import type { IAccountInfo, ICandle, IRobotCurrentStats, IRobotOrder, IProfitChart, IRobotInfo } from '~/types/websocket';

export const useRobotStore = defineStore('robot', {
    state: () => ({
        robot: {} as IRobot,
        robotInfo: {} as IRobotInfo,
        ordersHistory: {} as IResponseOrdersHistory,
        profitChart: [] as IProfitChart[],
        ws: null as WebSocket | null,
        stats: {} as IRobotCurrentStats,
        orders: [] as IRobotOrder[], // массив сделок
        candles: [] as ICandle[], // массив свечей
        account: {} as IAccountInfo,
        settings: {} as IRobotSettings,
        expertSettings: {} as IRobotExpertSettings,
        isConnected: false
    }),
    actions: {
        async fetchRobotInfo(payload: { product_id: number, account_num: number, api_key: string }) {
            try {
              console.log('[store] fetchRobotInfo вызван с:', payload)
              // В TgWebMode мы не делаем HTTP запрос за инфой о роботе,
              // а сразу создаем объект робота с нужными для WS данными.
              const mockRobot: IRobot = {
                product_id: payload.product_id,
                account_num: payload.account_num,
                api_key: payload.api_key,
                symbol: 'EURUSD', // Дефолтный символ, может быть обновлен из WS
                symbols_list: ['EURUSD', 'GBPUSD', 'USDJPY'], // Пример списка
                // --- Остальные поля IRobot могут быть дефолтными или пустыми --- 
                uid: `mock-${payload.product_id}`,
                front_version: 1,
                metatrader_version: 4, // или 5, в зависимости от робота
                account_currency: 'USD',
                cent: false,
                robot_type: 'delta',
                product_type: 'standard',
                broker_name: 'TestBroker',
                broker_server: 1,
                start_date: new Date(),
                online: true, // Предполагаем, что хотим подключиться
                server: {} as IRobotServer, // Можно оставить пустым для WS теста
                active: true,
                status: 'active',
                ignore_progress: false,
                cycle: 0,
                deposit_trade: 0,
                trade_limit: 0,
                profit_limit: 0,
                profit_limit_percent: 0,
                trading_strategy: 1,
                stop_trade: false,
                auto_trade: true, // Важно для некоторых логик
                statistic: {} as IRobotStatistic, // Заполнится из WS
                chart_daily_profit: { dates: [], profit: [], profit_daily: [], max_value: 0 } as IRobotDailyProfit,
                check_password: true, // Для WS авторизации
                stop_trade_reason: 0,
                hub: 'RoboHub1'
              }
              
              this.robot = mockRobot;
              console.log('[store] Объект робота создан/обновлен:', this.robot);
              return this.robot;
            } catch (error) {
              console.error('[store] Ошибка в fetchRobotInfo:', error);
              this.robot = {} as IRobot; // Сброс в случае ошибки
              throw error; // Пробрасываем ошибку дальше
            }
        },
        async fetchRobotOrdersHistory(payload: { page: number, size: number }) {

            try {
                const tgWebAppStore = useTgWebAppStore()
                const accessToken = tgWebAppStore.accessToken
                if (!accessToken) {
                    throw new Error("Access token is missing");
                }
                const headers: Record<string, string> = {
                    Authorization: `USERJWT ${accessToken}`,
                }

                const url = `https://forex-orders-store.ntxpro.ai/v1/orders/list_deals/?sort=asc&page=${payload.page}&size=${payload.size}`

                const response = (await $fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ product_id: this.robot.product_id }),
                })) as IResponseOrdersHistory
                this.ordersHistory = response
                return response
            } catch (error) {
                this.ordersHistory = {} as IResponseOrdersHistory
                console.error('fetchRobotOrdersHistory ', error)
                return error
            }
        },
        async fetchRobotProfit(payload: { product_id: string, start_date: string, end_date: string }) {
            try {
              const tgWebAppStore = useTgWebAppStore()
              const accessToken = tgWebAppStore.accessToken
              if (!accessToken) {
                throw new Error("Access token is missing")
              }
              const headers: Record<string, string> = {
                Authorization: `USERJWT ${accessToken}`,
              }
          
              const response = await $fetch<IProfitChart[]>('/api/profitChart', { // Предполагаем, что это /api/proxy
                method: 'POST',
                headers,
                body: payload, 
              })
          
              this.profitChart = response
              return response
            } catch (error) {
              this.profitChart = []
              console.error('fetchRobotProfit', error)
              return error
            }
          },
        
        connect() {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                addLog('[store] WebSocket уже подключен и открыт.')
                return;
            }
            if (!this.robot.product_id || !this.robot.api_key || !this.robot.account_num) {
                console.error('[store] Недостаточно данных для подключения WebSocket:', this.robot);
                addLog('[store] Ошибка: product_id, api_key или account_num отсутствуют.')
                return;
            }

            addLog(`[store] Попытка подключения к WS: wss://forex-robothub1.ntxpro.ai/ws/v1/web-client/${this.robot.product_id}`)
            this.ws = new WebSocket(`wss://forex-robothub1.ntxpro.ai/ws/v1/web-client/${this.robot.product_id}`)

            this.ws.onopen = () => {
                this.isConnected = true;
                console.log('[store] WebSocket подключен');
                addLog('[store] WebSocket успешно подключен (onopen).')
               
                // Сразу после подключения отправляем данные для авторизации (fetchInfo)
                this.fetchInfo(); 
            }
                // Запрос на свечи теперь будет отправляться после успешного ответа type: info
                // или если мы решим, что авторизация не обязательна для свечей (но она, скорее всего, обязательна)

            this.ws.onmessage = (event) => {
                console.log('[store WS RAW MESSAGE]', event.data); 
                addLog(`[store WS MSG]: ${event.data.substring(0,150)}...`)
                try {
                  const data = JSON.parse(event.data)
                  console.log('[store WS RAW MESSAGE RECEIVED]', data); // Log all parsed incoming messages
                  addLog(`[store WS MSG]: ${JSON.stringify(data).substring(0, 100)}...`);
                  if (data.type === 'heartbeat') {
                    // console.log('[store] Получен Heartbeat');
                    return; // Игнорируем heartbeat в основной логике обработки
                  }

                  if (data.type === 'auth_response') {
                    if (data.status === 'ok') {
                      console.log('[store] WebSocket авторизация успешна (auth_response: ok).');
                      addLog('[store] Авторизация WS успешна (auth_response: ok).');
                      // Запрашиваем свечи сразу после успешной авторизации
                      if (this.robot && this.robot.symbol) {
                        const candlePayload = { timeframe: "1", symbol: this.robot.symbol };
                        addLog(`[store] Запрашиваем свечи после auth_response: ${JSON.stringify(candlePayload)}`);
                        this.fetchCandles(candlePayload);
                      } else {
                        console.warn('[store] Не удалось запросить свечи после auth_response: symbol не определен в this.robot');
                        addLog('[store] Не удалось запросить свечи после auth_response: symbol не определен.');
                      }
                    } else {
                      console.error('[store] Ошибка авторизации WebSocket:', data.message || 'Статус не "ok"');
                      addLog(`[store] Ошибка авторизации WS: ${data.message || 'Статус не "ok"'}`);
                      // Здесь можно добавить логику обработки неудачной авторизации, например, disconnect() или retry.
                    }
                    return; // Обработали auth_response, выходим
                  }

                  if (data.type === 'info') {
                    console.log('[store] Получена информация о роботе (info):', data);
                    this.robotInfo = data; // IRobotInfo (из websocket.d.ts)
                    this.orders = data.data.orders ?? [];
                    this.stats = data.data.statistics_info ?? {};
                    this.account = data.data.account_info ?? {};
                    // Возможно, стоит обновить this.robot.symbol, если он пришел из info
                    if(data.data.account_info && data.data.account_info.symbol) {
                        this.robot.symbol = data.data.account_info.symbol;
                        addLog(`[store] Символ обновлен на: ${this.robot.symbol} из сообщения info`)
                    }
                  }
              
                  if (data.type === 'candlesticks') {
                    console.log('[store] Получены свечи (candlesticks):', data);
                    const candlesData = data.data?.candles;
                    if (!Array.isArray(candlesData)) {
                      console.warn('[store] Неверный формат свечей:', candlesData);
                      addLog('[store] Ошибка: получен неверный формат свечей.')
                      return;
                    }
              
                    addLog(`[store] Получено свечей: ${candlesData.length}`)
              
                    // Очищаем массив this.candles перед добавлением новых данных, 
                    // чтобы избежать дублирования, если это полный набор, а не обновление.
                    // Если это обновление, логика должна быть другой (поиск и замена/добавление)
                    // Время от сервера приходит в миллисекундах, конвертируем в секунды для графика
                    // Обновляем весь массив свечей данными из сообщения
                    this.candles = candlesData.map((candle: ICandle) => ({
                        time: candle.time / 1000, // Convert to seconds
                        open: candle.open,
                        high: candle.high,
                        low: candle.low,
                        close: candle.close,
                        tick_volume: candle.tick_volume,
                    }));
              
                    // Ограничение на количество свечей, если нужно
                    if (this.candles.length > 1000) {
                      this.candles.splice(0, this.candles.length - 1000);
                    }
                  }
                  // Другие типы сообщений от WS (robot_settings_changed, expert_settings_changed и т.д.)

                } catch (error) {
                  console.error('[store WS ERROR PARSE]', error);
                  addLog('[store] Ошибка парсинга сообщения от WS.')
                }
              };              

            this.ws.onclose = (event) => {
                this.isConnected = false;
                this.ws = null;
                console.log('[store] WebSocket отключен, код:', event.code, 'причина:', event.reason);
                addLog(`[store] WebSocket отключен (onclose). Код: ${event.code}`);
            };

            this.ws.onerror = (error) => {
                this.isConnected = false; // Убедимся, что статус обновлен
                console.error('[store] WebSocket ошибка:', error);
                addLog('[store] Ошибка WebSocket (onerror).')
            };
        },

        fetchInfo() {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                addLog('[store] fetchInfo: WebSocket не открыт или отсутствует.')
                return
            }
            if (!this.robot.product_id || !this.robot.account_num || !this.robot.api_key) {
                addLog('[store] fetchInfo: Отсутствуют product_id, account_num или api_key для отправки info.')
                return;
            }
            const authPayload = {
                product_id: Number(this.robot.product_id), // Убедимся, что это число
                account_num: Number(this.robot.account_num), // Убедимся, что это число
                check_password: this.robot.check_password, // true
                api_key: this.robot.api_key
            }
            this.ws.send(JSON.stringify(authPayload));
            console.log('[store] Запрос авторизации (info) отправлен:', authPayload);
            addLog('[store] Запрос авторизации (info) отправлен.');
        },

        fetchCandles(payload: { timeframe: string, symbol?: string }) {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
              console.warn('[store] fetchCandles: WebSocket неактивен')
              addLog('[store] fetchCandles: WebSocket неактивен, запрос не отправлен.')
              return
            }
          
            const symbolToRequest = payload.symbol || this.robot.symbol;
            if (!symbolToRequest) {
              console.warn('[store] fetchCandles: symbol не задан и отсутствует в this.robot.symbol')
              addLog('[store] fetchCandles: Символ не определен, запрос не отправлен.')
              return
            }
          
            const data = {
              period: payload.timeframe,
              limit: 1000,
              symbol: symbolToRequest
            }
            
            // this.candles.length = 0; // Перенесено в onmessage для типа 'candlesticks' чтобы не мерцало

            const timestamp = Date.now();
            // Убираем пробелы из JSON строки перед созданием подписи
            const dataString = `${this.robot.api_key}|${timestamp}|${JSON.stringify(data).replace(/\s/g, '')}`;
            const sign = HmacSHA256(dataString, this.robot.api_key).toString();
          
            const requestPayload = {
              type: 'get_candlesticks',
              product_id: Number(this.robot.product_id),
              data,
              timestamp,
              sign
            };

            this.ws.send(JSON.stringify(requestPayload));
          
            console.log('[store] Запрос на свечи отправлен (объект):', requestPayload);
            console.log('[store] Запрос на свечи (JSON):', JSON.stringify(requestPayload, null, 2));
            addLog('[store] Запрос на свечи отправлен.');
            // Для дебага, как в примере пользователя:
            console.log('[store] fetchCandles Debug Info:');
            console.log('[store] product_id:', this.robot.product_id);
            console.log('[store] symbol:', symbolToRequest);
            console.log('[store] api_key:', this.robot.api_key);
            console.log('[store] timestamp:', timestamp);
            console.log('[store] data:', data);
            console.log('[store] dataString:', dataString);
            console.log('[store] sign:', sign);
            console.log('[store] Номер аккаунта робота (для информации):', this.robot.account_num);
          },

        setRobotSetting(payload: { play: boolean, stop: boolean }) {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return

            let data: Record<string, number> = {}

            if (payload.stop) {
                data = { 'stop_trade': 1, 'auto_trade': 0 }
            }
            if (payload.play) {
                data = { 'auto_trade': 1, 'stop_trade': 0 }
            }

            const timestamp = new Date().getTime()
            const dataString = `${this.robot.api_key}|${timestamp}|${JSON.stringify(data).replace(/\s/g, '')}`
            const sign = HmacSHA256(dataString, this.robot.api_key).toString()

            this.ws.send(JSON.stringify({
                type: 'robot_settings',
                data,
                timestamp,
                sign
            }))
        },

        setRobotExpertSetting(payload: { lotRisk: number }) {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return

            const data = { 'LotRisk': payload.lotRisk }

           
            const timestamp = new Date().getTime()
            const dataString = `${this.robot.api_key}|${timestamp}|${JSON.stringify(data).replace(/\s/g, '')}`
            const sign = HmacSHA256(dataString, this.robot.api_key).toString()

            this.ws.send(JSON.stringify({
                type: 'expert_settings',
                data,
                timestamp,
                sign
            }))
        },

        async setRobotSettingOnce(payload: { play: boolean; stop: boolean; product_id: number, account_num: number, api_key: string }) {
            try {
                await this.fetchRobotInfo({ 
                    product_id: payload.product_id, 
                    account_num: payload.account_num, 
                    api_key: payload.api_key 
                });

                return new Promise((resolve, reject) => {
                    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                        if (!this.robot || !this.robot.product_id) {
                            return reject(new Error("robot.product_id не определен после загрузки"));
                        }
                        // Логика подключения WebSocket была перенесена в this.connect()
                        // Убедимся, что connect вызывается и обрабатывает открытие/ошибки
                        this.connect(); 
                        
                        let timeoutId: NodeJS.Timeout | null = null;
                        
                        // Используем существующие обработчики onopen, onmessage, onerror, onclose
                        // Вместо переопределения их здесь, будем полагаться на то, что они уже настроены в connect()
                        // и корректно обновляют состояние (this.isConnected) и обрабатывают сообщения.

                        // Ждем, пока соединение установится (опрос isConnected)
                        const checkConnection = () => {
                            if (this.isConnected) {
                                addLog("[store] setRobotSettingOnce: Соединение установлено, отправляем настройки.")
                                try {
                                    this.setRobotSetting(payload); // play/stop
                                    // Далее логика ожидания ответа, если это необходимо
                                    // Для этого примера просто разрешаем после отправки
                                    // или ждем подтверждающего сообщения type: 'info' или 'robot_settings_changed'
                                    // resolve(true); // Временно разрешаем сразу
                                } catch (error) {
                                    console.error("[store] setRobotSettingOnce: Ошибка в setRobotSetting:", error);
                                    clearTimeout(timeoutId!)
                                    return reject(new Error("Ошибка при отправке настроек"));
                                }
                            } else if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
                                // Еще подключаемся, ждем
                                setTimeout(checkConnection, 100);
                            } else {
                                // Не удалось подключиться
                                clearTimeout(timeoutId!)
                                reject(new Error("Не удалось установить WebSocket соединение для setRobotSettingOnce"));
                            }
                        };

                        // Устанавливаем таймер на общий случай, если ничего не происходит
                        timeoutId = setTimeout(() => {
                            console.warn("[store] ⏳ Тайм-аут в setRobotSettingOnce: закрываем соединение.");
                            this.disconnect();
                            reject(new Error("Тайм-аут ожидания операции в setRobotSettingOnce"));
                        }, 15000); // Увеличил тайм-аут

                        // Начинаем проверку соединения
                        checkConnection();

                        // Логика подтверждения через onmessage (если потребуется)
                        // Например, можно добавить временный обработчик или флаг
                        // чтобы поймать конкретный ответ на изменение настроек.
                        // Для упрощения, пока оставим так, но в реальном приложении это важно.
                        const originalOnMessage = this.ws?.onmessage || null;
                        if (this.ws) {
                            const currentWs = this.ws;
                            currentWs.onmessage = (event) => {
                                if (originalOnMessage) {
                                    originalOnMessage.call(currentWs, event);
                                }
                                try {
                                    const data = JSON.parse(event.data as string);
                                    if (data.type === 'info' || data.type === 'robot_settings_changed') { 
                                        const currentSettings = data.data?.robot_settings;
                                        if (currentSettings && 
                                            ((payload.play && currentSettings.auto_trade === 1 && currentSettings.stop_trade === 0) || 
                                            (payload.stop && currentSettings.auto_trade === 0 && currentSettings.stop_trade === 1)) ) {
                                            addLog("[store] setRobotSettingOnce: Настройки успешно применены и подтверждены.")
                                            clearTimeout(timeoutId!);
                                            this.disconnect(); 
                                            resolve(true);
                                            currentWs.onmessage = originalOnMessage; 
                                        }
                                    }
                                } catch(e) { /* Ошибка парсинга, игнорируем для этой логики */ }
                            }
                        } 

                    } else {
                        // Если WebSocket уже открыт, сразу отправляем настройки
                        addLog("[store] setRobotSettingOnce: WebSocket уже открыт, отправляем настройки.")
                        try {
                            this.setRobotSetting(payload);
                             let timeoutId: NodeJS.Timeout | null = null;
                             const originalOnMessage = this.ws?.onmessage || null;
                                if (this.ws) {
                                    const currentWs = this.ws;
                                    currentWs.onmessage = (event) => {
                                        if (originalOnMessage) {
                                            originalOnMessage.call(currentWs, event);
                                        }
                                        try {
                                            const data = JSON.parse(event.data as string);
                                            if (data.type === 'info' || data.type === 'robot_settings_changed') {
                                                const currentSettings = data.data?.robot_settings;
                                                if (currentSettings && 
                                                    ((payload.play && currentSettings.auto_trade === 1 && currentSettings.stop_trade === 0) || 
                                                    (payload.stop && currentSettings.auto_trade === 0 && currentSettings.stop_trade === 1)) ) {
                                                    addLog("[store] setRobotSettingOnce (уже подключен): Настройки успешно применены.")
                                                    clearTimeout(timeoutId!);
                                                    resolve(true);
                                                    currentWs.onmessage = originalOnMessage;
                                                }
                                            }
                                        } catch(e) { /* ... */ }
                                    }
                                }
                                timeoutId = setTimeout(() => {
                                    console.warn("[store] ⏳ Тайм-аут в setRobotSettingOnce (уже подключен).");
                                    reject(new Error("Тайм-аут ожидания подтверждения настроек (уже подключен)"));
                                }, 10000);

                        } catch (error) {
                            console.error("[store] setRobotSettingOnce: Ошибка в setRobotSetting (уже подключен):", error);
                            return reject(new Error("Ошибка при отправке настроек (уже подключен)"));
                        }
                    }
                });
            } catch (error) {
                console.error("[store] Ошибка в setRobotSettingOnce (внешний try-catch):", error);
                throw error; // Пробрасываем ошибку дальше
            }
        },

        disconnect() {
            if (this.ws) {
                addLog('[store] Отключаем WebSocket.')
                this.ws.close();
                // Состояния isConnected и ws = null будут установлены в onclose
            } else {
                addLog('[store] WebSocket уже отключен или не инициализирован.')
            }
        },

        async fetchRobotSettings(): Promise<IRobotSettings | null> {
            try {
              const tgWebAppStore = useTgWebAppStore()
              const accessToken = tgWebAppStore.accessToken
              if (!accessToken) {
                throw new Error("Access token is missing")
              }
          
              const headers: Record<string, string> = {
                Authorization: `USERJWT ${accessToken}`,
              }
          
              const formData = new FormData()
              formData.append('product_id', this.robot.product_id.toString())
              formData.append('account_num', this.robot.account_num.toString())
          
              const response = await $fetch<IRobotSettings>('/api/robotSettings', { // TODO: Заменить на реальный URL API
                method: 'POST',
                headers,
                body: formData,
              })
          
              this.settings = response
              return response
            } catch (e) {
              console.error('fetchRobotSettings', e)
              return null
            }
          },
        async fetchRobotExpertSettings(): Promise<IRobotExpertSettings | null> {
            try {
              const tgWebAppStore = useTgWebAppStore()
              const accessToken = tgWebAppStore.accessToken
              if (!accessToken) {
                throw new Error("Access token is missing")
              }
          
              const headers: Record<string, string> = {
                Authorization: `USERJWT ${accessToken}`,
              }
          
              const formData = new FormData()
              formData.append('product_id', this.robot.product_id.toString())
          
              const response = await $fetch<IRobotExpertSettings[]>('/api/expertSettings', { // TODO: Заменить на реальный URL API
                method: 'POST',
                headers,
                body: formData,
              })
          
              const expertSetting = response?.[0] ?? null
              this.expertSettings = expertSetting
              return expertSetting
            } catch (e) {
              console.error('fetchRobotExpertSettings', e)
              return null
            }
        }
                 
    },
    getters: {
        getRobotInfo(state) {
            return state.robot;
        },
        getRobotAccountNum(state) {
            return state.robot.account_num;
        },
        getRobotVPSInfo(state) {
            if (state.robot && state.robot.server) {
                return state.robot.server;
            }
            return null;
        },
        getRobotStats(state) {
            if (state.robot && state.robot.statistic) {
                return state.robot.statistic;
            }
            return null;
        },
        getRobotProfitChart(state) {
            if (state.profitChart.length > 0) {
                return state.profitChart;
            }
            return [];
        },
        getOrdersHistory(state) {
            if (state.ordersHistory && state.ordersHistory.pagination && state.ordersHistory.pagination.page_count > 0) {
                return state.ordersHistory;
            }
            return null;
        },
        getWsStatus(state) {
            return state.isConnected;
        },
        getWSOrders(state) {
            if (state.orders.length > 0) {
                return state.orders;
            }
            return [];
        },
        getWSStats(state) {
            if (Object.keys(state.stats).length > 0) {
                return state.stats;
            }
            return null;
        },
        getWSAccount(state) {
            if (Object.keys(state.account).length > 0) {
                return state.account;
            }
            return null;
        },
        getWSCandles(state) {
            return state.candles;
        },
        getWSRobotInfo(state) {
            if (Object.keys(state.robotInfo).length > 0) {
                return state.robotInfo;
            }
            return null;
        },
        getRobotExpertSettings(state) {
            return state.expertSettings;
        },
        getSymbol(state) {
            return state.robot.symbol;
        },
        getSymbolList(state) {
            return state.robot.symbols_list;
        },
        getfullPairList(state) {
            const result: string[] = [];
            if (state.orders.length > 0) {
                for (const order of state.orders) {
                    if (order.symbol && !result.includes(order.symbol)) {
                        result.push(order.symbol);
                    }
                }
                return result.sort();
            }
            return [];
        }
    },
})

// Вспомогательная функция для логгирования на странице (если она доступна глобально или передана)
// В данном контексте она не будет работать, но идея такая.
// Лучше использовать Pinia плагин или сервис для логгирования, если нужно логгировать из стора на UI.
declare global {
    interface Window { addLogToPage?: (message: string) => void; }
}
function addLog(message: string) {
    if (typeof window !== 'undefined' && window.addLogToPage) {
        window.addLogToPage(message);
    } else {
        console.log("[UI LOG FALLBACK]", message); // Фоллбэк, если глобальная функция не найдена
    }
}