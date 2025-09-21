import '../assets/globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/hooks/Authcontext';


const inter = Inter({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  display: "swap",
});

export const metadata = {
  title: "Carrydey",
  keywords: "travel, money, earn, income, remote work, digital nomad",
  description: "Your travel and remote work companion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <main className='max-w-md mx-auto bg-white'>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}