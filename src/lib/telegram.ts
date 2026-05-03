interface TelegramMessage {
  chat_id: string | number;
  text: string;
  parse_mode?: 'HTML' | 'Markdown';
  disable_web_page_preview?: boolean;
}

interface TelegramNotification {
  type: 'new_user' | 'new_payment' | 'subscription_upgrade' | 'user_blocked';
  data: any;
}

export class TelegramNotificationService {
  private botToken: string;
  private adminChatId: string;
  private isConfigured: boolean;

  constructor() {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    
    if (!botToken) {
      console.warn('TELEGRAM_BOT_TOKEN not configured');
      this.botToken = '';
      this.adminChatId = '';
      this.isConfigured = false;
      return;
    }
    
    this.botToken = botToken;
    this.adminChatId = adminChatId || '';
    this.isConfigured = true;
  }

  private async sendMessage(message: Omit<TelegramMessage, 'chat_id'>): Promise<boolean> {
    try {
      if (!this.isConfigured || !this.botToken || !this.adminChatId) {
        console.warn('Telegram bot not configured, skipping notification');
        return false;
      }

      const response = await fetch(
        `https://api.telegram.org/bot${this.botToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: this.adminChatId,
            ...message,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Telegram API error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Telegram notification error:', error);
      return false;
    }
  }

  async sendNotification(notification: TelegramNotification): Promise<boolean> {
    switch (notification.type) {
      case 'new_user':
        return this.sendNewUserNotification(notification.data);
      case 'new_payment':
        return this.sendNewPaymentNotification(notification.data);
      case 'subscription_upgrade':
        return this.sendSubscriptionUpgradeNotification(notification.data);
      case 'user_blocked':
        return this.sendUserBlockedNotification(notification.data);
      default:
        return false;
    }
  }

  private async sendNewUserNotification(user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
  }): Promise<boolean> {
    const message = `
<b>Yangi foydalanuvchi ro'yxatdan o'tdi!</b>

<b>Ism:</b> ${user.firstName} ${user.lastName || ''}
<b>Email:</b> ${user.email}
<b>Rol:</b> ${user.role}
<b>ID:</b> ${user.id}
<b>Sana:</b> ${new Date(user.createdAt).toLocaleString('uz-UZ')}

<b>Platform:</b> JURISAI Legal AI
    `.trim();

    return this.sendMessage({
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  }

  private async sendNewPaymentNotification(payment: {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    status: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    plan?: {
      name: string;
      price: number;
    };
    createdAt: string;
  }): Promise<boolean> {
    const message = `
<b>Yangi to'lov amalga oshirildi!</b>

<b>Foydalanuvchi:</b> ${payment.user.firstName} ${payment.user.lastName || ''}
<b>Email:</b> ${payment.user.email}
<b>Summa:</b> ${payment.amount.toLocaleString('uz-UZ')} ${payment.currency}
<b>To'lov ID:</b> ${payment.id}
<b>Sana:</b> ${new Date(payment.createdAt).toLocaleString('uz-UZ')}

${payment.plan ? `<b>Obuna:</b> ${payment.plan.name} (${payment.plan.price.toLocaleString('uz-UZ')} so'm/oy)` : ''}

<b>Platform:</b> JURISAI Legal AI
    `.trim();

    return this.sendMessage({
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  }

  private async sendSubscriptionUpgradeNotification(upgrade: {
    userId: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    oldPlan: string;
    newPlan: string;
    newPrice: number;
    createdAt: string;
  }): Promise<boolean> {
    const message = `
<b>Foydalanuvchi obunasini yangiladi!</b>

<b>Foydalanuvchi:</b> ${upgrade.user.firstName} ${upgrade.user.lastName || ''}
<b>Email:</b> ${upgrade.user.email}
<b>Eski reja:</b> ${upgrade.oldPlan}
<b>Yangi reja:</b> ${upgrade.newPlan}
<b>Yangi narx:</b> ${upgrade.newPrice.toLocaleString('uz-UZ')} so'm/oy
<b>Sana:</b> ${new Date(upgrade.createdAt).toLocaleString('uz-UZ')}

<b>Platform:</b> JURISAI Legal AI
    `.trim();

    return this.sendMessage({
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  }

  private async sendUserBlockedNotification(user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    blockedAt: string;
  }): Promise<boolean> {
    const message = `
<b>Foydalanuvchi bloklandi!</b>

<b>Foydalanuvchi:</b> ${user.firstName} ${user.lastName || ''}
<b>Email:</b> ${user.email}
<b>ID:</b> ${user.id}
<b>Status:</b> ${user.status}
<b>Bloklangan vaqt:</b> ${new Date(user.blockedAt).toLocaleString('uz-UZ')}

<b>Platform:</b> JURISAI Legal AI
    `.trim();

    return this.sendMessage({
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  }

  async sendCustomNotification(text: string): Promise<boolean> {
    return this.sendMessage({
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  }

  async testConnection(): Promise<boolean> {
    const message = `
<b>Telegram Bot Test</b>

Bot muvaffaqiyatli ishga tushdi!
<b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}
<b>Platform:</b> JURISAI Legal AI
    `.trim();

    return this.sendMessage({
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  }
}

// Singleton instance
// Lazy initialization to prevent build errors
let telegramServiceInstance: TelegramNotificationService | null = null;

export const telegramService = (() => {
  if (!telegramServiceInstance) {
    try {
      telegramServiceInstance = new TelegramNotificationService();
    } catch (error) {
      console.warn('Failed to initialize Telegram service:', error);
      telegramServiceInstance = null;
    }
  }
  return telegramServiceInstance;
})();
