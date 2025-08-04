const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  email?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: {
    id: string;
    username: string;
    email?: string;
  };
  token?: string;
  expiresIn?: string;
}

export interface SessionResponse {
  isValid: boolean;
  user?: {
    id: string;
    username: string;
    email?: string;
  };
  authMethod?: 'jwt' | 'session' | 'guest';
  sessionExpiry?: string;
}

class AuthApi {
  // Login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login API error:', error);
      return {
        success: false,
        error: 'Network error'
      };
    }
  }

  // Signup
  async signup(userData: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Signup API error:', error);
      return {
        success: false,
        error: 'Network error'
      };
    }
  }

  // Logout
  async logout(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Logout API error:', error);
      return {
        success: false,
        error: 'Network error'
      };
    }
  }

  // Check session status
  async checkSession(token?: string): Promise<SessionResponse> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/session`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Session check API error:', error);
      return {
        isValid: false
      };
    }
  }

  // Get user profile (protected route)
  async getProfile(token: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Profile API error:', error);
      return {
        success: false,
        error: 'Network error'
      };
    }
  }
}

export const authApi = new AuthApi();
export default authApi; 