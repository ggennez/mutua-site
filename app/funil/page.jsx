export const metadata = {
  title: 'Funil Tracker — Mutua',
};

export default function Funil() {
  return (
    <iframe
      src="/tools/funil.html"
      style={{
        display: 'block',
        width: '100%',
        height: '100vh',
        border: 'none',
      }}
      title="Funil Tracker Mutua"
    />
  );
}
