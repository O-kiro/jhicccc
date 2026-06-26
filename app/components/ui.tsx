"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Image from "next/image";
import { Icon } from "./icons";
import { GeoTexture } from "./ornaments";
import { Reveal } from "./reveal";
import type { IconName } from "@/lib/content";

export const cn = (...c: (string | false | undefined | null)[]) =>
  c.filter(Boolean).join(" ");

export function Container({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Button — MetaMask pill treatment                                */
/* ---------------------------------------------------------------- */
const buttonBase =
  "group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50";

const buttonVariants = {
  solid: "bg-blue-gradient text-white shadow-card hover:shadow-hover hover:brightness-105",
  light: "bg-surface text-blue shadow-card hover:shadow-hover",
  gold: "bg-gold text-white hover:bg-gold-strong hover:shadow-hover",
  outline: "border border-ink/15 text-ink hover:border-ink/30 hover:bg-ink/[0.03]",
  outlineDark: "border border-white/30 text-white hover:bg-white/10",
} as const;

const buttonSizes = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-[15px]",
} as const;

export function Button({
  href,
  onClick,
  variant = "solid",
  size = "md",
  external,
  icon = true,
  className,
  children,
  ariaLabel,
}: {
  href?: string;
  onClick?: () => void;
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  external?: boolean;
  icon?: boolean;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const cls = cn(buttonBase, buttonVariants[variant], buttonSizes[size], className);
  const inner = (
    <>
      {children}
      {icon && <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        aria-label={ariaLabel}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className={cls}>
      {inner}
    </button>
  );
}

/* ---------------------------------------------------------------- */
/*  Section heading — large MetaMask display type                   */
/* ---------------------------------------------------------------- */
export function SectionHeading({
  eyebrow,
  title,
  desc,
  align = "center",
  tone = "default",
  gradient = false,
}: {
  eyebrow: string;
  title: ReactNode;
  desc?: ReactNode;
  align?: "center" | "left";
  tone?: "default" | "onDark";
  gradient?: boolean;
}) {
  const centered = align === "center";
  return (
    <div className={cn(centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl")}>
      <Reveal>
        <span className={cn("eyebrow", tone === "onDark" && "text-gold")}>
          <Icon name="star8" className="h-3.5 w-3.5 text-gold" strokeWidth={1.4} />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2
          className={cn(
            "display mt-4 text-balance text-[clamp(2.25rem,5.4vw,4.25rem)]",
            tone === "onDark" ? "text-on-dark" : gradient ? "text-gradient-warm" : "text-ink",
          )}
        >
          {title}
        </h2>
      </Reveal>
      {desc ? (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "mt-5 text-pretty text-lg leading-relaxed",
              centered && "mx-auto max-w-2xl",
              tone === "onDark" ? "text-on-dark/70" : "text-muted",
            )}
          >
            {desc}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  PhotoTile — flat pastel stand-in panel                          */
/* ---------------------------------------------------------------- */
const toneMap: Record<"teal" | "blue" | "gold", string> = {
  teal: "bg-teal-soft text-teal",
  blue: "bg-blue-soft text-blue",
  gold: "bg-gold-soft text-gold-strong",
};

/** Real photo layered over the tile; fades in on load so the pastel panel is the placeholder. */
function TilePhoto({
  src,
  alt,
  priority,
  sizes,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
      priority={priority}
      onLoad={() => setLoaded(true)}
      className={cn(
        "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
        loaded ? "opacity-100" : "opacity-0",
      )}
    />
  );
}

export function PhotoTile({
  tone = "teal",
  icon = "camera",
  className,
  glyphClassName = "h-14 w-14",
  texture = true,
  src,
  alt = "",
  priority,
  sizes,
  children,
}: {
  tone?: "teal" | "blue" | "gold";
  icon?: IconName;
  className?: string;
  glyphClassName?: string;
  texture?: boolean;
  /** When set, a real photo renders over the tile (which becomes the placeholder). */
  src?: string;
  alt?: string;
  priority?: boolean;
  sizes?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("relative overflow-hidden", toneMap[tone], className)}>
      {texture && <GeoTexture className="pointer-events-none absolute inset-0 opacity-[0.12]" />}
      <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-70">
        <Icon name={icon} className={glyphClassName} strokeWidth={1.1} />
      </div>
      {src && <TilePhoto src={src} alt={alt} priority={priority} sizes={sizes} />}
      {children}
    </div>
  );
}

export function Badge({
  children,
  className,
  tone = "teal",
}: {
  children: ReactNode;
  className?: string;
  tone?: "teal" | "blue" | "gold" | "muted";
}) {
  const tones = {
    teal: "bg-teal-soft text-teal",
    blue: "bg-blue-soft text-blue",
    gold: "bg-gold-soft text-gold-strong",
    muted: "bg-surface-2 text-muted",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
