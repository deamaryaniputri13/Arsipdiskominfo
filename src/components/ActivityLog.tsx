import React, { useState, useMemo } from 'react';
import { ShieldCheck, Search, ShieldAlert, Monitor, UserCheck, RefreshCw, Key, DownloadCloud, Trash2 } from 'lucide-react';
import { AktivitasLog } from '../types';

interface ActivityLogProps {
  logs: AktivitasLog[];
  onClearLogs: () => void;
}

export default function ActivityLog({ logs, onClearLogs }: ActivityLogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const q = searchQuery.toLowerCase();
      const matchQuery = q === '' ||
        log.userName.toLowerCase().includes(q) ||
        log.detail.toLowerCase().includes(q) ||
        log.ipAddress.includes(q);
      
      const matchAction = actionFilter === 'ALL' || log.aksi === actionFilter;

      return matchQuery && matchAction;
    }).sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }, [logs, searchQuery, actionFilter]);

  const getActionBadge = (action: AktivitasLog['aksi']) => {
    switch (action) {
      case 'UNGGAH_ARSIP':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">UNGGAH</span>;
      case 'UBAH_ARSIP':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">UBAH</span>;
      case 'HAPUS_ARSIP':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">HAPUS</span>;
      case 'VERIFIKASI':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">VERIFIKASI</span>;
      case 'LOGIN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">MASUK PORTAL</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">AKSI</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in" id="security-activity-logs">
      {/* Title block */}
      <div className="p-6 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl border border-indigo-100/50">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Riwayat Pengawasan Keamanan (Audit Log)
            </h3>
            <p className="text-xs text-slate-400">Pencatatan real-time seluruh aktivitas pegawai teknis kearsipan</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('Apakah Anda mempunyai izin berwenang khusus untuk mereset seluruh database riwayat audit log?')) {
              onClearLogs();
            }
          }}
          className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:text-slate-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Seka Log Kearsipan</span>
        </button>
      </div>

      {/* Inputs controls */}
      <div className="p-4 bg-slate-50 border-b border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-2.5 text-slate-400 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Ketik nama operator, kata kunci berkas, atau IP Address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white text-slate-800 rounded-lg text-xs border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-semibold placeholder:text-slate-450"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="p-2 bg-white border border-slate-205 rounded-lg text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
        >
          <option value="ALL">Semua Jenis Aktivitas</option>
          <option value="UNGGAH_ARSIP">Hanya Unggah Arsip</option>
          <option value="UBAH_ARSIP">Hanya Ubah Arsip</option>
          <option value="HAPUS_ARSIP">Hanya Hapus Arsip</option>
          <option value="VERIFIKASI">Hanya Verifikasi</option>
          <option value="LOGIN">Hanya Akses Masuk</option>
        </select>
      </div>

      {/* Log Feed */}
      <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-xs">
            Tidak ada riwayat aktivitas keamanan yang cocok dengan saringan Anda.
          </div>
        ) : (
          filteredLogs.map(log => (
            <div key={log.id} className="p-4 hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-slate-800 bg-slate-100 border border-slate-200/40 px-2 py-0.5 rounded-md font-sans flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-indigo-550" /> {log.userName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    [{log.userRole}]
                  </span>
                  <span>{getActionBadge(log.aksi)}</span>
                </div>
                
                <p className="text-slate-600 font-medium">{log.detail}</p>
                
                <div className="flex items-center gap-4 text-[10px] text-slate-400">
                  <span className="font-mono">Tanggal: {new Date(log.tanggal).toLocaleString('id-ID')}</span>
                  <span className="text-slate-200">|</span>
                  <span className="font-mono flex items-center gap-0.5">
                    <Monitor className="w-3 h-3 text-slate-400" /> IP: {log.ipAddress}
                  </span>
                </div>
              </div>

              <div className="shrink-0">
                <span className="text-[9px] font-mono font-bold uppercase py-1 px-2 border border-slate-200 rounded-md bg-white text-slate-400 flex items-center gap-1">
                  <Key className="w-3 h-3 text-indigo-500" /> VERIFIED SIGN
                </span>
              </div>

            </div>
          ))
        )}
      </div>

      <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-450 flex items-center justify-between">
        <span className="font-mono tracking-wide">SECURE AUDIT INTEGRITY ASSURED VIA VERIFIABLE PROTOCOLS</span>
        <span className="font-bold text-indigo-600 uppercase tracking-widest text-[9px]">COMPLIANCE ACTIVE</span>
      </div>
    </div>
  );
}
