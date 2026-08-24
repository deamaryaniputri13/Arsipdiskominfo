import React, { useState } from 'react';
import { X, Download, ShieldCheck, User, Calendar, FileText, Lock, Globe, HardDrive, Printer, CheckCircle, Award } from 'lucide-react';
import { ArsipDokumen, Bidang, JenisDokumen, getRomanMonth } from '../types';

interface DocumentModalProps {
  document: ArsipDokumen;
  departments: Bidang[];
  docTypes: JenisDokumen[];
  onClose: () => void;
  isLoggedIn: boolean;
}

export default function DocumentModal({
  document,
  departments,
  docTypes,
  onClose,
  isLoggedIn
}: DocumentModalProps) {
  const dept = departments.find(d => d.id === document.bidangId);
  const type = docTypes.find(t => t.id === document.jenisId);

  const [signatureVerified, setSignatureVerified] = useState(true);

  // Generate a mock SHA-256 digest for security showmanship
  const mockSHA256 = React.useMemo(() => {
    let hash = '';
    const chars = 'abcdef0123456789';
    for (let i = 0; i < 64; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
  }, [document.id]);

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" id="document-preview-modal">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-5xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
        
        {/* LEFT COLUMN: THE GOVT DOCUMENT PREVIEW STAGE (Simulated Paper) */}
        <div className="flex-1 bg-slate-100 p-6 sm:p-8 overflow-y-auto border-r border-slate-250 flex flex-col">
          
          {/* Virtual Top Bar Controls */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              <span className="text-xs font-mono font-bold text-slate-500 ml-1.5 truncate max-w-[200px] sm:max-w-none">
                PREVIEW_ENGINE: {document.fileName}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => window.print()}
                className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-all"
                title="Cetak Berkas"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={() => alert(`Sertifikat TTE terverifikasi pada BSrE Siber Negara.\n\nHash Dokumen: SHA-256\n${mockSHA256}`)}
                className="p-1.5 hover:bg-slate-200 text-teal-600 rounded-lg transition-all"
                title="Verifikasi Validitas Tanda Tangan"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* THE PAPER BODY WRAPPER */}
          <div className="flex-1 bg-cream-50 bg-[#faf9f6] text-slate-900 p-6 sm:p-10 rounded-lg shadow-inner border border-slate-300 relative select-none max-w-2xl mx-auto w-full min-h-[600px] flex flex-col justify-between font-serif">
            
            {/* Watermark badge (Only shown for sensitive internal) */}
            {!document.isPublic && (
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none overflow-hidden">
                <div className="text-slate-800 text-6xl font-bold font-sans rotate-45 border-8 border-dashed border-slate-800 p-10 tracking-widest text-center uppercase">
                  DOKUMEN INTERN<br/>RAHASIA NEGARA
                </div>
              </div>
            )}
            
            <div>
              {/* Garuda Emblem/Logo Header */}
              <div className="text-center space-y-1 pb-4 border-b-4 double border-double border-slate-850 font-sans">
                <div className="flex justify-center mb-1.5 gap-3 items-center">
                  <div className="w-11 h-11 bg-white border border-slate-200 p-1 rounded-full flex items-center justify-center shadow-3xs overflow-hidden">
                    <img src="/src/assets/images/diskominfo_banten_logo_1781770844817.jpg" className="w-9 h-9 object-contain" alt="Banten Logo" referrerPolicy="no-referrer" />
                  </div>
                  <div className="w-11 h-11 bg-slate-900 text-amber-400 p-2.5 rounded-full flex items-center justify-center shadow">
                    <span className="text-xs font-black tracking-widest font-serif text-[10px]">RI</span>
                  </div>
                </div>
                <h4 className="text-sm font-black tracking-widest uppercase text-slate-900">Pemerintah Provinsi Banten</h4>
                <h3 className="text-md font-black uppercase tracking-wide text-slate-800">Dinas Komunikasi, Informatika, Persandian dan Statistik</h3>
                <p className="text-[9px] text-slate-500 font-medium">KP3B Jl. Syeh Syam\'un, Curug, Kota Serang • Telp. (0254) 267001 • Email: diskominfo@bantenprov.go.id</p>
              </div>

              {/* Document Number Title metadata */}
              <div className="mt-8 text-center space-y-1">
                <h2 className="text-md font-bold uppercase tracking-wide underline font-serif">
                  {type?.nama || 'DOKUMEN NEGARA'}
                </h2>
                <p className="text-xs font-mono font-bold tracking-widest text-slate-700">
                  {document.nomorBerkas}
                </p>
                <p className="text-[10px] italic text-slate-400">
                  Sub-Sektor Klasifikasi: {dept?.nama || 'Aptika'}
                </p>
              </div>

              {/* Document Content */}
              <div className="mt-6 text-xs text-justify leading-relaxed space-y-4 font-serif">
                <p className="indent-8">
                  Menimbang dalam rangka mendukung digitalisasi layanan publik daerah serta optimalisasi struktur tata kelola kearsipan teknis di lingkungan Dinas Komunikasi dan Informatika Provinsi, maka didaftarkan surat arsip resmi dengan judul:
                </p>
                
                <div className="p-3 bg-slate-100/70 border border-slate-200 rounded font-sans text-xs font-bold text-slate-800">
                  “ {document.namaDokumen} ”
                </div>

                <p className="indent-8 text-slate-700">
                  <strong>Ringkasan Isi / Abstrak Berkas:</strong> {document.deskripsi}
                </p>

                <p className="indent-8">
                  Bahwa berkas ini disahkan demi kepentingan pelayanan administrasi terpadu dengan rincian penerima manfaat/mitra pendamping yang ditunjuk: <strong className="font-sans text-[11px] text-slate-800">{document.penerimaManfaat || 'Internal Diskominfo'}</strong>. Bilamana diperlukan penelusuran berkas fisik asli, koordinat diatur pada lemari manual kepegawaian: <strong className="underline text-slate-800">{document.lokasiArsipFisik || 'Gedung Arsip, No.10'}</strong>.
                </p>
              </div>
            </div>

            {/* Official Signature stamp with QR (Points TTE) */}
            <div className="mt-12 pt-6 border-t border-slate-250 flex flex-row items-end justify-between font-sans">
              <div className="text-[10px] space-y-1 text-slate-400">
                <span className="block">Keamanan Enkripsi ID:</span>
                <code className="block font-mono bg-slate-200/50 p-1 rounded max-w-[180px] truncate text-[9px] text-slate-600">
                  {mockSHA256}
                </code>
              </div>

              {/* Verified Badge Frame */}
              <div className="text-right space-y-1 shrink-0 text-xs">
                <p className="text-[10px] text-slate-500">Bandung, {new Date(document.tanggalUpload).toLocaleDateString('id', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                <p className="font-bold text-slate-800 text-[11px]">Kepala Seksi Dokumentasi Arsip</p>
                
                {signatureVerified ? (
                  <div className="inline-flex items-center gap-1.5 p-1.5 bg-teal-50 border border-teal-200 rounded-lg text-left mt-1.5">
                    {/* Simulated verified QR Code */}
                    <div className="w-10 h-10 bg-slate-800 p-1 flex items-center justify-center text-teal-400 font-mono text-[6px] rounded tracking-tighter select-none" title="Scan QR BSrE">
                      {/* Generates a representation of TTE certificate QR */}
                      [QR-TTE]<br/>CERTIFIED
                    </div>
                    <div className="text-[9px] leading-tight text-teal-900">
                      <span className="font-bold block text-[10px] text-teal-600">★ TTE Tersertifikasi</span>
                      Balai Sertifikasi Elektronik<br/>Siber Sandi Negara (BSrE)
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-rose-500 italic mt-6">Tanda Tangan Tidak Tersertifikasi</p>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: METADATA INFORMATION SIDEBAR */}
        <div className="w-full md:w-80 bg-slate-50 text-slate-800 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-200">
          <div className="space-y-6">
            
            {/* Close button & Status header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1 text-[10px] bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold border border-indigo-105">
                  Metadata Penyiaran
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-lg transition-all cursor-pointer"
                id="close-preview-modal-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Structured code details */}
            <div className="space-y-4">
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nomor Berkas Resmi</h4>
                <div className="mt-1.5 text-xs font-mono font-bold text-indigo-700 break-all bg-white p-3 rounded-xl border border-slate-200 shadow-3xs">
                  {document.nomorBerkas}
                </div>
              </div>

              {/* Parameters breakdowns */}
              <div className="grid grid-cols-2 gap-2.5 text-xs bg-white p-3 rounded-xl border border-slate-200 shadow-3xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Kode Bidang</span>
                  <span className="font-mono font-bold text-slate-700">{dept?.kode || 'APT'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Kode Jenis</span>
                  <span className="font-mono font-bold text-slate-700">{type?.kode || 'SPEK'}</span>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Bulan Romawi</span>
                  <span className="font-mono font-bold text-slate-700">{getRomanMonth(document.bulan)}</span>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Nomor Urut</span>
                  <span className="font-mono font-bold text-slate-700">#{document.noUrut}</span>
                </div>
              </div>

              {/* Detailed variables list represent security */}
              <div className="space-y-3.5 text-xs pt-2">
                <div className="flex items-start gap-2.5">
                  <User className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-[10px] block font-semibold leading-tight">Petugas Pengunggah</span>
                    <span className="font-semibold text-slate-705">{document.userName}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-indigo-605 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-[10px] block font-semibold leading-tight">Tanggal Digitalisasi</span>
                    <span className="font-semibold text-slate-705">
                      {new Date(document.tanggalUpload).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <HardDrive className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-[10px] block font-semibold leading-tight">Lokasi Brankas Fisik</span>
                    <span className="font-bold text-slate-705">{document.lokasiArsipFisik || 'Sub-gudang Utama'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-[10px] block font-semibold leading-tight">Tipe Kearsipan</span>
                    <span className={`font-bold ${document.statusVerifikasi === 'ARSIP_VITAL' ? 'text-rose-600' : 'text-indigo-600'}`}>
                      {document.statusVerifikasi === 'ARSIP_VITAL' ? '★ ARSIP VITAL NEGARA' : '✓ ARSIP TERVERIFIKASI'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Secure Hash block */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-205 text-[10px] font-mono text-slate-500 space-y-1 shadow-3xs">
              <span className="text-indigo-700 font-bold block bg-indigo-50 px-1.5 py-0.5 rounded text-[8px] tracking-wider uppercase mb-1">
                ENKRIPSI FILE PATH (POINT 5)
              </span>
              <div className="break-all leading-tight text-slate-600">
                PATH_ENC: {document.filePath}
              </div>
              <p className="text-[9px] text-slate-405 italic leading-snug pt-1">
                Nama asli disamarkan secara acak pada ruang penyimpanan awan demi perlindungan data.
              </p>
            </div>

          </div>

          <div className="space-y-2 pt-4 border-t border-slate-200">
            {/* View document check or direct download */}
            {(document.isPublic || isLoggedIn) ? (
              <button
                onClick={() => {
                  alert(`Sertifikat Keaslian Valid!\nMendownload Berkas: ${document.fileName}\nUkuran: ${document.fileSize}`);
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File PDF Terenkripsi</span>
              </button>
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-100/60 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <Lock className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <p>
                  Kerja sama kepegawaian terbatas. Silakan login ke portal staf atau admin untuk mengunduh dokumen ini.
                </p>
              </div>
            )}
            
            <p className="text-[9px] text-center text-slate-400">
              Copyright © 2026 Diskominfo Provinsi • Biro Kearsipan Terpadu
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
