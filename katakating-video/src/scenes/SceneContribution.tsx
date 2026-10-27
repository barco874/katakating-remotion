import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../constants/colors";
import { FONT_MONO, FONT_SANS } from "../constants/fonts";
import { HEIGHT, WIDTH } from "../constants/video";
import { KnowledgeGraph } from "../components/graph/KnowledgeGraph";
import { NEW_NODE } from "../components/graph/graphData";
import { CheckIcon } from "../components/icons/Icons";
import { Cursor, cursorAt, type CursorKey } from "../components/system/Cursor";
import { Navbar } from "../components/ui/Navbar";
import { Dropzone, FileChip, FormField, TemplateCard } from "../components/ui/UploadParts";
import { Eyebrow } from "../components/ui/primitives";
import { BrowserWindow, pageToScreen } from "../components/window/BrowserWindow";
import { FORMATS, TICKET_CODE, UPLOAD_FIELDS } from "../data/site";
import { ScanWipe } from "../transitions/ScanWipe";
import { BEATS, local } from "../timing/beats";
import { SCENES } from "../timing/scenes";
import { UPLOAD_TYPING } from "../timing/typing";
import { EASE, lerp, mapClamp, progress } from "../utils/anim";

const B = local(BEATS.contribution, SCENES.contribution.from);
const END = SCENES.contribution.duration;

/* ---------- Upload page layout (native px) ---------- */

const PAGE = { left: 370, width: 1175 } as const;
const DROP_TOP = 638;
const FORM_TOP = 990;
const FORM_SCROLL = 600;

/** Example submission typed into the (reconstructed) metadata form. */
const VALUES: Record<(typeof UPLOAD_FIELDS)[number], string> = {
  "Judul Catatan": "Setup Docker untuk Praktikum Web",
  Kategori: "Web & Tooling",
  "Nama Penulis & NIM": "Nama Mahasiswa · NIM",
  "Ringkasan (Abstrak)": "Instalasi Docker + solusi error umum.",
  "Tags (Opsional)": "docker, setup, web",
};
const CHARS_PER_FRAME = 2.2;

/** Typing schedule: fields fill one after another. */
const FIELD_TIMES = (() => {
  let t = B.form + UPLOAD_TYPING.offset;
  return UPLOAD_FIELDS.map((f) => {
    const start = t;
    const end = start + Math.ceil(VALUES[f].length / CHARS_PER_FRAME);
    t = end + 3;
    return { field: f, start, end };
  });
})();

/** Where the contributed note joins the graph (screen px) — handed to the Ending. */
export const MINI_GRAPH = { size: 900, center: { x: WIDTH / 2, y: HEIGHT / 2 + 10 }, rotate: 20 } as const;
export const newNodeScreen = () => {
  const r = (MINI_GRAPH.rotate * Math.PI) / 180;
  const unit = MINI_GRAPH.size / 1040;
  return {
    x: MINI_GRAPH.center.x + (NEW_NODE.x * Math.cos(r) - NEW_NODE.y * Math.sin(r)) * unit,
    y: MINI_GRAPH.center.y + (NEW_NODE.x * Math.sin(r) + NEW_NODE.y * Math.cos(r)) * unit,
  };
};

/**
 * 01:20 – CONTRIBUTION. Knowledge goes back into the system: a note is
 * dropped in, documented, submitted (ticket SUB-1024), and joins the graph.
 */
export const SceneContribution: React.FC = () => {
  const frame = useCurrentFrame();

  const reveal = progress(frame, 0, 10, (t) => t);
  const scroll = lerp(0, FORM_SCROLL, progress(frame, B.form - 6, 14, EASE.inOut));
  const dropActive = progress(frame, B.drop - 8, 6, EASE.out);
  const dropped = frame >= B.drop;
  const submitPress = progress(frame, B.submit, 4, EASE.snap);
  const ticket = progress(frame, B.ticket, 8, EASE.snap);
  const toGraph = progress(frame, B.joinGraph - 8, 16, EASE.inOut);
  const joined = progress(frame, B.joinGraph + 2, 22, EASE.out);
  const isolate = progress(frame, END - 16, 14, EASE.inOut);

  // Drag path for the file chip (screen space)
  const dropCenter = pageToScreen(PAGE.left + PAGE.width / 2, DROP_TOP + 200);
  const ajukan = pageToScreen(PAGE.left + 63, FORM_TOP + 465 - FORM_SCROLL);
  const keys: CursorKey[] = [
    { f: 2, x: 1560, y: 980 },
    { f: B.drop, x: dropCenter.x + 40, y: dropCenter.y + 10 },
    { f: B.form + 4, x: dropCenter.x + 220, y: dropCenter.y + 60 },
    { f: B.submit, x: ajukan.x, y: ajukan.y },
  ];
  const cur = cursorAt(frame, keys);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - toGraph, scale: String(1 - toGraph * 0.08) }}>
        <BrowserWindow>
          <div style={{ position: "absolute", left: 0, right: 0, top: -scroll }}>
            <UploadPage dropActive={dropActive} />
            {/* Metadata form (reconstructed from "Lengkapi Metadata Naskah") */}
            <div style={{ position: "absolute", left: PAGE.left, top: FORM_TOP, width: PAGE.width }}>
              <Eyebrow size={15}>// LENGKAPI METADATA NASKAH</Eyebrow>
              <div style={{ marginTop: 26, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px 24px" }}>
                {FIELD_TIMES.map(({ field, start, end }) => (
                  <div key={field} style={{ gridColumn: field === "Kategori" || field === "Nama Penulis & NIM" ? undefined : "1 / span 2" }}>
                    <FormField
                      label={field}
                      value={VALUES[field]}
                      visible={Math.max(0, Math.floor((frame - start) * CHARS_PER_FRAME))}
                      typing={frame >= start && frame < end}
                      focused={frame >= start - 1 && frame < end + 3}
                      width={field === "Kategori" || field === "Nama Penulis & NIM" ? 575 : PAGE.width}
                    />
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 30,
                  display: "inline-flex",
                  alignItems: "center",
                  height: 50,
                  padding: "0 30px",
                  borderRadius: 6,
                  background: submitPress > 0.5 ? COLORS.green : COLORS.text,
                  color: COLORS.bgDeep,
                  fontFamily: FONT_MONO,
                  fontWeight: 700,
                  fontSize: 16,
                  letterSpacing: "0.12em",
                  scale: String(1 - 0.05 * (submitPress - progress(frame, B.submit + 4, 4, EASE.out))),
                }}
              >
                AJUKAN
              </div>
            </div>
          </div>
          <Navbar active="Upload" />

          {/* Ticket confirmation */}
          {ticket > 0 ? (
            <div
              style={{
                position: "absolute",
                left: PAGE.left + PAGE.width - 520,
                top: 420,
                width: 520,
                opacity: ticket,
                translate: `0 ${(1 - ticket) * 20}px`,
                background: COLORS.surface,
                border: `1px solid ${COLORS.green}`,
                boxShadow: `0 0 0 4px ${COLORS.greenSoft}, 0 30px 80px rgba(0,0,0,0.6)`,
                borderRadius: 10,
                padding: "26px 28px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 16, letterSpacing: "0.12em", color: COLORS.green }}>
                <CheckIcon size={22} color={COLORS.green} strokeWidth={2.4} /> NASKAH DIAJUKAN
              </div>
              <div style={{ marginTop: 16, fontFamily: FONT_MONO, fontSize: 18, color: COLORS.textMuted }}>kode tiket</div>
              <div style={{ fontFamily: FONT_MONO, fontWeight: 800, fontSize: 52, color: COLORS.text, letterSpacing: "0.04em" }}>{TICKET_CODE}</div>
              <div style={{ marginTop: 14, fontFamily: FONT_SANS, fontSize: 18, lineHeight: 1.5, color: COLORS.textSoft }}>
                Kurasi → tayang di katalog publik dan graf pengetahuan.
              </div>
            </div>
          ) : null}
        </BrowserWindow>

        {/* Dragged file chip, following the cursor until dropped */}
        {frame >= 2 && frame < B.form ? (
          <div
            style={{
              position: "absolute",
              left: dropped ? dropCenter.x - 170 : cur.x - 40,
              top: dropped ? dropCenter.y - 40 : cur.y + 18,
              opacity: mapClamp(frame, [2, 6], [0, 1]) * (1 - progress(frame, B.form - 8, 6, EASE.in)),
              scale: String(dropped ? 1 : 1.04),
            }}
          >
            <FileChip name="catatan-praktikum.md" ext="MD" done={progress(frame, B.drop + 10, 4, EASE.snap)} />
          </div>
        ) : null}

        <Cursor keys={keys} clicks={[B.drop, B.submit]} visibleFrom={2} visibleTo={B.ticket + 6} size={26} />
      </AbsoluteFill>

      {/* The note joins the Knowledge Graph */}
      {toGraph > 0 ? (
        <div
          style={{
            position: "absolute",
            left: MINI_GRAPH.center.x - MINI_GRAPH.size / 2,
            top: MINI_GRAPH.center.y - MINI_GRAPH.size / 2,
            opacity: toGraph * (1 - isolate),
            scale: String(0.92 + 0.08 * toGraph),
          }}
        >
          <KnowledgeGraph size={MINI_GRAPH.size} growth={1} rotate={MINI_GRAPH.rotate} rings={0.5} labels={0.7} joined={joined} />
        </div>
      ) : null}

      {/* Isolated new node: hand-off to the final message */}
      {isolate > 0 ? <NewNodeDot /> : null}

      <ScanWipe progress={reveal} mode="reveal" />
    </AbsoluteFill>
  );
};

export const NewNodeDot: React.FC<{ readonly scale?: number }> = ({ scale = 1 }) => {
  const p = newNodeScreen();
  const r = 9 * (MINI_GRAPH.size / 1040);
  return (
    <div
      style={{
        position: "absolute",
        left: p.x - r - 3,
        top: p.y - r - 3,
        width: (r + 3) * 2,
        height: (r + 3) * 2,
        borderRadius: 99,
        border: `3px solid ${COLORS.green}`,
        background: COLORS.bg,
        boxShadow: `0 0 30px ${COLORS.greenGlow}`,
        scale: String(scale),
      }}
    />
  );
};

const UploadPage: React.FC<{ readonly dropActive: number }> = ({ dropActive }) => (
  <div style={{ position: "absolute", left: PAGE.left, top: 0, width: PAGE.width }}>
    <div style={{ position: "absolute", top: 105, fontFamily: FONT_MONO, fontSize: 15, color: COLORS.textMuted, display: "flex", gap: 12 }}>
      <span style={{ color: COLORS.textSoft }}>Beranda</span>
      <span style={{ color: COLORS.textDim }}>/</span>
      <span>Upload Catatan</span>
    </div>
    <Eyebrow size={15} style={{ position: "absolute", top: 160 }}>
      // FORMULIR PENGAJUAN NASKAH
    </Eyebrow>
    <div style={{ position: "absolute", top: 200, fontFamily: FONT_SANS, fontWeight: 800, fontSize: 56, letterSpacing: "-0.04em", color: COLORS.text, whiteSpace: "nowrap" }}>
      Upload Catatan &amp; Panduan Praktikum
    </div>
    <div style={{ position: "absolute", top: 282, fontFamily: FONT_SANS, fontSize: 19, color: COLORS.textMuted }}>
      Unggah berkas praktikum atau catatan belajar. Terkonversi otomatis ke format repositori.
    </div>
    <div
      style={{
        position: "absolute",
        top: 335,
        width: PAGE.width,
        height: 272,
        border: `1px solid ${COLORS.borderStrong}`,
        borderRadius: 8,
        background: COLORS.surface,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 34,
        gap: 30,
      }}
    >
      <Eyebrow size={14}>● // UNDUH BERKAS TEMPLATE</Eyebrow>
      <div style={{ display: "flex", gap: 20 }}>
        {FORMATS.filter((f) => f.ext !== "PDF").map((f) => (
          <TemplateCard key={f.ext} ext={f.ext} label={f.label} sub={f.sub} />
        ))}
      </div>
    </div>
    <div style={{ position: "absolute", top: DROP_TOP }}>
      <Dropzone width={PAGE.width} active={dropActive} />
    </div>
  </div>
);
