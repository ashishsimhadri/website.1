"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";
import styles from "./DarkAcademiaDeck.module.css";
import { CONTACT, DOMAINS, type Domain, type MediaItem } from "./data";

/* ---------- icons (one per domain) ---------- */
const ICONS: Record<string, React.ReactNode> = {
  blender: (
    <path d="M12 2.8 20 7.4v9.2l-8 4.6-8-4.6V7.4l8-4.6Zm0 9.2 8-4.6M12 12 4 7.4M12 12v9.2" />
  ),
  unreal: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.4 3.1 8.1 7.5 9.5 4.4-1.4 7.5-5.1 7.5-9.5V6L12 3Z" />
      <path d="M9 9.5v4a3 3 0 0 0 6 0v-4" />
    </>
  ),
  editing: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="1.5" />
      <path d="M3.5 9h17M3.5 15h17M8 5v14M16 5v14" />
    </>
  ),
  pygame: (
    <>
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12" />
    </>
  ),
};

function Icon({ id }: { id: string }) {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[id]}
    </svg>
  );
}

/* ---------- media asset with graceful fallback ---------- */
function Asset({ item, full }: { item: MediaItem; full?: boolean }) {
  const [failed, setFailed] = useState(false);
  const file = item.src.split("/").pop();

  if (failed) {
    return (
      <div className={styles.fallback} role="img" aria-label={`${item.alt} (file not added yet)`}>
        <span className={styles.fallbackFile}>{file}</span>
        <span className={styles.fallbackHint}>Add this file to public/assets/placeholders/</span>
      </div>
    );
  }

  if (item.type === "video") {
    return full ? (
      <video className={styles.media} src={item.src} controls autoPlay playsInline onError={() => setFailed(true)} />
    ) : (
      <video className={styles.media} src={`${item.src}#t=0.1`} muted playsInline preload="metadata" onError={() => setFailed(true)} />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={styles.media} src={item.src} alt={item.alt} loading={full ? "eager" : "lazy"} onError={() => setFailed(true)} />
  );
}

/* ---------- lightbox ---------- */
function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const item = items[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus(), []);
  const multi = items.length > 1;
  const go = (d: number) => onIndex((index + d + items.length) % items.length);

  return (
    <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={item.alt} onClick={onClose}>
      <button type="button" className={`${styles.iconBtn} ${styles.lbClose}`} onClick={onClose} aria-label="Close preview" ref={closeRef}>
        ✕
      </button>
      {multi && (
        <button
          type="button"
          className={`${styles.iconBtn} ${styles.lbPrev}`}
          onClick={(e) => { e.stopPropagation(); go(-1); }}
          aria-label="Previous"
        >
          ‹
        </button>
      )}
      <figure className={styles.lbFigure} onClick={(e) => e.stopPropagation()}>
        <div className={styles.lbStage} key={item.src}>
          <Asset item={item} full />
        </div>
        <figcaption className={styles.lbCaption}>
          {item.label}
          {multi && <span className={styles.lbCount}>{index + 1} / {items.length}</span>}
        </figcaption>
      </figure>
      {multi && (
        <button
          type="button"
          className={`${styles.iconBtn} ${styles.lbNext}`}
          onClick={(e) => { e.stopPropagation(); go(1); }}
          aria-label="Next"
        >
          ›
        </button>
      )}
    </div>
  );
}

/* ---------- showcase modal ---------- */
function Showcase({ domain, onClose }: { domain: Domain; onClose: () => void }) {
  const [closing, setClosing] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const lbTriggerRef = useRef<HTMLElement | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const titleId = useId();

  const requestClose = useCallback(() => {
    setClosing(true);
    closeTimer.current = window.setTimeout(onClose, 220);
  }, [onClose]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // scroll lock
  useEffect(() => {
    const { body, documentElement } = document;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const bar = window.innerWidth - documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (bar > 0) body.style.paddingRight = `${bar}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, []);

  // initial focus
  useEffect(() => {
    overlayRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
  }, []);

  // closing the lightbox returns focus to the tile
  const closeLightbox = useCallback(() => {
    setLightbox(null);
    lbTriggerRef.current?.focus();
  }, []);

  // keyboard: ESC, arrows, focus trap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (lightbox !== null) closeLightbox();
        else requestClose();
        return;
      }
      if (lightbox !== null && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        const n = domain.media.length;
        setLightbox((i) => (i === null ? i : (i + (e.key === "ArrowRight" ? 1 : -1) + n) % n));
        return;
      }
      if (e.key === "Tab" && overlayRef.current) {
        const nodes = Array.from(
          overlayRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),video[controls],[tabindex]:not([tabindex="-1"])'),
        ).filter((el) => !el.closest("[inert]"));
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && (active === first || !overlayRef.current.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !overlayRef.current.contains(active))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox, domain.media.length, requestClose, closeLightbox]);

  const openLightbox = (i: number, e: ReactMouseEvent<HTMLElement>) => {
    lbTriggerRef.current = e.currentTarget;
    setLightbox(i);
  };

  return createPortal(
    <div
      ref={overlayRef}
      className={`${styles.overlay} ${closing ? styles.overlayOut : ""}`}
      style={{ "--accent": domain.accent } as CSSProperties}
      onMouseDown={(e) => { if (e.target === e.currentTarget) requestClose(); }}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        {...(lightbox !== null ? { inert: true } : {})}
      >
        <button type="button" className={`${styles.iconBtn} ${styles.close}`} onClick={requestClose} aria-label="Close" data-autofocus>
          ✕
        </button>

        <section className={styles.narrative}>
          <span className={styles.badge}>{domain.badge}</span>
          <h3 id={titleId} className={styles.heading}>{domain.heading}</h3>
          <div className={styles.copy}>
            {domain.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <button type="button" className={styles.cta} onClick={(e) => openLightbox(0, e)}>
            {domain.cta}
          </button>
          <footer className={styles.contact}>
            <a href={`mailto:${CONTACT.email}`}>
              <span>Email</span>
              {CONTACT.email}
            </a>
            <a href={`tel:${CONTACT.phone}`}>
              <span>Phone</span>
              {CONTACT.phone}
            </a>
          </footer>
        </section>

        <section className={styles.gallery} aria-label={`${domain.cardTitle} media`}>
          <div className={styles.grid} data-layout={domain.layout}>
            {domain.media.map((m, i) => (
              <button
                key={m.src}
                type="button"
                className={styles.tile}
                onClick={(e) => openLightbox(i, e)}
                aria-label={`Open ${m.alt}`}
              >
                <Asset item={m} />
                {m.type === "video" && <span className={styles.play} aria-hidden="true">▶</span>}
                <span className={styles.tileLabel}>{m.label}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {lightbox !== null && (
        <Lightbox items={domain.media} index={lightbox} onClose={closeLightbox} onIndex={setLightbox} />
      )}
    </div>,
    document.body,
  );
}

/* ---------- deck ---------- */
export default function DarkAcademiaDeck() {
  const [fanned, setFanned] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // touch: collapse when tapping outside the deck
  useEffect(() => {
    if (!fanned) return;
    const onDown = (e: PointerEvent) => {
      if (!stackRef.current?.contains(e.target as Node)) setFanned(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [fanned]);

  const onCardClick = (e: ReactMouseEvent<HTMLButtonElement>, id: string) => {
    const touch = window.matchMedia("(hover: none)").matches;
    if (touch && !fanned) {
      setFanned(true); // first tap spreads the deck
      return;
    }
    triggerRef.current = e.currentTarget;
    setActiveId(id);
  };

  const closeShowcase = useCallback(() => {
    setActiveId(null);
    triggerRef.current?.focus();
  }, []);

  const active = DOMAINS.find((d) => d.id === activeId) ?? null;

  return (
    <div className={styles.deck}>
      <div ref={stackRef} className={styles.stack} data-fanned={fanned}>
        {DOMAINS.map((d, i) => {
          const o = i - (DOMAINS.length - 1) / 2;
          return (
            <button
              key={d.id}
              type="button"
              className={styles.card}
              style={{ "--i": i, "--o": o, "--arc": o * o, "--accent": d.accent } as CSSProperties}
              onClick={(e) => onCardClick(e, d.id)}
              aria-haspopup="dialog"
              aria-label={`${d.cardTitle}, ${d.cardSub}. Open showcase`}
            >
              <span className={styles.face}>
                <span className={styles.cardBadge}>{d.badge}</span>
                <Icon id={d.id} />
                <span className={styles.cardText}>
                  <span className={styles.cardTitle}>{d.cardTitle}</span>
                  <span className={styles.cardSub}>{d.cardSub}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <p className={styles.hint}>Spread the deck, then pick a card.</p>
      {active && <Showcase key={active.id} domain={active} onClose={closeShowcase} />}
    </div>
  );
}
