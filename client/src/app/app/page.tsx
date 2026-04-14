import { ArrowUpRight, Users, Calendar, DollarSign } from "lucide-react";

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-muted text-sm mt-1">Un resumen del estado actual de tu clínica.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Citas de Hoy"
          value="24"
          trend="+12%"
          trendUp={true}
          icon={<Calendar className="text-primary-500" size={24} />}
        />
        <MetricCard
          title="Nuevos Pacientes"
          value="12"
          trend="+4%"
          trendUp={true}
          icon={<Users className="text-success" size={24} />}
        />
        <MetricCard
          title="Ingresos del Mes"
          value="$12,450"
          trend="-2%"
          trendUp={false}
          icon={<DollarSign className="text-warning" size={24} />}
        />
      </div>

      {/* Main Content Area Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-paper border border-border rounded-xl p-6 soft-shadow">
          <h2 className="font-medium mb-4">Próximas Citas</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium text-sm">
                    {i === 1 ? 'JM' : i === 2 ? 'AR' : 'CP'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{i === 1 ? 'Juan Martinez' : i === 2 ? 'Ana Rojas' : 'Carlos Perez'}</p>
                    <p className="text-xs text-muted">Odontología General</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">10:00 AM</p>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary-600 bg-primary-50 px-2 py-1 rounded-full">Confirmada</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-paper border border-border rounded-xl p-6 soft-shadow">
          <h2 className="font-medium mb-4">Actividad Reciente</h2>
          <div className="space-y-4">
            <ActivityItem title="Nuevo paciente registrado" time="Hace 5 min" />
            <ActivityItem title="Pago recibido: $150" time="Hace 12 min" />
            <ActivityItem title="Cita reprogramada" time="Hace 1 hora" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, trendUp, icon }: { title: string, value: string, trend: string, trendUp: boolean, icon: React.ReactNode }) {
  return (
    <div className="bg-paper border border-border rounded-xl p-5 soft-shadow flex flex-col justify-between h-36">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-muted">{title}</h3>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-semibold">{value}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className={`text-xs font-medium flex items-center ${trendUp ? "text-success" : "text-danger"}`}>
            {trendUp ? <ArrowUpRight size={14} /> : <ArrowUpRight size={14} className="rotate-90" />}
            {trend}
          </span>
          <span className="text-xs text-muted">vs mes anterior</span>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ title, time }: { title: string, time: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-1.5 h-1.5 mt-2 rounded-full bg-primary-400"></div>
      <div>
        <p className="text-sm">{title}</p>
        <p className="text-xs text-muted">{time}</p>
      </div>
    </div>
  );
}
