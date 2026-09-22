import React from 'react';
import { RefreshCw, HeartPulse, User, Waves } from 'lucide-react';

interface HeaderProps {
  lastUpdated: string;
  source?: 'live' | 'fallback';
  isLoading: boolean;
  onRefresh: () => void;
  recordCount: number;
  totalOriginalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  isLoading,
  onRefresh,
  recordCount,
  totalOriginalCount
}) => {
  return (
    <header className="bg-gradient-to-r from-sky-950 via-cyan-900 to-blue-950 text-white shadow-md border-b border-cyan-500/30 relative overflow-hidden">
      {/* Decorative subtle ambient wave glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-sky-400/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Title & Description */}
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center justify-center p-2.5 bg-cyan-500/20 rounded-2xl border border-cyan-400/30 text-cyan-300 shadow-inner">
                <Waves className="w-6 h-6 text-cyan-300 animate-pulse" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Health Risk &amp; Behavior Dashboard</span>
                <span className="text-xl" title="Ocean Theme">🌊</span>
                <span className="text-xl" title="Dolphin">🐬</span>
              </h1>
            </div>

            <p className="text-sm sm:text-base text-cyan-100/90 max-w-3xl leading-relaxed font-light">
              Dashboard วิเคราะห์ภาวะสุขภาพ ปัจจัยเสี่ยง และพฤติกรรมสุขภาพของผู้ได้รับการคัดกรอง
            </p>

            {/* Sub-meta: Author & Update timestamp */}
            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 pt-1 text-xs text-cyan-200/90">
              <div className="inline-flex items-center gap-1.5 bg-sky-950/60 px-3 py-1.5 rounded-xl border border-cyan-700/40 shadow-xs">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>ชื่อผู้จัดทำ: <strong className="text-white font-semibold">นางสาวอักษราภัค พลศรี</strong></span>
                <span className="text-cyan-300">✨</span>
              </div>

              <div className="inline-flex items-center gap-1.5 bg-sky-950/60 px-3 py-1.5 rounded-xl border border-cyan-700/40 shadow-xs">
                <span className="text-cyan-400">📅</span>
                <span>วัน/เวลา ที่อัปเดตข้อมูล: <strong className="text-white font-medium">{lastUpdated}</strong></span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0">
            <button
              id="refresh-sheet-btn"
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-sky-950 transition-all duration-150 shadow-md shadow-cyan-500/20 hover:shadow-cyan-400/30 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-sky-950 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'กำลังรีเฟรชข้อมูล...' : 'รีเฟรชข้อมูล 🔄'}</span>
            </button>
          </div>

        </div>

        {/* Dynamic filter notice indicator if records are filtered */}
        {recordCount !== totalOriginalCount && (
          <div className="mt-3 py-1.5 px-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-xs text-cyan-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>🔍 กำลังแสดงผลการกรอง:</span>
              <strong className="text-white font-bold">{recordCount}</strong> จากทั้งหมด {totalOriginalCount} ราย
            </div>
            <span className="text-[11px] text-cyan-300 font-medium">ตัวกรองทำงานแบบ Global ทุกหน้า 🌊</span>
          </div>
        )}
      </div>
    </header>
  );
};
