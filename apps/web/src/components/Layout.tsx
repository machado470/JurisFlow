import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-[#0D1117] text-gray-900 dark:text-gray-200">
      
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>

    </div>
  );
}
