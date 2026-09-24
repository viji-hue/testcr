import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'trainer' | 'student' | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole;
  loading: boolean;
  signIn: (cohortCode: string, name: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (cohortCode: string, name: string, password: string, role: 'trainer' | 'student') => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRoleState] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId: string, userMetadata?: any) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user role:', error);
        // Fallback to user_metadata role if database query fails
        return userMetadata?.role || null;
      }

      // If no role in database, check user_metadata
      return data?.role || userMetadata?.role || null;
    } catch (error) {
      console.error('Error fetching user role:', error);
      // Fallback to user_metadata role on error
      return userMetadata?.role || null;
    }
  };

  const setUserRole = async (role: UserRole) => {
    if (!user || !role) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert([
          {
            user_id: user.id,
            role: role
          }
        ]);

      if (error) {
        console.error('Error setting user role:', error);
        return;
      }

      setUserRoleState(role);
    } catch (error) {
      console.error('Error setting user role:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id, session.user.user_metadata)
          .then(role => {
            setUserRoleState(role);
          })
          .catch(error => {
            console.error('Error in fetchUserRole:', error);
            // Fallback to user_metadata role
            setUserRoleState(session.user.user_metadata?.role || null);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }).catch(error => {
      console.error('Error getting session:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setLoading(true);
          // Defer Supabase calls to prevent deadlock
          setTimeout(() => {
            fetchUserRole(session.user.id, session.user.user_metadata)
              .then(role => {
                setUserRoleState(role);
              })
              .catch(error => {
                console.error('Error fetching role on auth change:', error);
                // Fallback to user_metadata role
                setUserRoleState(session.user.user_metadata?.role || null);
              })
              .finally(() => setLoading(false));
          }, 0);
        } else {
          setUserRoleState(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (cohortCode: string, name: string, password: string) => {
    try {
      // Generate synthetic email for Supabase auth
      const email = `${name.toLowerCase().replace(/\s+/g, '-')}@${cohortCode.toLowerCase()}.cohort`;
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (cohortCode: string, name: string, password: string, role: 'trainer' | 'student') => {
    try {
      if (role === 'trainer') {
        return { success: false, error: 'Trainer accounts must be provisioned by an administrator.' };
      }
      // Generate synthetic email for Supabase auth
      const email = `${name.toLowerCase().replace(/\s+/g, '-')}@${cohortCode.toLowerCase()}.cohort`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            cohort_code: cohortCode,
            role: role
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUserRoleState(role);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserRoleState(null);
  };

  const value = {
    user,
    session,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
    setUserRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
