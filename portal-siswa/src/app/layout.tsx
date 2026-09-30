import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Portal Siswa MAN Kota Batu', description: 'Portal akademik siswa' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
