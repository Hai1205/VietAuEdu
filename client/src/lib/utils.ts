import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { parseISO } from 'date-fns/parseISO'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const TOTAL_MS_IN_DAY = 24 * 60 * 60 * 1000;

export const formatDateAgo = (date: string, style?: string) => {
  const createdDate = date ? parseISO(date) : new Date();
  const now = new Date();

  const diffInMs = now.getTime() - createdDate.getTime();
  const diffInDays = diffInMs / (TOTAL_MS_IN_DAY);

  if (diffInDays < 7) {
    return formatDistanceToNow(createdDate, { addSuffix: true });
  } else {
    switch (style) {
      case "DDMMYYY":
        return formatDateInDDMMYYY(date);
      case "YYYYMMDD":
        return formatDateInYYYYMMDD(date);
      default:
        return formatDateInDDMMYYY(date);
    }
  }
};

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const formatDateInDDMMYYY = (date: string) => {
  const d = new Date(date);
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export const formatDateInYYYYMMDD = (date: string) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const formatNumberStyle = (value: number): string => {
  if (value < 1_000) {
    return value.toString();
  } else if (value < 1_000_000) {
    return (value / 1_000).toFixed(value >= 10_000 ? 0 : 1).replace('.', ',') + 'K';
  } else if (value < 1_000_000_000) {
    return (value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1).replace('.', ',') + 'M';
  } else {
    return (value / 1_000_000_000).toFixed(value >= 10_000_000_000 ? 0 : 1).replace('.', ',') + 'B';
  }
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export const formatSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export const capitalizeEachWord = (input: string): string => {
  if (!input) return '';

  return input
    .toLowerCase()
    .split(' ')
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ');
}

export const testFormData = (formData: FormData) => {
  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });
}

export const validateEmail = (email: string): boolean => {
  return Boolean(email && /\S+@\S+\.\S+/.test(email));
}

export const validatePhone = (phone: string): boolean => {
  return Boolean(
    phone &&
    !/^[0-9]{10,11}$/.test(phone.replace(/\s/g, ""))
  );
}