import localFont from "next/font/local";

export const gitlabSans = localFont({
  src: [
    {
      path: "../node_modules/@gitlab/fonts/gitlab-sans/GitLabSans.woff2",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../node_modules/@gitlab/fonts/gitlab-sans/GitLabSans-Italic.woff2",
      style: "italic",
      weight: "100 900",
    },
  ],
  variable: "--font-gitlab-sans",
  display: "swap",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Noto Sans",
    "Ubuntu",
    "Cantarell",
    "Helvetica Neue",
    "sans-serif",
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "Noto Color Emoji",
  ],
});

export const gitlabMono = localFont({
  src: [
    {
      path: "../node_modules/@gitlab/fonts/gitlab-mono/GitLabMono.woff2",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../node_modules/@gitlab/fonts/gitlab-mono/GitLabMono-Italic.woff2",
      style: "italic",
      weight: "100 900",
    },
  ],
  variable: "--font-gitlab-mono",
  display: "swap",
  fallback: [
    "Menlo",
    "DejaVu Sans Mono",
    "Liberation Mono",
    "Consolas",
    "Ubuntu Mono",
    "Courier New",
    "monospace",
  ],
});

export const fontClassName = `${gitlabSans.variable} ${gitlabMono.variable}`;
