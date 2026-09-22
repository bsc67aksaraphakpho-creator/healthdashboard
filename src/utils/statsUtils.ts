import { FilterState, KPIStats, ScreeningRecord } from '../types';

export function getAgeGroup(age: number): '<30' | '30-49' | '50-59' | '60+' {
  if (age < 30) return '<30';
  if (age <= 49) return '30-49';
  if (age <= 59) return '50-59';
  return '60+';
}

export function filterRecords(records: ScreeningRecord[], filters: FilterState): ScreeningRecord[] {
  return records.filter(item => {
    // Search query
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchId = item.id.toLowerCase().includes(q);
      const matchRegion = item.region.toLowerCase().includes(q);
      const matchGender = item.gender.toLowerCase().includes(q);
      const matchRisk = item.riskLevel.toLowerCase().includes(q);
      if (!matchId && !matchRegion && !matchGender && !matchRisk) return false;
    }

    // Risk level
    if (filters.riskLevel !== 'ทั้งหมด' && item.riskLevel !== filters.riskLevel) {
      return false;
    }

    // Smoking
    if (filters.smoking !== 'ทั้งหมด' && item.smoking !== filters.smoking) {
      return false;
    }

    // Alcohol
    if (filters.alcohol !== 'ทั้งหมด' && item.alcohol !== filters.alcohol) {
      return false;
    }

    // Exercise
    if (filters.exercise !== 'ทั้งหมด' && item.exercise !== filters.exercise) {
      return false;
    }

    // Region
    if (filters.region !== 'ทั้งหมด' && item.region !== filters.region) {
      return false;
    }

    // Month
    if (filters.month !== 'ทั้งหมด' && item.month !== filters.month) {
      return false;
    }

    // Gender
    if (filters.gender !== 'ทั้งหมด' && item.gender !== filters.gender) {
      return false;
    }

    // Age group
    if (filters.ageGroup !== 'ทั้งหมด') {
      const group = getAgeGroup(item.age);
      if (group !== filters.ageGroup) return false;
    }

    return true;
  });
}

export function calculateKPIs(records: ScreeningRecord[]): KPIStats {
  const total = records.length;
  if (total === 0) {
    return {
      total: 0,
      highRiskCount: 0,
      highRiskPercent: 0,
      mediumRiskCount: 0,
      lowRiskCount: 0,
      avgBmi: 0,
      minBmi: 0,
      maxBmi: 0,
      obesePercent: 0,
      avgSbp: 0,
      minSbp: 0,
      maxSbp: 0,
      avgDbp: 0,
      avgFbs: 0,
      minFbs: 0,
      maxFbs: 0,
      highSugarCount: 0,
      highSugarPercent: 0,
      highBpCount: 0,
      highBpPercent: 0,
      healthyExercisePercent: 0,
      nonSmokerPercent: 0,
      nonAlcoholPercent: 0,
      avgAge: 0
    };
  }

  const highRiskCount = records.filter(r => r.riskLevel === 'สูง').length;
  const mediumRiskCount = records.filter(r => r.riskLevel === 'ปานกลาง').length;
  const lowRiskCount = records.filter(r => r.riskLevel === 'ต่ำ').length;

  const bmis = records.map(r => r.bmi);
  const avgBmi = parseFloat((bmis.reduce((a, b) => a + b, 0) / total).toFixed(1));
  const minBmi = Math.min(...bmis);
  const maxBmi = Math.max(...bmis);
  const obeseCount = records.filter(r => r.bmi >= 25).length;

  const sbps = records.map(r => r.sbp);
  const avgSbp = Math.round(sbps.reduce((a, b) => a + b, 0) / total);
  const minSbp = Math.min(...sbps);
  const maxSbp = Math.max(...sbps);

  const dbps = records.map(r => r.dbp);
  const avgDbp = Math.round(dbps.reduce((a, b) => a + b, 0) / total);

  const fbss = records.map(r => r.fbs);
  const avgFbs = Math.round(fbss.reduce((a, b) => a + b, 0) / total);
  const minFbs = Math.min(...fbss);
  const maxFbs = Math.max(...fbss);

  const highSugarCount = records.filter(r => r.fbs >= 126).length;
  const highBpCount = records.filter(r => r.sbp >= 140 || r.dbp >= 90).length;

  const healthyExerciseCount = records.filter(r => r.exercise === 'สม่ำเสมอ').length;
  const nonSmokerCount = records.filter(r => r.smoking === 'ไม่สูบ').length;
  const nonAlcoholCount = records.filter(r => r.alcohol === 'ไม่ดื่ม').length;

  const ages = records.map(r => r.age);
  const avgAge = Math.round(ages.reduce((a, b) => a + b, 0) / total);

  return {
    total,
    highRiskCount,
    highRiskPercent: parseFloat(((highRiskCount / total) * 100).toFixed(1)),
    mediumRiskCount,
    lowRiskCount,
    avgBmi,
    minBmi,
    maxBmi,
    obesePercent: parseFloat(((obeseCount / total) * 100).toFixed(1)),
    avgSbp,
    minSbp,
    maxSbp,
    avgDbp,
    avgFbs,
    minFbs,
    maxFbs,
    highSugarCount,
    highSugarPercent: parseFloat(((highSugarCount / total) * 100).toFixed(1)),
    highBpCount,
    highBpPercent: parseFloat(((highBpCount / total) * 100).toFixed(1)),
    healthyExercisePercent: parseFloat(((healthyExerciseCount / total) * 100).toFixed(1)),
    nonSmokerPercent: parseFloat(((nonSmokerCount / total) * 100).toFixed(1)),
    nonAlcoholPercent: parseFloat(((nonAlcoholCount / total) * 100).toFixed(1)),
    avgAge
  };
}

// Risk distribution data for Donut / Pie
export function getRiskLevelDistribution(records: ScreeningRecord[]) {
  const counts = { 'ต่ำ': 0, 'ปานกลาง': 0, 'สูง': 0 };
  records.forEach(r => {
    if (counts[r.riskLevel] !== undefined) {
      counts[r.riskLevel]++;
    }
  });
  return [
    { name: 'ความเสี่ยงต่ำ', key: 'ต่ำ', value: counts['ต่ำ'], color: '#10b981', emoji: '🟢' },
    { name: 'ความเสี่ยงปานกลาง', key: 'ปานกลาง', value: counts['ปานกลาง'], color: '#f59e0b', emoji: '🟡' },
    { name: 'ความเสี่ยงสูง', key: 'สูง', value: counts['สูง'], color: '#ef4444', emoji: '🔴' }
  ];
}

// Age Group Risk breakdown
export function getAgeRiskDistribution(records: ScreeningRecord[]) {
  const groups: Record<string, { total: number; low: number; mid: number; high: number; avgScore: number; scores: number[] }> = {
    '<30': { total: 0, low: 0, mid: 0, high: 0, avgScore: 0, scores: [] },
    '30-49': { total: 0, low: 0, mid: 0, high: 0, avgScore: 0, scores: [] },
    '50-59': { total: 0, low: 0, mid: 0, high: 0, avgScore: 0, scores: [] },
    '60+': { total: 0, low: 0, mid: 0, high: 0, avgScore: 0, scores: [] }
  };

  records.forEach(r => {
    const g = getAgeGroup(r.age);
    groups[g].total++;
    groups[g].scores.push(r.riskScore);
    if (r.riskLevel === 'ต่ำ') groups[g].low++;
    else if (r.riskLevel === 'ปานกลาง') groups[g].mid++;
    else if (r.riskLevel === 'สูง') groups[g].high++;
  });

  return Object.entries(groups).map(([ageGroup, data]) => {
    const avgScore = data.scores.length > 0 ? parseFloat((data.scores.reduce((a, b) => a + b, 0) / data.scores.length).toFixed(1)) : 0;
    const highPercent = data.total > 0 ? Math.round((data.high / data.total) * 100) : 0;
    return {
      ageGroup,
      total: data.total,
      low: data.low,
      mid: data.mid,
      high: data.high,
      highPercent,
      avgScore
    };
  });
}

// Region Risk breakdown
export function getRegionDistribution(records: ScreeningRecord[]) {
  const regionNames: Array<ScreeningRecord['region']> = ['เมือง', 'เหนือ', 'ตะวันออก', 'ตะวันตก', 'ใต้'];
  const map: Record<string, { total: number; low: number; mid: number; high: number; avgBmi: number; bmis: number[]; avgFbs: number; fbss: number[]; avgSbp: number; sbps: number[] }> = {};

  regionNames.forEach(rn => {
    map[rn] = { total: 0, low: 0, mid: 0, high: 0, avgBmi: 0, bmis: [], avgFbs: 0, fbss: [], avgSbp: 0, sbps: [] };
  });

  records.forEach(r => {
    if (!map[r.region]) {
      map[r.region] = { total: 0, low: 0, mid: 0, high: 0, avgBmi: 0, bmis: [], avgFbs: 0, fbss: [], avgSbp: 0, sbps: [] };
    }
    const item = map[r.region];
    item.total++;
    item.bmis.push(r.bmi);
    item.fbss.push(r.fbs);
    item.sbps.push(r.sbp);
    if (r.riskLevel === 'ต่ำ') item.low++;
    else if (r.riskLevel === 'ปานกลาง') item.mid++;
    else if (r.riskLevel === 'สูง') item.high++;
  });

  return Object.entries(map).map(([region, data]) => {
    const avgBmi = data.bmis.length > 0 ? parseFloat((data.bmis.reduce((a, b) => a + b, 0) / data.bmis.length).toFixed(1)) : 0;
    const avgFbs = data.fbss.length > 0 ? Math.round(data.fbss.reduce((a, b) => a + b, 0) / data.fbss.length) : 0;
    const avgSbp = data.sbps.length > 0 ? Math.round(data.sbps.reduce((a, b) => a + b, 0) / data.sbps.length) : 0;
    const highPercent = data.total > 0 ? Math.round((data.high / data.total) * 100) : 0;
    return {
      region,
      total: data.total,
      low: data.low,
      mid: data.mid,
      high: data.high,
      highPercent,
      avgBmi,
      avgFbs,
      avgSbp
    };
  });
}

// Trend data across months (Jan, Feb, Mar 2026)
export function getMonthlyTrends(records: ScreeningRecord[]) {
  const months = ['2026-01', '2026-02', '2026-03'];
  const monthLabels: Record<string, string> = {
    '2026-01': 'ม.ค. 2569 (Jan)',
    '2026-02': 'ก.พ. 2569 (Feb)',
    '2026-03': 'มี.ค. 2569 (Mar)'
  };

  return months.map(m => {
    const inMonth = records.filter(r => r.month === m);
    const count = inMonth.length;
    const highCount = inMonth.filter(r => r.riskLevel === 'สูง').length;
    const midCount = inMonth.filter(r => r.riskLevel === 'ปานกลาง').length;
    const lowCount = inMonth.filter(r => r.riskLevel === 'ต่ำ').length;
    const avgFbs = count > 0 ? Math.round(inMonth.reduce((a, b) => a + b.fbs, 0) / count) : 0;
    const avgSbp = count > 0 ? Math.round(inMonth.reduce((a, b) => a + b.sbp, 0) / count) : 0;
    const avgBmi = count > 0 ? parseFloat((inMonth.reduce((a, b) => a + b.bmi, 0) / count).toFixed(1)) : 0;

    return {
      month: m,
      name: monthLabels[m] || m,
      count,
      highCount,
      midCount,
      lowCount,
      highRate: count > 0 ? Math.round((highCount / count) * 100) : 0,
      avgFbs,
      avgSbp,
      avgBmi
    };
  });
}

// Behavior Cross-Analysis
export function getBehaviorRiskData(records: ScreeningRecord[]) {
  // Smoking vs Risk
  const smokingYes = records.filter(r => r.smoking === 'สูบ');
  const smokingNo = records.filter(r => r.smoking === 'ไม่สูบ');

  // Alcohol vs Risk
  const alcoholYes = records.filter(r => r.alcohol === 'ดื่ม');
  const alcoholNo = records.filter(r => r.alcohol === 'ไม่ดื่ม');

  // Exercise vs Risk
  const exRegular = records.filter(r => r.exercise === 'สม่ำเสมอ');
  const exSometimes = records.filter(r => r.exercise === 'บางครั้ง');
  const exNone = records.filter(r => r.exercise === 'ไม่ออกกำลังกาย');

  const calcGroup = (group: ScreeningRecord[], label: string, category: string) => {
    const total = group.length;
    const high = group.filter(r => r.riskLevel === 'สูง').length;
    const mid = group.filter(r => r.riskLevel === 'ปานกลาง').length;
    const low = group.filter(r => r.riskLevel === 'ต่ำ').length;
    return {
      category,
      label,
      total,
      high,
      mid,
      low,
      highPercent: total > 0 ? Math.round((high / total) * 100) : 0
    };
  };

  return [
    calcGroup(smokingYes, 'สูบบุหรี่', 'การสูบบุหรี่'),
    calcGroup(smokingNo, 'ไม่สูบบุหรี่', 'การสูบบุหรี่'),
    calcGroup(alcoholYes, 'ดื่มสุรา', 'แอลกอฮอล์'),
    calcGroup(alcoholNo, 'ไม่ดื่มสุรา', 'แอลกอฮอล์'),
    calcGroup(exRegular, 'ออกกำลังกายสม่ำเสมอ', 'การออกกำลังกาย'),
    calcGroup(exSometimes, 'ออกกำลังกายบางครั้ง', 'การออกกำลังกาย'),
    calcGroup(exNone, 'ไม่ออกกำลังกาย', 'การออกกำลังกาย')
  ];
}

// Screening Disease Risk breakdown
export function getScreeningDiseaseBreakdown(records: ScreeningRecord[]) {
  const total = records.length;
  const dmRisk = records.filter(r => r.diabetesRisk === 'มีแนวโน้ม/เสี่ยง').length;
  const htRisk = records.filter(r => r.hypertensionRisk === 'มีแนวโน้ม/เสี่ยง').length;
  const bothRisk = records.filter(r => r.diabetesRisk === 'มีแนวโน้ม/เสี่ยง' && r.hypertensionRisk === 'มีแนวโน้ม/เสี่ยง').length;
  const neitherRisk = records.filter(r => r.diabetesRisk === 'ไม่มี' && r.hypertensionRisk === 'ไม่มี').length;

  return {
    total,
    dmRisk,
    dmPercent: total > 0 ? Math.round((dmRisk / total) * 100) : 0,
    htRisk,
    htPercent: total > 0 ? Math.round((htRisk / total) * 100) : 0,
    bothRisk,
    bothPercent: total > 0 ? Math.round((bothRisk / total) * 100) : 0,
    neitherRisk,
    neitherPercent: total > 0 ? Math.round((neitherRisk / total) * 100) : 0
  };
}
