export const metadata = {
  title: 'Calculadora Financeira — Muthua',
};

export default function Calculadora() {
  return (
    <iframe
      src="/tools/calculadora.html"
      style={{
        display: 'block',
        width: '100%',
        height: '100vh',
        border: 'none',
      }}
      title="Calculadora Financeira Muthua"
    />
  );
}
