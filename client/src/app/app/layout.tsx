import Link from "next/link";
import { LayoutDashboard, Users, CalendarDays, KeySquare, Receipt, Settings, Stethoscope } from "lucide-react";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar Modular */}
            <aside className="w-64 border-r border-border bg-paper flex flex-col justify-between hidden md:flex">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                            <Stethoscope size={18} />
                        </div>
                        <h1 className="font-semibold text-lg tracking-tight">SaaS Clínico</h1>
                    </div>

                    <nav className="space-y-1">
                        <NavItem href="/app" icon={<LayoutDashboard size={20} />} label="Overview" active />
                        <NavItem href="/app/calendar" icon={<CalendarDays size={20} />} label="Calendario" />
                        <NavItem href="/app/patients" icon={<Users size={20} />} label="Pacientes" />
                        <NavItem href="/app/reception" icon={<KeySquare size={20} />} label="Recepción" />
                        <NavItem href="/app/billing" icon={<Receipt size={20} />} label="Facturación" />
                    </nav>
                </div>

                <div className="p-6 border-t border-border">
                    <NavItem href="/app/settings" icon={<Settings size={20} />} label="Configuración" />
                    <div className="mt-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 border border-primary-200"></div>
                        <div>
                            <p className="text-sm font-medium">Dr. Admin</p>
                            <p className="text-xs text-muted">Clínica Central</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                {/* Topbar for mobile and context actions */}
                <header className="h-16 border-b border-border bg-paper/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10 w-full">
                    <div className="flex md:hidden items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                            <Stethoscope size={18} />
                        </div>
                        <span className="font-semibold">Clínico</span>
                    </div>

                    <div className="hidden md:flex flex-1">
                        <h2 className="text-sm font-medium text-muted">Dashboard / Overview</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Tenant selector Mock */}
                        <select className="text-sm border border-border rounded-md px-3 py-1.5 focus:outline-none focus:border-primary-500 bg-transparent">
                            <option>Clínica Central</option>
                            <option>Sucursal Norte</option>
                        </select>
                    </div>
                </header>

                <div className="p-6 md:p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavItem({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <Link href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${active ? "bg-primary-50 text-primary-700 font-medium" : "text-muted hover:text-foreground hover:bg-gray-50"}`}>
            <span className={active ? "text-primary-600" : ""}>{icon}</span>
            {label}
        </Link>
    );
}
