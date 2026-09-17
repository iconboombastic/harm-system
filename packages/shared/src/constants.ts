// ============================================
// HARM SYSTEM — Shared Constants & Enums
// ============================================
// File ini berisi semua konstanta dan enum yang digunakan
// di seluruh sistem. Ubah di sini untuk mengubah di semua tempat.

// ----- ROLE -----
export const ROLES = {
  STAF: 'STAF',
  ATASAN: 'ATASAN',
  ADMIN: 'ADMIN',
  SYSTEM: 'SYSTEM',
} as const
export type Role = (typeof ROLES)[keyof typeof ROLES]

// ----- OFFICIAL STATUS (Status Resmi Case) -----
export const OFFICIAL_STATUS = {
  DIAJUKAN: 'DIAJUKAN',
  MENUNGGU_VERIFIKASI_OPD: 'MENUNGGU_VERIFIKASI_OPD',
  DITOLAK: 'DITOLAK',
  MENUNGGU_REVIEW: 'MENUNGGU_REVIEW',
  PERLU_PERBAIKAN: 'PERLU_PERBAIKAN',
  MENUNGGU_REVIEW_ULANG: 'MENUNGGU_REVIEW_ULANG',
  SELESAI: 'SELESAI',
} as const
export type OfficialStatus = (typeof OFFICIAL_STATUS)[keyof typeof OFFICIAL_STATUS]

export const OFFICIAL_STATUS_LABELS: Record<OfficialStatus, string> = {
  DIAJUKAN: 'Diajukan',
  MENUNGGU_VERIFIKASI_OPD: 'Menunggu Verifikasi OPD',
  DITOLAK: 'Ditolak',
  MENUNGGU_REVIEW: 'Menunggu Review',
  PERLU_PERBAIKAN: 'Perlu Perbaikan',
  MENUNGGU_REVIEW_ULANG: 'Menunggu Review Ulang',
  SELESAI: 'Selesai',
}

// ----- OPERATIONAL STATE (Status Operasional) -----
export const OPERATIONAL_STATE = {
  IN_PROGRESS: 'IN_PROGRESS',
  WAITING_EXTERNAL_RESULT: 'WAITING_EXTERNAL_RESULT',
  BLOCKED: 'BLOCKED',
  ON_HOLD: 'ON_HOLD',
} as const
export type OperationalState = (typeof OPERATIONAL_STATE)[keyof typeof OPERATIONAL_STATE]

// ----- JENIS DOKUMEN -----
export const DOCUMENT_TYPES = {
  PERDA: 'PERDA',
  PERBUP: 'PERBUP',
  KEPUTUSAN_BUPATI: 'KEPUTUSAN_BUPATI',
  INSTRUKSI_BUPATI: 'INSTRUKSI_BUPATI',
} as const
export type DocumentType = (typeof DOCUMENT_TYPES)[keyof typeof DOCUMENT_TYPES]

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  PERDA: 'Peraturan Daerah',
  PERBUP: 'Peraturan Bupati',
  KEPUTUSAN_BUPATI: 'Keputusan Bupati',
  INSTRUKSI_BUPATI: 'Instruksi Bupati',
}

// ----- PRIORITY -----
export const PRIORITIES = {
  LOW: 'LOW',
  NORMAL: 'NORMAL',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const
export type Priority = (typeof PRIORITIES)[keyof typeof PRIORITIES]

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: 'Rendah',
  NORMAL: 'Normal',
  HIGH: 'Tinggi',
  CRITICAL: 'Kritis',
}

// ----- RISK -----
export const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const
export type RiskLevel = (typeof RISK_LEVELS)[keyof typeof RISK_LEVELS]

// ----- CASE HEALTH -----
export const CASE_HEALTH = {
  GREEN: 'GREEN',
  BLUE: 'BLUE',
  AMBER: 'AMBER',
  RED: 'RED',
  DONE: 'DONE',
} as const
export type CaseHealth = (typeof CASE_HEALTH)[keyof typeof CASE_HEALTH]

export const CASE_HEALTH_LABELS: Record<CaseHealth, string> = {
  GREEN: 'Baik',
  BLUE: 'Perlu Perhatian',
  AMBER: 'Peringatan',
  RED: 'Kritis',
  DONE: 'Selesai',
}

// ----- STAGE STATUS -----
export const STAGE_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  SKIPPED: 'SKIPPED',
  CANCELLED: 'CANCELLED',
  WAITING_EXTERNAL_RESULT: 'WAITING_EXTERNAL_RESULT',
} as const
export type StageStatus = (typeof STAGE_STATUS)[keyof typeof STAGE_STATUS]

// ----- TASK STATUS -----
export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  BLOCKED: 'BLOCKED',
  DONE: 'DONE',
  CANCELLED: 'CANCELLED',
} as const
export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS]

// ----- SLA STATE -----
export const SLA_STATE = {
  ON_TRACK: 'ON_TRACK',
  WARNING: 'WARNING',
  DUE: 'DUE',
  OVERDUE: 'OVERDUE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
} as const
export type SlaState = (typeof SLA_STATE)[keyof typeof SLA_STATE]

// ----- REVIEW STATUS -----
export const REVIEW_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  REOPENED: 'REOPENED',
  WAIVED: 'WAIVED',
} as const
export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS]

// ----- WAITING FOR TYPE -----
export const WAITING_FOR_TYPE = {
  OPD: 'OPD',
  DPRK: 'DPRK',
  KEMENKUM: 'KEMENKUM',
  INTERNAL: 'INTERNAL',
  TANDA_TANGAN: 'TANDA_TANGAN',
  REGISTRASI: 'REGISTRASI',
  OTHER: 'OTHER',
} as const
export type WaitingForType = (typeof WAITING_FOR_TYPE)[keyof typeof WAITING_FOR_TYPE]

// ----- EVIDENCE CATEGORY -----
export const EVIDENCE_CATEGORY = {
  SURAT: 'SURAT',
  FOTO: 'FOTO',
  NOTULEN: 'NOTULEN',
  DAFTAR_HADIR: 'DAFTAR_HADIR',
  DISPOSISI: 'DISPOSISI',
  HASIL_FASILITASI: 'HASIL_FASILITASI',
  BUKTI_REGISTRASI: 'BUKTI_REGISTRASI',
  EMAIL: 'EMAIL',
  DOKUMEN_PENDUKUNG: 'DOKUMEN_PENDUKUNG',
  HASIL_PEMBAHASAN: 'HASIL_PEMBAHASAN',
  OTHER: 'OTHER',
} as const
export type EvidenceCategory = (typeof EVIDENCE_CATEGORY)[keyof typeof EVIDENCE_CATEGORY]

// ----- ACTIVITY TYPE -----
export const ACTIVITY_TYPE = {
  RAPAT: 'RAPAT',
  TELEPON: 'TELEPON',
  KOORDINASI: 'KOORDINASI',
  KONSULTASI: 'KONSULTASI',
  KIRIM_SURAT: 'KIRIM_SURAT',
  MENERIMA_SURAT: 'MENERIMA_SURAT',
  MENERIMA_HASIL_FASILITASI: 'MENERIMA_HASIL_FASILITASI',
  PEMBAHASAN_DPRK: 'PEMBAHASAN_DPRK',
  DISPOSISI: 'DISPOSISI',
  MENUNGGU_OPD: 'MENUNGGU_OPD',
  MENUNGGU_KEMENKUM: 'MENUNGGU_KEMENKUM',
  MENUNGGU_TANDA_TANGAN: 'MENUNGGU_TANDA_TANGAN',
  OTHER: 'OTHER',
} as const
export type ActivityType = (typeof ACTIVITY_TYPE)[keyof typeof ACTIVITY_TYPE]

// ----- DOCUMENT REQUIREMENT -----
export const REQUIREMENT_STATUS = {
  WAJIB: 'WAJIB',
  OPSIONAL: 'OPSIONAL',
  KONDISIONAL: 'KONDISIONAL',
  TIDAK_BERLAKU: 'TIDAK_BERLAKU',
} as const
export type RequirementStatus = (typeof REQUIREMENT_STATUS)[keyof typeof REQUIREMENT_STATUS]

// ----- DUPLICATE STATUS -----
export const DUPLICATE_STATUS = {
  EXACT_DUPLICATE: 'EXACT_DUPLICATE',
  POSSIBLE_DUPLICATE: 'POSSIBLE_DUPLICATE',
  NEW: 'NEW',
} as const
export type DuplicateStatus = (typeof DUPLICATE_STATUS)[keyof typeof DUPLICATE_STATUS]

// ----- CONFIDENTIALITY -----
export const CONFIDENTIALITY = {
  PUBLIC: 'PUBLIC',
  INTERNAL: 'INTERNAL',
  CONFIDENTIAL: 'CONFIDENTIAL',
  RESTRICTED: 'RESTRICTED',
} as const
export type Confidentiality = (typeof CONFIDENTIALITY)[keyof typeof CONFIDENTIALITY]

// ----- NOTE CATEGORY -----
export const NOTE_CATEGORY = {
  GENERAL: 'GENERAL',
  MEETING: 'MEETING',
  COORDINATION: 'COORDINATION',
  FOLLOW_UP: 'FOLLOW_UP',
  DEADLINE: 'DEADLINE',
  IMPORTANT: 'IMPORTANT',
} as const
export type NoteCategory = (typeof NOTE_CATEGORY)[keyof typeof NOTE_CATEGORY]

// ----- CASE RELATION -----
export const CASE_RELATION_TYPE = {
  PARENT: 'PARENT',
  CHILD: 'CHILD',
  RELATED: 'RELATED',
  DUPLICATE: 'DUPLICATE',
  SUPERSEDES: 'SUPERSEDES',
  DERIVED_FROM: 'DERIVED_FROM',
  AMENDMENT_OF: 'AMENDMENT_OF',
} as const
export type CaseRelationType = (typeof CASE_RELATION_TYPE)[keyof typeof CASE_RELATION_TYPE]

// ----- DECISION TYPE -----
export const DECISION_TYPE = {
  SETUJU: 'SETUJU',
  REVISI: 'REVISI',
  DITUNDA: 'DITUNDA',
  DIKEMBALIKAN: 'DIKEMBALIKAN',
  PERLU_PEMBAHASAN: 'PERLU_PEMBAHASAN',
  PERLU_FASILITASI: 'PERLU_FASILITASI',
} as const
export type DecisionType = (typeof DECISION_TYPE)[keyof typeof DECISION_TYPE]

// ----- JOB STATUS -----
export const JOB_STATUS = {
  QUEUED: 'QUEUED',
  RUNNING: 'RUNNING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  RETRYING: 'RETRYING',
  CANCELLED: 'CANCELLED',
} as const
export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS]

// ----- INTAKE SOURCE -----
export const INTAKE_SOURCE = {
  INTERNAL: 'INTERNAL',
  PUBLIC: 'PUBLIC',
} as const
export type IntakeSource = (typeof INTAKE_SOURCE)[keyof typeof INTAKE_SOURCE]

// ----- NOTIFICATION TYPE -----
export const NOTIFICATION_TYPE = {
  TASK_ASSIGNED: 'TASK_ASSIGNED',
  TASK_OVERDUE: 'TASK_OVERDUE',
  REVISION_REQUESTED: 'REVISION_REQUESTED',
  REVISION_SUBMITTED: 'REVISION_SUBMITTED',
  REVIEW_REQUESTED: 'REVIEW_REQUESTED',
  APPROVAL_REQUESTED: 'APPROVAL_REQUESTED',
  SLA_WARNING: 'SLA_WARNING',
  SLA_OVERDUE: 'SLA_OVERDUE',
  EVIDENCE_GAP: 'EVIDENCE_GAP',
  MEETING: 'MEETING',
  EXTERNAL_RESPONSE: 'EXTERNAL_RESPONSE',
  ACCOUNT_SECURITY: 'ACCOUNT_SECURITY',
} as const
export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE]

// ----- PERMISSIONS -----
export const PERMISSIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  UPLOAD: 'upload',
  DOWNLOAD: 'download',
  DELETE: 'delete',
  APPROVE: 'approve',
  ASSIGN: 'assign',
  CONFIGURE: 'configure',
  EXPORT: 'export',
  AUDIT: 'audit',
} as const
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export const PERMISSION_SCOPE = {
  OWN: 'own',
  ASSIGNED: 'assigned',
  TEAM: 'team',
  OPD: 'opd',
  ALL: 'all',
} as const
export type PermissionScope = (typeof PERMISSION_SCOPE)[keyof typeof PERMISSION_SCOPE]

// ----- ANNOTATION TYPE (Review Studio) -----
export const ANNOTATION_TYPE = {
  PEN: 'PEN',
  HIGHLIGHTER: 'HIGHLIGHTER',
  TEXT: 'TEXT',
  ARROW: 'ARROW',
  RECTANGLE: 'RECTANGLE',
  CIRCLE: 'CIRCLE',
  STRIKEOUT: 'STRIKEOUT',
  UNDERLINE: 'UNDERLINE',
  STICKY_NOTE: 'STICKY_NOTE',
  COMMENT: 'COMMENT',
  BOOKMARK: 'BOOKMARK',
} as const
export type AnnotationType = (typeof ANNOTATION_TYPE)[keyof typeof ANNOTATION_TYPE]

// ----- FILE VALIDATION -----
export const ALLOWED_EXTENSIONS = [
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff',
  'zip', 'rar',
  'txt', 'rtf', 'odt', 'ods', 'odp',
] as const

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
export const MAX_FILES_PER_UPLOAD = 20

// ----- DEFAULTS -----
export const DEFAULT_SLA_HOURS = 48
export const UNCONFIRMED_INTAKE_RETENTION_DAYS = 30
export const HARM_NUMBER_PREFIX = 'HARM'
