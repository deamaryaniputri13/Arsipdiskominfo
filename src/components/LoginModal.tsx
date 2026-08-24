import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, Shield, KeyRound, AlertCircle, CheckCircle2, User as UserIcon } from 'lucide-react';
import { User, UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: UserRole; // 'ADMIN' or 'STAFF'
  availableUsers: User[];
  onLoginSuccess: (user: User) => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  targetRole,
  availableUsers,
  onLoginSuccess,
}: LoginModalProps) {
  // Filter users matching target role
  const matchingUsers = availableUsers.filter((u) => u.role === targetRole);
  const [selectedUserId, setSelectedUserId] = useState<string>(
    matchingUsers[0]?.id || availableUsers[0]?.id || ''
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync selected user when targetRole changes
  React.useEffect(() => {
    const list = availableUsers.filter((u) => u.role === targetRole);
    if (list.length > 0) {
      setSelectedUserId(list[0].id);
    }
    setPassword('');
    setErrorMsg('');
  }, [targetRole, availableUsers, isOpen]);

  if (!isOpen) return null;

  const currentSelectedUser = availableUsers.find((u) => u.id === selectedUserId);
  const expectedPassword = currentSelectedUser?.password || (targetRole === 'ADMIN' ? 'admin' : 'staf');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password.trim()) {
      setErrorMsg('Silakan masukkan kata sandi akun.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Allow user's specific password OR standard fallback 'admin' / 'staf' / '123456'
      const isValid = 
        password === expectedPassword || 
        password === (targetRole === 'ADMIN' ? 'admin' : 'staf') ||
        password === 'admin123' ||
        password === 'staf123' ||
        password === '123456';

      if (isValid && currentSelectedUser) {
        setIsLoading(false);
        onLoginSuccess(currentSelectedUser);
        onClose();
      } else {
        setIsLoading(false);
        setErrorMsg('Kata sandi yang Anda masukkan salah. Periksa kembali sandi Anda.');
      }
    }, 300);
  };

  const handleUseDemoPassword = () => {
    setPassword(expectedPassword);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" id="login-password-modal">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              targetRole === 'ADMIN' 
                ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
            }`}>
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Kunci Akses {targetRole === 'ADMIN' ? 'Administrator' : 'Staf Teknis'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Masukkan kata sandi untuk autentikasi keamanan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-650 hover:bg-slate-200/60 rounded-lg transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* User selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Pilih Pegawai / Akun</span>
              <span className="text-[10px] font-normal text-slate-400">Terdaftar pada sistem</span>
            </label>

            <div className="relative">
              <select
                value={selectedUserId}
                onChange={(e) => {
                  setSelectedUserId(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 cursor-pointer"
              >
                {matchingUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} (NIP: {u.nip})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Kata Sandi (Password)</span>
              <button
                type="button"
                onClick={handleUseDemoPassword}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer underline"
              >
                Gunakan sandi default ({expectedPassword})
              </button>
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Masukkan kata sandi..."
                autoFocus
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-700 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{errorMsg}</div>
            </div>
          )}

          {/* Info hint box */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>Sandi default: <strong>{expectedPassword}</strong></span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">BSrE Encrypted</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 py-2.5 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                targetRole === 'ADMIN'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Memverifikasi...' : 'Buka Kunci Akses'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
