import '../src/index.css';

export const metadata = {
  title: 'SPROUT — The Growth Guardian | Interactive Superhero Story & AI Chatbot',
  description: 'Enter Sprout\'s world in an award-winning interactive cinematic superhero narrative & talk with Sprout AI companion.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/webp" href="/favicon.webp" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.webp" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Press+Start+2P&family=Outfit:wght@500;600;700;800&family=Caveat:wght@600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
