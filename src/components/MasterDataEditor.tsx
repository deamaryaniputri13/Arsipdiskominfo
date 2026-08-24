import React, { useState } from 'react';
import { Database, Plus, Check, Edit2, Trash2, Folder, FileText, Info, AlertTriangle, RefreshCw } from 'lucide-react';
import { Bidang, JenisDokumen, ArsipDokumen } from '../types';

interface MasterDataEditorProps {
  departments: Bidang[];
  onAddDept: (dept: Omit<Bidang, 'id'>) => void;
  onUpdateDept: (dept: Bidang) => void;
  onDeleteDept: (id: string) => boolean; // return true if deleted, false if has documents
  
  docTypes: JenisDokumen[];
  onAddDocType: (type: Omit<JenisDokumen, 'id'>) => void;
  onUpdateDocType: (type: JenisDokumen) => void;
  onDeleteDocType: (id: string) => boolean;

  archives: ArsipDokumen[];
}

export default function MasterDataEditor({
  departments,
  onAddDept,
  onUpdateDept,
  onDeleteDept,
  docTypes,
  onAddDocType,
  onUpdateDocType,
  onDeleteDocType,
  archives
}: MasterDataEditorProps) {
  // Bidang form states
  const [bKode, setBKode] = useState('');
  const [bNama, setBNama] = useState('');
  const [bDeskripsi, setBDeskripsi] = useState('');
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);

  // Jenis form states
  const [jKode, setJKode] = useState('');
  const [jNama, setJNama] = useState('');
  const [jDeskripsi, setJDeskripsi] = useState('');
  const [editingJenisId, setEditingJenisId] = useState<string | null>(null);

  // Error/Success messages
  const [bMessage, setBMessage] = useState('');
  const [jMessage, setJMessage] = useState('');

  // 📁 DEPT ACTIONS
  const handleSaveDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bKode.trim() || !bNama.trim()) {
      alert('Kode dan nama Bidang harus diisi.');
      return;
    }

    // Capitalize code to ensure structured styling compatibility
    const formattedKode = bKode.trim().toUpperCase();

    if (editingDeptId) {
      onUpdateDept({
        id: editingDeptId,
        kode: formattedKode,
        nama: bNama.trim(),
        deskripsi: bDeskripsi.trim() || 'No description provided.'
      });
      setBMessage('Bidang berhasil diperbarui!');
      setEditingDeptId(null);
    } else {
      // check duplicate code
      if (departments.some(d => d.kode === formattedKode)) {
        alert('Kode Bidang sudah digunakan oleh bidang lain!');
        return;
      }
      onAddDept({
        kode: formattedKode,
        nama: bNama.trim(),
        deskripsi: bDeskripsi.trim() || 'No description provided.'
      });
      setBMessage('Bidang baru berhasil ditambahkan!');
    }

    // reset index
    setBKode('');
    setBNama('');
    setBDeskripsi('');
    setTimeout(() => setBMessage(''), 3000);
  };

  const handleEditDeptClick = (dept: Bidang) => {
    setEditingDeptId(dept.id);
    setBKode(dept.kode);
    setBNama(dept.nama);
    setBDeskripsi(dept.deskripsi);
  };

  const handleDeleteDeptClick = (id: string, kode: string) => {
    const usageCount = archives.filter(a => a.bidangId === id).length;
    if (usageCount > 0) {
      alert(`Kode [${kode}] sedang digunakan oleh ${usageCount} dokumen aktif. Kategori ini tidak boleh dihapus demi menjaga integritas data pemerintah.`);
      return;
    }
    
    if (confirm(`Apakah Anda yakin ingin menghapus Kode Bidang [${kode}]? Tindakan ini bersifat permanen.`)) {
      onDeleteDept(id);
      setBMessage('Bidang berhasil dihapus.');
      setTimeout(() => setBMessage(''), 3000);
    }
  };

  // 📝 JENIS ACTIONS
  const handleSaveJenis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jKode.trim() || !jNama.trim()) {
      alert('Kode dan nama jenis dokumen harus diisi.');
      return;
    }

    const formattedKode = jKode.trim().toUpperCase();

    if (editingJenisId) {
      onUpdateDocType({
        id: editingJenisId,
        kode: formattedKode,
        nama: jNama.trim(),
        deskripsi: jDeskripsi.trim() || 'No description provided.'
      });
      setJMessage('Jenis dokumen berhasil diperbarui!');
      setEditingJenisId(null);
    } else {
      if (docTypes.some(t => t.kode === formattedKode)) {
        alert('Kode Jenis Dokumen ini sudah terdaftar!');
        return;
      }
      onAddDocType({
        kode: formattedKode,
        nama: jNama.trim(),
        deskripsi: jDeskripsi.trim() || 'No description provided.'
      });
      setJMessage('Jenis Dokumen berhasil didaftarkan!');
    }

    setJKode('');
    setJNama('');
    setJDeskripsi('');
    setTimeout(() => setJMessage(''), 3000);
  };

  const handleEditJenisClick = (type: JenisDokumen) => {
    setEditingJenisId(type.id);
    setJKode(type.kode);
    setJNama(type.nama);
    setJDeskripsi(type.deskripsi);
  };

  const handleDeleteJenisClick = (id: string, kode: string) => {
    const usageCount = archives.filter(a => a.jenisId === id).length;
    if (usageCount > 0) {
      alert(`Kode [${kode}] sedang digunakan oleh ${usageCount} arsip aktif. Hapus relasi dokumen terlebih dahulu.`);
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus Kode Jenis Dokumen [${kode}]?`)) {
      onDeleteDocType(id);
      setJMessage('Jenis dokumen berhasil dihapus.');
      setTimeout(() => setJMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="master-data-editor">
      
      {/* Informational Warning */}
      <div className="bg-slate-50 border-l-4 border-indigo-500 p-4 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <span className="font-bold text-slate-800">PERHATIAN ADMINISTRASI NEGARA:</span> Kode klasifikasi di bawah ini adalah fondasi algoritma penomoran berkas terstruktur otomatis. Mengedit atau menghapus kode bidang/jenis yang telah digunakan oleh ribuan arsip akan memicu ketidaksinkronan data arsip fisik. Diskominfo mengunci perubahan kode yang sedang memiliki arsip aktif.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PANEL 1: MANAGING DEPT CODES (BIDANG) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Folder className="w-4.5 h-4.5 text-indigo-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  Kode Bidang ({departments.length})
                </h3>
              </div>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded font-bold">
                Segmen 2 Penomoran
              </span>
            </div>

            {bMessage && (
              <div className="mx-5 my-3 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-lg font-semibold">
                ✓ {bMessage}
              </div>
            )}

            {/* List display with stats */}
            <div className="p-5 divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
              {departments.map(d => {
                const docCount = archives.filter(a => a.bidangId === d.id).length;
                return (
                  <div key={d.id} className="py-2.5 flex items-center justify-between gap-2 group">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-indigo-50 text-indigo-700 border border-indigo-100/60 px-2 py-0.5 rounded shadow-3xs">
                          {d.kode}
                        </span>
                        <span className="font-bold text-slate-800 text-xs">
                          {d.nama}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 italic max-w-sm">
                        {d.deskripsi}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] bg-slate-100 text-slate-500 font-mono px-1.5 py-0.5 rounded">
                        {docCount} Arsip
                      </span>
                      
                      <button
                        onClick={() => handleEditDeptClick(d)}
                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded cursor-pointer"
                        title="Ubah Nama & Deskripsi"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteDeptClick(d.id, d.kode)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded cursor-pointer"
                        title="Hapus Kode Klasifikasi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form input fields */}
          <div className="p-5 bg-slate-50 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase mb-3 flex items-center gap-1">
              <span>{editingDeptId ? 'Ubah Bidang Kominfo' : 'Daftarkan Bidang Baru'}</span>
              {editingDeptId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingDeptId(null);
                    setBKode('');
                    setBNama('');
                    setBDeskripsi('');
                  }}
                  className="text-[10px] text-rose-500 underline lowercase font-semibold ml-auto cursor-pointer"
                >
                  Batal Ubah
                </button>
              )}
            </h4>

            <form onSubmit={handleSaveDept} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">KODE KELAS</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="e.g. INF"
                    value={bKode}
                    disabled={!!editingDeptId} // Lock code change to prevent breaking existing IDs
                    onChange={(e) => setBKode(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-205 text-xs font-mono font-bold text-slate-800 rounded disabled:bg-slate-100"
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-slate-500">NAMA BIDANG</label>
                  <input
                    type="text"
                    required
                    placeholder="Aplikasi Informatika"
                    value={bNama}
                    onChange={(e) => setBNama(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-205 text-xs font-bold text-slate-800 rounded focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">DESKRIPSI TUGAS POKOK & STRUKTUR</label>
                <input
                  type="text"
                  placeholder="Mengurusi sub-domain prov.go.id dan persetujuan tanda tangan digital..."
                  value={bDeskripsi}
                  onChange={(e) => setBDeskripsi(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-205 text-xs text-slate-600 rounded focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-white font-bold" />
                <span>{editingDeptId ? 'Simpan Perubahan Bidang' : 'Tambahkan Ke Database'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* PANEL 2: MANAGING DOCUMENT TYPE CODES (JENIS) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-indigo-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  Kode Jenis Dokumen ({docTypes.length})
                </h3>
              </div>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded font-bold">
                Segmen 3 Penomoran
              </span>
            </div>

            {jMessage && (
              <div className="mx-5 my-3 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-lg font-semibold">
                ✓ {jMessage}
              </div>
            )}

            {/* List display */}
            <div className="p-5 divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
              {docTypes.map(t => {
                const docCount = archives.filter(a => a.jenisId === t.id).length;
                return (
                  <div key={t.id} className="py-2.5 flex items-center justify-between gap-2 group">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded shadow-3xs">
                          {t.kode}
                        </span>
                        <span className="font-bold text-slate-800 text-xs">
                          {t.nama}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 italic max-w-sm">
                        {t.deskripsi}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] bg-slate-100 text-slate-500 font-mono px-1.5 py-0.5 rounded">
                        {docCount} Arsip
                      </span>
                      
                      <button
                        onClick={() => handleEditJenisClick(t)}
                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded cursor-pointer"
                        title="Ubah Nama & Deskripsi"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteJenisClick(t.id, t.kode)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded cursor-pointer"
                        title="Hapus Kategori Dokumen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form input fields */}
          <div className="p-5 bg-slate-50 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase mb-3 flex items-center gap-1">
              <span>{editingJenisId ? 'Ubah Klasifikasi Dokumen' : 'Daftarkan Jenis Baru'}</span>
              {editingJenisId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingJenisId(null);
                    setJKode('');
                    setJNama('');
                    setJDeskripsi('');
                  }}
                  className="text-[10px] text-rose-500 underline lowercase font-semibold ml-auto cursor-pointer"
                >
                  Batal Ubah
                </button>
              )}
            </h4>

            <form onSubmit={handleSaveJenis} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">KODE JENIS</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="e.g. SPEK"
                    value={jKode}
                    disabled={!!editingJenisId}
                    onChange={(e) => setJKode(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-205 text-xs font-mono font-bold text-slate-800 rounded disabled:bg-slate-100"
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-slate-500">NAMA JENIS ARSIP</label>
                  <input
                    type="text"
                    required
                    placeholder="Spesifikasi Teknis (KAK)"
                    value={jNama}
                    onChange={(e) => setJNama(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-205 text-xs font-bold text-slate-800 rounded focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">DESKRIPSI SIFAT KEARSIPAN</label>
                <input
                  type="text"
                  placeholder="Berkas pendukung berisi lampiran detail arsitektur infrastruktur IT..."
                  value={jDeskripsi}
                  onChange={(e) => setJDeskripsi(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-205 text-xs text-slate-600 rounded focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-white font-bold" />
                <span>{editingJenisId ? 'Simpan Perubahan Klasifikasi' : 'Daftarkan Jenis Arsip'}</span>
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
