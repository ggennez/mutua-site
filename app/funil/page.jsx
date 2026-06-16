export const metadata = {
  title: 'Funil Tracker — Muthua',
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
      title="Funil Tracker Muthua"
    />
  );
}
