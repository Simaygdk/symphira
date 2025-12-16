import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Uygulamanın en dış kabuğu, global provider YOK */}
        {children}
      </body>
    </html>
  );
}
