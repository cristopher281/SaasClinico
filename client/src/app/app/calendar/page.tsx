"use client"
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Calendar as CalendarIcon, Clock, User } from "lucide-react";

export default function SmartCalendar() {
    const [isSlideoverOpen, setIsSlideoverOpen] = useState(false);

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6 -mt-2 relative overflow-hidden">

            {/* Main Calendar View */}
            <div className="flex-1 bg-paper border border-border rounded-xl soft-shadow flex flex-col overflow-hidden">

                {/* Calendar Header */}
                <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold">Octubre 2026</h2>
                        <div className="flex bg-white border border-border rounded-lg overflow-hidden">
                            <button className="px-3 py-1.5 hover:bg-gray-50 border-r border-border"><ChevronLeft size={18} /></button>
                            <button className="px-4 py-1.5 text-sm font-medium hover:bg-gray-50 border-r border-border">Hoy</button>
                            <button className="px-3 py-1.5 hover:bg-gray-50"><ChevronRight size={18} /></button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex bg-white border border-border rounded-lg overflow-hidden text-sm">
                            <button className="px-4 py-1.5 font-medium bg-primary-50 text-primary-700">Semana</button>
                            <button className="px-4 py-1.5 font-medium hover:bg-gray-50">Día</button>
                        </div>
                        <button
                            onClick={() => setIsSlideoverOpen(true)}
                            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-1.5 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                        >
                            <Plus size={16} /> Nueva Cita
                        </button>
                    </div>
                </div>

                {/* Calendar Grid (Mock) */}
                <div className="flex-1 overflow-y-auto bg-white p-4">
                    {/* Simple UI Mock for calendar grid using columns */}
                    <div className="grid grid-cols-5 gap-4 h-full min-h-[600px]">
                        {['Lunes 11', 'Martes 12', 'Miércoles 13', 'Jueves 14', 'Viernes 15'].map((day, idx) => (
                            <div key={idx} className="border-r border-border last:border-0 relative">
                                <h3 className="text-center font-medium text-sm text-muted mb-4 pb-2 border-b border-border">{day}</h3>

                                {/* Mock Events */}
                                {idx === 1 && (
                                    <div className="absolute top-20 left-2 right-4 bg-primary-50 border border-primary-200 rounded-md p-2 shadow-sm">
                                        <p className="text-xs font-semibold text-primary-800">10:00 - Consulta</p>
                                        <p className="text-[10px] text-primary-600">Andrea Martinez</p>
                                    </div>
                                )}
                                {idx === 3 && (
                                    <div className="absolute top-40 left-2 right-4 bg-success/10 border border-success/20 rounded-md p-2 shadow-sm">
                                        <p className="text-xs font-semibold text-success">13:30 - Control</p>
                                        <p className="text-[10px] text-success">Luis Gomez</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Slide-over New Appointment */}
            <div
                className={`absolute inset-y-0 right-0 w-full sm:w-96 bg-paper border-l border-border soft-shadow transform transition-transform duration-300 ease-in-out z-20 flex flex-col ${isSlideoverOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="p-5 border-b border-border flex justify-between items-center bg-gray-50/50">
                    <h2 className="font-semibold flex items-center gap-2"><CalendarIcon size={18} className="text-primary-600" /> Agendar Cita</h2>
                    <button
                        onClick={() => setIsSlideoverOpen(false)}
                        className="text-muted hover:text-foreground p-1 rounded-md transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-6">

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2"><User size={14} /> Paciente</label>
                        <input
                            type="text"
                            placeholder="Buscar paciente o crear nuevo..."
                            className="w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground flex items-center gap-2"><CalendarIcon size={14} /> Fecha</label>
                            <input
                                type="date"
                                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground flex items-center gap-2"><Clock size={14} /> Hora</label>
                            <input
                                type="time"
                                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Doctor / Especialidad</label>
                        <select className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 bg-white">
                            <option>Dr. Admin (General)</option>
                            <option>Dra. Rojas (Pediatría)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Motivo</label>
                        <textarea
                            placeholder="Breve nota para el doctor..."
                            className="w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary-500 min-h-[80px]"
                        />
                    </div>

                </div>

                <div className="p-5 border-t border-border bg-gray-50 flex gap-3">
                    <button
                        onClick={() => setIsSlideoverOpen(false)}
                        className="flex-1 py-2 text-sm font-medium text-muted hover:text-foreground bg-white border border-border rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 rounded-lg transition-colors shadow-sm">
                        Guardar Cita
                    </button>
                </div>

            </div>

        </div>
    );
}
