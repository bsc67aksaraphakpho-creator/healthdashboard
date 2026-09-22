import React from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Activity, 
  HeartHandshake, 
  TableProperties, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Waves
} from 'lucide-react';
import { NavTab, KPIStats } from '../types';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  kpis: KPIStats;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  kpis,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const navItems = [
    {
      id: 'overview' as NavTab,
      label: 'สรุปภาพรวม',
      subtitle: 'Executive Overview',
      icon: LayoutDashboard,
      emoji: '🌊',
      badge: `${kpis.total} ราย`
    },
    {
      id: 'demographics' as NavTab,
      label: 'วิเคราะห์ตามพื้นที่และประชากร',
      subtitle: 'Demographics & Geography',
      icon: MapPin,
      emoji: '🏝️',
      badge: '5 พื้นที่'
    },
    {
      id: 'risk' as NavTab,
      label: 'การวิเคราะห์โรคและความเสี่ยง',
      subtitle: 'Risk & Screening Analysis',
      icon: Activity,
      emoji: '🩺',
      badge: `${kpis.highRiskCount} เสี่ยงสูง`
    },
    {
      id: 'behavior' as NavTab,
      label: 'พฤติกรรมสุขภาพ',
      subtitle: 'Behavior & Lifestyle',
      icon: HeartHandshake,
      emoji: '🏃',
      badge: '3 พฤติกรรม'
    },
    {
      id: 'table' as NavTab,
      label: 'ตารางข้อมูลเชิงลึก',
      subtitle: 'Data Table & Detail View',
      icon: TableProperties,
      emoji: '📋',
      badge: `${kpis.total} แถว`
    }
  ];

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 lg:top-auto h-full lg:h-[calc(100vh-80px)] z-40 lg:z-10
        w-72 bg-white/95 backdrop-blur-md border-r border-sky-100 flex flex-col justify-between
        transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Navigation list */}
        <div className="p-4 overflow-y-auto space-y-6 flex-1">
          {/* Section title */}
          <div className="px-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                <span>🐬</span> เมนูนำทางหลัก (Navigation)
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-semibold flex items-center gap-1">
                <span>🫧</span> 4 หน้าหลัก
              </span>
            </div>
            <p className="text-[12px] text-slate-500 mt-1">
              เลือกหน้าเพื่อวิเคราะห์ข้อมูลเชิงลึกตามมิติต่างๆ
            </p>
          </div>

          {/* Nav Items */}
          <nav className="space-y-2" aria-label="Sidebar Navigation">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`
                    w-full text-left p-3 rounded-2xl flex items-center justify-between gap-3
                    transition-all duration-200 group relative
                    ${isActive 
                      ? 'bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-500/25 font-medium scale-[1.01]' 
                      : 'hover:bg-sky-50/80 text-slate-700 hover:text-sky-950'}
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`
                      p-2 rounded-xl flex items-center justify-center transition-colors
                      ${isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-sky-100 text-sky-700 group-hover:bg-sky-200'}
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold flex items-center gap-1.5 truncate">
                        <span>{item.label}</span>
                        <span className="text-xs">{item.emoji}</span>
                      </div>
                      <div className={`text-[11px] truncate ${isActive ? 'text-cyan-100' : 'text-slate-500'}`}>
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`
                      text-[11px] px-2 py-0.5 rounded-full font-medium
                      ${isActive 
                        ? 'bg-sky-950/40 text-cyan-100 border border-cyan-400/30' 
                        : 'bg-slate-100 text-slate-600 group-hover:bg-sky-100 group-hover:text-sky-800'}
                    `}>
                      {item.badge}
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-white translate-x-0.5' : 'text-slate-400 group-hover:text-sky-600'}`} />
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Quick Health Status Card in Sidebar */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50/70 border border-sky-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                <span>🎯</span> ตัวชี้วัดสุขภาพด่วน
              </span>
              <span className="text-[10px] text-sky-700 font-semibold bg-sky-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <span>🫧</span> Live
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/90 p-2.5 rounded-xl border border-sky-100 shadow-xs">
                <span className="text-[11px] text-slate-500 block">คัดกรองแล้ว</span>
                <span className="text-base font-bold text-slate-800">{kpis.total}</span>
                <span className="text-[10px] text-slate-500 block">ราย 👤</span>
              </div>
              <div className="bg-white/90 p-2.5 rounded-xl border border-rose-100 shadow-xs">
                <span className="text-[11px] text-rose-600 block flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-500" /> เสี่ยงสูง
                </span>
                <span className="text-base font-bold text-rose-600">{kpis.highRiskPercent}%</span>
                <span className="text-[10px] text-slate-500 block">({kpis.highRiskCount} ราย)</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 pt-1.5 border-t border-sky-200/60 flex items-center justify-between">
              <span>BMI เฉลี่ย: <strong className="text-sky-900">{kpis.avgBmi}</strong></span>
              <span>FBS: <strong className="text-sky-900">{kpis.avgFbs}</strong></span>
            </div>
          </div>
        </div>

        {/* Sidebar Footer: Student / Project info */}
        <div className="p-4 border-t border-sky-100 bg-sky-50/40 text-xs text-slate-600 space-y-1">
          <div className="flex items-center justify-between text-slate-700 font-medium">
            <span className="flex items-center gap-1.5 text-sky-900 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>โครงงานระบบสุขภาพ</span>
              <span>🌊</span>
            </span>
            <span className="text-[10px] bg-cyan-100 text-cyan-900 px-1.5 py-0.5 rounded-full font-mono font-bold">
              2026
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            จัดทำโดย: <strong>นางสาวอักษราภัค พลศรี</strong> 💙
          </p>
          <div className="text-[10px] text-cyan-700 flex items-center gap-1 pt-1 font-medium">
            <span>🐬</span> สีฟ้าน้ำทะเล (Sea Blue Ocean)
          </div>
        </div>
      </aside>
    </>
  );
};
