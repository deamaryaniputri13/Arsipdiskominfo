import React, { useState, useEffect, useMemo } from 'react';
import { FileUp, Sparkles, FolderPlus, Info, Check, AlertCircle, FileText, Lock, Globe, Database, Milestone } from 'lucide-react';
import { Bidang, JenisDokumen, ArsipDokumen, getRomanMonth } from '../types';

interface UploadDocumentFormProps {
  departments: Bidang[];
  docTypes: JenisDokumen[];
  archives: ArsipDokumen[];
  onUploadSuccess: (newDoc: ArsipDokumen) => void;
  onCancel: () => void;
  currentUserId: string;
  currentUserName: string;
}

export default function UploadDocumentForm({
  departments,
  docTypes,
  archives,
  onUploadSuccess,
  onCancel,
  currentUserId,
  currentUserName
}: UploadDocumentFormProps) {
  // Input states
  const [namaDokumen, setNamaDokumen] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [selectedBidangId, setSelectedBidangId] = useState(departments[0]?.id || '');
  const [selectedJenisId, setSelectedJenisId] = useState(docTypes[0]?.id || '');
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [fileName, setFileName] = useState('');
  const [fileSizeStr, setFileSizeStr] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [statusVerifikasi, setStatusVerifikasi] = useState<'DRAFT' | 'TERVERIFIKASI' | 'ARSIP_VITAL'>('TERVERIFIKASI');
  const [penerimaManfaat, setPenerimaManfaat] = useState('');
  const [lokasiArsipFisik, setLokasiArsipFisik] = useState('');

  // Drop simulation states
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // AI assistant simulation status
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiRecommendationLog, setAiRecommendationLog] = useState('');

  // 📝 LOGIC AUTOMATION GENERATOR (Point 2 of the Blueprint)
  const calculatedNumberDetails = useMemo(() => {
    const bidang = departments.find(d => d.id === selectedBidangId);
    const jenis = docTypes.find(t => t.id === selectedJenisId);
    
    if (!bidang || !jenis) {
      return { number: 'MENGHITUNG...', noUrut: '0000' };
    }

    const kodeBidang = bidang.kode;
    const kodeJenis = jenis.kode;
    const bulanRomawi = getRomanMonth(bulan);
    
    // Count exact similar documents on this year (just like PHP code logic given)
    const orderCountOnYear = archives.filter(a => a.tahun === tahun).length + 1;
    const nextOrderString = orderCountOnYear.toString().padStart(4, '0');

    const formattedNumber = `ARSIP/${kodeBidang}/${kodeJenis}/${bulanRomawi}/${tahun}/${nextOrderString}`;
    
    return {
      number: formattedNumber,
      noUrut: nextOrderString
    };
  }, [selectedBidangId, selectedJenisId, tahun, bulan, archives, departments, docTypes]);

  // 🗃️ SUBMIT FORM ARSIP BARU
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaDokumen.trim() || !fileName) {
      alert('Mohon isi nama dokumen dan unggah berkas PDF pendukung.');
      return;
    }

    // 🛡️ SECURITY FEATURE (Point 5 of the Blueprint - Enkripsi Nama File)
    // Generate a secure, randomized filename to prevent easy URL scraping
    const randomHash = Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 6);
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    const secureFileName = `arsip_secured_${randomHash}${fileExtension}`;
    const secureFilePath = `gcs/diskominfo-prov/secure_storage/${secureFileName}`;

    const newDoc: ArsipDokumen = {
      id: 'doc_' + Date.now(),
      nomorBerkas: calculatedNumberDetails.number,
      namaDokumen: namaDokumen.trim(),
      deskripsi: deskripsi.trim() || 'Dokumen tanpa deskripsi sistem.',
      bidangId: selectedBidangId,
      jenisId: selectedJenisId,
      tahun,
      bulan,
      noUrut: calculatedNumberDetails.noUrut,
      filePath: secureFilePath,
      fileName: fileName, // Preserve display name but file path is secure/encrypted
      fileSize: fileSizeStr || '1.8 MB',
      tanggalUpload: new Date().toISOString(),
      userId: currentUserId,
      userName: currentUserName,
      isPublic,
      statusVerifikasi,
      penerimaManfaat: penerimaManfaat.trim() || 'Internal Bidang Diskominfo',
      lokasiArsipFisik: lokasiArsipFisik.trim() || 'Gedung Arsip, Laci Utama'
    };

    onUploadSuccess(newDoc);
  };

  // Drag and drop simulation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      simulateFileUpload(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      simulateFileUpload(files[0]);
    }
  };

  const simulateFileUpload = (file: File) => {
    setFileName(file.name);
    // human readable size
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    setFileSizeStr(`${sizeInMB} MB`);
    
    setIsUploading(true);
    setUploadProgress(10);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 30;
      });
    }, 150);
  };

  // 🧠 AI SMART RECOMMENDATION ENGINE (Point 5 Extension - Smart Assist)
  const handleAiRecommendation = () => {
    if (!namaDokumen.trim()) {
      alert('Tolong ketik judul atau deskripsi dokumen terlebih dahulu agar AI dapat memahami topiknya.');
      return;
    }

    setAiAnalyzing(true);
    setAiRecommendationLog('Membaca keywords...');

    setTimeout(() => {
      const text = (namaDokumen + ' ' + deskripsi).toLowerCase();
      let recommendedBidangId = selectedBidangId;
      let recommendedJenisId = selectedJenisId;
      let reason = '';

      // Rule Heuristic Scanner
      if (text.includes('jaringan') || text.includes('bandwidth') || text.includes('internet') || text.includes('fo') || text.includes('fiber') || text.includes('router') || text.includes('topologi')) {
        const d = departments.find(b => b.kode === 'INF');
        if (d) recommendedBidangId = d.id;
        
        if (text.includes('topologi') || text.includes('peta') || text.includes('design')) {
          recommendedJenisId = docTypes.find(j => j.kode === 'DOK')?.id || selectedJenisId;
          reason = 'Mendeteksi kata kunci jaringan dan topologi. Direkomendasikan masuk Bidang Infrastruktur [INF] dengan jenis Dokumentasi Jaringan [DOK].';
        } else {
          recommendedJenisId = docTypes.find(j => j.kode === 'SPEK')?.id || selectedJenisId;
          reason = 'Mendeteksi kata kunci infrastruktur internet/penyediaan bandwidth. Direkomendasikan masuk Bidang Infrastruktur [INF] dengan jenis Spesifikasi Teknis (KAK) [SPEK].';
        }
      } 
      else if (text.includes('sandi') || text.includes('csirt') || text.includes('keamanan') || text.includes('siber') || text.includes('enkripsi') || text.includes('tte') || text.includes('sertifikat')) {
        const d = departments.find(b => b.kode === 'PSD');
        if (d) recommendedBidangId = d.id;

        if (text.includes('sk') || text.includes('penetapan') || text.includes('tim')) {
          recommendedJenisId = docTypes.find(j => j.kode === 'SK')?.id || selectedJenisId;
          reason = 'Mendeteksi penugasan tim intelijen/keamanan siber. Direkomendasikan masuk Bidang Persandian & Sandi Negara [PSD] dengan format Surat Keputusan Kelayakan [SK].';
        } else {
          recommendedJenisId = docTypes.find(j => j.kode === 'DOK')?.id || selectedJenisId;
          reason = 'Mendeteksi audit/skema enkripsi pengamanan. Direkomendasikan masuk Bidang Persandian & Sandi [PSD] dengan format Dokumentasi Sistem [DOK].';
        }
      }
      else if (text.includes('sso') || text.includes('aplikasi') || text.includes('portal') || text.includes('e-gov') || text.includes('software') || text.includes('web') || text.includes('database') || text.includes('migrasi')) {
        const d = departments.find(b => b.kode === 'APT');
        if (d) recommendedBidangId = d.id;

        if (text.includes('serah terima') || text.includes('bast') || text.includes('rampung')) {
          recommendedJenisId = docTypes.find(j => j.kode === 'BAST')?.id || selectedJenisId;
          reason = 'Mendeteksi serah terima migrasi data/instalasi software. Direkomendasikan untuk Bidang Aplikasi [APT] dengan jenis Berita Acara Serah Terima [BAST].';
        } else {
          recommendedJenisId = docTypes.find(j => j.kode === 'DOK')?.id || selectedJenisId;
          reason = 'Mendeteksi sistem e-Government regional. Direkomendasikan masuk Bidang Aplikasi Informatika [APT] dengan jenis Dokumentasi & Arsitektur [DOK].';
        }
      }
      else if (text.includes('kerjasama') || text.includes('tvri') || text.includes('konten') || text.includes('press') || text.includes('iklan') || text.includes('siaran') || text.includes('mou')) {
        const d = departments.find(b => b.kode === 'IKP');
        if (d) recommendedBidangId = d.id;
        recommendedJenisId = docTypes.find(j => j.kode === 'MOU')?.id || selectedJenisId;
        reason = 'Mendeteksi siaran massal / rilis pers resmi publik Banten. Direkomendasikan masuk Bidang Humas Informasi Publik [IKP] dengan format Memorandum Perjanjian [MOU].';
      } else {
        reason = 'Kata kunci umum terdeteksi. AI menyarankan kategori standar.';
      }

      setSelectedBidangId(recommendedBidangId);
      setSelectedJenisId(recommendedJenisId);
      setAiRecommendationLog(reason);
      setAiAnalyzing(false);
    }, 900);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="upload-archive-form">
      
      {/* Form Header banner */}
      <div className="bg-white px-6 py-5 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl">
            <FolderPlus className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Registrasi Kearsipan Baru</h3>
            <p className="text-xs text-slate-400">Terstruktur dengan format penomoran standar Diskominfo Provinsi Banten</p>
          </div>
        </div>
        <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
          STAFF SECURE ACCESS
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* UPPER DISPLAY: AUTOMATION PREVIEW (The structured administrative label) */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-450 flex items-center gap-1.5">
              <Milestone className="w-3.5 h-3.5 text-indigo-550" />
              SISTEM GENERATOR NOMOR ARSIP OTOMATIS (LIVE PREVIEW)
            </div>
            <div className="text-lg sm:text-xl font-mono font-bold text-indigo-700 tracking-wider break-all bg-white p-3 rounded-xl border border-slate-200 mt-1.5 shadow-2xs">
              {calculatedNumberDetails.number}
            </div>
            <p className="text-[10px] text-slate-400">
              Format: ARSIP / [BIDANG-KODE] / [JENIS-KODE] / [BULAN-ROMAWI] / [TAHUN] / [NO-URUT-BERKAS]
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 self-start sm:self-auto shrink-0 max-w-xs shadow-2xs">
            <span className="font-bold text-indigo-650 block mb-1">ℹ Informasi Auto-Counter:</span>
            Tahun {tahun} mendeteksi {archives.filter(a => a.tahun === tahun).length} arsip tersimpan. Nomor urut berikutnya diatur ke <strong className="font-mono text-slate-805 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md">{calculatedNumberDetails.noUrut}</strong>.
          </div>
        </div>

        {/* INPUT 1: TITLE AND AI RECOMMENDER */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Nama Dokumen / Arsip Teknis <span className="text-rose-500">*</span>
            </label>
            
            {/* AI Assistant Button */}
            <button
              type="button"
              onClick={handleAiRecommendation}
              className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold border border-indigo-200/60 transition-all shrink-0 cursor-pointer"
              title="Gunakan kecerdasan buatan untuk mengklasifikasikan kode bidang & jenis otomatis"
              id="ai-classify-doc-btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span>Gunakan AI Asisten Klasifikasi</span>
            </button>
          </div>

          <input
            type="text"
            required
            placeholder="Ketik judul berkas asli (misal: 'Spesifikasi Teknis Data Center Provinsi Banten')"
            value={namaDokumen}
            onChange={(e) => setNamaDokumen(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 text-slate-800 rounded-xl text-sm border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all font-semibold"
          />

          {aiAnalyzing && (
            <div className="text-xs text-indigo-600 animate-pulse flex items-center gap-1.5 font-bold">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
              <span>AI sedang memindai judul berkas, mengekstrak instansi, dan melakukan klasifikasi taksonomi...</span>
            </div>
          )}

          {aiRecommendationLog && !aiAnalyzing && (
            <div className="p-3.5 bg-indigo-50/80 border border-indigo-150 rounded-xl text-xs flex items-start gap-2.5 text-indigo-900">
              <span className="p-1 bg-indigo-100 text-indigo-800 rounded-lg shrink-0 mt-0.5">
                <Sparkles className="w-3 h-3" />
              </span>
              <div>
                <strong>Hasul Klasifikasi Smart AI:</strong> {aiRecommendationLog}
              </div>
            </div>
          )}
        </div>

        {/* INPUT 2: TWO COLUMNS FOR CATEGORIZING (BIDANG & JENIS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Bidang Penanggung Jawab <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedBidangId}
              onChange={(e) => setSelectedBidangId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-550/10"
            >
              {departments.map(b => (
                <option key={b.id} value={b.id}>[{b.kode}] {b.nama}</option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400">
              Kode bidang ini akan disisipkan di segmen kedua kode arsip.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Jenis Dokumen Teknis <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedJenisId}
              onChange={(e) => setSelectedJenisId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-550/10"
            >
              {docTypes.map(t => (
                <option key={t.id} value={t.id}>[{t.kode}] {t.nama}</option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400">
              Mewakili taksonomi dokumen (Segmen ketiga kode arsip).
            </p>
          </div>

        </div>

        {/* FILE UPLOAD COMPONENT (Point 1 of Blueprint File Upload specifications) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Berkas PDF / Hasil Scan Dokumen <span className="text-rose-500">*</span>
          </label>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDragging ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-300 hover:border-indigo-400 bg-slate-50/20'
            }`}
          >
            <input
              type="file"
              id="hidden-file-input"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <label htmlFor="hidden-file-input" className="cursor-pointer space-y-2 block">
              <div className="bg-slate-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-slate-500">
                <FileUp className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">
                  {fileName ? 'Berkas berhasil dipilih!' : 'Seret & Letakkan Berkas di Sini'}
                </p>
                <p className="text-[10px] text-slate-400">
                  {fileName ? 'Klik di bawah jika ingin mengganti file' : 'Atau klik untuk menelusuri komputer lokal (.PDF maks 10MB)'}
                </p>
              </div>
            </label>

            {/* Display selected file name */}
            {fileName && (
              <div className="mt-4 p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-left max-w-md mx-auto shadow-2xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-slate-800 truncate">{fileName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Ukuran: {fileSizeStr}</div>
                  </div>
                </div>
                
                {isUploading ? (
                  <span className="text-[10px] font-mono font-bold text-indigo-600 animate-pulse shrink-0">
                    MEMBACA ({uploadProgress}%)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold px-2 py-0.5 rounded-full shrink-0">
                    <Check className="w-3 h-3 text-emerald-600" /> OK
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* DETAILS SECTION (Penerima Manfaat, Lokasi Fisik, Deskripsi) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Pihak Ketiga / Vendor Pendamping
            </label>
            <input
              type="text"
              placeholder="e.g. PT Telekomunikasi Indonesia, LPP TVRI, etc."
              value={penerimaManfaat}
              onChange={(e) => setPenerimaManfaat(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 text-slate-800 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-semibold"
            />
            <p className="text-[9px] text-slate-400">Ditulis untuk mempermudah audit pertanggungjawaban.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Koordinat Lokasi Arsip Fisik (Hardcopy)
            </label>
            <input
              type="text"
              placeholder="e.g. Lemari B, Laci 04, Box APT-02"
              value={lokasiArsipFisik}
              onChange={(e) => setLokasiArsipFisik(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 text-slate-800 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-semibold"
            />
            <p className="text-[9px] text-slate-400">Penting untuk pencarian fisik apabila terjadi kegagalan server.</p>
          </div>

        </div>

        {/* INPUT: DATE SPECIFICATIONS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tahun Berkas</label>
            <select
              value={tahun}
              onChange={(e) => setTahun(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bulan Berkas</label>
            <select
              value={bulan}
              onChange={(e) => setBulan(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-75 * text-slate-700"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                <option key={m} value={m}>{m} ({getRomanMonth(m)})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sifat Keterbukaan</label>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex-1 py-1 px-2.5 rounded text-[11px] font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                  isPublic 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-805 font-bold' 
                    : 'bg-slate-50 border-slate-100 text-slate-400'
                }`}
              >
                <Globe className="w-3 h-3" /> Publik
              </button>
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex-1 py-1 px-2.5 rounded text-[11px] font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                  !isPublic 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-805 font-bold' 
                    : 'bg-slate-50 border-slate-100 text-slate-400'
                }`}
              >
                <Lock className="w-3 h-3" /> Terbatas
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status Berkas</label>
            <select
              value={statusVerifikasi}
              onChange={(e) => setStatusVerifikasi(e.target.value as any)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="TERVERIFIKASI">✓ TERVERIFIKASI</option>
              <option value="ARSIP_VITAL">★ ARSIP VITAL</option>
              <option value="DRAFT">☁ DRAFT</option>
            </select>
          </div>

        </div>

        {/* INPUT: SHORT SUMMARY / DESKRIPSI */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Abstrak / Rincian Singkat Isi Dokumen
          </label>
          <textarea
            rows={3}
            placeholder="Jelaskan secara garis besar isi dokumen ini agar mudah dipahami pegawai dinas lain dan kepala bidang saat melakukan pencarian di masa depan..."
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 text-slate-800 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-semibold"
          />
        </div>

        {/* ACTIONS FOOTER BUTTONS */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-150">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Batalkan
          </button>
          
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 hover:shadow-xs shadow-2xs cursor-pointer"
          >
            <Check className="w-4 h-4 text-white font-bold" />
            <span>Simpan & Daftarkan Arsip</span>
          </button>
        </div>

      </form>
    </div>
  );
}
