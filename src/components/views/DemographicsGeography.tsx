import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { MapPin, Users, Scale, HeartPulse, Droplet, ArrowUpRight, Award, ShieldAlert, Waves } from 'lucide-react';
import { ScreeningRecord, NavTab } from '../../types';
import { getRegionDistribution, getAgeRiskDistribution } from '../../utils/statsUtils';

interface DemographicsGeographyProps {
  records: ScreeningRecord[];
  onNavigateTab: (tab: NavTab) => void;
  onFilterRegion: (region: string) => void;
}

export const DemographicsGeography: React.FC<DemographicsGeographyProps> = ({
  records,
  onNavigateTab,
  onFilterRegion
}) => {
  const regionDist = getRegionDistribution(records);
  const ageRiskData = getAgeRiskDistribution(records);

  // Gender breakdown
  const maleRecords = records.filter(r => r.gender === 'ชาย');
  const femaleRecords = records.filter(r => r.gender === 'หญิง');

  const maleHigh = maleRecords.filter(r => r.riskLevel === 'สูง').length;
  const femaleHigh = femaleRecords.filter(r => r.riskLevel === 'สูง').length;

  const genderData = [
    { 
      name: 'เพศชาย 👨', 
      total: maleRecords.length, 
      highRisk: maleHigh, 
      highRate: maleRecords.length > 0 ? Math.round((maleHigh / maleRecords.length) * 100) : 0,
      color: '#0284c7' 
    },
    { 
      name: 'เพศหญิง 👩', 
      total: femaleRecords.length, 
      highRisk: femaleHigh, 
      highRate: femaleRecords.length > 0 ? Math.round((femaleHigh / femaleRecords.length) * 100) : 0,
      color: '#06b6d4' 
    }
  ];

  // Custom tooltips
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-2xl text-xs shadow-xl border border-sky-800 space-y-1">
          <div className="font-bold text-cyan-300 border-b border-slate-700 pb-1 mb-1 flex items-center gap-1">
            <span>🏝️ พื้นที่:</span>
            <span>{label}</span>
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-3 text-[11px]">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-bold text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Description Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sky-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-950 bg-sky-100 px-3 py-1 rounded-full mb-1 border border-sky-200">
            <span>🏝️</span> พื้นที่ &amp; ประชากรศาสตร์ (Geography &amp; Demographics) <span>🌊</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>วิเคราะห์เชิงลึกแยกตามพื้นที่ 5 ภาค, เพศ, และช่วงอายุ</span>
            <span className="text-base">🫧</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            สำรวจความเหลื่อมล้ำทางสุขภาพระหว่างพื้นที่ (เหนือ, เมือง, ตะวันออก, ตะวันตก, ใต้) พร้อมเจาะลึกโครงสร้างอายุและเพศ (จัดสัดส่วนเท่ากัน)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200/80">
          <span>🐬</span>
          <span>คลิกที่การ์ดภาคเพื่อกรองข้อมูล</span>
        </div>
      </div>

      {/* 5 Region Cards Slicer Grid - Strictly Equal Proportions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {regionDist.map(reg => (
          <div
            key={reg.region}
            onClick={() => onFilterRegion(reg.region)}
            className="bg-white p-4 sm:p-5 rounded-3xl border border-sky-100 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all cursor-pointer group flex flex-col justify-between h-full"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-600 group-hover:scale-110 transition-transform" />
                  <span>พื้นที่ {reg.region}</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-sky-100 text-sky-900 border border-sky-200">
                  {reg.total} ราย
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">เสี่ยงสูง:</span>
                  <span className={`font-bold ${reg.highPercent > 50 ? 'text-rose-600' : 'text-slate-700'}`}>
                    {reg.high} ราย ({reg.highPercent}%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">BMI เฉลี่ย:</span>
                  <span className="font-semibold text-slate-700">{reg.avgBmi}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">น้ำตาลเฉลี่ย:</span>
                  <span className="font-semibold text-slate-700">{reg.avgFbs} mg/dL</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">ความดัน SBP:</span>
                  <span className="font-semibold text-slate-700">{reg.avgSbp} mmHg</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-sky-700 font-semibold group-hover:text-cyan-800">
              <span className="flex items-center gap-1">
                <span>🌊</span> กรองภาคนี้
              </span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Equal 50/50 Proportions (Regional SBP/FBS Chart & Gender Demographics) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Box 1 (50% Equal Width): Regional SBP & FBS Comparison Chart */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>📊</span> ค่าเฉลี่ยสุขภาพรายพื้นที่ (Health by Region)
                <span>🌊</span>
              </h3>
              <span className="text-[11px] text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full font-semibold border border-sky-200">
                SBP vs FBS
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              แสดงค่าเฉลี่ยความดันโลหิต (SBP) และระดับน้ำตาลในเลือด (FBS) ในแต่ละพื้นที่
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionDist} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="region" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="avgSbp" name="ความดัน SBP เฉลี่ย (mmHg)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avgFbs" name="น้ำตาล FBS เฉลี่ย (mg/dL)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 flex items-center justify-between">
            <span>พื้นที่ 5 ภาค เปรียบเทียบสัดส่วนอย่างแม่นยำ</span>
            <span className="text-sky-700 font-semibold">🌊 Sea Blue Analytics</span>
          </div>
        </div>

        {/* Box 2 (50% Equal Width): Gender Structure & Risk */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>👥</span> โครงสร้างเพศและความเสี่ยง (Gender Analysis)
                <span>💙</span>
              </h3>
              <span className="text-[11px] text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full font-semibold border border-cyan-200">
                ชาย vs หญิง (50/50)
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              สัดส่วนผู้เข้ารับการตรวจคัดกรองและอัตราความเสี่ยงสูงตามเพศ (แบ่งสัดส่วนเท่ากัน)
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {genderData.map(g => (
                <div key={g.name} className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
                  <div className="text-xs font-bold text-sky-950 mb-1">{g.name}</div>
                  <div className="text-2xl font-black text-slate-800 mb-1">{g.total} ราย</div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>กลุ่มเสี่ยงสูง:</span>
                      <strong className="text-rose-600">{g.highRisk} ราย</strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>อัตราความเสี่ยง:</span>
                      <strong className="text-rose-600">{g.highRate}%</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Observation quote */}
            <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200/80 text-xs text-sky-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <span>💡</span> ข้อค้นพบทางระบาดวิทยา:
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600">
                เพศชายมีอัตราความเสี่ยงสูงสูงกว่าเล็กน้อยเนื่องจากมีพฤติกรรมสูบบุหรี่และดื่มแอลกอฮอล์ร่วมด้วย ในขณะที่เพศหญิงมีสัดส่วนกลุ่มเสี่ยงเบาหวานและ BMI สูงกว่าในกลุ่มวัยทอง
              </p>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigateTab('risk')}
              className="text-xs font-semibold text-sky-700 hover:text-sky-950 flex items-center gap-1"
            >
              <span>ไปที่หน้าการวิเคราะห์โรคและความเสี่ยง</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Row 3: Table of Region Rankings */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>🏆</span> ตารางจัดอันดับความเสี่ยงสุขภาพตามพื้นที่ (Region Health Leaderboard)
              <span>🌊</span>
            </h3>
            <p className="text-xs text-slate-500">
              เรียงลำดับพื้นที่ตามสัดส่วนผู้มีความเสี่ยงสูง และค่าเฉลี่ยตัวชี้วัดสำคัญ
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('table')}
            className="text-xs font-semibold text-sky-700 hover:underline flex items-center gap-1"
          >
            <span>ดูตารางรายบุคคล</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-sky-50 text-sky-950 font-bold border-b border-sky-200">
              <tr>
                <th className="py-3 px-3 rounded-l-2xl">พื้นที่ 🏝️</th>
                <th className="py-3 px-3 text-center">ผู้คัดกรอง (ราย)</th>
                <th className="py-3 px-3 text-center">เสี่ยงต่ำ 🟢</th>
                <th className="py-3 px-3 text-center">เสี่ยงปานกลาง 🟡</th>
                <th className="py-3 px-3 text-center">เสี่ยงสูง 🔴</th>
                <th className="py-3 px-3 text-center">ร้อยละเสี่ยงสูง</th>
                <th className="py-3 px-3 text-center">BMI เฉลี่ย</th>
                <th className="py-3 px-3 text-center">FBS เฉลี่ย</th>
                <th className="py-3 px-3 text-center rounded-r-2xl">SBP เฉลี่ย</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {regionDist
                .sort((a, b) => b.highPercent - a.highPercent)
                .map((r, i) => (
                  <tr key={r.region} className="hover:bg-sky-50/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-900 text-[10px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      {r.region}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700 font-medium">{r.total}</td>
                    <td className="py-3 px-3 text-center text-cyan-700 font-semibold">{r.low}</td>
                    <td className="py-3 px-3 text-center text-amber-700 font-semibold">{r.mid}</td>
                    <td className="py-3 px-3 text-center text-rose-700 font-bold">{r.high}</td>
                    <td className="py-3 px-3 text-center font-bold">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] ${r.highPercent > 50 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'}`}>
                        {r.highPercent}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700">{r.avgBmi}</td>
                    <td className="py-3 px-3 text-center text-slate-700">{r.avgFbs} mg/dL</td>
                    <td className="py-3 px-3 text-center text-slate-700">{r.avgSbp} mmHg</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
