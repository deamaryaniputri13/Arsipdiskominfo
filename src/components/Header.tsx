import React from 'react';
import { Shield, User as UserIcon, Globe, Lock, LogOut } from 'lucide-react';
import { User, UserRole } from '../types';

interface HeaderProps {
  currentUser: User;
  onRoleChange: (role: UserRole) => void;
  availableUsers: User[];
  onUserChange: (userId: string) => void;
  onRequestLogin: (role: 'ADMIN' | 'STAFF') => void;
}

export default function Header({
  currentUser,
  onRoleChange,
  availableUsers,
  onUserChange,
  onRequestLogin,
}: HeaderProps) {
  const isInternalUser = currentUser.role !== 'PUBLIC';

  return (
    <header className="bg-white border-b border-slate-200 text-slate-800 sticky top-0 z-30" id="main-app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-xs overflow-hidden shrink-0">
              <img 
                src="/src/assets/images/diskominfo_banten_logo_1781770844817.jpg" 
                alt="Diskominfo Provinsi Banten Logo" 
                className="w-8 h-8 object-contain" 
                id="brand-logo-image" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-slate-900 text-base">
                  SIKAT-ARSIP
                </span>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                  Provinsi Banten
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Dinas Komunikasi, Informatika, Statistik dan Persandian
              </p>
            </div>
          </div>

          {/* Role switcher & Profile */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* Segmented Switch with Password Lock indication */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-slate-600 text-xs border border-slate-200/60">
              
              {/* Public Mode Button */}
              <button
                onClick={() => onRoleChange('PUBLIC')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentUser.role === 'PUBLIC'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Mode Pengunjung Publik (Terbuka)"
                id="role-switch-public"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>Publik</span>
              </button>

              {/* Staff Mode Button (Requires Password) */}
              <button
                onClick={() => {
                  if (currentUser.role === 'STAFF') {
                    // Already in staff, could switch staff user or stay
                    return;
                  }
                  onRequestLogin('STAFF');
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentUser.role === 'STAFF'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Mode Staf Teknis (Perlu Kata Sandi)"
                id="role-switch-staff"
              >
                {currentUser.role === 'STAFF' ? (
                  <UserIcon className="w-3.5 h-3.5 text-indigo-600" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>Staf</span>
              </button>

              {/* Admin Mode Button (Requires Password) */}
              <button
                onClick={() => {
                  if (currentUser.role === 'ADMIN') {
                    return;
                  }
                  onRequestLogin('ADMIN');
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentUser.role === 'ADMIN'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Mode Admin / Kepala (Perlu Kata Sandi)"
                id="role-switch-admin"
              >
                {currentUser.role === 'ADMIN' ? (
                  <Shield className="w-3.5 h-3.5 text-indigo-600" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>Admin</span>
              </button>
            </div>

            {/* Profile Avatar / User Name */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-xs font-bold border border-indigo-100">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div className="hidden md:block text-left text-xs">
                <div className="font-semibold text-slate-800 leading-tight">
                  {currentUser.role === 'PUBLIC' ? 'Tamu Publik' : currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  {currentUser.role === 'PUBLIC' ? (
                    <span>Akses Terbuka</span>
                  ) : (
                    <span className="font-mono text-emerald-600 font-semibold flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> Terotentikasi
                    </span>
                  )}
                </div>
              </div>

              {/* Logout Button if logged in */}
              {isInternalUser && (
                <button
                  onClick={() => onRoleChange('PUBLIC')}
                  className="p-1.5 ml-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                  title="Kunci / Keluar ke Mode Publik"
                  id="logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
