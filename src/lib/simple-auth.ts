// Simple Authentication System for JurisAI
// Using localStorage instead of NextAuth for simplicity

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  subscription_plan?: string;
  subscription_expires_at?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Mock user data (in real app, this would come from database)
const mockUsers: User[] = [
  {
    id: 'test-admin-1',
    email: 'admin@jurisai.uz',
    name: 'Admin User',
    role: 'ADMIN',
    subscription_plan: 'premium',
    subscription_expires_at: '2024-12-31'
  },
  {
    id: 'test-user-1',
    email: 'user@jurisai.uz',
    name: 'Test User',
    role: 'USER',
    subscription_plan: 'pro',
    subscription_expires_at: '2024-06-30'
  },
  {
    id: 'demo-user',
    email: 'demo@jurisai.uz',
    name: 'Demo User',
    role: 'USER',
    subscription_plan: 'free'
  }
];

export class SimpleAuth {
  private static instance: SimpleAuth;
  private user: User | null = null;
  private callbacks: Set<(user: User | null) => void> = new Set();

  private constructor() {
    // Check localStorage on initialization
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('jurisai_user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
    }
  }

  static getInstance(): SimpleAuth {
    if (!SimpleAuth.instance) {
      SimpleAuth.instance = new SimpleAuth();
    }
    return SimpleAuth.instance;
  }

  // Subscribe to auth state changes
  subscribe(callback: (user: User | null) => void): () => void {
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }

  // Notify all subscribers
  private notify() {
    this.callbacks.forEach(callback => callback(this.user));
  }

  // Get current user
  getUser(): User | null {
    return this.user;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.user !== null;
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.user?.role === 'ADMIN';
  }

  // Check if user has active subscription
  hasActiveSubscription(): boolean {
    if (!this.user?.subscription_expires_at) return false;
    return new Date(this.user.subscription_expires_at) > new Date();
  }

  // Get subscription plan
  getSubscriptionPlan(): string {
    return this.user?.subscription_plan || 'free';
  }

  // Login with email and password
  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user in mock data
      const user = mockUsers.find(u => u.email === email);
      
      if (!user) {
        return { success: false, error: 'Foydalanuvchi topilmadi' };
      }

      // In real app, verify password here
      if (password !== 'password123') {
        return { success: false, error: 'Noto\'g\'ri parol' };
      }

      // Set user
      this.user = user;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('jurisai_user', JSON.stringify(user));
      }

      // Notify subscribers
      this.notify();

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login xatosi' };
    }
  }

  // Register new user
  async register(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        return { success: false, error: 'Bu email allaqachon ro\'yxatdan o\'tgan' };
      }

      // Create new user
      const newUser: User = {
        id: crypto.randomUUID(),
        email: userData.email,
        name: userData.name,
        role: 'USER',
        subscription_plan: 'free'
      };

      // Add to mock users (in real app, save to database)
      mockUsers.push(newUser);

      // Auto login after registration
      this.user = newUser;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('jurisai_user', JSON.stringify(newUser));
      }

      this.notify();

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Ro\'yxatdan o\'tish xatosi' };
    }
  }

  // Logout
  logout() {
    this.user = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jurisai_user');
    }

    this.notify();
  }

  // Update user profile
  async updateProfile(updates: Partial<User>): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.user) {
        return { success: false, error: 'Foydalanuvchi tizimga kirmagan' };
      }

      // Update user data
      this.user = { ...this.user, ...updates };
      
      // Update in mock users
      const userIndex = mockUsers.findIndex(u => u.id === this.user!.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = this.user;
      }

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('jurisai_user', JSON.stringify(this.user));
      }

      this.notify();

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Profilni yangilash xatosi' };
    }
  }

  // Get auth state for React hooks
  getAuthState(): AuthState {
    return {
      user: this.user,
      isAuthenticated: this.isAuthenticated(),
      isLoading: false
    };
  }
}

// Export singleton instance
export const auth = SimpleAuth.getInstance();

// Export only server-side auth functions
// Client-side hooks should be in separate file

// For server-side usage
export function getServerSession(): Promise<{ user: User | null }> {
  return new Promise((resolve) => {
    // In real app, this would verify server-side session
    // For now, return mock data
    resolve({ 
      user: {
        id: 'demo-user',
        email: 'demo@jurisai.uz',
        name: 'Demo User',
        role: 'USER',
        subscription_plan: 'free'
      }
    });
  });
}
