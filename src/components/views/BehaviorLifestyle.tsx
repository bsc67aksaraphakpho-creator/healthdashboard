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
import { 
  Flame, 
  Wine, 
  Activity, 
  Heart, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Award,
  Waves
} from 'lucide-react';
import { ScreeningRecord, NavTab } from '../../types';
import { getBehaviorRiskData } from '../../utils/statsUtils';

interface BehaviorLifestyleProps {
  records: ScreeningRecord[];
  onNavigateTab: (tab: NavTab) => void;
}

export const BehaviorLifestyle: React.FC<BehaviorLifestyleProps> = ({
  records,
  onNavigateTab
}) => {
  const behaviorData = getBehaviorRiskData(records);

  // Smoking breakdown
  const smokers = records.filter(r => r.smoking === 'สูบ');
  const nonSmokers = records.filter(r => r.smoking === 'ไม่สูบ');
  const smokerHighRate = smokers.length > 0 
    ? Math.round((smokers.filter(r => r.riskLevel === 'สูง').length / smokers.length) * 100) 
    : 0;
  const nonSmokerHighRate = nonSmokers.length > 0 
    ? Math.round((nonSmokers.filter(r => r.riskLevel === 'สูง').length / nonSmokers.length) * 100) 
    : 0;

  // Alcohol breakdown
  const drinkers = records.filter(r => r.alcohol === 'ดื่ม');
  const nonDrinkers = records.filter(r => r.alcohol === 'ไม่ดื่ม');
  const drinkerHighRate = drinkers.length > 0 
    ? Math.round((drinkers.filter(r => r.riskLevel === 'สูง').length / drinkers.length) * 100) 
    : 0;
  const nonDrinkerHighRate = nonDrinkers.length > 0 
    ? Math.round((nonDrinkers.filter(r => r.riskLevel === 'สูง').length / nonDrinkers.length) * 100) 
    : 0;

  // Exercise breakdown
  const exRegular = records.filter(r => r.exercise === 'สม่ำเสมอ');
  const exSometimes = records.filter(r => r.exercise === 'บางครั้ง');
  const exNone = records.filter(r => r.exercise === 'ไม่ออกกำลังกาย');

  const exRegularHighRate = exRegular.length > 0 
    ? Math.round((exRegular.filter(r => r.riskLevel === 'สูง').length / exRegular.length) * 100) 
    : 0;
  const exNoneHighRate = exNone.length > 0 
    ? Math.round((exNone.filter(r => r.riskLevel === 'สูง').length / exNone.length) * 100) 
    : 0;

  // Chart data comparing High Risk percentage across behavior habits
  const habitComparisonData = [
    { habit: 'สูบบุหรี่ 🔥', groupA: 'สูบ', highRateA: smokerHighRate, groupB: 'ไม่สูบ', highRateB: nonSmokerHighRate },
    { habit: 'ดื่มแอลกอฮอล์ 🍷', groupA: 'ดื่ม', highRateA: drinkerHighRate, groupB: 'ไม่ดื่ม', highRateB: nonDrinkerHighRate },
    { habit: 'การออกกำลังกาย 🏃', groupA: 'ไม่ออกกำลัง', highRateA: exNoneHighRate, groupB: 'สม่ำเสมอ', highRateB: exRegularHighRate },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title & Overview Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sky-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-950 bg-sky-100 px-3 py-1 rounded-full mb-1 border border-sky-200">
            <span>🏃</span> พฤติกรรมสุขภาพ &amp; ไลฟ์สไตล์ (Behavior &amp; Lifestyle) <span>🌊</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>ผลกระทบของบุหรี่, แอลกอฮอล์, และการออกกำลังกายต่อระดับความเสี่ยง</span>
            <span className="text-base">🫧</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            วิเคราะห์ 3 พฤติกรรมสุขภาพหลัก และผลกระทบต่อความดันโลหิต น้ำตาล และระดับความเสี่ยง (จัดสัดส่วนเท่ากัน)
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('table')}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-2xl bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition-all"
        >
          <span>ดูตารางข้อมูลรายบุคคล</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Equal-width Dimension Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Smoking Card */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-rose-100 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>การสูบบุหรี่ 🔥</span>
              </span>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                {smokers.length} คนสูบ
              </span>
            </div>
            <div className="text-2xl font-black text-rose-700 mb-1">
              {smokerHighRate}% <span className="text-xs font-normal text-slate-500">เสี่ยงสูง</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            เทียบกับกลุ่มไม่สูบบุหรี่ที่มีความเสี่ยงสูงเพียง {nonSmokerHighRate}%
          </p>
        </div>

        {/* Alcohol Card */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-amber-100 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Wine className="w-4 h-4 text-amber-500" />
                <span>การดื่มสุรา 🍷</span>
              </span>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {drinkers.length} คนดื่ม
              </span>
            </div>
            <div className="text-2xl font-black text-amber-700 mb-1">
              {drinkerHighRate}% <span className="text-xs font-normal text-slate-500">เสี่ยงสูง</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            กลุ่มดื่มแอลกอฮอล์มีความดัน SBP เฉลี่ยสูงกว่ากลุ่มไม่ดื่มอย่างมีนัยสำคัญ
          </p>
        </div>

        {/* Exercise Card */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-600" />
                <span>ออกกำลังกายสม่ำเสมอ ⚡</span>
              </span>
              <span className="text-[11px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                {exRegular.length} คน
              </span>
            </div>
            <div className="text-2xl font-black text-cyan-700 mb-1">
              {exRegularHighRate}% <span className="text-xs font-normal text-slate-500">เสี่ยงสูง</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            กลุ่มออกกำลังกายสม่ำเสมอมีระดับความเสี่ยงต่ำที่สุดและคุมน้ำหนักได้ดี
          </p>
        </div>

        {/* Inactive Lifestyle Card */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-orange-100 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-orange-500" />
                <span>ไม่ออกกำลังกาย 🛑</span>
              </span>
              <span className="text-[11px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                {exNone.length} คน
              </span>
            </div>
            <div className="text-2xl font-black text-orange-700 mb-1">
              {exNoneHighRate}% <span className="text-xs font-normal text-slate-500">เสี่ยงสูง</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            พฤติกรรมเนือยนิ่งสัมพันธ์กับภาวะอ้วนลงพุงและความเสี่ยงโรคหัวใจ
          </p>
        </div>

      </div>

      {/* Row 2: Equal 3-Column Behavior Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Box 1 (33.3% Equal Width): Smoking Details */}
        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between h-full">
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-2">
              <span>🔥</span> พฤติกรรมสูบบุหรี่
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-100 flex justify-between items-center">
                <span>กลุ่มสูบบุหรี่:</span>
                <span className="font-bold text-rose-700">{smokers.length} ราย (เสี่ยงสูง {smokerHighRate}%)</span>
              </div>
              <div className="p-3 bg-sky-50/70 rounded-2xl border border-sky-100 flex justify-between items-center">
                <span>กลุ่มไม่สูบบุหรี่:</span>
                <span className="font-bold text-sky-800">{nonSmokers.length} ราย (เสี่ยงสูง {nonSmokerHighRate}%)</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
            การสูบบุหรี่เพิ่มคะแนนความเสี่ยงโรคหลอดเลือดสมองและหัวใจอย่างมีนัยสำคัญ
          </p>
        </div>

        {/* Box 2 (33.3% Equal Width): Alcohol Details */}
        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between h-full">
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-2">
              <span>🍷</span> พฤติกรรมดื่มสุรา
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-100 flex justify-between items-center">
                <span>กลุ่มดื่มสุรา:</span>
                <span className="font-bold text-amber-700">{drinkers.length} ราย (เสี่ยงสูง {drinkerHighRate}%)</span>
              </div>
              <div className="p-3 bg-sky-50/70 rounded-2xl border border-sky-100 flex justify-between items-center">
                <span>กลุ่มไม่ดื่ม:</span>
                <span className="font-bold text-sky-800">{nonDrinkers.length} ราย (เสี่ยงสูง {nonDrinkerHighRate}%)</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
            การดื่มสุราสัมพันธ์กับภาวะความดันโลหิตสูงและไขมันพอกตับ
          </p>
        </div>

        {/* Box 3 (33.3% Equal Width): Exercise Details */}
        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between h-full">
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-2">
              <span>🏃</span> การออกกำลังกาย
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-cyan-50/70 rounded-2xl border border-cyan-100 flex justify-between items-center">
                <span>สม่ำเสมอ (≥3 วัน/สัปดาห์):</span>
                <span className="font-bold text-cyan-800">{exRegular.length} ราย ({exRegularHighRate}% เสี่ยง)</span>
              </div>
              <div className="p-2.5 bg-sky-50/70 rounded-2xl border border-sky-100 flex justify-between items-center">
                <span>บางครั้ง (1-2 วัน):</span>
                <span className="font-bold text-sky-800">{exSometimes.length} ราย</span>
              </div>
              <div className="p-2.5 bg-orange-50/70 rounded-2xl border border-orange-100 flex justify-between items-center">
                <span>ไม่ออกกำลังกาย:</span>
                <span className="font-bold text-orange-700">{exNone.length} ราย ({exNoneHighRate}% เสี่ยง)</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
            การออกกำลังกายช่วยลดระดับน้ำตาล FBS และค่าความดันโลหิตได้อย่างชัดเจน
          </p>
        </div>

      </div>

      {/* Row 3: Equal 50/50 Proportions (Habit Comparison Chart & Action Recommendations) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Box 1 (50% Equal Width): Habit Comparison Bar Chart */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>📊</span> เปรียบเทียบสัดส่วนเสี่ยงสูงตามกลุ่มพฤติกรรม
                <span>🌊</span>
              </h3>
              <span className="text-[11px] text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full font-semibold border border-sky-200">
                ร้อยละเสี่ยงสูง (%)
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              เปรียบเทียบร้อยละของผู้มีความเสี่ยงสูงระหว่างกลุ่มพฤติกรรมเสี่ยง (สีแดง) กับกลุ่มพฤติกรรมดี (สีฟ้าน้ำทะเล)
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={habitComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="habit" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="highRateA" name="กลุ่มพฤติกรรมเสี่ยง (สูบ/ดื่ม/ไม่ออก)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="highRateB" name="กลุ่มพฤติกรรมดี (ไม่สูบ/ไม่ดื่ม/ออกกำลัง)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 flex items-center justify-between">
            <span>วิเคราะห์ผลเชิงประจักษ์ (Empirical Evidence)</span>
            <span className="text-cyan-700 font-semibold">🌊 Sea Blue Lifestyle</span>
          </div>
        </div>

        {/* Box 2 (50% Equal Width): Clinical Action Recommendations */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>💡</span> ข้อเสนอแนะเชิงนโยบายสุขภาพ (Health Recommendations)
                <span>🐬</span>
              </h3>
              <span className="text-[11px] text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full font-semibold border border-cyan-200">
                Action Plan
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              แนวทางปรับเปลี่ยนพฤติกรรมตามระดับความเสี่ยงเพื่อลดความชุกโรค NCDs (จัดสัดส่วนเท่ากัน)
            </p>

            <div className="space-y-2.5 text-xs">
              
              <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200/80 flex items-start gap-3">
                <span className="text-lg">🚭</span>
                <div className="space-y-0.5">
                  <span className="font-bold text-rose-950">คลินิกเลิกบุหรี่และสุรา (Smoking &amp; Alcohol Cessation):</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    ส่งต่อกลุ่มเสี่ยงสูงที่สูบบุหรี่และดื่มสุราเข้าสู่คลินิกชุมชน เพื่อปรับพฤติกรรมเข้มข้น ลดความดันโลหิตและโอกาสเส้นเลือดในสมองแตก
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-200/80 flex items-start gap-3">
                <span className="text-lg">🏃</span>
                <div className="space-y-0.5">
                  <span className="font-bold text-sky-950">โครงการขยับกายวันละ 30 นาที (Physical Activity):</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    ส่งเสริมการเดินเร็วหรือแอโรบิกในกลุ่ม 50 ปีขึ้นไป เพื่อควบคุมระดับน้ำตาลสะสมและปรับค่าดัชนีมวลกาย (BMI) ให้เข้าสู่เกณฑ์ปกติ
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80 flex items-start gap-3">
                <span className="text-lg">🥗</span>
                <div className="space-y-0.5">
                  <span className="font-bold text-teal-950">โภชนาการชะลอไตเสื่อมและเบาหวาน (Medical Nutrition):</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    จำกัดปริมาณโซเดียมไม่เกิน 2,000 มก./วัน และลดอาหารหวานมันเค็มในกลุ่มผู้มีความดันและน้ำตาลเกินเกณฑ์
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>ผู้จัดทำ: <strong>นางสาวอักษราภัค พลศรี</strong> 💙</span>
            <button 
              onClick={() => onNavigateTab('overview')}
              className="text-sky-700 hover:text-sky-950 font-semibold"
            >
              กลับหน้าสรุปภาพรวม ➔
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
