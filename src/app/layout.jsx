import './globals.css';
import ThemeRegistry from '@/theme/themeRegistry';
import Header from '@/components/Header';

export const metadata = {
  title: 'Guardia',
  description: 'Sistema Guardia – Frontend',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-brand-bg text-brand-text antialiased">
        <ThemeRegistry>
          <Header />
          <main className="mx-auto w-full max-w-6xl">
            {children}
          </main>
        </ThemeRegistry>
      </body>
    </html>
  );
}

