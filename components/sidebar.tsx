"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Home, CalendarClock, Settings, LogOut, Search, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { SPHERE_META, SPHERE_SLUGS } from "@/lib/spheres";

const NAV = [
  { href: "/",         label: "Dashboard", icon: Home },
  { href: "/contatos", label: "Contatos",  icon: Users },
  { href: "/agenda",   label: "Agenda",    icon: CalendarClock },
  { href: "/config",   label: "Configurações", icon: Settings },
];

export function Sidebar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();
  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }
  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--card)] p-4 md:flex">
      <Link href="/" className="mb-6 flex items-center gap-2 px-2">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-neutral-900 text-white">CP</div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">CRM Pessoal</div>
          <div className="text-xs text-neutral-500">Networking por esfera</div>
        </div>
      </Link>

      <nav className="space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                active ? "bg-neutral-100 font-medium dark:bg-neutral-800" : "hover:bg-neutral-100 dark:hover:bg-neutral-800",
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6">
        <div className="px-3 text-xs font-medium uppercase tracking-wide text-neutral-500">Esferas</div>
        <div className="mt-2 space-y-1">
          {SPHERE_SLUGS.map((s) => (
            <Link
              key={s}
              href={`/contatos?sphere=${s}`}
              className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: SPHERE_META[s].color }} />
              {SPHERE_META[s].name}
            </Link>
          ))}
          <Link href="/contatos?favorite=1" className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <Star size={14} className="text-amber-500" /> Favoritos
          </Link>
        </div>
      </div>

      <div className="mt-auto border-t border-[var(--border)] pt-3">
        {userEmail && <div className="px-3 pb-2 text-xs text-neutral-500">{userEmail}</div>}
        <button onClick={signOut} className="btn-ghost w-full justify-start">
          <LogOut size={14} /> Sair
        </button>
      </div>
    </aside>
  );
}

export function MobileTopBar() {
  return (
    <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--card)] px-4 py-3 md:hidden">
      <Link href="/" className="font-semibold">CRM Pessoal</Link>
      <div className="ml-auto flex items-center gap-1">
        <Link href="/contatos" className="btn-ghost px-2"><Users size={16} /></Link>
        <Link href="/agenda" className="btn-ghost px-2"><CalendarClock size={16} /></Link>
        <Link href="/config" className="btn-ghost px-2"><Settings size={16} /></Link>
      </div>
    </div>
  );
}
