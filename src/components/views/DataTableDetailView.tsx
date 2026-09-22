import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Download, 
  Filter, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  HeartPulse, 
  Droplet, 
  Scale, 
  Flame, 
  Wine, 
  Activity,
  User,
  Calendar,
  MapPin,
  Sparkles,
  Waves
} from 'lucide-react';
import { ScreeningRecord } from '../../types';

interface DataTableDetailViewProps {
  records: ScreeningRecord[];
}

export const DataTableDetailView: React.FC<DataTableDetailViewProps> = ({ records }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ScreeningRecord | null>(null);
  const [sortField, setSortField] = useState<keyof ScreeningRecord>('riskScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter
  const filteredRecords = useMemo(() => {
    return records.filter(item => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return (
        item.id.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q) ||
        item.gender.toLowerCase().includes(q) ||
        item.riskLevel.toLowerCase().includes(q) ||
        item.exercise.toLowerCase().includes(q) ||
        item.smoking.toLowerCase().includes(q) ||
        item.alcohol.toLowerCase().includes(q)
      );
    });
  }, [records, searchTerm]);

  // Sort
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      return sortDirection === 'asc' 
        ? String(valA).localeCompare(String(valB)) 
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredRecords, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  const handleSort = (field: keyof ScreeningRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // CSV Export
  const exportToCSV = () => {
    const headers = [
      'รหัสบุคคล', 'วันที่คัดกรอง', 'พื้นที่', 'เพศ', 'อายุ', 'ส่วนสูง_cm', 'น้ำหนัก_kg',
      'BMI', 'SBP_mmHg', 'DBP_mmHg', 'ชีพจร_bpm', 'น้ำตาล_mg_dL', 'สูบบุหรี่', 'ดื่มแอลกอฮอล์',
      'การออกกำลังกาย', 'เบาหวาน_คัดกรอง', 'ความดันโลหิตสูง_คัดกรอง', 'คะแนนความเสี่ยง', 'ระดับความเสี่ยง', 'เดือน'
    ];

    const rows = sortedRecords.map(r => [
      r.id, r.screeningDate, r.region, r.gender, r.age, r.height, r.weight,
      r.bmi, r.sbp, r.dbp, r.pulse, r.fbs, r.smoking, r.alcohol,
      r.exercise, r.diabetesRisk, r.hypertensionRisk, r.riskScore, r.riskLevel, r.month
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `health_risk_dashboard_data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Conditional formatting helper
  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'สูง':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">🔴 เสี่ยงสูง</span>;
      case 'ปานกลาง':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">🟡 ปานกลาง</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">🟢 เสี่ยงต่ำ</span>;
    }
  };

  const getBmiBadge = (bmi: number) => {
    if (bmi >= 30) {
      return <span className="font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded text-[11px] border border-rose-200">{bmi} (อ้วน II)</span>;
    }
    if (bmi >= 25) {
      return <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[11px] border border-amber-200">{bmi} (อ้วน I)</span>;
    }
    if (bmi >= 23) {
      return <span className="font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">{bmi} (ท้วม)</span>;
    }
    return <span className="font-medium text-cyan-800 bg-cyan-50 px-1.5 py-0.5 rounded text-[11px] border border-cyan-200">{bmi} (ปกติ)</span>;
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Actions */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sky-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-950 bg-sky-100 px-3 py-1 rounded-full mb-1 border border-sky-200">
            <span>📋</span> ข้อมูลรายบุคคลเชิงลึก (Data Table &amp; Detail View) <span>🌊</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>ตารางบันทึกการคัดกรองรายบุคคล พร้อมสีเน้นเตือนความเสี่ยง</span>
            <span className="text-base">🐬</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            คลิกที่แถวใดก็ได้เพื่อเปิดดูแบบประเมินสุขภาพรายบุคคลเชิงลึก (Individual Health Record Card)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ค้นหาในตาราง... 🔍"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-sky-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-sky-500 focus:outline-none w-48"
            />
          </div>

          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-2xl bg-sky-600 hover:bg-sky-500 text-white shadow-sm shadow-sky-500/25 transition-all"
            title="ดาวน์โหลดข้อมูลเป็นไฟล์ CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ส่งออก CSV 📥</span>
          </button>
        </div>
      </div>

      {/* Conditional Formatting Guide Banner */}
      <div className="p-4 bg-gradient-to-r from-sky-50 via-cyan-50 to-blue-50/70 rounded-2xl border border-sky-200/80 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-600">
        <span className="font-semibold text-sky-950 flex items-center gap-1.5">
          <span>🎨</span> สีเน้นเตือนความเสี่ยง (Conditional Colors):
          <span>🫧</span>
        </span>
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> ปกติ/เสี่ยงต่ำ
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> ปานกลาง/เริ่มเสี่ยง (FBS ≥100 / SBP ≥130)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> เสี่ยงสูง/ผิดปกติ (FBS ≥126 / SBP ≥140 / BMI ≥25)
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-gradient-to-r from-sky-900 to-cyan-900 text-white font-semibold">
              <tr>
                <th onClick={() => handleSort('id')} className="py-3.5 px-3 cursor-pointer hover:bg-sky-800 transition-colors">
                  <div className="flex items-center gap-1">
                    <span>รหัสบุคคล</span>
                    <ArrowUpDown className="w-3 h-3 opacity-80" />
                  </div>
                </th>
                <th onClick={() => handleSort('screeningDate')} className="py-3.5 px-3 cursor-pointer hover:bg-sky-800 transition-colors">
                  <div className="flex items-center gap-1">
                    <span>วันที่</span>
                    <ArrowUpDown className="w-3 h-3 opacity-80" />
                  </div>
                </th>
                <th onClick={() => handleSort('region')} className="py-3.5 px-3 cursor-pointer hover:bg-sky-800 transition-colors">
                  <div className="flex items-center gap-1">
                    <span>พื้นที่</span>
                    <ArrowUpDown className="w-3 h-3 opacity-80" />
                  </div>
                </th>
                <th onClick={() => handleSort('gender')} className="py-3.5 px-2 cursor-pointer hover:bg-sky-800 transition-colors">
                  <span>เพศ</span>
                </th>
                <th onClick={() => handleSort('age')} className="py-3.5 px-2 text-center cursor-pointer hover:bg-sky-800 transition-colors">
                  <div className="flex items-center justify-center gap-1">
                    <span>อายุ</span>
                    <ArrowUpDown className="w-3 h-3 opacity-80" />
                  </div>
                </th>
                <th onClick={() => handleSort('bmi')} className="py-3.5 px-3 text-center cursor-pointer hover:bg-sky-800 transition-colors">
                  <div className="flex items-center justify-center gap-1">
                    <span>BMI</span>
                    <ArrowUpDown className="w-3 h-3 opacity-80" />
                  </div>
                </th>
                <th onClick={() => handleSort('sbp')} className="py-3.5 px-3 text-center cursor-pointer hover:bg-sky-800 transition-colors">
                  <div className="flex items-center justify-center gap-1">
                    <span>ความดัน (SBP/DBP)</span>
                    <ArrowUpDown className="w-3 h-3 opacity-80" />
                  </div>
                </th>
                <th onClick={() => handleSort('fbs')} className="py-3.5 px-3 text-center cursor-pointer hover:bg-sky-800 transition-colors">
                  <div className="flex items-center justify-center gap-1">
                    <span>น้ำตาล (FBS)</span>
                    <ArrowUpDown className="w-3 h-3 opacity-80" />
                  </div>
                </th>
                <th className="py-3.5 px-2 text-center">บุหรี่</th>
                <th className="py-3.5 px-2 text-center">สุรา</th>
                <th className="py-3.5 px-2 text-center">ออกกำลัง</th>
                <th onClick={() => handleSort('riskScore')} className="py-3.5 px-2 text-center cursor-pointer hover:bg-sky-800 transition-colors">
                  <div className="flex items-center justify-center gap-1">
                    <span>คะแนน</span>
                    <ArrowUpDown className="w-3 h-3 opacity-80" />
                  </div>
                </th>
                <th onClick={() => handleSort('riskLevel')} className="py-3.5 px-3 text-center cursor-pointer hover:bg-sky-800 transition-colors">
                  <div className="flex items-center justify-center gap-1">
                    <span>ระดับความเสี่ยง</span>
                    <ArrowUpDown className="w-3 h-3 opacity-80" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-8 text-center text-slate-400">
                    ไม่พบข้อมูลที่ตรงกับคำค้นหา
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((r, idx) => {
                  const isHighBp = r.sbp >= 140 || r.dbp >= 90;
                  const isMidBp = (r.sbp >= 130 && r.sbp < 140) || (r.dbp >= 85 && r.dbp < 90);
                  const isHighFbs = r.fbs >= 126;
                  const isMidFbs = r.fbs >= 100 && r.fbs < 126;

                  return (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedRecord(r)}
                      className={`
                        hover:bg-sky-50/70 transition-colors cursor-pointer
                        ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}
                      `}
                    >
                      {/* ID */}
                      <td className="py-2.5 px-3 font-mono font-bold text-sky-950 flex items-center gap-1">
                        <span>{r.id}</span>
                        <Sparkles className="w-2.5 h-2.5 text-cyan-500 opacity-0 group-hover:opacity-100" />
                      </td>

                      {/* Date */}
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {r.screeningDate}
                      </td>

                      {/* Region */}
                      <td className="py-2.5 px-3 font-medium text-slate-700 whitespace-nowrap">
                        🏝️ {r.region}
                      </td>

                      {/* Gender */}
                      <td className="py-2.5 px-2 text-slate-600">
                        {r.gender}
                      </td>

                      {/* Age */}
                      <td className="py-2.5 px-2 text-center font-medium text-slate-700">
                        {r.age}
                      </td>

                      {/* BMI with conditional badge */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        {getBmiBadge(r.bmi)}
                      </td>

                      {/* SBP/DBP with conditional color */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className={`
                          font-mono font-bold px-2 py-0.5 rounded text-[11px]
                          ${isHighBp ? 'bg-rose-100 text-rose-800 border border-rose-300' : isMidBp ? 'bg-amber-100 text-amber-800' : 'text-cyan-800'}
                        `}>
                          {r.sbp}/{r.dbp}
                        </span>
                      </td>

                      {/* FBS with conditional color */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className={`
                          font-mono font-bold px-2 py-0.5 rounded text-[11px]
                          ${isHighFbs ? 'bg-rose-100 text-rose-800 border border-rose-300' : isMidFbs ? 'bg-amber-100 text-amber-800' : 'text-cyan-800'}
                        `}>
                          {r.fbs}
                        </span>
                      </td>

                      {/* Smoking */}
                      <td className="py-2.5 px-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${r.smoking === 'สูบ' ? 'bg-rose-100 text-rose-900 font-bold' : 'text-slate-400'}`}>
                          {r.smoking}
                        </span>
                      </td>

                      {/* Alcohol */}
                      <td className="py-2.5 px-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${r.alcohol === 'ดื่ม' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-400'}`}>
                          {r.alcohol}
                        </span>
                      </td>

                      {/* Exercise */}
                      <td className="py-2.5 px-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${r.exercise === 'สม่ำเสมอ' ? 'bg-cyan-100 text-cyan-800 font-bold' : r.exercise === 'ไม่ออกกำลังกาย' ? 'bg-slate-200 text-slate-700' : 'text-slate-500'}`}>
                          {r.exercise}
                        </span>
                      </td>

                      {/* Score */}
                      <td className="py-2.5 px-2 text-center font-bold text-slate-800">
                        {r.riskScore}
                      </td>

                      {/* Risk Level */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        {getRiskBadge(r.riskLevel)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            แสดงแถวที่ <strong>{sortedRecords.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> ถึง <strong>{Math.min(currentPage * pageSize, sortedRecords.length)}</strong> จากทั้งหมด <strong>{sortedRecords.length}</strong> รายการ
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors font-medium"
            >
              ก่อนหน้า
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`
                  w-8 h-8 rounded-xl text-xs font-semibold transition-colors
                  ${currentPage === p 
                    ? 'bg-sky-600 text-white shadow-xs' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-sky-50'}
                `}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors font-medium"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      {/* Individual Health Record Detail Modal */}
      {selectedRecord && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedRecord(null)}
        >
          <div 
            className="bg-white rounded-3xl border border-sky-100 shadow-2xl max-w-lg w-full p-6 relative overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-sky-100 text-sky-950 font-mono font-bold text-sm">
                  {selectedRecord.id}
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                    <span>แบบประเมินสุขภาพรายบุคคล</span>
                    <span>🐬</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    วันที่คัดกรอง: {selectedRecord.screeningDate} ({selectedRecord.month})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Risk Summary Badge in Modal */}
            <div className={`p-4 rounded-2xl mb-4 border flex items-center justify-between ${
              selectedRecord.riskLevel === 'สูง' 
                ? 'bg-rose-50 border-rose-200 text-rose-900' 
                : selectedRecord.riskLevel === 'ปานกลาง' 
                  ? 'bg-amber-50 border-amber-200 text-amber-900' 
                  : 'bg-cyan-50 border-cyan-200 text-cyan-950'
            }`}>
              <div className="space-y-0.5">
                <span className="text-xs font-semibold">ผลการประเมินระดับความเสี่ยง:</span>
                <div className="text-lg font-black flex items-center gap-1.5">
                  {selectedRecord.riskLevel === 'สูง' && <span>🔴</span>}
                  {selectedRecord.riskLevel === 'ปานกลาง' && <span>🟡</span>}
                  {selectedRecord.riskLevel === 'ต่ำ' && <span>🟢</span>}
                  <span>ระดับความเสี่ยง: {selectedRecord.riskLevel}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] block">คะแนนความเสี่ยง</span>
                <span className="text-2xl font-black">{selectedRecord.riskScore} / 7</span>
              </div>
            </div>

            {/* Vitals Grid - Equal 2x2 Proportions */}
            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-500 block mb-0.5">ข้อมูลทั่วไป 👤</span>
                <div className="font-semibold text-slate-800">เพศ: {selectedRecord.gender} | อายุ: {selectedRecord.age} ปี</div>
                <div className="text-slate-600">พื้นที่: {selectedRecord.region}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-500 block mb-0.5">สัดส่วนร่างกาย ⚖️</span>
                <div className="font-semibold text-slate-800">สูง: {selectedRecord.height} cm | นน: {selectedRecord.weight} kg</div>
                <div className="text-slate-800 font-bold">BMI: {selectedRecord.bmi} kg/m²</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-500 block mb-0.5">สัญญาณชีพ &amp; ความดัน 🫀</span>
                <div className="font-bold text-slate-800 text-sm">{selectedRecord.sbp}/{selectedRecord.dbp} mmHg</div>
                <div className="text-slate-600">ชีพจร: {selectedRecord.pulse} bpm</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-500 block mb-0.5">ระดับน้ำตาลในเลือด 🩸</span>
                <div className="font-bold text-slate-800 text-sm">{selectedRecord.fbs} mg/dL</div>
                <div className="text-slate-600">{selectedRecord.fbs >= 126 ? '⚠️ เสี่ยงเบาหวาน' : selectedRecord.fbs >= 100 ? 'เสี่ยงเล็กน้อย' : '✅ เกณฑ์ปกติ'}</div>
              </div>
            </div>

            {/* Habits and Screenings - Equal 3 Column Grid */}
            <div className="p-3.5 bg-sky-50/60 rounded-2xl border border-sky-100 text-xs space-y-2 mb-4">
              <span className="font-bold text-sky-950 block">พฤติกรรมสุขภาพ &amp; การคัดกรองโรค (จัดสัดส่วนเท่ากัน):</span>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className="bg-white/80 p-2 rounded-xl border border-sky-100 text-center">
                  <span className="text-slate-500 block">สูบบุหรี่ 🔥</span>
                  <strong className={selectedRecord.smoking === 'สูบ' ? 'text-rose-700' : 'text-slate-700'}>{selectedRecord.smoking}</strong>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-sky-100 text-center">
                  <span className="text-slate-500 block">ดื่มแอลกอฮอล์ 🍷</span>
                  <strong className={selectedRecord.alcohol === 'ดื่ม' ? 'text-amber-700' : 'text-slate-700'}>{selectedRecord.alcohol}</strong>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-sky-100 text-center">
                  <span className="text-slate-500 block">ออกกำลังกาย 🏃</span>
                  <strong className={selectedRecord.exercise === 'สม่ำเสมอ' ? 'text-cyan-800' : 'text-slate-700'}>{selectedRecord.exercise}</strong>
                </div>
              </div>
              <div className="pt-2 border-t border-sky-200/60 flex justify-between text-[11px]">
                <span>คัดกรองเบาหวาน: <strong>{selectedRecord.diabetesRisk}</strong></span>
                <span>คัดกรองความดัน: <strong>{selectedRecord.hypertensionRisk}</strong></span>
              </div>
            </div>

            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedRecord(null)}
              className="w-full py-2.5 rounded-2xl bg-sky-900 hover:bg-sky-950 text-white font-semibold text-xs transition-colors"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
