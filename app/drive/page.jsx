export const metadata = {
  title: 'Drive — Muthua',
};

const folders = [
  {
    name: 'propostas',
    files: [
      {
        name: 'studio-viva.html',
        href: '/propostas/studio-viva',
        desc: 'Proposta — Vivá Pilates × Muthua',
      },
      {
        name: 'vagaja.html',
        href: '/propostas/vagaja',
        desc: 'Proposta — VagaJá × Muthua',
      },
    ],
  },
  {
    name: 'ferramentas',
    files: [
      {
        name: 'apresentacao.html',
        href: '/apresentacao',
        desc: 'Apresentação institucional — Muthua',
      },
      {
        name: 'calculadora.html',
        href: '/calculadora',
        desc: 'Calculadora financeira — Muthua',
      },
      {
        name: 'funil.html',
        href: '/funil',
        desc: 'Funil Tracker — Muthua',
      },
    ],
  },
];

const mono = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";

function FileIcon() {
  return (
    <svg aria-hidden="true" height="16" width="16" viewBox="0 0 16 16" fill="#7d8590" style={{ flexShrink: 0 }}>
      <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg aria-hidden="true" height="16" width="16" viewBox="0 0 16 16" fill="#58a6ff" style={{ flexShrink: 0 }}>
      <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z" />
    </svg>
  );
}

export default function Drive() {
  return (
    <main style={{ background: '#0d1117', minHeight: '100vh', padding: '64px 24px' }}>
      <style>{`
        .drive-row:hover { background: #161b22; }
        .drive-row:hover .drive-filename { text-decoration: underline; }
      `}</style>

      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <a
          href="/"
          style={{
            display: 'inline-block',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: '#7d8590',
            marginBottom: '32px',
          }}
        >
          ← muthuadesign.com.br
        </a>

        <h1
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '32px',
            fontWeight: 700,
            color: '#c9d1d9',
            marginBottom: '8px',
          }}
        >
          mutua <span style={{ color: '#7d8590', fontWeight: 400 }}>/</span> drive
        </h1>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            color: '#7d8590',
            marginBottom: '48px',
          }}
        >
          Acesso rápido a propostas e ferramentas da Muthua. Clique em um arquivo para abrir a página em uma nova aba.
        </p>

        {folders.map((folder) => (
          <div key={folder.name} style={{ marginBottom: '40px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '12px',
                fontFamily: mono,
                fontSize: '15px',
                fontWeight: 600,
                color: '#c9d1d9',
              }}
            >
              <FolderIcon />
              {folder.name}/
            </div>

            <div
              style={{
                border: '1px solid #21262d',
                borderRadius: '6px',
                overflow: 'hidden',
              }}
            >
              {folder.files.map((file, i) => (
                <a
                  key={file.name}
                  href={file.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="drive-row"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    borderBottom: i < folder.files.length - 1 ? '1px solid #21262d' : 'none',
                    textDecoration: 'none',
                  }}
                >
                  <FileIcon />
                  <span
                    className="drive-filename"
                    style={{
                      fontFamily: mono,
                      fontSize: '14px',
                      color: '#58a6ff',
                      flexShrink: 0,
                    }}
                  >
                    {file.name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      color: '#7d8590',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {file.desc}
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
