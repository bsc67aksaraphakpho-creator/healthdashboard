export interface ScreeningRecord {
  id: string; // รหัสบุคคล เช่น H0001
  screeningDate: string; // วันที่คัดกรอง เช่น 3/1/2026
  region: 'เมือง' | 'เหนือ' | 'ตะวันออก' | 'ตะวันตก' | 'ใต้'; // พื้นที่
  gender: 'หญิง' | 'ชาย'; // เพศ
  age: number; // อายุ
  height: number; // ส่วนสูง cm
  weight: number; // น้ำหนัก kg
  bmi: number; // BMI
  sbp: number; // SBP mmHg
  dbp: number; // DBP mmHg
  pulse: number; // ชีพจร bpm
  fbs: number; // น้ำตาล mg/dL
  smoking: 'สูบ' | 'ไม่สูบ'; // สูบบุหรี่
  alcohol: 'ดื่ม' | 'ไม่ดื่ม'; // ดื่มแอลกอฮอล์
  exercise: 'สม่ำเสมอ' | 'บางครั้ง' | 'ไม่ออกกำลังกาย'; // การออกกำลังกาย
  diabetesRisk: 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง'; // เบาหวาน_คัดกรอง
  hypertensionRisk: 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง'; // ความดันโลหิตสูง_คัดกรอง
  riskScore: number; // คะแนนความเสี่ยง
  riskLevel: 'ต่ำ' | 'ปานกลาง' | 'สูง'; // ระดับความเสี่ยง
  month: string; // เดือน เช่น 2026-01
}

export interface FilterState {
  search: string;
  riskLevel: string; // 'ทั้งหมด' | 'ต่ำ' | 'ปานกลาง' | 'สูง'
  smoking: string; // 'ทั้งหมด' | 'สูบ' | 'ไม่สูบ'
  alcohol: string; // 'ทั้งหมด' | 'ดื่ม' | 'ไม่ดื่ม'
  exercise: string; // 'ทั้งหมด' | 'สม่ำเสมอ' | 'บางครั้ง' | 'ไม่ออกกำลังกาย'
  region: string; // 'ทั้งหมด' | 'เมือง' | 'เหนือ' | 'ตะวันออก' | 'ตะวันตก' | 'ใต้'
  month: string; // 'ทั้งหมด' | '2026-01' | '2026-02' | '2026-03'
  gender: string; // 'ทั้งหมด' | 'หญิง' | 'ชาย'
  ageGroup: string; // 'ทั้งหมด' | '<30' | '30-49' | '50-59' | '60+'
}

export type NavTab = 'overview' | 'demographics' | 'risk' | 'behavior' | 'table';

export interface KPIStats {
  total: number;
  highRiskCount: number;
  highRiskPercent: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  avgBmi: number;
  minBmi: number;
  maxBmi: number;
  obesePercent: number; // BMI >= 25
  avgSbp: number;
  minSbp: number;
  maxSbp: number;
  avgDbp: number;
  avgFbs: number;
  minFbs: number;
  maxFbs: number;
  highSugarCount: number; // FBS >= 126
  highSugarPercent: number;
  highBpCount: number; // SBP >= 140 or DBP >= 90
  highBpPercent: number;
  healthyExercisePercent: number; // exercise === 'สม่ำเสมอ'
  nonSmokerPercent: number; // smoking === 'ไม่สูบ'
  nonAlcoholPercent: number; // alcohol === 'ไม่ดื่ม'
  avgAge: number;
}
