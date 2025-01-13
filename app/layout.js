import './globals.css';

export const metadata = {
  title: 'Bill Splitter',
  description: 'A simple app to split bills evenly.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
