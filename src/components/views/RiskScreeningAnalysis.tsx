import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  Cell,
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  Activity, 
  HeartPulse, 
  Droplet, 
  Scale, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Waves
} from 'lucide-react';
import { ScreeningRecord, NavTab } from '../../types';
import { 
  getMonthlyTrends, 
  getScreeningDiseaseBreakdown 
} from '../../utils/statsUtils';

interface RiskScreeningAnalysisProps {
  records: ScreeningRecord[];
  onNavigateTab: (tab: NavTab) => void;
}

export const RiskScreeningAnalysis: React.FC<RiskScreeningAnalysisProps> = ({
  records,
  onNavigateTab
}) => {
  const [scatterMetric, setScatterMetric] = useState<'fbs' | 'sbp'>('fbs');

  const trends = getMonthlyTrends(records);
  const diseaseBreakdown = getScreeningDiseaseBreakdown(records);

  // Scatter plot data for BMI vs Sugar & BMI vs Blood Pressure
  const scatterData = records.map(r => ({
    id: r.id,
    bmi: r.bmi,
    fbs: r.fbs,
    sbp: r.sbp,
    dbp: r.dbp,
    age: r.age,
    gender: r.gender,
    region: r.region,
    riskLevel: r.riskLevel,
    riskScore: r.riskScore,
    color: r.riskLevel === 'สูง' ? '#ef4444' : r.riskLevel === 'ปานกลาง' ? '#f59e0b' : '#06b6d4'
  }));

  // Risk Score Distribution (0 through 7)
  const scoreCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
  records.forEach(r => {
    if (scoreCounts[r.riskScore] !== undefined) {
      scoreCounts[r.riskScore]++;
    }
  });
  const scoreDistributionData = Object.entries(scoreCounts).map(([score, count]) => ({
    score: `${score} แต้ม`,
    count,
    riskLevel: Number(score) >= 4 ? 'เสี่ยงสูง' : Number(score) >= 2 ? 'เสี่ยงปานกลาง' : 'เสี่ยงต่ำ',
    fill: Number(score) >= 4 ? '#ef4444' : Number(score) >= 2 ? '#f59e0b' : '#06b6d4'
  }));

  // Custom Tooltip for Scatter
  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-2xl text-xs shadow-xl border border-sky-800 space-y-1">
          <div className="font-bold text-cyan-300 border-b border-slate-700 pb-1 flex justify-between gap-2">
            <span>รหัส: {data.id} 🐬</span>
            <span className="font-normal text-slate-300">({data.region} / {data.gender} {data.age} ปี)</span>
          </div>
          <div className="text-[11px] space-y-0.5">
            <div>BMI: <strong className="text-white">{data.bmi}</strong> kg/m²</div>
            <div>น้ำตาล FBS: <strong className="text-amber-300">{data.fbs}</strong> mg/dL</div>
            <div>ความดัน: <strong className="text-cyan-300">{data.sbp}/{data.dbp}</strong> mmHg</div>
            <div>ระดับความเสี่ยง: <strong style={{ color: data.color }}>{data.riskLevel} (คะแนน {data.riskScore})</strong></div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Introduction Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sky-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-950 bg-sky-100 px-3 py-1 rounded-full mb-1 border border-sky-200">
            <span>🩺</span> การวิเคราะห์โรคและความเสี่ยง (Risk &amp; Screening) <span>🌊</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>เจาะลึกการคัดกรองเบาหวาน, ความดันโลหิต, สหสัมพันธ์ BMI และแนวโน้มสุขภาพ</span>
            <span className="text-base">🫧</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            วิเคราะห์ 4 ตัวชี้วัดความเสี่ยง, 2 แนวโน้มตามช่วงเวลา (Health Trends) และความสัมพันธ์ทางสถิติ (แบ่งสัดส่วนเท่ากัน)
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('behavior')}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-2xl bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition-all"
        >
          <span>ไปที่พฤติกรรมสุขภาพ</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Health Risk Indicator Cards (Equal 4-column Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Risk 1: เบาหวาน_คัดกรอง */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-amber-100 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-amber-500" />
                <span>1. คัดกรองเบาหวาน</span>
              </span>
              <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full font-bold border border-amber-200">
                {diseaseBreakdown.dmPercent}% เสี่ยง
              </span>
            </div>
            <div className="text-2xl font-black text-amber-700 mb-1">
              {diseaseBreakdown.dmRisk} <span className="text-xs font-normal text-slate-500">จาก {diseaseBreakdown.total} ราย</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            ผู้มีผลคัดกรอง "มีแนวโน้ม/เสี่ยง" มีระดับน้ำตาล FBS ≥ 100 mg/dL
          </p>
        </div>

        {/* Risk 2: ความดันโลหิตสูง_คัดกรอง */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-rose-100 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <span>2. คัดกรองความดันโลหิต</span>
              </span>
              <span className="text-[10px] bg-rose-50 text-rose-800 px-2 py-0.5 rounded-full font-bold border border-rose-200">
                {diseaseBreakdown.htPercent}% เสี่ยง
              </span>
            </div>
            <div className="text-2xl font-black text-rose-700 mb-1">
              {diseaseBreakdown.htRisk} <span className="text-xs font-normal text-slate-500">จาก {diseaseBreakdown.total} ราย</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            ผู้มีผลคัดกรอง "มีแนวโน้ม/เสี่ยง" มีค่า SBP ≥ 130 หรือ DBP ≥ 85
          </p>
        </div>

        {/* Risk 3: โรคร่วม (เบาหวาน + ความดัน) */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-purple-100 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-purple-500" />
                <span>3. เสี่ยง 2 โรคพร้อมกัน</span>
              </span>
              <span className="text-[10px] bg-purple-50 text-purple-800 px-2 py-0.5 rounded-full font-bold border border-purple-200">
                {diseaseBreakdown.bothPercent}% โรคร่วม
              </span>
            </div>
            <div className="text-2xl font-black text-purple-700 mb-1">
              {diseaseBreakdown.bothRisk} <span className="text-xs font-normal text-slate-500">ราย</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            เสี่ยงทั้งเบาหวานและความดันโลหิตสูง จำเป็นต้องติดตามเร่งด่วน
          </p>
        </div>

        {/* Risk 4: กลุ่มสุขภาพปกติ */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                <span>4. ปลอดความเสี่ยงทั้งคู่</span>
              </span>
              <span className="text-[10px] bg-cyan-50 text-cyan-800 px-2 py-0.5 rounded-full font-bold border border-cyan-200">
                {diseaseBreakdown.neitherPercent}% ปกติ
              </span>
            </div>
            <div className="text-2xl font-black text-cyan-700 mb-1">
              {diseaseBreakdown.neitherRisk} <span className="text-xs font-normal text-slate-500">ราย</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            ไม่มีแนวโน้มทั้งเบาหวานและความดัน ผลตรวจสุขภาพอยู่ในเกณฑ์ปกติ
          </p>
        </div>

      </div>

      {/* Row 2: Correlation Analysis (Scatter Plots) */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>🔬</span> การวิเคราะห์สหสัมพันธ์ (Correlation: BMI vs Sugar &amp; Blood Pressure)
              <span>🌊</span>
            </h3>
            <p className="text-xs text-slate-500">
              ทดสอบความสัมพันธ์ระหว่างดัชนีมวลกาย (BMI) กับระดับน้ำตาลในเลือด หรือความดันโลหิต
            </p>
          </div>

          {/* Metric switch buttons */}
          <div className="inline-flex p-1 bg-sky-50 rounded-2xl border border-sky-200/80">
            <button
              onClick={() => setScatterMetric('fbs')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                scatterMetric === 'fbs' 
                  ? 'bg-white text-sky-950 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🩸 BMI กับน้ำตาล (FBS)
            </button>
            <button
              onClick={() => setScatterMetric('sbp')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                scatterMetric === 'sbp' 
                  ? 'bg-white text-sky-950 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🩺 BMI กับความดัน (SBP)
            </button>
          </div>
        </div>

        {/* Scatter Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                type="number" 
                dataKey="bmi" 
                name="BMI" 
                domain={[18, 35]} 
                unit=" kg/m²" 
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                label={{ value: 'ดัชนีมวลกาย (BMI kg/m²)', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#64748b' }}
              />
              <YAxis 
                type="number" 
                dataKey={scatterMetric === 'fbs' ? 'fbs' : 'sbp'} 
                name={scatterMetric === 'fbs' ? 'น้ำตาลในเลือด' : 'ความดันโลหิต SBP'} 
                unit={scatterMetric === 'fbs' ? ' mg/dL' : ' mmHg'} 
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                label={{ 
                  value: scatterMetric === 'fbs' ? 'ระดับน้ำตาลในเลือด FBS (mg/dL)' : 'ความดันโลหิต SBP (mmHg)', 
                  angle: -90, 
                  position: 'insideLeft', 
                  fontSize: 11, 
                  fill: '#64748b' 
                }}
              />
              <Tooltip content={<CustomScatterTooltip />} />
              <Scatter name="ผู้รับการตรวจคัดกรอง" data={scatterData} fill="#0284c7">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Interpretation Note */}
        <div className="mt-3 p-3.5 bg-sky-50 rounded-2xl border border-sky-200/80 text-xs text-sky-950 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-sky-950">การแปลผลสหสัมพันธ์ทางคลินิก (ธีมฟ้าน้ำทะเล):</span>
            <p className="text-[11px] leading-relaxed text-slate-600">
              กราฟแสดงสหสัมพันธ์เชิงบวกชัดเจน โดยบุคคลที่มีค่า BMI ≥ 28 (กลุ่มอ้วนระดับ 2) 
              มีความเสี่ยงสูงที่จะพบระดับน้ำตาลสะสม {'>'} 130 mg/dL และความดันโลหิตตัวบน SBP {'>'} 140 mmHg จุดสีแดงแสดงกลุ่มผู้มีความเสี่ยงสูง
            </p>
          </div>
        </div>
      </div>

      {/* Row 3: Equal 50/50 Proportions (Health Trends & Risk Score Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Box 1 (50% Equal Width): Health Trend Line Chart */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>📈</span> Health Trend: แนวโน้มตามเดือน (ม.ค. - มี.ค. 2569)
                <span>🌊</span>
              </h3>
              <span className="text-[11px] text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full font-semibold border border-sky-200">
                2 ตัวชี้วัดแนวโน้ม
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              ติดตามแนวโน้มค่าเฉลี่ยระดับน้ำตาล (FBS) และความดันโลหิต (SBP) แต่ละเดือน
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[80, 160]} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="avgSbp" 
                    name="ความดัน SBP เฉลี่ย (mmHg)" 
                    stroke="#0284c7" 
                    strokeWidth={3} 
                    dot={{ r: 5, fill: '#0284c7' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avgFbs" 
                    name="น้ำตาล FBS เฉลี่ย (mg/dL)" 
                    stroke="#06b6d4" 
                    strokeWidth={3} 
                    dot={{ r: 5, fill: '#06b6d4' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 flex items-center justify-between">
            <span>แนวโน้มสุขภาพ 3 เดือนแรกของปี 2569</span>
            <span className="text-sky-700 font-semibold">🌊 Sea Blue Metrics</span>
          </div>
        </div>

        {/* Box 2 (50% Equal Width): Risk Score Distribution Bar Chart */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>🎯</span> การกระจายคะแนนความเสี่ยง (Score 0-7)
                <span>🐬</span>
              </h3>
              <span className="text-[11px] text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full font-semibold border border-cyan-200">
                เกณฑ์ประเมิน
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              จำนวนผู้คัดกรองจำแนกตามคะแนนความเสี่ยงตั้งแต่ 0 ถึง 7 แต้ม (สัดส่วนเท่ากัน)
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="score" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" name="จำนวนคน (ราย)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>เกณฑ์: 0-1 (ต่ำ), 2-3 (ปานกลาง), 4-7 (สูง)</span>
            <span className="text-rose-600 font-bold">สูงสุด 7 แต้ม (3 ราย)</span>
          </div>
        </div>

      </div>

    </div>
  );
};
