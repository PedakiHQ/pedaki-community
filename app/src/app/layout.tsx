export default function RootLayout({ children }: { children: React.ReactNode }) {
  // See [locale]/layout.tsx for more details
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
