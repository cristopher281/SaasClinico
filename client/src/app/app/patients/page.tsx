import { Search, Plus, Filter, MoreHorizontal } from "lucide-react";

export default function PatientsDirectory() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Directorio de Pacientes</h1>
                    <p className="text-muted text-sm mt-1">Gestiona historias clínicas, datos de contacto y saldos.</p>
                </div>
                <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto">
                    <Plus size={16} />
                    Nuevo Paciente
                </button>
            </div>

            <div className="bg-paper border border-border rounded-xl soft-shadow overflow-hidden">
                {/* Table Toolbar */}
                <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 justify-between items-center bg-gray-50/50">
                    <div className="relative w-full sm:w-96">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, documento o teléfono..."
                            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-border rounded-lg bg-white hover:bg-gray-50 w-full sm:w-auto justify-center">
                        <Filter size={16} />
                        Filtros
                    </button>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/80 text-muted uppercase text-xs font-semibold tracking-wider border-b border-border">
                            <tr>
                                <th className="px-6 py-4">Paciente</th>
                                <th className="px-6 py-4">Documento</th>
                                <th className="px-6 py-4">Contacto</th>
                                <th className="px-6 py-4">Última Cita</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium text-xs">
                                            P{i}
                                        </div>
                                        Paciente Ejemplo {i}
                                    </td>
                                    <td className="px-6 py-4 text-muted">1234567{i}</td>
                                    <td className="px-6 py-4 text-muted">555-010{i}</td>
                                    <td className="px-6 py-4 text-muted">12 Oct 2026</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-success/10 text-success px-2.5 py-1 rounded-full text-xs font-medium">
                                            Activo
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-muted hover:text-primary-600 p-1 rounded transition-colors">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination mock */}
                <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted bg-gray-50/50">
                    <span>Mostrando 1 a 5 de 42 pacientes</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 mr-2 border border-border rounded bg-white hover:bg-gray-50 text-foreground font-medium disabled:opacity-50">Anterior</button>
                        <button className="px-3 py-1 border border-border rounded bg-white hover:bg-gray-50 text-foreground font-medium">Siguiente</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
