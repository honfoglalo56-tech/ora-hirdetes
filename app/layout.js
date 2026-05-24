import "./globals.css";

export const metadata = {
  title: "Óra Hirdetési Asszisztens",
  description: "Mutass egy képet, adj meg pár adatot és már kész is",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hu">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
