import { Sidebar, MobileTopBar } from "@/components/sidebar";
import { GlobalSearch } from "@/components/global-search";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen">
      <Sidebar userEmail={user?.email ?? undefined} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <header className="border-b border-[var(--border)] bg-[var(--card)] px-4 py-3 md:px-6">
          <GlobalSearch />
        </header>
        <main className="flex-1 overflow-x-hidden p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
