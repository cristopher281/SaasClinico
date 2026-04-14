import { FileText, Clock, AlertCircle, Save, Stethoscope } from "lucide-react";

export default function DoctorConsole() {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6 -mt-2">

      {/* Left Column: Timeline & Context (25-30%) */}
      <div className="lg:w-1/3 xl:w-1/4 h-full flex flex-col gap-4">
        {/* Patient Hero Context */}
        <div className="bg-paper border border-border rounded-xl p-5 soft-shadow">
          <div className="flex gap-4 items-center mb-4">
            <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xl font-bold">
              AM
            </div>
            <div>
              <h2 className="font-semibold text-lg leading-tight">Andrea Martinez</h2>
              <p className="text-muted text-sm">34 años • Femenino</p>
            </div>
          </div>
          <div className="space-y-2 mt-4 pt-4 border-t border-border">
            <div className="bg-danger/10 text-danger-700 px-3 py-2 rounded-lg flex gap-2 items-center text-sm font-medium border border-danger/20">
              <AlertCircle size={16} className="text-danger" />
              Alergia: Penicilina
            </div>
            <div className="flex justify-between text-sm pt-2">
              <span className="text-muted">Presión art.</span>
              <span className="font-medium">120/80</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Peso</span>
              <span className="font-medium">65 kg</span>
            </div>
          </div>
        </div>

        {/* Clinical History Timeline */}
        <div className="bg-paper border border-border rounded-xl soft-shadow flex-1 overflow-y-auto">
          <div className="p-4 border-b border-border sticky top-0 bg-paper/95 backdrop-blur z-10 flex justify-between items-center">
            <h3 className="font-medium flex items-center gap-2"><Clock size={16} className="text-muted" /> Historial</h3>
          </div>
          <div className="p-4 space-y-6">
            <TimelineItem date="10 Sep 2026" title="Consulta General" desc="Dolor de espalda leve." />
            <TimelineItem date="05 Ago 2026" title="Resultados Lab" desc="Exámenes de sangre normales." />
            <TimelineItem date="12 Ene 2026" title="Primera visita" desc="Apertura de expediente." />
          </div>
        </div>
      </div>

      {/* Right Column: Diagnostic 'Pizarra' (70-75%) */}
      <div className="lg:w-2/3 xl:w-3/4 bg-paper border border-border rounded-xl soft-shadow flex flex-col h-full overflow-hidden">
        <div className="p-5 border-b border-border bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Stethoscope className="text-primary-600" size={20} />
            Nota de Evolución Médica
          </h2>
          <span className="text-xs font-medium bg-warning/20 text-warning-700 px-3 py-1 rounded-full border border-warning/30">
            Borrador guardado hace 2 mins
          </span>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Motivo de Consulta (Subjetivo)</label>
            <textarea
              placeholder="El paciente refiere..."
              className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Exploración Física (Objetivo)</label>
            <textarea
              placeholder="Tensión arterial, frecuencia cardíaca, hallazgos..."
              className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Diagnóstico (CIE-10 / Impresión)</label>
              <input
                type="text"
                placeholder="Ej. J00 - Resfriado común"
                className="w-full border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
              />
            </div>

            <div className="space-y-2 bg-primary-50/50 p-4 rounded-lg border border-primary-100">
              <label className="text-sm font-medium text-primary-900 flex items-center gap-2">
                <FileText size={16} /> Receta Rápida
              </label>
              <input
                type="text"
                placeholder="Buscar medicamento..."
                className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm bg-white"
              />
              <p className="text-xs text-muted mt-2">Usa la búsqueda para añadir medicamentos a la receta final.</p>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-border bg-gray-50/50 flex justify-end gap-3">
          <button className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-gray-100 rounded-lg transition-colors border border-transparent">
            Descartar
          </button>
          <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
            <Save size={16} />
            Finalizar y Firmar
          </button>
        </div>
      </div>

    </div>
  );
}

function TimelineItem({ date, title, desc }: { date: string, title: string, desc: string }) {
  return (
    <div className="relative pl-6 border-l-2 border-border pb-4 last:border-0 last:pb-0">
      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full border-4 border-paper bg-primary-400"></div>
      <p className="text-xs text-muted mb-1">{date}</p>
      <h4 className="font-medium text-sm">{title}</h4>
      <p className="text-sm text-foreground mt-1 bg-gray-50 p-2 rounded border border-border">{desc}</p>
    </div>
  );
}
