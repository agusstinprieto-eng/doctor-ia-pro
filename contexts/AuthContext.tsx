import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    username: string | null;
    login: (username: string, password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials (hardcoded for commercial deployment)
const DEMO_USERS: Record<string, string> = {
    'invitado': 'demo123',
    // Legacy support alias if needed
    'demo': 'demo123'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState<string | null>(null);

    // Check if user was previously authenticated
    useEffect(() => {
        const savedAuth = localStorage.getItem('doctor-ia-auth');
        if (savedAuth) {
            try {
                const { username: savedUsername, timestamp } = JSON.parse(savedAuth);
                // Session expires after 24 hours
                if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                    setIsAuthenticated(true);
                    setUsername(savedUsername);
                } else {
                    localStorage.removeItem('doctor-ia-auth');
                }
            } catch (e) {
                localStorage.removeItem('doctor-ia-auth');
            }
        }
    }, []);

    const login = (username: string, password: string): boolean => {
        if (DEMO_USERS[username] === password) {
            setIsAuthenticated(true);
            setUsername(username);
            localStorage.setItem('doctor-ia-auth', JSON.stringify({
                username,
                timestamp: Date.now()
            }));
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUsername(null);
        localStorage.removeItem('doctor-ia-auth');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
