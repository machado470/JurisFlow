export default function AppLayout({ children }: { children: any }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 bg-white border-b font-bold">
        AutoEscola Sim — Admin
      </header>

      <main className="p-6">
        {children}
      </main>
    </div>
  )
}
