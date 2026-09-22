import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Heart, 
  Activity, 
  MapPin, 
  Sparkles,
  Users,
  Award,
  Waves
} from 'lucide-react';
import { KPIStats, NavTab, ScreeningRecord } from '../../types';
import { 
  getRiskLevelDistribution, 
  getAgeRiskDistribution, 
  getRegionDistribution,
  getScreeningDiseaseBreakdown
} from '../../utils/statsUtils';

interface ExecutiveOverviewProps {
  records: ScreeningRecord[];
  kpis: KPIStats;
  onNavigateTab: (tab: NavTab) => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  records,
  kpis,
  onNavigateTab
}) => {
  // Update risk distribution colors to sea blue / cyan harmony
  const rawRiskDist = getRiskLevelDistribution(records);
  const riskDist = rawRiskDist.map(item => {
    if (item.key === 'ต่ำ') return { ...item, color: '#06b6d4' }; // ocean cyan
    if (item.key === 'ปานกลาง') return { ...item, color: '#f59e0b' }; // amber
    return { ...item, color: '#ef4444' }; // coral red
  });

  const ageRiskData = getAgeRiskDistribution(records);
  const regionDist = getRegionDistribution(records);
  const diseaseBreakdown = getScreeningDiseaseBreakdown(records);

  // Custom tooltips
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pct = kpis.total > 0 ? ((data.value / kpis.total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-2xl text-xs shadow-xl border border-sky-800">
          <div className="font-semibold flex items-center gap-1.5 mb-1">
            <span>{data.emoji}</span>
            <span>{data.name}</span>
          </div>
          <div className="text-cyan-300 font-bold">{data.value} ราย ({pct}%)</div>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-2xl text-xs shadow-xl border border-sky-800 space-y-1">
          <div className="font-bold text-cyan-300 mb-1 border-b border-slate-700 pb-1 flex items-center gap-1">
            <span>🌊</span>
            <span>{label}</span>
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3 text-[11px]">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                {entry.name}:
              </span>
              <span className="font-bold text-white">{entry.value} ราย</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Executive Highlight Banner */}
      <div className="bg-gradient-to-r from-sky-50 via-cyan-50 to-blue-50 p-5 sm:p-6 rounded-3xl border border-sky-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-900 bg-sky-100/90 px-3 py-1 rounded-full border border-sky-200 shadow-2xs">
            <span>🌊</span> รายงานสรุปผลภาพรวม (Executive Summary) <span>🐬</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>ภาพรวมผลการตรวจคัดกรองสุขภาพและระดับความเสี่ยงประชากร</span>
            <span className="text-base">🫧</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            จากการคัดกรองประชากรจำนวน <strong className="text-sky-900">{kpis.total} ราย</strong> พบว่าประชากรส่วนใหญ่ร้อยละ{' '}
            <strong className="text-rose-600">{kpis.highRiskPercent}% มีภาวะเสี่ยงสูง</strong> (คะแนนเสี่ยง 4-7 แต้ม) 
            โดยพบปัจจัยเสี่ยงหลักจาก <span className="text-slate-800 font-medium">ความดันโลหิตสูง ({diseaseBreakdown.htPercent}%)</span> และ 
            <span className="text-slate-800 font-medium"> ระดับน้ำตาลในเลือด ({diseaseBreakdown.dmPercent}%)</span>
          </p>
        </div>

        {/* Drill-through Jump button */}
        <button
          onClick={() => onNavigateTab('risk')}
          className="shrink-0 z-10 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-sky-500/25 transition-all active:scale-95"
        >
          <span>เจาะลึกความเสี่ยงโรค</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Row 1: Equal 50/50 Proportions (Donut Chart & Age Risk Group Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Box 1 (50% Equal Width): Donut Chart Risk Levels */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                <span>🎯</span> สัดส่วนระดับความเสี่ยง (Risk Proportion)
                <span>🫧</span>
              </h3>
              <span className="text-[11px] text-cyan-800 font-semibold bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                Donut Chart (สัดส่วนเท่ากัน)
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              จำแนกผู้เข้ารับการคัดกรองตามระดับความเสี่ยง ต่ำ ปานกลาง และสูง
            </p>

            <div className="h-64 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Center stat badge */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-800">{kpis.total}</span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <span>🐬</span> ผู้คัดกรอง
                </span>
              </div>
            </div>
          </div>

          {/* Legend breakdown list */}
          <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-slate-100 text-center">
            {riskDist.map(item => (
              <div 
                key={item.key}
                onClick={() => onNavigateTab('risk')} 
                className="p-2.5 rounded-2xl bg-sky-50/60 hover:bg-sky-100/80 transition-colors cursor-pointer border border-sky-100/60"
              >
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 mb-0.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span>{item.key}</span>
                </div>
                <div className="text-lg font-black text-slate-800">{item.value} ราย</div>
                <div className="text-[11px] text-slate-500">
                  {kpis.total > 0 ? ((item.value / kpis.total) * 100).toFixed(0) : 0}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Box 2 (50% Equal Width): Bar Chart High Risk by Age Groups */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                <span>📊</span> กลุ่มอายุที่มีความเสี่ยงสูง (Risk by Age)
                <span>🎂</span>
              </h3>
              <span className="text-[11px] text-sky-800 font-semibold bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                จำแนก 4 ช่วงวัย
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              เปรียบเทียบสัดส่วนกลุ่มเสี่ยงสูง (สีแดง) ปานกลาง (สีเหลือง) และต่ำ (สีฟ้า) ตามวัย
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageRiskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="ageGroup" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="low" name="เสี่ยงต่ำ" stackId="a" fill="#06b6d4" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="mid" name="เสี่ยงปานกลาง" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="high" name="เสี่ยงสูง" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 p-3 bg-sky-50 rounded-2xl border border-sky-200/80 text-xs text-sky-950 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>💡</span> ข้อสังเกต: กลุ่ม 60 ปีขึ้นไป พบความเสี่ยงสูง <strong>100%</strong> และ 50-59 ปี เสี่ยงสูงกว่า <strong>70%</strong>
            </span>
            <button 
              onClick={() => onNavigateTab('demographics')}
              className="font-bold text-sky-800 underline hover:text-sky-950 shrink-0 text-[11px]"
            >
              ดูข้อมูลประชากร
            </button>
          </div>
        </div>

      </div>

      {/* Row 2: Equal 50/50 Proportions (Region High Risk Overview & Drill-down Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Box 3 (50% Equal Width): Bar chart พื้นที่ที่มีผู้เสี่ยงสูง */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                <span>🏝️</span> พื้นที่ที่มีผู้เสี่ยงสูง (High Risk by Region)
                <span>📍</span>
              </h3>
              <span className="text-[11px] text-sky-800 font-semibold bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                5 พื้นที่เท่ากัน
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              แสดงจำนวนผู้ที่มีความเสี่ยงสูง (สีแดง) เทียบกับผู้คัดกรองทั้งหมด (สีฟ้าน้ำทะเล)
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionDist} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="region" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="total" name="คัดกรองทั้งหมด" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="high" name="กลุ่มเสี่ยงสูง" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 flex items-center justify-between">
            <span>พื้นที่ 5 ภาค: เหนือ, เมือง, ตะวันออก, ตะวันตก, ใต้</span>
            <button 
              onClick={() => onNavigateTab('demographics')}
              className="text-sky-700 hover:text-sky-900 font-semibold"
            >
              ดูสถิติเจาะลึก ➔
            </button>
          </div>
        </div>

        {/* Box 4 (50% Equal Width): Drill-through Action Cards */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                <span>⚡</span> ปุ่มเจาะลึกข้อมูล (Drill-down Actions)
                <span>🐬</span>
              </h3>
              <span className="text-[11px] text-cyan-800 font-semibold bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                คลิกข้ามหน้า
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              คลิกเพื่อเจาะลึกการวิเคราะห์ประเด็นที่สนใจได้ทันที (จัดสัดส่วนเท่ากัน)
            </p>

            <div className="space-y-2.5">
              
              {/* Drill 1: เบาหวาน */}
              <div 
                onClick={() => onNavigateTab('risk')}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200/70 hover:border-amber-400 transition-all cursor-pointer group flex items-center justify-between shadow-2xs"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <span>🩸</span> กลุ่มเสี่ยงโรคเบาหวาน (Diabetes Risk)
                  </div>
                  <div className="text-[11px] text-amber-800">
                    พบผู้มีแนวโน้ม/เสี่ยง <strong className="text-amber-950 font-bold">{diseaseBreakdown.dmRisk} ราย</strong> ({diseaseBreakdown.dmPercent}%)
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-amber-200 text-amber-900 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Drill 2: ความดันโลหิตสูง */}
              <div 
                onClick={() => onNavigateTab('risk')}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 to-red-50/60 border border-rose-200/70 hover:border-rose-400 transition-all cursor-pointer group flex items-center justify-between shadow-2xs"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                    <span>🫀</span> กลุ่มเสี่ยงความดันโลหิตสูง (Hypertension)
                  </div>
                  <div className="text-[11px] text-rose-800">
                    พบผู้มีแนวโน้ม/เสี่ยง <strong className="text-rose-950 font-bold">{diseaseBreakdown.htRisk} ราย</strong> ({diseaseBreakdown.htPercent}%)
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-rose-200 text-rose-900 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Drill 3: พฤติกรรมสุขภาพ */}
              <div 
                onClick={() => onNavigateTab('behavior')}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 to-cyan-50/60 border border-sky-200/80 hover:border-cyan-400 transition-all cursor-pointer group flex items-center justify-between shadow-2xs"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                    <span>🏃</span> ความสัมพันธ์พฤติกรรมกับความเสี่ยง
                  </div>
                  <div className="text-[11px] text-sky-800">
                    บุหรี่, สุรา และการออกกำลังกาย ส่งผลต่อโรคอย่างไร
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-sky-200 text-sky-900 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Drill 4: ตารางรายบุคคล */}
              <div 
                onClick={() => onNavigateTab('table')}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-all cursor-pointer group flex items-center justify-between text-xs text-slate-700"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <span>📋</span> เปิดดูตารางข้อมูลรายบุคคลพร้อมสีเน้นเตือน
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-800" />
              </div>

            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>ผู้จัดทำ: <strong>นางสาวอักษราภัค พลศรี</strong></span>
            <span className="text-cyan-700 font-semibold">🌊 Sea Blue Ocean Dashboard</span>
          </div>
        </div>

      </div>

    </div>
  );
};
