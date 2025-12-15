export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  age: number;
  // Medical Examination Fields (all optional)
  surname?: string; // Ovog
  gender?: string; // Huis
  chiefComplaint?: string; // Zoviur
  // Visual Acuity
  vod?: string; // Visual Acuity Right Eye
  vos?: string; // Visual Acuity Left Eye
  // BCVA Prescription
  odSph?: string;
  odCyl?: string;
  odAxis?: string;
  osSph?: string;
  osCyl?: string;
  osAxis?: string;
  // Near Vision
  nearVisionOD?: string;
  nearVisionOS?: string;
  // Intraocular Pressure
  iop?: string;
  // Eye Movement
  eyeMovement?: string;
  eyeMovementDirection?: string;
  eyeMovementRestricted?: string;
  // Eye Findings (Right and Left)
  conjunctivaOD?: string;
  conjunctivaOS?: string;
  corneaOD?: string;
  corneaOS?: string;
  anteriorChamberOD?: string;
  anteriorChamberOS?: string;
  pupilOD?: string;
  pupilOS?: string;
  irisOD?: string;
  irisOS?: string;
  lensOD?: string;
  lensOS?: string;
  retinaOD?: string;
  retinaOS?: string;
  vitreousOD?: string;
  vitreousOS?: string;
  maculaOD?: string;
  maculaOS?: string;
  bloodVesselsOD?: string;
  bloodVesselsOS?: string;
  // Diagnosis, Recommendations, Follow-up
  diagnosis?: string; // Onosh
  recommendations?: string; // Zovllgoo
  followUp?: string; // Davtan uzleg
}

export interface MedicalExamination {
  id: string;
  patientId: string;
  surname?: string;
  gender?: string;
  chiefComplaint?: string;
  vod?: string;
  vos?: string;
  odSph?: string;
  odCyl?: string;
  odAxis?: string;
  osSph?: string;
  osCyl?: string;
  osAxis?: string;
  nearVisionOD?: string;
  nearVisionOS?: string;
  iop?: string;
  eyeMovement?: string;
  eyeMovementDirection?: string;
  eyeMovementRestricted?: string;
  conjunctivaOD?: string;
  conjunctivaOS?: string;
  corneaOD?: string;
  corneaOS?: string;
  anteriorChamberOD?: string;
  anteriorChamberOS?: string;
  pupilOD?: string;
  pupilOS?: string;
  irisOD?: string;
  irisOS?: string;
  lensOD?: string;
  lensOS?: string;
  retinaOD?: string;
  retinaOS?: string;
  vitreousOD?: string;
  vitreousOS?: string;
  maculaOD?: string;
  maculaOS?: string;
  bloodVesselsOD?: string;
  bloodVesselsOS?: string;
  diagnosis?: string;
  recommendations?: string;
  followUp?: string;
  createdAt?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  reason: string;
  status: "scheduled" | "completed" | "cancelled";
}
