import { Link } from 'react-router-dom'

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-white font-semibold">
          JurisFlow
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm rounded-lg border border-white/20 text-white hover:bg-white/5 transition"
          >
            Entrar
          </Link>

          <a
            href="#cta"
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition"
          >
            Solicitar acesso
          </a>
        </div>
      </div>
    </header>
  )
}
