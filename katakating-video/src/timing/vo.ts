import { FPS } from "../constants/video";

/**
 * VOICE-OVER TIMING MAP: the single source of timing for the whole video.
 *
 * The text is the VO script from the master brief, verbatim, split into the
 * phrases the visuals hit. `start` / `end` are seconds on the final timeline.
 *
 * These are ESTIMATES until the real VO is recorded. After recording:
 *   1. Drop the file in public/audio/vo/ and set VO_TRACK.src (src/audio/config.ts).
 *   2. Replace each start/end below with the measured phrase times.
 * Scene boundaries, visual beats and SFX are all derived from these values,
 * so visuals and sound effects move together with the VO.
 */
export type VoLine = {
  readonly id: string;
  readonly text: string;
  readonly start: number;
  readonly end: number;
};

export const VO_LINES = [
  // PROBLEM
  { id: "p1", text: "Pernah kepikiran...", start: 0.8, end: 2.3 },
  { id: "p2", text: "kenapa masalah yang sama,", start: 2.9, end: 4.4 },
  { id: "p3", text: "harus terus terjadi?", start: 4.5, end: 5.9 },
  { id: "p4", text: "Error yang sama.", start: 6.6, end: 7.8 },
  { id: "p5", text: "Pertanyaan yang sama.", start: 8.4, end: 9.8 },
  { id: "p6", text: "Dan solusi yang sebenarnya...", start: 10.4, end: 12.2 },
  { id: "p7", text: "sudah pernah ditemukan.", start: 12.8, end: 14.4 },

  // KNOWLEDGE GETS LOST
  { id: "l1", text: "Tapi hilang.", start: 15.2, end: 16.3 },
  { id: "l2", text: "Tenggelam di chat.", start: 16.8, end: 18.2 },
  { id: "l3", text: "Tersimpan di laptop.", start: 18.6, end: 20.0 },
  { id: "l4", text: "Atau ikut pergi bersama angkatan sebelumnya.", start: 20.4, end: 23.4 },
  { id: "l5", text: "Padahal...", start: 24.2, end: 25.2 },
  { id: "l6", text: "pengetahuan nggak seharusnya berhenti di satu angkatan.", start: 25.8, end: 29.4 },

  // REVEAL
  { id: "r1", text: "Karena itu,", start: 30.4, end: 31.3 },
  { id: "r2", text: "hadir KATAKATING.", start: 31.6, end: 33.4 },
  { id: "r3", text: "Knowledge Hub mahasiswa Universitas Boash.", start: 34.4, end: 37.6 },

  // DISCOVERY
  { id: "d1", text: "Satu tempat,", start: 38.8, end: 39.7 },
  { id: "d2", text: "untuk menemukan berbagai catatan praktikum", start: 39.9, end: 42.2 },
  { id: "d3", text: "dan panduan akademik yang terstruktur.", start: 42.3, end: 44.4 },
  { id: "d4", text: "Cari berdasarkan topik.", start: 45.0, end: 46.6 },
  { id: "d5", text: "Telusuri berdasarkan kategori.", start: 47.0, end: 48.8 },
  { id: "d6", text: "Temukan solusi yang kamu butuhkan.", start: 49.2, end: 51.2 },

  // FEATURES
  { id: "f1", text: "Bukan cuma catatan.", start: 51.9, end: 53.1 },
  { id: "f2", text: "KATAKATING juga menghadirkan", start: 53.5, end: 55.0 },
  { id: "f3", text: "panduan teknis,", start: 55.1, end: 56.1 },
  { id: "f4", text: "template akademik,", start: 56.4, end: 57.5 },
  { id: "f5", text: "dan dokumentasi dalam berbagai format.", start: 57.8, end: 60.0 },
  { id: "f6", text: "Semua dirancang", start: 60.5, end: 61.4 },
  { id: "f7", text: "agar pengetahuan lebih mudah ditemukan,", start: 61.5, end: 63.5 },
  { id: "f8", text: "dipahami,", start: 63.7, end: 64.4 },
  { id: "f9", text: "dan digunakan kembali.", start: 64.6, end: 66.0 },

  // KNOWLEDGE GRAPH
  { id: "g1", text: "Dan untuk melihat bagaimana", start: 66.8, end: 68.2 },
  { id: "g2", text: "berbagai pengetahuan saling terhubung...", start: 68.3, end: 70.6 },
  { id: "g3", text: "jelajahi Knowledge Graph KATAKATING.", start: 71.3, end: 73.7 },
  { id: "g4", text: "Karena pengetahuan bukan hanya untuk ditemukan.", start: 74.4, end: 77.0 },
  { id: "g5", text: "Pengetahuan juga untuk diteruskan.", start: 77.4, end: 79.6 },

  // CONTRIBUTION
  { id: "c1", text: "Bagikan catatanmu.", start: 80.2, end: 81.4 },
  { id: "c2", text: "Dokumentasikan pengalamanmu.", start: 81.7, end: 83.3 },
  { id: "c3", text: "Dan bantu angkatan berikutnya", start: 83.6, end: 85.1 },
  { id: "c4", text: "menghadapi masalah yang sama.", start: 85.2, end: 86.9 },

  // FINAL MESSAGE
  { id: "e1", text: "Satu catatan hari ini,", start: 87.7, end: 89.1 },
  { id: "e2", text: "bisa menjadi solusi untuk seseorang di kemudian hari.", start: 89.3, end: 92.3 },
  { id: "e3", text: "KATAKATING.", start: 93.2, end: 94.2 },
  { id: "e4", text: "Knowledge should move forward.", start: 94.6, end: 96.6 },
] as const satisfies readonly VoLine[];

export type VoId = (typeof VO_LINES)[number]["id"];

const byId = Object.fromEntries(VO_LINES.map((l) => [l.id, l])) as Record<
  VoId,
  VoLine
>;

export const sec = (seconds: number) => Math.round(seconds * FPS);

/** Absolute frame where a VO phrase starts. */
export const vo = (id: VoId) => sec(byId[id].start);

/** Absolute frame where a VO phrase ends. */
export const voEnd = (id: VoId) => sec(byId[id].end);

/** Hold on the final brand lockup after the last VO line (seconds). */
export const END_HOLD_SECONDS = 2.6;

export const TOTAL_FRAMES = sec(
  VO_LINES[VO_LINES.length - 1].end + END_HOLD_SECONDS,
);
