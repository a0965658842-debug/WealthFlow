
import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { auth, isFirebaseInitialized } from '../services/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/email-already-in-use': return '此 Email 已經被註冊過了';
      case 'auth/invalid-email': return 'Email 格式不正確';
      case 'auth/weak-password': return '密碼強度不足';
      case 'auth/user-not-found': return '找不到此帳號';
      case 'auth/wrong-password': return '密碼錯誤';
      case 'auth/invalid-credential': return '登入資訊錯誤';
      default: return `發生錯誤 (${errorCode})`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!isFirebaseInitialized) {
       setError("Firebase 未正確設定，請檢查您的環境變數 (API Key)。");
       setIsLoading(false);
       return;
    }

    // Basic Validation
    if (isRegister && password !== confirmPassword) {
      setError("兩次輸入的密碼不相符");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("密碼長度至少需要 6 個字元");
      setIsLoading(false);
      return;
    }

    try {
      if (isRegister) {
        // Firebase Registration
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Update Display Name
        if (name) {
          await updateProfile(userCredential.user, { displayName: name });
        }
        
        const newUser: User = {
          id: userCredential.user.uid,
          name: name || userCredential.user.displayName || '新使用者',
          email: userCredential.user.email || '',
          avatar: userCredential.user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userCredential.user.uid)}`
        };
        onLogin(newUser);
      } else {
        // Firebase Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        onLogin({
            id: userCredential.user.uid,
            name: userCredential.user.displayName || email.split('@')[0],
            email: userCredential.user.email || '',
            avatar: userCredential.user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userCredential.user.uid)}`
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err.code || 'unknown'));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 transition-all duration-500">
        <div className="bg-indigo-600 p-8 text-center relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto flex items-center justify-center mb-4 backdrop-blur-md shadow-inner">
               <span className="text-3xl font-bold text-white">W</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">WealthFlow</h1>
            <p className="text-indigo-100 text-sm mt-2 font-light">
              {isRegister ? '建立您的智慧財務帳戶' : '您的智慧財務管家'}
            </p>
          </div>
        </div>
        
        <div className="p-8">
          {!isFirebaseInitialized && (
            <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-sm">
              <strong>設定尚未完成：</strong> 系統偵測不到 Firebase 設定。請前往 GitHub Settings &rarr; Secrets 設定相關環境變數，並重新觸發 Deploy。
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 animate-fade-in border border-red-100">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Name Field - Only for Register */}
            {isRegister && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-slate-700 mb-1 pl-1">姓名</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
                    placeholder="請輸入您的姓名"
                    required={isRegister}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 pl-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 pl-1">密碼</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Confirm Password Field - Only for Register */}
            {isRegister && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-slate-700 mb-1 pl-1">確認密碼</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white ${
                      confirmPassword && password !== confirmPassword 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-slate-200 focus:border-transparent'
                    }`}
                    placeholder="請再次輸入密碼"
                    required={isRegister}
                  />
                  {confirmPassword && password === confirmPassword && (
                     <CheckCircle2 className="absolute right-3 top-3.5 text-emerald-500 animate-pulse" size={18} />
                  )}
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading || !isFirebaseInitialized}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>處理中...</span>
                </>
              ) : (
                <>
                  <span>{isRegister ? '立即註冊' : '登入帳戶'}</span>
                  {!isRegister && <ArrowRight size={18} />}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">或是</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={toggleMode}
              className="text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors"
            >
              {isRegister ? '已經有帳號了？ 登入' : '還沒有帳號？ 註冊新帳戶'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
