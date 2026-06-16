import './globals.css';

export const metadata = {
  title: 'Muthua — Revenue Operations & Growth Intelligence',
  description: 'Transformamos operações de receita em crescimento previsível.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
