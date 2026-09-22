import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  Scale, 
  HeartPulse, 
  Droplet, 
  Activity, 
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Waves
} from 'lucide-react';
import { KPIStats, NavTab } from '../types';

interface KPICardsProps {
  kpis: KPIStats;
  onNavigateTab: (tab: NavTab) => void;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis, onNavigateTab }) => {
  return (
    <section className="mb-6 space-y-3" aria-label="Health Overview KPI Summary">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-sky-950 flex items-center gap-2">
            <span>🌊</span> Health Overview (ตัวชี้วัดสุขภาพสำคัญ)
            <span>🐬</span>
          </h2>
          <p className="text-xs text-slate-500">
            สรุปข้อมูลสถิติสำคัญ 5 ด้าน (แบ่งสัดส่วนเท่ากันทุกการ์ด): จำนวน, ค่าเฉลี่ย, ค่าต่ำสุด-สูงสุด, สัดส่วน และร้อยละ
          </p>
        </div>
        <span className="text-xs font-semibold text-cyan-900 bg-cyan-100/90 px-3 py-1 rounded-full flex items-center gap-1.5 border border-cyan-200 shadow-2xs">
          <span>🫧</span> คำนวณแบบเรียลไทม์
        </span>
      </div>

      {/* 5 Equal Columns Grid with matched height */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: ผู้รับการคัดกรองทั้งหมด (Count & Ratio) */}
        <div 
          id="kpi-card-total"
          onClick={() => onNavigateTab('table')}
          className="bg-white rounded-3xl p-4 sm:p-5 border border-sky-100 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all duration-200 cursor-pointer group relative overflow-hidden flex flex-col justify-between h-full"
        >
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-sky-50 rounded-full transition-transform group-hover:scale-125 pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <span>🐬</span> คัดกรองทั้งหมด
              </span>
              <div className="p-2 rounded-xl bg-sky-100 text-sky-700 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-slate-800 tracking-tight">{kpis.total}</span>
              <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">ราย (100%)</span>
            </div>
          </div>

          {/* Ratio breakdown */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
              <span>🟢 ต่ำ: <strong>{kpis.lowRiskCount}</strong></span>
              <span>🟡 กลาง: <strong>{kpis.mediumRiskCount}</strong></span>
              <span>🔴 สูง: <strong>{kpis.highRiskCount}</strong></span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 flex overflow-hidden">
              <div style={{ width: `${(kpis.lowRiskCount / (kpis.total || 1)) * 100}%` }} className="bg-cyan-500"></div>
              <div style={{ width: `${(kpis.mediumRiskCount / (kpis.total || 1)) * 100}%` }} className="bg-amber-400"></div>
              <div style={{ width: `${(kpis.highRiskCount / (kpis.total || 1)) * 100}%` }} className="bg-rose-500"></div>
            </div>
          </div>
        </div>

        {/* Card 2: สัดส่วนผู้มีความเสี่ยงสูง (Percentage & High Count) */}
        <div 
          id="kpi-card-high-risk"
          onClick={() => onNavigateTab('risk')}
          className="bg-white rounded-3xl p-4 sm:p-5 border border-rose-100 shadow-sm hover:shadow-md hover:border-rose-400 transition-all duration-200 cursor-pointer group relative overflow-hidden flex flex-col justify-between h-full"
        >
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-rose-50 rounded-full transition-transform group-hover:scale-125 pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                <span>🚨</span> สัดส่วนเสี่ยงสูง
              </span>
              <div className="p-2 rounded-xl bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-rose-600 tracking-tight">{kpis.highRiskPercent}%</span>
              <span className="text-xs font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                {kpis.highRiskCount} ราย
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>เกณฑ์ประเมิน:</span>
            <span className="font-bold text-rose-600">คะแนน 4 - 7 แต้ม</span>
          </div>
        </div>

        {/* Card 3: ดัชนีมวลกายเฉลี่ย (Average, Min, Max BMI) */}
        <div 
          id="kpi-card-bmi"
          onClick={() => onNavigateTab('risk')}
          className="bg-white rounded-3xl p-4 sm:p-5 border border-sky-100 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all duration-200 cursor-pointer group relative overflow-hidden flex flex-col justify-between h-full"
        >
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-cyan-50 rounded-full transition-transform group-hover:scale-125 pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <span>⚖️</span> ดัชนีมวลกาย (BMI)
              </span>
              <div className="p-2 rounded-xl bg-cyan-100 text-cyan-700 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <Scale className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-slate-800 tracking-tight">{kpis.avgBmi}</span>
              <span className="text-xs font-semibold text-slate-500">kg/m²</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span className="text-slate-500">ต่ำ-สูง: <strong>{kpis.minBmi}-{kpis.maxBmi}</strong></span>
            <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
              อ้วน: {kpis.obesePercent}%
            </span>
          </div>
        </div>

        {/* Card 4: ความดันโลหิตเฉลี่ย (Average SBP / DBP, Min, Max) */}
        <div 
          id="kpi-card-bp"
          onClick={() => onNavigateTab('risk')}
          className="bg-white rounded-3xl p-4 sm:p-5 border border-sky-100 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all duration-200 cursor-pointer group relative overflow-hidden flex flex-col justify-between h-full"
        >
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-teal-50 rounded-full transition-transform group-hover:scale-125 pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <span>🫀</span> ความดันโลหิตเฉลี่ย
              </span>
              <div className="p-2 rounded-xl bg-teal-100 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <HeartPulse className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                {kpis.avgSbp}<span className="text-lg font-bold text-slate-400">/{kpis.avgDbp}</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500">mmHg</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span className="text-slate-500">ช่วง SBP: <strong>{kpis.minSbp}-{kpis.maxSbp}</strong></span>
            <span className="text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
              สูง: {kpis.highBpPercent}%
            </span>
          </div>
        </div>

        {/* Card 5: ระดับน้ำตาลในเลือดเฉลี่ย (Average FBS, Min, Max) */}
        <div 
          id="kpi-card-fbs"
          onClick={() => onNavigateTab('risk')}
          className="bg-white rounded-3xl p-4 sm:p-5 border border-sky-100 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all duration-200 cursor-pointer group relative overflow-hidden flex flex-col justify-between h-full"
        >
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-amber-50 rounded-full transition-transform group-hover:scale-125 pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <span>🩸</span> น้ำตาลในเลือด (FBS)
              </span>
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Droplet className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-slate-800 tracking-tight">{kpis.avgFbs}</span>
              <span className="text-xs font-semibold text-slate-500">mg/dL</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span className="text-slate-500">ต่ำ-สูง: <strong>{kpis.minFbs}-{kpis.maxFbs}</strong></span>
            <span className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
              สูง: {kpis.highSugarPercent}%
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
