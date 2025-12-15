import { useParams } from 'react-router-dom'
import { useCertificate } from '../../hooks/useCertificate'
import { tracks } from '../../mocks/education'
import html2pdf from 'html2pdf.js'

export default function Certificate() {
  const { trackId } = useParams()
  const { get } = useCertificate()

  const certificate = trackId ? get(trackId) : null
  const track = tracks.find(t => t.id === trackId)

  if (!certificate || !track) {
    return <p>Certificado não encontrado.</p>
  }

  function downloadPDF() {
    const element = document.getElementById('certificate')
    if (!element) return

    html2pdf()
      .set({
        margin: 10,
        filename: `certificado-${track.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .save()
  }

  return (
    <div>
      <div
        id="certificate"
        style={{
          maxWidth: 700,
          margin: '40px auto',
          padding: 32,
          border: '2px solid #111',
          borderRadius: 12,
          textAlign: 'center',
          background: '#fff',
        }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 24 }}>
          Certificado de Conclusão
        </h1>

        <p style={{ fontSize: 16, marginBottom: 12 }}>
          Certificamos que
        </p>

        <p style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>
          {certificate.userName}
        </p>

        <p style={{ marginBottom: 24 }}>
          concluiu com êxito a trilha
        </p>

        <p style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 32 }}>
          {track.title}
        </p>

        <p style={{ fontSize: 14, color: '#555' }}>
          Emitido em{' '}
          {new Date(certificate.issuedAt).toLocaleDateString()}
        </p>
      </div>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button
          onClick={downloadPDF}
          style={{
            padding: '10px 20px',
            background: '#111',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Baixar certificado (PDF)
        </button>
      </div>
    </div>
  )
}
