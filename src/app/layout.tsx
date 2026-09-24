import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Cidadão Fiscal",
  description: "Acompanhe despesas públicas e transferências com clareza",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <a href="#conteudo-principal" className="skipLink">
          Pular para o conteúdo principal
        </a>
        <Header />
        <main id="conteudo-principal">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
