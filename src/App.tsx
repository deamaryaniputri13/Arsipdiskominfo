import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PublicSearch from './components/PublicSearch';
import UploadDocumentForm from './components/UploadDocumentForm';
import MasterDataEditor from './components/MasterDataEditor';
import ActivityLog from './components/ActivityLog';
import DocumentModal from './components/DocumentModal';
import LoginModal from './components/LoginModal';

import {
  ArsipDokumen,
  Bidang,
  JenisDokumen,
  AktivitasLog,
  User,
  UserRole,
  INITIAL_BIDANG,
  INITIAL_JENIS,
  INITIAL_ARSIP,
  INITIAL_LOGS,
  INTIAL_USERS
} from './types';

import {
  Plus,
  Archive,
  Settings,
  FolderLock,
  Clock,
  Lock
} from 'lucide-react';

export default function App() {
  // 💾 STATE LOADERS & LOCAL PERSISTENCE
  const [departments, setDepartments] = useState<Bidang[]>(() => {
    const saved = localStorage.getItem('diskominfo_bidang');
    return saved ? JSON.parse(saved) : INITIAL_BIDANG;
  });

  const [docTypes, setDocTypes] = useState<JenisDokumen[]>(() => {
    const saved = localStorage.getItem('diskominfo_jenis');
    return saved ? JSON.parse(saved) : INITIAL_JENIS;
  });

  const [archives, setArchives] = useState<ArsipDokumen[]>(() => {
    const saved = localStorage.getItem('diskominfo_arsip');
    return saved ? JSON.parse(saved) : INITIAL_ARSIP;
  });

  const [logs, setLogs] = useState<AktivitasLog[]>(() => {
    const saved = localStorage.getItem('diskominfo_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  // Track the available mock users
  const availableUsers = INTIAL_USERS;
  const [currentUser, setCurrentUser] = useState<User>(() => {
    return {
      id: 'public_guest',
      name: 'Tamu Publik',
      nip: '190000000000000000',
      role: 'PUBLIC'
    };
  });

  // Password Login Modal State
  const [loginModalState, setLoginModalState] = useState<{
    isOpen: boolean;
    targetRole: 'ADMIN' | 'STAFF';
  }>({
    isOpen: false,
    targetRole: 'STAFF',
  });

  // Navigation tab states for the Admin layout
  // 'DATABASE' (Archives List with CRUD), 'MASTER' (Kode Bidang & Jenis), 'LOGS' (Riwayat audit)
  const [adminTab, setAdminTab] = useState<'DATABASE' | 'MASTER' | 'LOGS'>('DATABASE');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<ArsipDokumen | null>(null);

  // Sync to local storage regularly
  useEffect(() => {
    localStorage.setItem('diskominfo_bidang', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('diskominfo_jenis', JSON.stringify(docTypes));
  }, [docTypes]);

  useEffect(() => {
    localStorage.setItem('diskominfo_arsip', JSON.stringify(archives));
  }, [archives]);

  useEffect(() => {
    localStorage.setItem('diskominfo_logs', JSON.stringify(logs));
  }, [logs]);

  // Handle requesting login with password
  const handleRequestLogin = (role: 'ADMIN' | 'STAFF') => {
    setLoginModalState({
      isOpen: true,
      targetRole: role,
    });
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    addSecurityLog(
      'LOGIN',
      `Otentikasi Berhasil: Pengguna ${user.name} masuk sebagai ${user.role} dengan verifikasi sandi.`
    );
  };

  // Handle role simulator change
  const handleRoleChange = (newRole: UserRole) => {
    if (newRole === 'PUBLIC') {
      setCurrentUser({
        id: 'public_guest',
        name: 'Tamu Publik',
        nip: '190000000000000000',
        role: 'PUBLIC'
      });
      // also close any upload forms
      setShowUploadForm(false);
      addSecurityLog(
        'LOGIN',
        'Sesi internal ditutup. Beralih ke Mode Pengunjung Publik.'
      );
    } else {
      // Require password before switching to STAFF or ADMIN
      handleRequestLogin(newRole);
    }
  };

  const handleUserChange = (userId: string) => {
    const usr = availableUsers.find(u => u.id === userId);
    if (usr) {
      setCurrentUser(usr);
      // log login action
      addSecurityLog(
        'LOGIN',
        `Pengguna ${usr.name} beralih sesi atau berhasil masuk sistem sebagai ${usr.role}.`
      );
    }
  };

  // Helper to append security log
  const addSecurityLog = (
    action: AktivitasLog['aksi'],
    detail: string
  ) => {
    const IP_POOL = ['10.252.12.98', '10.252.12.110', '10.24.114.53', '192.168.10.4'];
    const randomIP = IP_POOL[Math.floor(Math.random() * IP_POOL.length)];
    
    const newLog: AktivitasLog = {
      id: 'log_' + Date.now() + Math.random().toString(36).substring(4, 8),
      tanggal: new Date().toISOString(),
      userName: currentUser.name || 'Sistem Tamu',
      userRole: currentUser.role,
      aksi: action,
      detail,
      ipAddress: currentUser.role === 'PUBLIC' ? '180.252.124.9' : randomIP
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // 📝 WRITE OPERATIONS: DOCUMENT HANDLING
  const handleUploadSuccess = (newDoc: ArsipDokumen) => {
    setArchives(prev => [newDoc, ...prev]);
    setShowUploadForm(false);
    
    // Add audit log
    addSecurityLog(
      'UNGGAH_ARSIP',
      `Berhasil mendaftarkan arsip teknis baru: "${newDoc.namaDokumen}" dengan kode otomatis: ${newDoc.nomorBerkas}.`
    );
  };

  const handleDeleteArchive = (docId: string, docNo: string) => {
    if (currentUser.role !== 'ADMIN') {
      alert('Akses Terbatas: Hanya Kepala/Admin Utama yang berhak menghapus arsip resmi dinas demi menjaga rantai penyerahan data.');
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus arsip ${docNo} secara permanen? Dokumen fisik perlu ditarik kembali dari lemari.`)) {
      setArchives(prev => prev.filter(a => a.id !== docId));
      addSecurityLog(
        'HAPUS_ARSIP',
        `MENGHAPUS berkas resmi pemprov nomor: ${docNo} dari server.`
      );
    }
  };

  // 📂 MASTER DATA CRUDS
  const handleAddDept = (dept: Omit<Bidang, 'id'>) => {
    const newDept: Bidang = {
      id: 'b_' + Date.now(),
      ...dept
    };
    setDepartments(prev => [...prev, newDept]);
    addSecurityLog(
      'UBAH_MASTER',
      `Menambahkan kode bidang administrasi baru: [${newDept.kode}] - ${newDept.nama}.`
    );
  };

  const handleUpdateDept = (updated: Bidang) => {
    setDepartments(prev => prev.map(d => d.id === updated.id ? updated : d));
    addSecurityLog(
      'UBAH_MASTER',
      `Memperbarui detail bidang kerja: [${updated.kode}] menjadi "${updated.nama}".`
    );
  };

  const handleDeleteDept = (id: string) => {
    const deptToDelete = departments.find(d => d.id === id);
    if (!deptToDelete) return false;
    
    setDepartments(prev => prev.filter(d => d.id !== id));
    addSecurityLog(
      'UBAH_MASTER',
      `Menghapus kode bidang kerja: [${deptToDelete.kode}] dari taksonomi penomoran.`
    );
    return true;
  };

  const handleAddDocType = (type: Omit<JenisDokumen, 'id'>) => {
    const newType: JenisDokumen = {
      id: 'j_' + Date.now(),
      ...type
    };
    setDocTypes(prev => [...prev, newType]);
    addSecurityLog(
      'UBAH_MASTER',
      `Mendaftarkan jenis dokumen teknis baru: [${newType.kode}] - ${newType.nama}.`
    );
  };

  const handleUpdateDocType = (updated: JenisDokumen) => {
    setDocTypes(prev => prev.map(t => t.id === updated.id ? updated : t));
    addSecurityLog(
      'UBAH_MASTER',
      `Memperbarui rincian tipe data kearsipan: [${updated.kode}] menjadi "${updated.nama}".`
    );
  };

  const handleDeleteDocType = (id: string) => {
    const typeToDelete = docTypes.find(t => t.id === id);
    if (!typeToDelete) return false;

    setDocTypes(prev => prev.filter(t => t.id !== id));
    addSecurityLog(
      'UBAH_MASTER',
      `Menghapus kode jenis berkas: [${typeToDelete.kode}] dari kamus sistem.`
    );
    return true;
  };

  // Viewing detail trigger
  const handleViewDetails = (doc: ArsipDokumen) => {
    setSelectedPreviewDoc(doc);
    addSecurityLog(
      'LIHAT_ARSIP',
      `Membuka lembar pratinjau digital resmi untuk nomor berkas: ${doc.nomorBerkas}.`
    );
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  // State calculations
  const totalVerifiedArchives = archives.filter(a => a.statusVerifikasi !== 'DRAFT').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" id="diskominfo-archive-manager-app">
      
      {/* 🏛️ HEADER SIMULATOR SECTION */}
      <Header
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        availableUsers={availableUsers}
        onUserChange={handleUserChange}
        onRequestLogin={handleRequestLogin}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* PUBLIC ACCESS LAYOUT vs INTERNAL EXECUTIVE LAYOUT */}
        {currentUser.role === 'PUBLIC' ? (
          <div className="space-y-6" id="view-public-home">
            {/* Banner info */}
            <div className="bg-indigo-50/60 rounded-xl p-5 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Pencarian Berkas & Dokumen Publik
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                  Akses kerangka acuan kerja, SK gubernur, atau kontrak MoU terbuka resmi Diskominfo Provinsi Banten.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={() => handleRequestLogin('STAFF')}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Login Staf / Admin</span>
                </button>
              </div>
            </div>

            {/* Render the unified public search and dashboard visual statistics */}
            <PublicSearch
              archives={archives}
              departments={departments}
              docTypes={docTypes}
              onViewDetails={handleViewDetails}
              isLoggedIn={false}
            />
          </div>
        ) : (
          /* ==================== INTERNAL PEGURUS (STAFF & ADMIN) DASHBOARD ==================== */
          <div className="space-y-6 animate-fade-in" id="view-internal-dashboard">
            
            {/* Admin Header with fast navigation tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-slate-900">
                    Panel Administrasi Arsip
                  </h1>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pengguna aktif: <strong className="text-slate-600 font-medium">{currentUser.name}</strong>
                </p>
              </div>

              {/* NAV TABS */}
              <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold self-stretch sm:self-auto shrink-0">
                <button
                  onClick={() => { setAdminTab('DATABASE'); setShowUploadForm(false); }}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-md transition-all cursor-pointer ${adminTab === 'DATABASE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <Archive className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Berkas</span>
                </button>
                
                <button
                  onClick={() => { setAdminTab('MASTER'); setShowUploadForm(false); }}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-md transition-all cursor-pointer ${adminTab === 'MASTER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <Settings className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Data Master</span>
                </button>
                
                <button
                  onClick={() => { setAdminTab('LOGS'); setShowUploadForm(false); }}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-md transition-all cursor-pointer ${adminTab === 'LOGS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <FolderLock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Audit Log</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT: DATABASE AND DOCUMENT MANAGER */}
            {adminTab === 'DATABASE' && (
              <div className="space-y-5">
                
                {/* Form to submit a new file or Button */}
                {showUploadForm ? (
                  <UploadDocumentForm
                    departments={departments}
                    docTypes={docTypes}
                    archives={archives}
                    onUploadSuccess={handleUploadSuccess}
                    onCancel={() => setShowUploadForm(false)}
                    currentUserId={currentUser.id}
                    currentUserName={currentUser.name}
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-slate-800">Daftar Arsip Digital</h2>
                      <p className="text-xs text-slate-400">Pencarian, pratinjau, dan verifikasi berkas.</p>
                    </div>

                    <button
                      onClick={() => setShowUploadForm(true)}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      id="display-add-archive-form-btn"
                    >
                      <Plus className="w-4 h-4 text-white" />
                      <span>Registrasi Arsip Baru</span>
                    </button>
                  </div>
                )}

                {/* Main archive search view */}
                <PublicSearch
                  archives={archives}
                  departments={departments}
                  docTypes={docTypes}
                  onViewDetails={handleViewDetails}
                  isLoggedIn={true}
                />

              </div>
            )}

            {/* TAB CONTENT: MASTER CLASSIFICATION CODES */}
            {adminTab === 'MASTER' && (
              <MasterDataEditor
                departments={departments}
                onAddDept={handleAddDept}
                onUpdateDept={handleUpdateDept}
                onDeleteDept={handleDeleteDept}
                docTypes={docTypes}
                onAddDocType={handleAddDocType}
                onUpdateDocType={handleUpdateDocType}
                onDeleteDocType={handleDeleteDocType}
                archives={archives}
              />
            )}

            {/* TAB CONTENT: SECURITY LOGS AUDITS */}
            {adminTab === 'LOGS' && (
              <ActivityLog
                logs={logs}
                onClearLogs={handleClearLogs}
              />
            )}

          </div>
        )}

      </main>

      {/* 🚀 DETAILS / PREVIEW MODAL MOUNT */}
      {selectedPreviewDoc && (
        <DocumentModal
          document={selectedPreviewDoc}
          departments={departments}
          docTypes={docTypes}
          onClose={() => setSelectedPreviewDoc(null)}
          isLoggedIn={currentUser.role !== 'PUBLIC'}
        />
      )}

      {/* 🔐 PASSWORD AUTHENTICATION MODAL */}
      <LoginModal
        isOpen={loginModalState.isOpen}
        targetRole={loginModalState.targetRole}
        availableUsers={availableUsers}
        onClose={() => setLoginModalState(prev => ({ ...prev, isOpen: false }))}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Gov Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 py-10 mt-auto text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-bold text-slate-805 text-sm">Diskominfo Provinsi Banten • E-Arsip Teknis</h4>
            <p className="max-w-md text-slate-400 leading-relaxed text-[11px]">
              Sistem digitalisasi terarah sebagai realisasi cetak biru peningkatan keandalan data negara, klasifikasi sandi dan penomoran otomatis teratur.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 text-slate-400 font-mono text-[9px] tracking-wide">
            <span>Powered by Smart AI Classifier v2.4</span>
            <span className="text-slate-200 hidden sm:inline">|</span>
            <span>TTE Berizin Sandi BSrE</span>
            <span className="text-slate-200 hidden sm:inline">|</span>
            <span>Versi Dokumen: ISO_27001_A.8</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
