import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../constants/colors";
import { FONT_MONO, FONT_SANS } from "../constants/fonts";
import { ArrowLeftIcon, ArrowRightIcon } from "../components/icons/Icons";
import { Cursor, type CursorKey } from "../components/system/Cursor";
import { CodeBlock } from "../components/terminal/CodeBlock";
import { ARTICLE, ArticleHeader, ArticleParagraph } from "../components/ui/ArticlePage";
import { Navbar, SITE } from "../components/ui/Navbar";
import { NoteCard } from "../components/ui/NoteCard";
import { SearchPanel } from "../components/ui/SearchPanel";
import { Eyebrow, SectionLabel } from "../components/ui/primitives";
import { BROWSER, BrowserWindow, pageToScreen } from "../components/window/BrowserWindow";
import { HERO, NOTES, type NoteKey } from "../data/site";
import { BEATS, local } from "../timing/beats";
import { SCENES } from "../timing/scenes";
import { SEARCH_TYPING } from "../timing/typing";
import { EASE, lerp, progress } from "../utils/anim";

const B = local(BEATS.discovery, SCENES.discovery.from);

/* ---------- Page layout (native website px) ---------- */

const RECENT_TOP = 490;
const SEARCH_TOP = 1110;
const GRID_TOP = 1260;
const GRID = { left: 255, colW: 455, gap: 21, cardH: 520 } as const;
const SCROLL_SEARCH = 1010;
/** Screen point the camera pushes in on (search panel + results). */
const CAMERA_ORIGIN = { x: 960, y: 150 } as const;

const slot = (i: number) => ({
  x: GRID.left + (i % 3) * (GRID.colW + GRID.gap),
  y: GRID_TOP + Math.floor(i / 3) * (GRID.cardH + GRID.gap),
});

/** Results per phase: all notes → query "install" → category "Web & Linux". */
const PHASES: readonly (readonly NoteKey[])[] = [
  ["aicl", "flut", "wsl", "margin", "vlan", "sql"],
  ["aicl", "flut", "wsl"],
  ["flut", "wsl"],
];
const ALL_KEYS = PHASES[0];

/* ---------- Article (WSL note) ---------- */

const ARTICLE_TOP = 100;
const ARTICLE_CODE_TOP = 690;
const ARTICLE_SCROLL = 270;
export const WSL_CODE = [
  { text: "wsl --update" },
  { text: "wsl --install -d Ubuntu-24.04" },
  { text: "wsl --set-default-version 2" },
] as const;

/** Where the code block hands off to the Features scene (screen px). */
export const CODE_HANDOFF = { x: 410, y: 430, w: 1100, fontSize: 22 } as const;

const codeOnScreen = () => {
  const p = pageToScreen(ARTICLE.left, ARTICLE_CODE_TOP - ARTICLE_SCROLL);
  return { x: p.x, y: p.y, w: ARTICLE.width * BROWSER.scale, fontSize: 17 * BROWSER.scale };
};

/* ---------- Scene ---------- */

/**
 * 00:39 – DISCOVERY. One continuous browsing action on the reconstructed
 * website: home → search "install" → filter "Web & Linux" → open the WSL
 * note → the fix is highlighted → the code block lifts out of the page.
 */
export const SceneDiscovery: React.FC = () => {
  const frame = useCurrentFrame();

  // Search + filter state
  const typedChars = Math.max(0, Math.min(SEARCH_TYPING.text.length, Math.floor((frame - B.searchType) / SEARCH_TYPING.framesPerChar) + 1));
  const query = frame >= B.searchType ? SEARCH_TYPING.text.slice(0, typedChars) : "";
  const typingDone = B.searchType + SEARCH_TYPING.text.length * SEARCH_TYPING.framesPerChar;
  const phase1 = progress(frame, typingDone + 4, 12, EASE.inOut);
  const phase2 = progress(frame, B.categoryClick + 3, 12, EASE.inOut);
  const focus = progress(frame, B.searchClick, 4, EASE.snap) * (1 - progress(frame, B.categoryClick, 4, EASE.snap));

  // Scroll: settle on the hero, then glide down to the catalogue.
  const scroll = lerp(0, SCROLL_SEARCH, progress(frame, B.structure + 10, B.searchClick - 6 - (B.structure + 10), EASE.inOut));

  // Page switch to the article
  const toArticle = progress(frame, B.cardOpen + 3, 14, EASE.out);
  const articleScroll = lerp(0, ARTICLE_SCROLL, progress(frame, B.codeHighlight - 22, 18, EASE.inOut));
  const highlight = progress(frame, B.codeHighlight, 8, EASE.out);

  // Hand-off: code block lifts out of the page, browser recedes.
  const lift = progress(frame, B.zoomOut, 16, EASE.inOut);

  const cardHover = progress(frame, B.cardHover + 10, 6, EASE.out);
  const pressed = progress(frame, B.cardOpen, 3, EASE.snap);

  // Cursor path (screen space)
  const searchPt = pageToScreen(640, SEARCH_TOP + 30 - SCROLL_SEARCH);
  const chipPt = pageToScreen(625, SEARCH_TOP + 89 - SCROLL_SEARCH);
  const wslSlot = slot(1);
  const bukaPt = pageToScreen(wslSlot.x + GRID.colW - 62, wslSlot.y + GRID.cardH - 26 - SCROLL_SEARCH);
  const keys: CursorKey[] = [
    { f: B.searchClick - 22, x: 1460, y: 820 },
    { f: B.searchClick, x: searchPt.x, y: searchPt.y },
    { f: B.categoryClick - 14, x: searchPt.x + 40, y: searchPt.y + 20 },
    { f: B.categoryClick, x: chipPt.x, y: chipPt.y },
    { f: B.cardHover + 12, x: bukaPt.x, y: bukaPt.y },
    { f: B.cardOpen, x: bukaPt.x, y: bukaPt.y },
  ];

  const handoff = codeOnScreen();

  // Camera: push in while the user interacts, ease back out for the article.
  const camera =
    1 +
    0.24 * progress(frame, B.searchClick - 24, 22, EASE.inOut) -
    0.24 * progress(frame, B.cardOpen + 2, 16, EASE.inOut);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: 1 - lift,
          scale: String(camera * (1 + lift * 0.06)),
          transformOrigin: `${CAMERA_ORIGIN.x}px ${CAMERA_ORIGIN.y}px`,
        }}
      >
        <BrowserWindow>
          {/* Home / catalogue page */}
          {toArticle < 1 ? (
            <div style={{ position: "absolute", inset: 0, opacity: 1 - toArticle, translate: `0 ${-toArticle * 40}px` }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: -scroll }}>
                <HomeHero frame={frame} />
                <RecentRow frame={frame} />
                <CatalogueHeader />
                <div style={{ position: "absolute", left: SITE.contentLeft, top: SEARCH_TOP }}>
                  <SearchPanel
                    width={SITE.contentWidth}
                    query={query}
                    focus={focus}
                    typing={frame >= B.searchType && frame < typingDone}
                    activeChip={frame >= B.categoryClick ? "Web & Linux" : "Semua Kategori"}
                    chipPress={1 - progress(frame, B.categoryClick, 6, EASE.out)}
                  />
                </div>
                {ALL_KEYS.map((key) => {
                  const i0 = PHASES[0].indexOf(key);
                  const i1 = PHASES[1].indexOf(key);
                  const i2 = PHASES[2].indexOf(key);
                  const a = slot(i0);
                  const b = i1 >= 0 ? slot(i1) : a;
                  const c = i2 >= 0 ? slot(i2) : b;
                  const x = lerp(lerp(a.x, b.x, phase1), c.x, phase2);
                  const y = lerp(lerp(a.y, b.y, phase1), c.y, phase2);
                  const vis = (i1 >= 0 ? 1 : 1 - phase1) * (i2 >= 0 ? 1 : 1 - phase2);
                  if (vis <= 0) return null;
                  const isWsl = key === "wsl";
                  return (
                    <div key={key} style={{ position: "absolute", left: x, top: y, opacity: vis, scale: String(0.94 + 0.06 * vis) }}>
                      <NoteCard
                        note={NOTES[key]}
                        width={GRID.colW}
                        highlight={isWsl ? cardHover : 0}
                        buttonActive={isWsl ? pressed : 0}
                        style={{ height: GRID.cardH }}
                      />
                    </div>
                  );
                })}
              </div>
              <Navbar />
            </div>
          ) : null}

          {/* Article page */}
          {toArticle > 0 ? (
            <div style={{ position: "absolute", inset: 0, opacity: toArticle, translate: `0 ${(1 - toArticle) * 60}px` }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: -articleScroll }}>
                <div style={{ position: "absolute", left: ARTICLE.left, top: ARTICLE_TOP }}>
                  <ArticleHeader
                    crumbs={["Beranda", "Web & Tooling", "WSL"]}
                    eyebrow="// WEB & TOOLING // KODE: WSL"
                    title={NOTES.wsl.title}
                    contributor="Mu'adz Hudzaifah"
                    date="2026-09-21"
                    minutes={NOTES.wsl.minutes}
                    tags={NOTES.wsl.tags}
                    build={progress(frame, B.cardOpen + 4, 20, EASE.out)}
                  />
                </div>
                <div style={{ position: "absolute", left: ARTICLE.left, top: ARTICLE_CODE_TOP - 92, width: ARTICLE.width }}>
                  <ArticleParagraph>
                    Panduan instalasi dan konfigurasi native Linux kernel di Windows menggunakan WSL2 untuk kebutuhan praktikum.
                  </ArticleParagraph>
                </div>
                <div style={{ position: "absolute", left: ARTICLE.left, top: ARTICLE_CODE_TOP, opacity: lift > 0 ? 0 : 1 }}>
                  <CodeBlock lines={WSL_CODE} width={ARTICLE.width} fontSize={17} highlightLine={0} highlight={highlight} />
                </div>
              </div>
              <Navbar />
            </div>
          ) : null}
        </BrowserWindow>
        <Cursor keys={keys} clicks={[B.searchClick, B.categoryClick, B.cardOpen]} visibleFrom={B.searchClick - 22} visibleTo={B.cardOpen + 8} size={26} />
      </AbsoluteFill>

      {/* Code block lifts out of the page toward the Features scene */}
      {lift > 0 ? (
        <div
          style={{
            position: "absolute",
            left: lerp(handoff.x, CODE_HANDOFF.x, lift),
            top: lerp(handoff.y, CODE_HANDOFF.y, lift),
          }}
        >
          <CodeBlock
            lines={WSL_CODE}
            width={lerp(handoff.w, CODE_HANDOFF.w, lift)}
            fontSize={lerp(handoff.fontSize, CODE_HANDOFF.fontSize, lift)}
            highlightLine={0}
            highlight={1}
          />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- Home page sections ---------- */

const rowIn = (frame: number, start: number) => {
  const p = progress(frame, start, 10, EASE.out);
  return { opacity: p, translate: `0 ${(1 - p) * 18}px` };
};

const HomeHero: React.FC<{ readonly frame: number }> = ({ frame }) => (
  <div style={{ position: "absolute", left: SITE.contentLeft, top: 100 }}>
    <Eyebrow size={15} style={rowIn(frame, 4)}>
      {HERO.label}
    </Eyebrow>
    <div
      style={{
        ...rowIn(frame, 8),
        marginTop: 22,
        fontFamily: FONT_SANS,
        fontWeight: 800,
        fontSize: 72,
        letterSpacing: "-0.045em",
        color: COLORS.text,
        lineHeight: 1.05,
      }}
    >
      {HERO.headline}
    </div>
    <div style={{ ...rowIn(frame, 12), marginTop: 28, fontFamily: FONT_SANS, fontSize: 19, lineHeight: 1.55, color: COLORS.textMuted }}>
      {HERO.sub[0]}
      <br />
      {HERO.sub[1]}
    </div>
    <div
      style={{
        ...rowIn(frame, 16),
        marginTop: 34,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        height: 46,
        padding: "0 18px",
        background: COLORS.text,
        color: COLORS.bgDeep,
        borderRadius: 6,
        fontFamily: FONT_MONO,
        fontWeight: 700,
        fontSize: 14,
        letterSpacing: "0.12em",
      }}
    >
      {HERO.cta} <ArrowRightIcon size={13} color={COLORS.bgDeep} />
    </div>
  </div>
);

const RecentRow: React.FC<{ readonly frame: number }> = ({ frame }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: SITE.contentLeft,
        top: RECENT_TOP - 50,
        width: SITE.contentWidth,
        display: "flex",
        justifyContent: "space-between",
        paddingBottom: 16,
        borderBottom: `1px solid ${COLORS.border}`,
        ...rowIn(frame, B.cardsIn - 6),
      }}
    >
      <SectionLabel>BARU DITAMBAHKAN</SectionLabel>
      <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: COLORS.textSoft }}>lihat semua →</span>
    </div>
    {(["aicl", "excl", "etik"] as const).map((key, i) => {
      const p = progress(frame, B.cardsIn + i * 4, 10, EASE.snap);
      return (
        <div
          key={key}
          style={{
            position: "absolute",
            left: SITE.contentLeft + i * 490,
            top: RECENT_TOP,
            opacity: p,
            translate: `0 ${(1 - p) * 40}px`,
          }}
        >
          <NoteCard note={NOTES[key]} width={470} style={{ height: 486 }} />
        </div>
      );
    })}
  </>
);

const CatalogueHeader: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: SITE.contentLeft,
      top: SEARCH_TOP - 72,
      width: SITE.contentWidth,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 14,
      borderBottom: `1px solid ${COLORS.border}`,
    }}
  >
    <SectionLabel>SEMUA CATATAN</SectionLabel>
    <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: FONT_MONO, fontSize: 14, color: COLORS.textMuted }}>
      <span>
        <b style={{ color: COLORS.text }}>20</b> catatan praktikum
      </span>
      {[ArrowLeftIcon, ArrowRightIcon].map((Icon, i) => (
        <span key={i} style={{ width: 46, height: 40, display: "grid", placeItems: "center", border: `1px solid ${COLORS.borderStrong}`, borderRadius: 6 }}>
          <Icon size={16} color={COLORS.text} />
        </span>
      ))}
    </div>
  </div>
);
