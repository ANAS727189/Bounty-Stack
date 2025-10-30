import Sidebar from "@/components/Layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <div className="fixed left-0 top-20 bottom-0 w-64 z-40">
        <Sidebar />
      </div>
      <main className="ml-64 flex-1 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}