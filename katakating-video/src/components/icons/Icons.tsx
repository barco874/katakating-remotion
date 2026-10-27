import React from "react";

/**
 * Minimal stroke icons matching the line icons used on the website
 * (search, bookmark, heart, share, eye, arrows, sun, login, graph, file).
 */
type IconProps = {
  readonly size?: number;
  readonly color?: string;
  readonly strokeWidth?: number;
};

const Svg: React.FC<IconProps & { readonly children: React.ReactNode }> = ({
  size = 16,
  color = "currentColor",
  strokeWidth = 1.8,
  children,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", flexShrink: 0 }}
  >
    {children}
  </svg>
);

export const SearchIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);

export const BookmarkIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M6 3h12v18l-6-4-6 4z" />
  </Svg>
);

export const HeartIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
  </Svg>
);

export const ShareIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="18" cy="5" r="2.5" />
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="19" r="2.5" />
    <path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" />
  </Svg>
);

export const EyeIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12z" />
    <circle cx="12" cy="12" r="2.5" />
  </Svg>
);

export const ArrowUpRightIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Svg>
);

export const ArrowRightIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Svg>
);

export const ChevronDownIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const SunIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Svg>
);

export const LoginIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M15 4h4v16h-4M10 17l5-5-5-5M15 12H3" />
  </Svg>
);

export const GraphIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="5" r="2.5" />
    <circle cx="5" cy="19" r="2.5" />
    <circle cx="19" cy="19" r="2.5" />
    <path d="M11 7.3 6.2 16.8M13 7.3l4.8 9.5" />
  </Svg>
);

export const FileUpIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M14 3H6v18h12V7z" />
    <path d="M14 3v4h4M12 17v-6M9 13.5l3-3 3 3" />
  </Svg>
);

export const DownloadIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 4v12M6 11l6 6 6-6M5 20h14" />
  </Svg>
);

export const CopyIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M16 8V4H4v12h4" />
  </Svg>
);

export const PrintIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M6 9V3h12v6M6 18H4v-7h16v7h-2M6 14h12v7H6z" />
  </Svg>
);

export const FolderIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M3 6h7l2 2h9v11H3z" />
  </Svg>
);

export const FileIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M14 3H6v18h12V7z" />
    <path d="M14 3v4h4" />
  </Svg>
);

export const CheckIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="m5 12 5 5 9-10" />
  </Svg>
);

export const LockIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </Svg>
);
