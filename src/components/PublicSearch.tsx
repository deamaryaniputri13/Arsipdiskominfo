import React, { useState, useMemo } from 'react';
import { Search, Folder, FileText, Calendar, Lock, Eye, Download, Database, CheckCircle2, RotateCcw } from 'lucide-react';
import { ArsipDokumen, Bidang, JenisDokumen } from '../types';

interface PublicSearchProps {
  archives: ArsipDokumen[];
  departments: Bidang[];
  docTypes: JenisDokumen[];
  onViewDetails: (doc: ArsipDokumen) => void;
  isLoggedIn: boolean;
}

export default function PublicSearch({
  archives,
  departments,
  docTypes,
  onViewDetails,
  isLoggedIn
}: PublicSearchProps) {
  // Search parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('ALL');
  const [selectedJenis, setSelectedJenis] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');

  // Extract unique years
  const availableYears = useMemo(() => {
    const years = archives.map(a => a.tahun);
    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, [archives]);

  // Filter archives based on role & search filters
  const filteredArchives = useMemo(() => {
    return archives.filter(doc => {
      // 1. Role boundaries: Public visitors only see public documents
      if (!isLoggedIn && !doc.isPublic) {
        return false;
      }

      // 2. Query search
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = q === '' || 
        doc.namaDokumen.toLowerCase().includes(q) ||
        doc.nomorBerkas.toLowerCase().includes(q) ||
        doc.deskripsi.toLowerCase().includes(q) ||
        (doc.penerimaManfaat && doc.penerimaManfaat.toLowerCase().includes(q));

      // 3. Dropdown filters
      const matchBidang = selectedBidang === 'ALL' || doc.bidangId === selectedBidang;
      const matchJenis = selectedJenis === 'ALL' || doc.jenisId === selectedJenis;
      const matchYear = selectedYear === 'ALL' || doc.tahun.toString() === selectedYear;

      return matchQuery && matchBidang && matchJenis && matchYear;
    });
  }, [archives, searchQuery, selectedBidang, selectedJenis, selectedYear, isLoggedIn]);

  const stats = useMemo(() => {
    const total = archives.length;
    const publicCount = archives.filter(a => a.isPublic).length;
    const lockedCount = total - publicCount;
    return { total, publicCount, lockedCount };
  }, [archives]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedBidang('ALL');
    setSelectedJenis('ALL');
    setSelectedYear('ALL');
  };

  const hasActiveFilters = searchQuery !== '' || selectedBidang !== 'ALL' || selectedJenis !== 'ALL' || selectedYear !== 'ALL';

  return (
    <div className="space-y-6" id="public-search-container">
      
      {/* 📊 Simple Compact Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-slate-900">{stats.total}</div>
            <div className="text-[11px] text-slate-500 font-medium">Total Arsip</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-slate-900">{stats.publicCount}</div>
            <div className="text-[11px] text-slate-500 font-medium">Arsip Publik</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-slate-900">{stats.lockedCount}</div>
            <div className="text-[11px] text-slate-500 font-medium">Internal Terbatas</div>
          </div>
        </div>
      </div>

      {/* 🔍 Search & Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3">
        {/* Search input row */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari berkas... (contoh: 'Data Center', 'MoU', 'ARSIP/APT/...')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 text-slate-800 rounded-lg text-sm border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
              id="main-archive-search-input"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Filter Pills / Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Bidang */}
          <div className="relative">
            <select
              value={selectedBidang}
              onChange={(e) => setSelectedBidang(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Bidang</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>[{d.kode}] {d.nama}</option>
              ))}
            </select>
          </div>

          {/* Jenis */}
          <div className="relative">
            <select
              value={selectedJenis}
              onChange={(e) => setSelectedJenis(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Jenis Dokumen</option>
              {docTypes.map(t => (
                <option key={t.id} value={t.id}>[{t.kode}] {t.nama}</option>
              ))}
            </select>
          </div>

          {/* Tahun */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Tahun</option>
              {availableYears.map(year => (
                <option key={year} value={year}>Tahun {year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 📁 Document List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Daftar Berkas ({filteredArchives.length})
          </span>
          <span className="text-[11px] text-slate-400">
            {isLoggedIn ? 'Akses Pegawai' : 'Akses Publik'}
          </span>
        </div>

        {filteredArchives.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <div className="text-xs font-semibold text-slate-600">Tidak ada arsip yang cocok</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Coba gunakan kata kunci lain atau reset filter pencarian</div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredArchives.map((doc) => {
              const bCode = departments.find(d => d.id === doc.bidangId)?.kode || 'APT';
              const jName = docTypes.find(t => t.id === doc.jenisId)?.nama || 'Jenis';

              return (
                <div 
                  key={doc.id} 
                  className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    {/* Badges & Number */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                        {doc.nomorBerkas}
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                        {bCode}
                      </span>
                      {doc.isPublic ? (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                          Publik
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Terbatas
                        </span>
                      )}
                    </div>

                    {/* Document Title */}
                    <h3 
                      onClick={() => onViewDetails(doc)}
                      className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer leading-snug"
                    >
                      {doc.namaDokumen}
                    </h3>

                    {/* Metadata line */}
                    <div className="flex flex-wrap items-center gap-x-3 text-[11px] text-slate-400">
                      <span>{jName}</span>
                      <span>•</span>
                      <span>{doc.penerimaManfaat || 'Diskominfo'}</span>
                      <span>•</span>
                      <span>{new Date(doc.tanggalUpload).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>•</span>
                      <span className="font-mono">{doc.fileSize}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => onViewDetails(doc)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat</span>
                    </button>

                    {(doc.isPublic || isLoggedIn) && (
                      <button
                        onClick={() => {
                          alert(`Mengunduh berkas: ${doc.fileName}\nUkuran: ${doc.fileSize}`);
                        }}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all cursor-pointer"
                        title="Unduh Berkas"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
