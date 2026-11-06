import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sparkles, HeartHandshake, Hourglass } from 'lucide-react';
import { useAnniversary } from '../context/AnniversaryContext';

interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  heartbeatsApprox: number;
  isFuture: boolean;
}

export const CounterSection: React.FC = () => {
  const { config } = useAnniversary();

  const [time, setTime] = useState<TimeElapsed>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
    totalHours: 0,
    heartbeatsApprox: 0,
    isFuture: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(config.anniversaryDate).getTime();
      const now = new Date().getTime();
      const diffMs = now - start;

      if (isNaN(start)) {
        return;
      }

      if (diffMs < 0) {
        // Data futura: contagem regressiva precisa até o momento
        const absDiff = Math.abs(diffMs);
        const totalSecs = Math.floor(absDiff / 1000);
        const days = Math.floor(totalSecs / 86400);
        const hours = Math.floor((totalSecs % 86400) / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = totalSecs % 60;

        setTime({
          years: Math.floor(days / 365),
          months: Math.floor((days % 365) / 30),
          days: days % 30,
          hours,
          minutes,
          seconds,
          totalDays: days,
          totalHours: Math.floor(absDiff / 3600000),
          heartbeatsApprox: Math.floor(totalSecs * 1.2),
          isFuture: true,
        });
        return;
      }

      // Data passada: Decomposição exata pelo calendário (considerando anos bissextos e dias de cada mês)
      const startDate = new Date(config.anniversaryDate);
      const currentDate = new Date();

      let cursor = new Date(startDate.getTime());
      let years = 0;
      let months = 0;
      let days = 0;

      // 1. Acumular anos completos
      while (true) {
        const nextYear = new Date(cursor.getTime());
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        if (nextYear.getTime() <= currentDate.getTime()) {
          cursor = nextYear;
          years++;
        } else {
          break;
        }
      }

      // 2. Acumular meses completos
      while (true) {
        const nextMonth = new Date(cursor.getTime());
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        if (nextMonth.getTime() <= currentDate.getTime()) {
          cursor = nextMonth;
          months++;
        } else {
          break;
        }
      }

      // 3. Acumular dias completos
      while (true) {
        const nextDay = new Date(cursor.getTime());
        nextDay.setDate(nextDay.getDate() + 1);
        if (nextDay.getTime() <= currentDate.getTime()) {
          cursor = nextDay;
          days++;
        } else {
          break;
        }
      }

      // 4. Calcular horas, minutos e segundos remanescentes exatos
      const remainingMs = currentDate.getTime() - cursor.getTime();
      const hours = Math.floor(remainingMs / 3600000);
      const minutes = Math.floor((remainingMs % 3600000) / 60000);
      const seconds = Math.floor((remainingMs % 60000) / 1000);

      const totalSecs = Math.floor(diffMs / 1000);
      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
      const heartbeatsApprox = Math.floor(totalSecs * 1.2);

      setTime({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        totalDays,
        totalHours,
        heartbeatsApprox,
        isFuture: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [config.anniversaryDate]);

  const units = [
    { label: 'Anos', value: time.years, singular: 'Ano' },
    { label: 'Meses', value: time.months, singular: 'Mês' },
    { label: 'Dias', value: time.days, singular: 'Dia' },
    { label: 'Horas', value: time.hours, singular: 'Hora' },
    { label: 'Minutos', value: time.minutes, singular: 'Minuto' },
    { label: 'Segundos', value: time.seconds, singular: 'Segundo' },
  ];

  const startDateFormatted = new Date(config.anniversaryDate).toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section id="tempo" className="py-16 md:py-24 bg-[#f5f3ef]/50 relative scroll-mt-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#735c00] mb-2">
            <Clock className="w-4 h-4 text-[#d4af37]" />
            <span>{time.isFuture ? 'Contagem Regressiva' : 'Linha do Tempo do Amor'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#2a0006] tracking-tight mb-4">
            {time.isFuture ? 'Tempo para a Nossa Data' : 'Cada Segundo ao Seu Lado'}
          </h2>
          <p className="text-sm sm:text-base text-[#544343]">
            {time.isFuture
              ? 'Esperando ansiosamente o momento em que nossa história começa oficialmente.'
              : `Desde ${startDateFormatted}, construindo lembranças eternas dia após dia.`}
          </p>
        </div>

        {/* 6-Unit Main Countdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 mb-10">
          {units.map((unit, idx) => (
            <div
              key={idx}
              className="glass-card rounded-xl p-4 sm:p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#d4af37]/60 group relative overflow-hidden"
            >
              {/* Subtle top metallic glow */}
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
              
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4a0e17] tabular-nums tracking-tight mb-1 group-hover:scale-105 transition-transform duration-200">
                {String(unit.value).padStart(2, '0')}
              </div>
              <div className="text-xs sm:text-sm font-medium uppercase tracking-wider text-[#867273]">
                {unit.value === 1 ? unit.singular : unit.label}
              </div>
            </div>
          ))}
        </div>

        {/* Aggregate Milestone Metrics (Unboxed, Zero-Pill) */}
        <div className="glass-panel rounded-xl p-6 sm:p-8 border border-[#d4af37]/30 max-w-4xl mx-auto shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#d9c1c1]/50">
            {/* Total Days */}
            <div className="px-4 py-2">
              <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider text-[#735c00] font-semibold mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Total de Dias</span>
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2a0006] tabular-nums">
                {time.totalDays.toLocaleString('pt-BR')} dias
              </div>
              <div className="text-xs text-[#867273] mt-1">
                De carinho, cumplicidade e união
              </div>
            </div>

            {/* Total Hours */}
            <div className="px-4 py-2">
              <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider text-[#735c00] font-semibold mb-1">
                <Hourglass className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Horas de Amor</span>
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2a0006] tabular-nums">
                {time.totalHours.toLocaleString('pt-BR')} horas
              </div>
              <div className="text-xs text-[#867273] mt-1">
                Vividas e compartilhadas lado a lado
              </div>
            </div>

            {/* Heartbeats */}
            <div className="px-4 py-2">
              <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider text-[#735c00] font-semibold mb-1">
                <HeartHandshake className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Batimentos Juntos</span>
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#4a0e17] tabular-nums flex items-center justify-center gap-2">
                <span>~{time.heartbeatsApprox.toLocaleString('pt-BR')}</span>
              </div>
              <div className="text-xs text-[#867273] mt-1">
                Batendo em um único ritmo por você
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Footer Message */}
        <div className="text-center mt-6">
          <p className="text-xs sm:text-sm text-[#867273] italic">
            &ldquo;O tempo nunca para, e meu amor por você só aumenta a cada segundo.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
};
