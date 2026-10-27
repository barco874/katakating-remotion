/**
 * Content taken verbatim from the KATAKATING website reference screenshots
 * (home, MENU PANDUAN, UPLOAD MENU, thebrain). Do not invent entries here:
 * everything on screen that claims to be site content comes from this file.
 */

export type Note = {
  readonly code: string;
  readonly index: string;
  readonly title: string;
  readonly author: string;
  readonly category: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly minutes: number;
};

export const NOTES = {
  aicl: {
    code: "AICL",
    index: "#06",
    title: "AI Chat vs AI CLI: Alat Paling Powerful untuk Mahasiswa Teknologi & Software",
    author: "Faris Aghna",
    category: "Algoritma & Pem…",
    description:
      "Panduan komparasi lengkap AI chat vs AI CLI coding agent untuk mahasiswa: instalasi, alur kerja, etika belajar…",
    tags: ["algoritma", "ai", "cli"],
    minutes: 8,
  },
  flut: {
    code: "FLUT",
    index: "#07",
    title: "Panduan Lengkap Install Flutter & Android SDK Headless via Terminal di Windows (Tanpa Android Studio)",
    author: "Mu'adz Hudzaifah",
    category: "Web & Tool…",
    description:
      "Panduan instalasi Flutter SDK dan Android Command-Line Tools (cmdline-tools & adb) secara headless murni via…",
    tags: ["flutter", "dart", "android"],
    minutes: 12,
  },
  wsl: {
    code: "WSL",
    index: "#08",
    title: "Setup Lengkap WSL2 Ubuntu 24.04 untuk Web Development",
    author: "Mu'adz Hudzaifah",
    category: "Web & Tool…",
    description:
      "Panduan instalasi dan konfigurasi native Linux kernel di Windows menggunakan WSL2 untuk kebutuhan praktiku…",
    tags: ["linux", "wsl2", "ubuntu"],
    minutes: 6,
  },
  margin: {
    code: "4433",
    index: "#09",
    title: "Standar Baku Format Margin Laporan Praktikum & TA (4-4-3-3)",
    author: "Tim KataKating",
    category: "Akademik & L…",
    description:
      "Panduan tata letak layout dokumen akademik Universitas Boash. Aturan margin 4-4-3-3, pemisahan nomor roma…",
    tags: ["akademik", "laporan", "word"],
    minutes: 5,
  },
  vlan: {
    code: "VLAN",
    index: "#10",
    title: "Konfigurasi Inter-VLAN Routing & Trunking pada Cisco Packet Tracer",
    author: "Mu'adz Hudzaifah",
    category: "Jaringan K…",
    description:
      "Tutorial konfigurasi jaringan switch layer-2 dan router on-a-stick untuk memisahkan segmentasi traffic mahasisw…",
    tags: ["jaringan", "cisco", "vlan"],
    minutes: 7,
  },
  sql: {
    code: "SQL",
    index: "#11",
    title: "Panduan Praktis Normalisasi Basis Data (1NF, 2NF, 3NF)",
    author: "Tim KataKating",
    category: "Basis Data",
    description:
      "Memahami teknik dekomposisi tabel anomali menjadi bentuk normal 1NF, 2NF, dan 3NF pada studi kasus siste…",
    tags: ["database", "sql", "normalisasi"],
    minutes: 6,
  },
  excl: {
    code: "EXCL",
    index: "#01",
    title: "Rumus Esensial Excel untuk Tugas Kuliah, Olah Data & Akuntansi",
    author: "BEM & Mahasiswa Akuntansi",
    category: "A…",
    description:
      "Kumpulan rumus penting Microsoft Excel yang wajib dikuasai mahasiswa semua jurusan untuk menyelesaikan…",
    tags: ["excel", "office", "akuntansi"],
    minutes: 6,
  },
  etik: {
    code: "ETIK",
    index: "#02",
    title: "Tata Cara & Etika Sopan Menghubungi Dosen serta Kakak Tingkat",
    author: "Tim Katakating & Himpunan Mah…",
    category: "",
    description:
      "Panduan sopan dan templat pesan WhatsApp siap pakai saat ingin berkonsultasi mengenai tugas, meminta izin tida…",
    tags: ["mentoring", "etika", "whatsapp"],
    minutes: 3,
  },
} as const satisfies Record<string, Note>;

export type NoteKey = keyof typeof NOTES;

export const FILTER_CHIPS = [
  "Semua Kategori",
  "Jaringan",
  "Web & Linux",
  "Basis Data",
  "Algoritma",
  "IoT",
  "Multimedia",
  "Akademik",
  "DevOps",
] as const;

export const NAV_LINKS = ["Semua Catatan", "Upload", "Panduan"] as const;

export const HERO = {
  label: "// DOKUMENTASI & PANDUAN AKADEMIK",
  headline: "eksplorasi catatan mahasiswa boash",
  sub: [
    "Pusat dokumentasi catatan praktikum mandiri dan panduan akademik mahasiswa Universitas Boash.",
    "Terbuka, terstruktur, dan mudah dipahami.",
  ],
  cta: "JELAJAHI CATATAN",
} as const;

export const SEARCH_PLACEHOLDER = "Cari catatan, topik, atau tag…";

/** File formats supported by the upload converter (Panduan + Upload page). */
export const FORMATS = [
  { ext: "DOCX", label: "Microsoft Word", sub: ".docx dokumen" },
  { ext: "PDF", label: "PDF Digital", sub: ".pdf" },
  { ext: "TXT", label: "Notepad Teks", sub: ".txt polos" },
  { ext: "MD", label: "Markdown", sub: ".md naskah" },
] as const;

/** Upload metadata fields, verbatim from "4. Alur Pengajuan Catatan di Web". */
export const UPLOAD_FIELDS = [
  "Judul Catatan",
  "Kategori",
  "Nama Penulis & NIM",
  "Ringkasan (Abstrak)",
  "Tags (Opsional)",
] as const;

/** Example ticket code, verbatim from the Panduan page. */
export const TICKET_CODE = "SUB-1024";

/** THE BRAIN: rumpun (organs) and vitals, verbatim from the graph screenshot. */
export const BRAIN = {
  title: "KATAKATING — THE BRAIN",
  vitals: [
    { label: "memories (catatan)", value: 20 },
    { label: "links (sinapsis)", value: 75 },
    { label: "organs (rumpun)", value: 14 },
    { label: "authors (kontributor)", value: 5 },
    { label: "tags (fokus topik)", value: 83 },
  ],
  organs: [
    "Web & Tooling",
    "Akademik & Laporan",
    "Basis Data",
    "Game & Multimedia",
    "IoT & Embedded",
    "Jaringan Komputer",
    "multimedia-3d",
    "systems-network",
    "web-software",
    "Algoritma & Pemrograman",
    "Git & DevOps",
    "Kontribusi & Panduan",
  ],
  legend: ["cortex", "organ", "memory", "author"],
  rings: ["10-15", "10-08", "10-01", "09-24", "09-17", "09-10"],
} as const;
