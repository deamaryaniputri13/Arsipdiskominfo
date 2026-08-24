/**
 * Type declarations and initial database definitions for Diskominfo Archive App.
 */

export type UserRole = 'ADMIN' | 'STAFF' | 'PUBLIC';

export interface User {
  id: string;
  name: string;
  nip: string;
  role: UserRole;
  password?: string;
  bidangId?: string; // If binding to a department
  avatar?: string;
}

export interface Bidang {
  id: string;
  kode: string; // e.g. 'APT', 'INF', 'IKP', 'PSD'
  nama: string; // e.g. 'Aplikasi & Informatika', 'Infrastruktur & Jaringan', 'Informasi & Komunikasi Publik', 'Persandian & Keamanan Informasi'
  deskripsi: string;
}

export interface JenisDokumen {
  id: string;
  kode: string; // e.g. 'SPEK', 'BAST', 'SK', 'MOU', 'DOK'
  nama: string; // e.g. 'Spesifikasi Teknis', 'Berita Acara Serah Terima', 'Surat Keputusan', 'Memorandum of Understanding', 'Dokumentasi Sistem'
  deskripsi: string;
}

export interface ArsipDokumen {
  id: string;
  nomorBerkas: string; // Format: ARSIP/[KODE-BIDANG]/[KODE-JENIS]/[BULAN-ROMAWI]/[TAHUN]/[NO-URUT]
  namaDokumen: string;
  deskripsi: string;
  bidangId: string;
  jenisId: string;
  tahun: number;
  bulan: number; // 1-12
  noUrut: string; // e.g. "0042"
  filePath: string; // Virtual path
  fileName: string; // Real or virtual file name
  fileSize: string; // Human readable size (e.g., '2.4 MB')
  tanggalUpload: string; // ISO date string
  userId: string; // Uploaded by
  userName: string; // Uploaded by name
  isPublic: boolean; // Whether public can search/preview it
  statusVerifikasi: 'DRAFT' | 'TERVERIFIKASI' | 'ARSIP_VITAL';
  penerimaManfaat?: string; // Vendor name, third-party, or internal
  lokasiArsipFisik?: string; // Physical cabinet/box reference
}

export interface AktivitasLog {
  id: string;
  tanggal: string;
  userName: string;
  userRole: UserRole;
  aksi: 'UNGGAH_ARSIP' | 'UBAH_ARSIP' | 'HAPUS_ARSIP' | 'UNDUH_ARSIP' | 'LIHAT_ARSIP' | 'UBAH_MASTER' | 'LOGIN' | 'VERIFIKASI';
  detail: string;
  ipAddress: string;
}

// Initial mockup data to populate our application instantly
export const INITIAL_BIDANG: Bidang[] = [
  {
    id: 'b1',
    kode: 'APT',
    nama: 'Aplikasi Informatika (Aptika)',
    deskripsi: 'Pengembangan perangkat lunak, sistem administrasi, domain, dan integrasi e-Government.'
  },
  {
    id: 'b2',
    kode: 'INF',
    nama: 'Infrastruktur & Jaringan',
    deskripsi: 'Penyediaan bandwidth, data center, penataan FO fiber-optic, dan konektivitas OPD.'
  },
  {
    id: 'b3',
    kode: 'IKP',
    nama: 'Informasi & Komunikasi Publik',
    deskripsi: 'Diseminasi informasi daerah, hubungan media massa, dokumentasi rilis pers, dan PPID.'
  },
  {
    id: 'b4',
    kode: 'PSD',
    nama: 'Persandian & Keamanan Siber',
    deskripsi: 'Pengamanan sandi negara, sertifikat elektronik (TTE), audit keamanan sistem, dan insiden response.'
  }
];

export const INITIAL_JENIS: JenisDokumen[] = [
  {
    id: 'j1',
    kode: 'SPEK',
    nama: 'Spesifikasi Teknis (KAK)',
    deskripsi: 'Dokumen Kerangka Acuan Kerja (KAK) dan rincian spek teknis perangkat keras/lunak.'
  },
  {
    id: 'j2',
    kode: 'BAST',
    nama: 'Berita Acara Serah Terima',
    deskripsi: 'Bukti serah terima pekerjaan dari pihak ketiga/vendor kepada Pejabat Pembuat Komitmen.'
  },
  {
    id: 'j3',
    kode: 'SK',
    nama: 'Surat Keputusan (SK/Technical)',
    deskripsi: 'SK Tim Teknis, SK Tim Keamanan Siber, atau Surat Keputusan Kelayakan Layanan.'
  },
  {
    id: 'j4',
    kode: 'MOU',
    nama: 'Memory of Understanding / PKS',
    deskripsi: 'Perjanjian Kerja Sama antardinas, vendor, lembaga negara, atau penyedia infrastruktur.'
  },
  {
    id: 'j5',
    kode: 'DOK',
    nama: 'Dokumentasi Sistem & Topologi',
    deskripsi: 'Manual book aplikasi, diagram topologi jaringan, blueprint sistem arsitektur.'
  }
];

export const INTIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'Ir. Ahmad Subagyo, M.Kom',
    nip: '197410052002121004',
    role: 'ADMIN',
    password: 'admin',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u2',
    name: 'Dea maryani Putri, S.ST',
    nip: '198902142015032001',
    role: 'STAFF',
    bidangId: 'b1',
    password: 'staf',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u3',
    name: 'Pratama Yuniarto, S.Kom',
    nip: '199211232019011003',
    role: 'STAFF',
    bidangId: 'b2',
    password: 'staf',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_ARSIP: ArsipDokumen[] = [
  {
    id: 'a1',
    nomorBerkas: 'ARSIP/APT/DOK/I/2026/0001',
    namaDokumen: 'Aplikasi Portal Layanan Publik Terpadu (Jawa Barat Juara)',
    deskripsi: 'Dokumentasi arsitektur microservices sistem single sign-on (SSO) untuk seluruh aplikasi kedinasan Jawa Barat.',
    bidangId: 'b1',
    jenisId: 'j5',
    tahun: 2026,
    bulan: 1,
    noUrut: '0001',
    filePath: 'dokumen/apt/sso-portal-2026.pdf',
    fileName: 'SSO_Portal_Arsitektur_Technical_v1.2.pdf',
    fileSize: '4.8 MB',
    tanggalUpload: '2026-01-14T09:30:00Z',
    userId: 'u2',
    userName: 'Wulan Lestari, S.ST',
    isPublic: true,
    statusVerifikasi: 'ARSIP_VITAL',
    penerimaManfaat: 'Internal Pemerintah Provinsi',
    lokasiArsipFisik: 'Lemari A, Rak 2, Box Aptika-01'
  },
  {
    id: 'a2',
    nomorBerkas: 'ARSIP/INF/SPEK/II/2026/0002',
    namaDokumen: 'KAK Pengadaan Core Bandwidth & Backup Link internet OPD 10Gbps',
    deskripsi: 'Spesifikasi KAK teknis untuk pengadaan layanan bandwidth internet serat optik (Fiber Optic) sebesar 10Gbps yang didistribusikan ke 34 Kantor Dinas Daerah.',
    bidangId: 'b2',
    jenisId: 'j1',
    tahun: 2026,
    bulan: 2,
    noUrut: '0002',
    filePath: 'dokumen/inf/kak-bandwidth-10g.pdf',
    fileName: 'KAK_Bandwidth_10Gbps_OPD_Final.pdf',
    fileSize: '2.3 MB',
    tanggalUpload: '2026-02-20T14:15:00Z',
    userId: 'u3',
    userName: 'Pratama Yuniarto, S.Kom',
    isPublic: false,
    statusVerifikasi: 'TERVERIFIKASI',
    penerimaManfaat: 'Penyedia Cloud & Jaringan (PT Indolink)',
    lokasiArsipFisik: 'Lemari Jaringan, Rak 4, Box Jaringan-09'
  },
  {
    id: 'a3',
    nomorBerkas: 'ARSIP/PSD/SK/III/2026/0003',
    namaDokumen: 'SK Penetapan Incident Response Team (Diskominfo-CSIRT) 2026',
    deskripsi: 'Daftar personil, pembagian shift kerja, koordinasi lintas sektor, dan daftar penanganan tanggap darurat insiden siber pada server OPD.',
    bidangId: 'b4',
    jenisId: 'j3',
    tahun: 2026,
    bulan: 3,
    noUrut: '0003',
    filePath: 'dokumen/psd/sk-csirt-2026.pdf',
    fileName: 'SK_Gubernur_Diskominfo_CSIRT_2026_Signed.pdf',
    fileSize: '1.2 MB',
    tanggalUpload: '2026-03-05T10:00:00Z',
    userId: 'u1',
    userName: 'Ir. Ahmad Subagyo, M.Kom',
    isPublic: true,
    statusVerifikasi: 'ARSIP_VITAL',
    penerimaManfaat: 'Tim Keamanan Diskominfo',
    lokasiArsipFisik: 'Lemari Sandi Rahasia, Brankas 02'
  },
  {
    id: 'a4',
    nomorBerkas: 'ARSIP/IKP/MOU/IV/2026/0004',
    namaDokumen: 'Perjanjian Kerja Sama Diseminasi Konten Siaran Publik TVRI',
    deskripsi: 'Nota kesepahaman program tayangan e-Gov, publikasi program kesejahteraan sosial daerah, dan penayangan agenda dinas gubernur Jawa Barat tahun 2026.',
    bidangId: 'b3',
    jenisId: 'j4',
    tahun: 2026,
    bulan: 4,
    noUrut: '0004',
    filePath: 'dokumen/ikp/mou-tvri-2026.pdf',
    fileName: 'MoU_PKS_TVRI_Publikasi_Daerah_2026.pdf',
    fileSize: '3.1 MB',
    tanggalUpload: '2026-04-18T16:45:00Z',
    userId: 'u2',
    userName: 'Wulan Lestari, S.ST',
    isPublic: true,
    statusVerifikasi: 'TERVERIFIKASI',
    penerimaManfaat: 'Lembaga Penyiaran Publik TVRI',
    lokasiArsipFisik: 'Lemari Humas & PPID, Rak 1'
  },
  {
    id: 'a5',
    nomorBerkas: 'ARSIP/APT/BAST/V/2026/0005',
    namaDokumen: 'BAST Pekerjaan Migrasi Data Center OPD ke Pusat Data Nasional (PDN)',
    deskripsi: 'Laporan penyelesaian pekerjaan migrasi database dan backend aplikasi kependudukan ke cloud PDN, lengkap dengan hasil load test dan backup hash SHA-256.',
    bidangId: 'b1',
    jenisId: 'j2',
    tahun: 2026,
    bulan: 5,
    noUrut: '0005',
    filePath: 'dokumen/apt/bast-pdn-migration.pdf',
    fileName: 'BAST_Migrasi_Cloud_PDN_Tahap2_Signed.pdf',
    fileSize: '5.6 MB',
    tanggalUpload: '2026-05-30T11:20:00Z',
    userId: 'u2',
    userName: 'Wulan Lestari, S.ST',
    isPublic: false,
    statusVerifikasi: 'TERVERIFIKASI',
    penerimaManfaat: 'Pihak Ketiga & Kementerian Kominfo RI',
    lokasiArsipFisik: 'Lemari A, Rak 3, Box Aptika-02'
  },
  {
    id: 'a6',
    nomorBerkas: 'ARSIP/INF/DOK/VI/2026/0006',
    namaDokumen: 'Peta Topologi Jaringan Fiber Optic Ring Pemprov & Titik Distribusi FO',
    deskripsi: 'Peta jaringan serat optik sepanjang 50KM yang menghubungkan kompleks Gedung Sate dengan Kantor Perwakilan Rakyat Daerah dan Dinas Teknis Luar Kompleks.',
    bidangId: 'b2',
    jenisId: 'j5',
    tahun: 2026,
    bulan: 6,
    noUrut: '0006',
    filePath: 'dokumen/inf/fo-topology-map.pdf',
    fileName: 'Ring_Topology_FiberOptic_Provinsi_2026.pdf',
    fileSize: '8.4 MB',
    tanggalUpload: '2026-06-12T08:50:00Z',
    userId: 'u3',
    userName: 'Pratama Yuniarto, S.Kom',
    isPublic: false,
    statusVerifikasi: 'ARSIP_VITAL',
    penerimaManfaat: 'Sub-Bagian Tata Usaha Infrastruktur',
    lokasiArsipFisik: 'Lemari Jaringan, Rak 5 (Besar), Map Gantung FO-11'
  }
];

export const INITIAL_LOGS: AktivitasLog[] = [
  {
    id: 'l1',
    tanggal: '2026-06-17T09:00:00Z',
    userName: 'Ir. Ahmad Subagyo, M.Kom',
    userRole: 'ADMIN',
    aksi: 'LOGIN',
    detail: 'Pengguna melakukan login sistem melalui portal kepegawaian Diskominfo.',
    ipAddress: '10.252.12.98'
  },
  {
    id: 'l2',
    tanggal: '2026-06-17T10:15:00Z',
    userName: 'Wulan Lestari, S.ST',
    userRole: 'STAFF',
    aksi: 'UNGGAH_ARSIP',
    detail: 'Mengunggah Berkas BAST Migrasi Data Center OPD ke PDN (ARSIP/APT/BAST/V/2026/0005).',
    ipAddress: '10.252.14.120'
  },
  {
    id: 'l3',
    tanggal: '2026-06-17T11:42:00Z',
    userName: 'Pratama Yuniarto, S.Kom',
    userRole: 'STAFF',
    aksi: 'UNGGAH_ARSIP',
    detail: 'Mengunggah topologi Jaringan Fiber Optic Ring Pemprov (ARSIP/INF/DOK/VI/2026/0006).',
    ipAddress: '10.252.15.5'
  },
  {
    id: 'l4',
    tanggal: '2026-06-17T13:10:00Z',
    userName: 'Ir. Ahmad Subagyo, M.Kom',
    userRole: 'ADMIN',
    aksi: 'VERIFIKASI',
    detail: 'Melakukan sertifikasi dan penetapan status "ARSIP_VITAL" pada berkas topologi jaringan FO.',
    ipAddress: '10.252.12.98'
  }
];

export function getRomanMonth(monthNum: number): string {
  const romanMap = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  return romanMap[monthNum - 1] || 'I';
}
