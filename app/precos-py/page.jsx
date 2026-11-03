export const metadata = {
  title: 'Radar Paraguai — Muthua',
};

export default function PrecosPy() {
  return (
    <iframe
      src="/tools/precos-py.html"
      style={{
        display: 'block',
        width: '100%',
        height: '100vh',
        border: 'none',
      }}
      title="Radar Paraguai — gerenciador de preços"
    />
  );
}
