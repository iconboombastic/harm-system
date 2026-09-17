// ============================================
// HARM SYSTEM — Zod Validators
// ============================================
// Validasi data untuk form dan server actions.
// Setiap form di aplikasi menggunakan validator dari sini.

import { z } from 'zod'
import {
  OFFICIAL_STATUS, PRIORITIES, RISK_LEVELS, DOCUMENT_TYPES,
  TASK_STATUS, WAITING_FOR_TYPE, EVIDENCE_CATEGORY, ACTIVITY_TYPE,
  NOTE_CATEGORY, CASE_RELATION_TYPE, DECISION_TYPE, CONFIDENTIALITY,
  REVIEW_STATUS, REQUIREMENT_STATUS, INTAKE_SOURCE, ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE,
} from './constants'

// ---- Helpers ----
const uuidSchema = z.string().uuid()
const requiredString = z.string().min(1, 'Wajib diisi')
const optionalString = z.string().optional().or(z.literal(''))
const emailSchema = z.string().email('Format email tidak valid')

// ---- AUTH ----
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password minimal 8 karakter'),
})

export const registerSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password minimal 8 karakter'),
  confirmPassword: z.string(),
  name: requiredString,
  jabatan: optionalString,
  unit: optionalString,
}).refine(d => d.password === d.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
})

// ---- CASE ----
export const createCaseSchema = z.object({
  title: requiredString.max(500, 'Judul maksimal 500 karakter'),

  description: requiredString,

  document_type: z.enum([
    DOCUMENT_TYPES.PERDA,
    DOCUMENT_TYPES.PERBUP,
    DOCUMENT_TYPES.KEPUTUSAN_BUPATI,
    DOCUMENT_TYPES.INSTRUKSI_BUPATI,
  ]),

  opd_id: uuidSchema,

  priority: z.enum([
    PRIORITIES.LOW,
    PRIORITIES.NORMAL,
    PRIORITIES.HIGH,
    PRIORITIES.CRITICAL,
  ]).default(PRIORITIES.NORMAL),

  notes: optionalString,
})

export const updateCaseSchema = z.object({
  title: optionalString,
  official_status: z.enum(Object.values(OFFICIAL_STATUS) as [string, ...string[]]).optional(),
  priority: z.enum(Object.values(PRIORITIES) as [string, ...string[]]).optional(),
  risk: z.enum(Object.values(RISK_LEVELS) as [string, ...string[]]).optional(),
  assignee_id: uuidSchema.optional().nullable(),
  reviewer_id: uuidSchema.optional().nullable(),
  approver_id: uuidSchema.optional().nullable(),
  next_action: optionalString,
  next_action_due: z.string().datetime().optional().nullable(),
  waiting_for: z.enum(Object.values(WAITING_FOR_TYPE) as [string, ...string[]]).optional().nullable(),
  waiting_for_detail: optionalString,
  notes: optionalString,
})

// ---- PUBLIC INTAKE ----
export const publicIntakeSchema = z.object({
  opd_name: requiredString,
  applicant_name: requiredString,
  applicant_email: emailSchema,
  applicant_phone: z.string().optional(),
  document_type: z.enum(Object.values(DOCUMENT_TYPES) as [string, ...string[]]),
  title: requiredString.max(500),
  nomor_surat: optionalString,
  tanggal_surat: z.string().optional(),
  description: optionalString,
})

// ---- DOCUMENT ----
export const uploadDocumentSchema = z.object({
  case_id: uuidSchema,
  category: requiredString,
  document_type: requiredString,
  confidentiality: z.enum(Object.values(CONFIDENTIALITY) as [string, ...string[]]).default(CONFIDENTIALITY.INTERNAL),
})

export const reviseDocumentSchema = z.object({
  document_id: uuidSchema,
  revision_reason: requiredString,
  change_summary: optionalString,
})

export const replaceDocumentSchema = z.object({
  document_id: uuidSchema,
  version_id: uuidSchema,
  replacement_reason: requiredString,
})

// ---- TASK ----
export const createTaskSchema = z.object({
  case_id: uuidSchema,
  title: requiredString,
  description: optionalString,
  assignee_id: uuidSchema.optional(),
  priority: z.enum(Object.values(PRIORITIES) as [string, ...string[]]).default(PRIORITIES.NORMAL),
  due_date: z.string().datetime().optional(),
  stage_instance_id: uuidSchema.optional(),
  evidence_required: z.boolean().default(false),
})

export const updateTaskSchema = z.object({
  title: optionalString,
  description: optionalString,
  assignee_id: uuidSchema.optional().nullable(),
  priority: z.enum(Object.values(PRIORITIES) as [string, ...string[]]).optional(),
  status: z.enum(Object.values(TASK_STATUS) as [string, ...string[]]).optional(),
  due_date: z.string().datetime().optional().nullable(),
})

// ---- EVIDENCE ----
export const createEvidenceSchema = z.object({
  case_id: uuidSchema,
  category: z.enum(Object.values(EVIDENCE_CATEGORY) as [string, ...string[]]),
  source: optionalString,
  date: z.string().datetime().optional(),
  description: optionalString,
  confidentiality: z.enum(Object.values(CONFIDENTIALITY) as [string, ...string[]]).default(CONFIDENTIALITY.INTERNAL),
})

// ---- REVIEW ----
export const createReviewSchema = z.object({
  case_id: uuidSchema,
  document_version_id: uuidSchema,
  checklist: z.record(z.boolean()).optional(),
})

export const createReviewThreadSchema = z.object({
  review_id: uuidSchema,
  content: requiredString,
  parent_id: uuidSchema.optional(),
  assignee_id: uuidSchema.optional(),
  priority: z.enum(Object.values(PRIORITIES) as [string, ...string[]]).optional(),
  due_date: z.string().datetime().optional(),
})

// ---- DECISION ----
export const createDecisionSchema = z.object({
  case_id: uuidSchema,
  decision_type: z.enum(Object.values(DECISION_TYPE) as [string, ...string[]]),
  decision: requiredString,
  rationale: optionalString,
  supporting_evidence_ids: z.array(uuidSchema).optional(),
  related_review_id: uuidSchema.optional(),
})

// ---- ACTIVITY ----
export const createActivitySchema = z.object({
  case_id: uuidSchema,
  activity_type: z.enum(Object.values(ACTIVITY_TYPE) as [string, ...string[]]),
  description: requiredString,
  external_party_id: uuidSchema.optional(),
  result: optionalString,
  next_action: optionalString,
  evidence_ids: z.array(uuidSchema).optional(),
  stage_instance_id: uuidSchema.optional(),
})

// ---- WAITING FOR ----
export const createWaitingSchema = z.object({
  case_id: uuidSchema,
  waiting_type: z.enum(Object.values(WAITING_FOR_TYPE) as [string, ...string[]]),
  description: optionalString,
  contact: optionalString,
  reference_number: optionalString,
  expected_date: z.string().datetime().optional(),
})

// ---- NOTE ----
export const createNoteSchema = z.object({
  case_id: uuidSchema,
  content: requiredString,
  category: z.enum(Object.values(NOTE_CATEGORY) as [string, ...string[]]).default(NOTE_CATEGORY.GENERAL),
  color: z.string().optional(),
  is_pinned: z.boolean().default(false),
})

// ---- CASE RELATION ----
export const createCaseRelationSchema = z.object({
  case_id: uuidSchema,
  related_case_id: uuidSchema,
  relation_type: z.enum(Object.values(CASE_RELATION_TYPE) as [string, ...string[]]),
})

// ---- OPD ----
export const createOpdSchema = z.object({
  kode: requiredString,
  nama: requiredString,
  email: emailSchema.optional().or(z.literal('')),
  phone: optionalString,
  is_active: z.boolean().default(true),
})

// ---- USER ----
export const createUserSchema = z.object({
  email: emailSchema,
  password: z.string().min(8),
  name: requiredString,
  role: z.enum(['STAF', 'ATASAN', 'ADMIN']),
  jabatan: optionalString,
  unit: optionalString,
  opd_ids: z.array(uuidSchema).optional(),
})

export const updateProfileSchema = z.object({
  name: optionalString,
  jabatan: optionalString,
  unit: optionalString,
  phone: optionalString,
  avatar_url: optionalString,
})

// ---- MEETING ----
export const createMeetingSchema = z.object({
  case_id: uuidSchema,
  title: requiredString,
  date: z.string(),
  time: z.string().optional(),
  location: optionalString,
  meeting_type: optionalString,
  agenda: optionalString,
  participant_ids: z.array(uuidSchema).optional(),
})

// ---- SLA CONFIG ----
export const slaConfigSchema = z.object({
  document_type: optionalString,
  stage: optionalString,
  duration_hours: z.number().min(1),
  duration_type: z.enum(['CALENDAR', 'WORKING_HOURS', 'WORKING_DAYS']).default('WORKING_HOURS'),
  warning_threshold_percent: z.number().min(0).max(100).default(80),
})

// ---- SEARCH ----
export const searchSchema = z.object({
  query: z.string().min(1),
  scope: z.enum(['all', 'cases', 'documents', 'evidence', 'tasks', 'activities', 'meetings', 'decisions', 'notes']).default('all'),
  filters: z.object({
    status: z.string().optional(),
    date_from: z.string().optional(),
    date_to: z.string().optional(),
    opd_id: uuidSchema.optional(),
    assignee_id: uuidSchema.optional(),
    priority: z.string().optional(),
    document_type: z.string().optional(),
  }).optional(),
  page: z.number().default(1),
  limit: z.number().default(20),
})

// ---- Type exports ----
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CreateCaseInput = z.infer<typeof createCaseSchema>
export type UpdateCaseInput = z.infer<typeof updateCaseSchema>
export type PublicIntakeInput = z.infer<typeof publicIntakeSchema>
export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>
export type ReviseDocumentInput = z.infer<typeof reviseDocumentSchema>
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type CreateEvidenceInput = z.infer<typeof createEvidenceSchema>
export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type CreateReviewThreadInput = z.infer<typeof createReviewThreadSchema>
export type CreateDecisionInput = z.infer<typeof createDecisionSchema>
export type CreateActivityInput = z.infer<typeof createActivitySchema>
export type CreateWaitingInput = z.infer<typeof createWaitingSchema>
export type CreateNoteInput = z.infer<typeof createNoteSchema>
export type CreateCaseRelationInput = z.infer<typeof createCaseRelationSchema>
export type CreateOpdInput = z.infer<typeof createOpdSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type CreateMeetingInput = z.infer<typeof createMeetingSchema>
export type SearchInput = z.infer<typeof searchSchema>
