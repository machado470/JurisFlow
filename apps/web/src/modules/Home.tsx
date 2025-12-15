export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border rounded-lg p-8 w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-bold">
          AutoEscola Sim / JurisFlow
        </h1>

        <p className="text-gray-600">
          Sistema de controle de risco operacional.
        </p>

        <a
          href="/admin/people-risk"
          className="inline-block underline text-blue-600"
        >
          Acessar painel de risco
        </a>
      </div>
    </div>
  )
}
