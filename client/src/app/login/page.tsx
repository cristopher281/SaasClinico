import Link from "next/link";
import { ArrowRight, Activity } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background">
      {/* Visual / Marketing Side */}
      <div className="hidden md:flex flex-col justify-center items-center bg-primary-900 border-r border-border text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-primary-900 to-primary-950"></div>
        <div className="relative z-10 max-w-md text-center">
          <Activity className="mx-auto mb-8 text-primary-300" size={64} />
          <h2 className="text-3xl font-semibold mb-4 tracking-tight">Potencia tu práctica médica</h2>
          <p className="text-primary-200 text-lg">
            SaaS Clínico unifica la gestión de pacientes, calendario y finanzas en una sola plataforma premium.
          </p>
        </div>
      </div>

      {/* Login Form Side */}
      <div className="flex flex-col justify-center px-8 md:px-20 lg:px-32 bg-paper relative">
        <div className="max-w-sm w-full mx-auto">
          <div className="mb-8 hidden md:flex items-center gap-2 text-primary-600">
            <Activity size={24} />
            <span className="font-semibold tracking-tight text-lg">SaaS Clínico</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight mb-2">Iniciar sesión</h1>
          <p className="text-muted text-sm mb-8">Ingresa tus credenciales para acceder a tu clínica.</p>

          <form className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Correo electrónico</label>
              <input
                type="email"
                placeholder="doctor@clinica.com"
                className="w-full border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Contraseña</label>
                <a href="#" className="text-xs text-primary-600 hover:text-primary-700 font-medium cursor-pointer">¿Olvidaste tu contraseña?</a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
              />
            </div>

            <button type="button" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg flex justify-center items-center gap-2 transition-colors mt-2 text-sm">
              <Link href="/app" className="flex items-center gap-2 w-full justify-center">
                Acceder <ArrowRight size={16} />
              </Link>
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted">
            ¿No tienes una cuenta? <a href="/registro-clinica" className="text-primary-600 font-medium hover:underline">Registra tu clínica</a>
          </div>
        </div>
      </div>
    </div>
  );
}
