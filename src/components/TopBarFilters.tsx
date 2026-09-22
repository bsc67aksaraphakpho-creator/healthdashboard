import React, { useState } from 'react';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  ChevronDown, 
  SlidersHorizontal, 
  Sparkles,
  Calendar,
  Heart,
  Activity,
  Flame,
  Wine,
  UserCheck
} from 'lucide-react';
import { FilterState } from '../types';

interface TopBarFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  filteredCount: number;
  totalCount: number;
}

export const TopBarFilters: React.FC<TopBarFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  filteredCount,
  totalCount
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const regions = ['ทั้งหมด', 'เมือง', 'เหนือ', 'ตะวันออก', 'ตะวันตก', 'ใต้'];
  const riskLevels = ['ทั้งหมด', 'ต่ำ', 'ปานกลาง', 'สูง'];
  const smokingOptions = ['ทั้งหมด', 'สูบ', 'ไม่สูบ'];
  const alcoholOptions = ['ทั้งหมด', 'ดื่ม', 'ไม่ดื่ม'];
  const exerciseOptions = ['ทั้งหมด', 'สม่ำเสมอ', 'บางครั้ง', 'ไม่ออกกำลังกาย'];
  const monthOptions = [
    { value: 'ทั้งหมด', label: 'ทุกเดือน (ม.ค. - มี.ค. 2569)' },
    { value: '2026-01', label: 'มกราคม 2569 (2026-01)' },
    { value: '2026-02', label: 'กุมภาพันธ์ 2569 (2026-02)' },
    { value: '2026-03', label: 'มีนาคม 2569 (2026-03)' }
  ];
  const genderOptions = ['ทั้งหมด', 'หญิง', 'ชาย'];
  const ageGroupOptions = [
    { value: 'ทั้งหมด', label: 'ทุกช่วงอายุ' },
    { value: '<30', label: 'น้อยกว่า 30 ปี' },
    { value: '30-49', label: '30 - 49 ปี' },
    { value: '50-59', label: '50 - 59 ปี' },
    { value: '60+', label: '60 ปีขึ้นไป' }
  ];

  // Check if any filter is active
  const isFiltered = 
    filters.search !== '' ||
    filters.region !== 'ทั้งหมด' ||
    filters.riskLevel !== 'ทั้งหมด' ||
    filters.smoking !== 'ทั้งหมด' ||
    filters.alcohol !== 'ทั้งหมด' ||
    filters.exercise !== 'ทั้งหมด' ||
    filters.month !== 'ทั้งหมด' ||
    filters.gender !== 'ทั้งหมด' ||
    filters.ageGroup !== 'ทั้งหมด';

  const updateField = (key: keyof FilterState, val: string) => {
    onFilterChange({
      ...filters,
      [key]: val
    });
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-sky-100 shadow-sm p-4 sm:p-5 mb-6 transition-all duration-200">
      
      {/* Top row: Region Button Slicer & Time Filter & Quick Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-sky-50">
        
        {/* Region Button Slicer with Equal Width Buttons */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-sky-950 uppercase tracking-wider flex items-center gap-1.5">
              <span>📍</span> ตัวกรองพื้นที่ (Region Button Slicer)
              <span className="text-xs">🌊</span>
            </label>
            <span className="text-[11px] text-slate-500">เลือกพื้นที่เปรียบเทียบ (แบ่งสัดส่วนเท่ากัน)</span>
          </div>
          
          {/* Equal 6-column grid for region buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2" role="group" aria-label="Region Slicer">
            {regions.map(r => {
              const active = filters.region === r;
              return (
                <button
                  key={r}
                  id={`filter-region-${r}`}
                  onClick={() => updateField('region', r)}
                  className={`
                    w-full py-2 px-2 text-xs font-semibold rounded-xl text-center transition-all duration-150 truncate
                    ${active 
                      ? 'bg-sky-600 text-white shadow-sm shadow-sky-500/30 scale-[1.02] border border-sky-600' 
                      : 'bg-sky-50/70 hover:bg-sky-100 text-slate-700 hover:text-sky-950 border border-sky-100/80'}
                  `}
                >
                  {r === 'ทั้งหมด' ? '🌊 ทั้งหมด' : `🏝️ ${r}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Filter & Search & Reset */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Month Slicer */}
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 text-sky-600 absolute left-3 top-2.5 pointer-events-none" />
            <select
              id="filter-month-select"
              value={filters.month}
              onChange={e => updateField('month', e.target.value)}
              className="pl-8 pr-7 py-1.5 text-xs font-medium bg-sky-50/70 hover:bg-sky-100 border border-sky-200/80 rounded-xl text-slate-700 focus:ring-2 focus:ring-sky-500 focus:outline-none appearance-none cursor-pointer"
            >
              {monthOptions.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Quick text search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              id="filter-text-search"
              type="text"
              placeholder="ค้นหาบุคคล/พื้นที่... 🔍"
              value={filters.search}
              onChange={e => updateField('search', e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-sky-200/80 rounded-xl text-slate-700 focus:ring-2 focus:ring-sky-500 focus:outline-none w-44 placeholder:text-slate-400"
            />
          </div>

          {/* Reset Filter Button */}
          {isFiltered && (
            <button
              id="reset-all-filters-btn"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors shadow-2xs"
              title="ล้างตัวกรองทั้งหมด"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ล้างตัวกรอง</span>
            </button>
          )}
        </div>

      </div>

      {/* Row 2: Equal Proportion Global Filter Selectors (6 Equal Columns on Desktop) */}
      <div className="pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
            <span>🎛️</span> ตัวกรองพฤติกรรม &amp; สุขภาพ (แบ่งสัดส่วนเท่ากัน 6 ช่อง)
            <span>🫧</span>
          </div>
          <span className="text-[11px] text-slate-500">
            แสดงผล: <strong className="text-sky-900">{filteredCount}</strong> จาก {totalCount} ราย
          </span>
        </div>

        {/* 6 Equal-width Columns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* 1. Risk Level */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
              <span>🎯</span> ระดับความเสี่ยง
            </label>
            <div className="relative">
              <select
                id="filter-risk-level"
                value={filters.riskLevel}
                onChange={e => updateField('riskLevel', e.target.value)}
                className="w-full py-1.5 pl-2.5 pr-6 text-xs bg-slate-50 border border-sky-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-sky-500 focus:outline-none appearance-none"
              >
                {riskLevels.map(r => (
                  <option key={r} value={r}>
                    {r === 'ทั้งหมด' ? 'ทั้งหมด (ทุกระดับ)' : r === 'สูง' ? '🔴 เสี่ยงสูง' : r === 'ปานกลาง' ? '🟡 ปานกลาง' : '🟢 เสี่ยงต่ำ'}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>

          {/* 2. Smoking */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
              <span>🚬</span> การสูบบุหรี่
            </label>
            <div className="relative">
              <select
                id="filter-smoking"
                value={filters.smoking}
                onChange={e => updateField('smoking', e.target.value)}
                className="w-full py-1.5 pl-2.5 pr-6 text-xs bg-slate-50 border border-sky-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-sky-500 focus:outline-none appearance-none"
              >
                {smokingOptions.map(s => (
                  <option key={s} value={s}>{s === 'ทั้งหมด' ? 'ทั้งหมด' : s === 'สูบ' ? '🔥 สูบบุหรี่' : '🌿 ไม่สูบ'}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>

          {/* 3. Alcohol */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
              <span>🍷</span> ดื่มแอลกอฮอล์
            </label>
            <div className="relative">
              <select
                id="filter-alcohol"
                value={filters.alcohol}
                onChange={e => updateField('alcohol', e.target.value)}
                className="w-full py-1.5 pl-2.5 pr-6 text-xs bg-slate-50 border border-sky-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-sky-500 focus:outline-none appearance-none"
              >
                {alcoholOptions.map(a => (
                  <option key={a} value={a}>{a === 'ทั้งหมด' ? 'ทั้งหมด' : a === 'ดื่ม' ? '🍷 ดื่มสุรา' : '💧 ไม่ดื่ม'}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>

          {/* 4. Exercise */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
              <span>🏃</span> ออกกำลังกาย
            </label>
            <div className="relative">
              <select
                id="filter-exercise"
                value={filters.exercise}
                onChange={e => updateField('exercise', e.target.value)}
                className="w-full py-1.5 pl-2.5 pr-6 text-xs bg-slate-50 border border-sky-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-sky-500 focus:outline-none appearance-none"
              >
                {exerciseOptions.map(e => (
                  <option key={e} value={e}>{e === 'ทั้งหมด' ? 'ทั้งหมด' : e === 'สม่ำเสมอ' ? '⚡ สม่ำเสมอ' : e === 'บางครั้ง' ? '🚶 บางครั้ง' : '🛑 ไม่ออกกำลัง'}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>

          {/* 5. Gender */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
              <span>💙</span> เพศ
            </label>
            <div className="relative">
              <select
                id="filter-gender"
                value={filters.gender}
                onChange={e => updateField('gender', e.target.value)}
                className="w-full py-1.5 pl-2.5 pr-6 text-xs bg-slate-50 border border-sky-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-sky-500 focus:outline-none appearance-none"
              >
                {genderOptions.map(g => (
                  <option key={g} value={g}>{g === 'ทั้งหมด' ? 'ทั้งหมด (ชาย/หญิง)' : g === 'ชาย' ? '👨 ชาย' : '👩 หญิง'}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>

          {/* 6. Age Group */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
              <span>🎂</span> ช่วงอายุ
            </label>
            <div className="relative">
              <select
                id="filter-age-group"
                value={filters.ageGroup}
                onChange={e => updateField('ageGroup', e.target.value)}
                className="w-full py-1.5 pl-2.5 pr-6 text-xs bg-slate-50 border border-sky-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-sky-500 focus:outline-none appearance-none"
              >
                {ageGroupOptions.map(ag => (
                  <option key={ag.value} value={ag.value}>{ag.label}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
