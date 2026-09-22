/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Menu, X, Sparkles, Waves, ArrowUpRight } from 'lucide-react';
import { FilterState, NavTab, ScreeningRecord } from './types';
import { fetchSheetData, DEFAULT_RECORDS, getFormattedThaiDateTime } from './data/sheetService';
import { calculateKPIs, filterRecords } from './utils/statsUtils';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TopBarFilters } from './components/TopBarFilters';
import { KPICards } from './components/KPICards';
import { ExecutiveOverview } from './components/views/ExecutiveOverview';
import { DemographicsGeography } from './components/views/DemographicsGeography';
import { RiskScreeningAnalysis } from './components/views/RiskScreeningAnalysis';
import { BehaviorLifestyle } from './components/views/BehaviorLifestyle';
import { DataTableDetailView } from './components/views/DataTableDetailView';

const initialFilters: FilterState = {
  search: '',
  riskLevel: 'ทั้งหมด',
  smoking: 'ทั้งหมด',
  alcohol: 'ทั้งหมด',
  exercise: 'ทั้งหมด',
  region: 'ทั้งหมด',
  month: 'ทั้งหมด',
  gender: 'ทั้งหมด',
  ageGroup: 'ทั้งหมด'
};

export default function App() {
  const [allRecords, setAllRecords] = useState<ScreeningRecord[]>(DEFAULT_RECORDS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>(getFormattedThaiDateTime());
  const [source, setSource] = useState<'live' | 'fallback'>('live');
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Load live data from Google Sheet on mount
  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchSheetData();
      setAllRecords(res.records);
      setSource(res.source);
      setLastUpdated(res.updatedAt);
    } catch (err) {
      console.error('Error fetching sheet data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter records based on active filters
  const filteredRecords = useMemo(() => {
    return filterRecords(allRecords, filters);
  }, [allRecords, filters]);

  // Compute live KPIs from filtered records
  const kpis = useMemo(() => {
    return calculateKPIs(filteredRecords);
  }, [filteredRecords]);

  // Reset filters
  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  // Slicer trigger for region
  const handleFilterRegion = (reg: string) => {
    setFilters(prev => ({
      ...prev,
      region: reg
    }));
  };

  return (
    <div className="min-h-screen bg-[#f4f9fd] text-slate-800 flex flex-col font-['Prompt','Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. Header (ชื่อ Dashboard, ผู้จัดทำ, วันเวลาอัปเดต) */}
      <Header
        lastUpdated={lastUpdated}
        source={source}
        isLoading={isLoading}
        onRefresh={loadData}
        recordCount={filteredRecords.length}
        totalOriginalCount={allRecords.length}
      />

      {/* Mobile Top bar menu trigger */}
      <div className="lg:hidden bg-white/95 backdrop-blur-md px-4 py-2.5 border-b border-sky-100 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-900 text-xs font-semibold border border-sky-200"
        >
          <Menu className="w-4 h-4 text-sky-700" />
          <span>เมนูนำทาง 🌊 ({currentTab})</span>
        </button>

        <div className="text-xs text-slate-600 flex items-center gap-1.5">
          <span>ผู้คัดกรอง:</span>
          <strong className="text-sky-900 font-bold">{filteredRecords.length} ราย 🐬</strong>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* Left Sidebar Navigation (4 Main Tabs + Detail Table) */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          kpis={kpis}
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          
          {/* Top Bar Filters & Slicers (Global Filters) */}
          <TopBarFilters
            filters={filters}
            onFilterChange={setFilters}
            onReset={handleResetFilters}
            filteredCount={filteredRecords.length}
            totalCount={allRecords.length}
          />

          {/* Health Overview KPI Cards (Summary Cards - Equal Proportions) */}
          <KPICards
            kpis={kpis}
            onNavigateTab={setCurrentTab}
          />

          {/* Tab Views */}
          <div className="transition-opacity duration-200">
            {currentTab === 'overview' && (
              <ExecutiveOverview
                records={filteredRecords}
                kpis={kpis}
                onNavigateTab={setCurrentTab}
              />
            )}

            {currentTab === 'demographics' && (
              <DemographicsGeography
                records={filteredRecords}
                onNavigateTab={setCurrentTab}
                onFilterRegion={handleFilterRegion}
              />
            )}

            {currentTab === 'risk' && (
              <RiskScreeningAnalysis
                records={filteredRecords}
                onNavigateTab={setCurrentTab}
              />
            )}

            {currentTab === 'behavior' && (
              <BehaviorLifestyle
                records={filteredRecords}
                onNavigateTab={setCurrentTab}
              />
            )}

            {currentTab === 'table' && (
              <DataTableDetailView
                records={filteredRecords}
              />
            )}
          </div>

        </main>

      </div>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-sky-100 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sky-900 font-semibold flex items-center gap-1">
              <span>🌊</span> Health Risk &amp; Behavior Dashboard
              <span>🐬</span>
            </span>
            <span className="text-slate-300">|</span>
            <span>จัดทำโดย: <strong className="text-slate-700">นางสาวอักษราภัค พลศรี</strong> 💙</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span>ธีมฟ้าน้ำทะเล (Sea Blue Ocean) • สัดส่วนสมดุล 🫧</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
