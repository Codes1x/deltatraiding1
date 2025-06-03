export function formatSum(sum: number): {
  formattedIntegerPart: string
  decimalPart: string
} {
  // Разделяем целую и дробную части
  const parts = sum.toFixed(2).split('.')
  const integerPart = parts[0]
  const decimalPart = parts[1]

  // Форматируем целую часть с разделителем тысяч
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return {
    formattedIntegerPart,
    decimalPart,
  }
}


export function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDateTimestamp(dateString: string | number, locale: string): string {
  const date = new Date(Number(dateString)); // Преобразуем в число и создаем дату
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short', // 'short' → "May" вместо "May" (убирает лишнее)
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // 24-часовой формат
  }).format(date);
}

// Функция для форматирования даты
export function formatDateEstimation(unixTimestamp: number): string {
  // Учитываем, что UNIX timestamp в миллисекундах
  const date = new Date(unixTimestamp * 1000); // Перевод в миллисекунды
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}
// Функция для вычисления оставшихся часов
export function calculateRemainingHours(unixTimestamp: number): number {
  const currentTime = Date.now();
  const expirationTime = unixTimestamp * 1000;
  const timeDifference = expirationTime - currentTime;

  if (timeDifference <= 0) {
    return 0;
  }

  return Math.floor(timeDifference / (1000 * 60 * 60));
}

export function formatRemainingTime(unixTimestamp: number): string {
  const currentTime = Date.now();
  const expirationTime = unixTimestamp * 1000;
  const timeDifference = expirationTime - currentTime;

  if (timeDifference <= 0) return 'истек';

  const totalMinutes = Math.floor(timeDifference / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours} ч ${minutes} мин`;
}
