import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'UZS'): string {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string, locale: string = 'uz-UZ'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

export function formatDateTime(date: Date | string, locale: string = 'uz-UZ'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

export function formatTime(date: Date | string, locale: string = 'uz-UZ'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

export function formatNumber(num: number, locale: string = 'uz-UZ'): string {
  return new Intl.NumberFormat(locale).format(num);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
}

export function calculateAge(birthDate: Date | string): number {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'hozirgina';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} daqiqa oldin`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} soat oldin`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} kun oldin`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} oy oldin`;
  return `${Math.floor(diffInSeconds / 31536000)} yil oldin`;
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((resolve, reject) => {
      document.execCommand('copy') ? resolve() : reject();
      textArea.remove();
    });
  }
}

export function downloadFile(data: string, filename: string, type: string = 'text/plain'): void {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getInitials(name: string, maxLength: number = 2): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, maxLength);
}

export function getRandomColor(): string {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = percent / 100;
  const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * factor));
  const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * factor));
  const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * factor));
  
  return rgbToHex(r, g, b);
}

export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = percent / 100;
  const r = Math.max(0, Math.floor(rgb.r * (1 - factor)));
  const g = Math.max(0, Math.floor(rgb.g * (1 - factor)));
  const b = Math.max(0, Math.floor(rgb.b * (1 - factor)));
  
  return rgbToHex(r, g, b);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

export function getScrollPosition(): { x: number; y: number } {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop
  };
}

export function scrollToTop(smooth: boolean = true): void {
  if (smooth) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.scrollTo(0, 0);
  }
}

export function scrollToElement(elementId: string, smooth: boolean = true): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  }
}

export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function isTabletDevice(): boolean {
  return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
}

export function isDesktopDevice(): boolean {
  return !isMobileDevice() && !isTabletDevice();
}

export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (isMobileDevice()) return 'mobile';
  if (isTabletDevice()) return 'tablet';
  return 'desktop';
}

export function getLocalStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setLocalStorageItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('Failed to set localStorage item:', error);
  }
}

export function removeLocalStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove localStorage item:', error);
  }
}

export function getSessionStorageItem(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setSessionStorageItem(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch (error) {
    console.error('Failed to set sessionStorage item:', error);
  }
}

export function removeSessionStorageItem(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove sessionStorage item:', error);
  }
}
