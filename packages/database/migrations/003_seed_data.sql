-- 003_seed_data.sql

-- Insert default System Config
INSERT INTO system_config (key, value, description) VALUES
('APP_NAME', '"HARM - Sistem Harmonisasi Dokumen Terpadu"', 'Application Name'),
('DEFAULT_TIMEZONE', '"Asia/Jakarta"', 'Default timezone'),
('MAINTENANCE_MODE', 'false', 'Enable maintenance mode');

-- Insert OPD for Aceh Tamiang (Samples)
INSERT INTO opd (id, kode, nama, email, phone) VALUES
('ca2653c0-5df3-4533-b2b0-048b1aed7e0c', 'SETDA', 'Sekretariat Daerah', 'setda@acehtamiangkab.go.id', '0641-31001'),
('4e16854f-e715-4dbc-b79d-26969e8dafa1', 'BKPSDM', 'Badan Kepegawaian dan Pengembangan SDM', 'bkpsdm@acehtamiangkab.go.id', '0641-31002'),
('6fbe8acc-309e-443b-9497-e0faf630ac36', 'BAPPEDA', 'Badan Perencanaan Pembangunan Daerah', 'bappeda@acehtamiangkab.go.id', '0641-31003'),
('9d62c38b-d82c-4225-9f35-5e60d5ccda25', 'DINKES', 'Dinas Kesehatan', 'dinkes@acehtamiangkab.go.id', '0641-31004'),
('c4814e73-0e52-4da9-9caf-d38f3af1807c', 'DISDIK', 'Dinas Pendidikan dan Kebudayaan', 'disdik@acehtamiangkab.go.id', '0641-31005')
ON CONFLICT (id) DO NOTHING;

-- Insert Default Workflow Templates for 4 Document Types
INSERT INTO workflow_templates (name, document_type, description, stages) VALUES
('Workflow Keputusan Bupati', 'KEPUTUSAN_BUPATI', 'Standar operasional prosedur untuk Keputusan Bupati (SK)', 
'[
    {"order": 1, "name": "Pengajuan", "role": "STAF"},
    {"order": 2, "name": "Verifikasi Berkas", "role": "KABAG"},
    {"order": 3, "name": "Drafting", "role": "STAF"},
    {"order": 4, "name": "Review Asisten", "role": "ASISTEN"},
    {"order": 5, "name": "Persetujuan Sekda", "role": "SEKDA"},
    {"order": 6, "name": "Penetapan Bupati", "role": "BUPATI"}
]'::jsonb),
('Workflow Peraturan Bupati', 'PERBUP', 'Standar operasional prosedur untuk Peraturan Bupati', 
'[
    {"order": 1, "name": "Pengajuan & Naskah Akademik", "role": "STAF"},
    {"order": 2, "name": "Harmonisasi", "role": "KABAG"},
    {"order": 3, "name": "Review Asisten", "role": "ASISTEN"},
    {"order": 4, "name": "Persetujuan Sekda", "role": "SEKDA"},
    {"order": 5, "name": "Penetapan Bupati", "role": "BUPATI"}
]'::jsonb),
('Workflow Peraturan Daerah', 'PERDA', 'Standar operasional prosedur untuk Peraturan Daerah / Qanun', 
'[
    {"order": 1, "name": "Pengajuan & Prolegda", "role": "STAF"},
    {"order": 2, "name": "Harmonisasi & Pembahasan", "role": "KABAG"},
    {"order": 3, "name": "Fasilitasi Provinsi", "role": "ASISTEN"},
    {"order": 4, "name": "Persetujuan Bersama DPRK", "role": "SEKDA"},
    {"order": 5, "name": "Pengundangan & Penomoran", "role": "BUPATI"}
]'::jsonb),
('Workflow Instruksi Bupati', 'INSTRUKSI_BUPATI', 'Standar operasional prosedur untuk Instruksi Bupati', 
'[
    {"order": 1, "name": "Drafting", "role": "STAF"},
    {"order": 2, "name": "Review Legal", "role": "KABAG"},
    {"order": 3, "name": "Penetapan Bupati", "role": "BUPATI"}
]'::jsonb);

-- Insert Default SLA Configs
INSERT INTO sla_configs (document_type, stage, duration_hours, duration_type, warning_threshold_percent) VALUES
('KEPUTUSAN_BUPATI', 'Pengajuan', 24, 'WORKING_HOURS', 80),
('KEPUTUSAN_BUPATI', 'Verifikasi Berkas', 48, 'WORKING_HOURS', 80),
('KEPUTUSAN_BUPATI', 'Drafting', 72, 'WORKING_HOURS', 80),
('KEPUTUSAN_BUPATI', 'Review Asisten', 48, 'WORKING_HOURS', 80),
('KEPUTUSAN_BUPATI', 'Persetujuan Sekda', 48, 'WORKING_HOURS', 80),
('PERBUP', 'Pengajuan & Naskah Akademik', 120, 'WORKING_HOURS', 80),
('PERBUP', 'Harmonisasi', 168, 'WORKING_HOURS', 80),
('PERDA', 'Pengajuan & Prolegda', 120, 'WORKING_HOURS', 80),
('PERDA', 'Harmonisasi & Pembahasan', 240, 'WORKING_HOURS', 80),
('INSTRUKSI_BUPATI', 'Drafting', 48, 'WORKING_HOURS', 80);

-- Insert Default Document Requirements
INSERT INTO document_requirements (document_type, category, requirement_name, requirement_status) VALUES
('KEPUTUSAN_BUPATI', 'LEGAL', 'Nota Dinas Pengantar', 'WAJIB'),
('KEPUTUSAN_BUPATI', 'SUBSTANSI', 'Draft SK (Word)', 'WAJIB'),
('KEPUTUSAN_BUPATI', 'REFERENSI', 'Dasar Hukum (PDF)', 'OPSIONAL'),
('PERBUP', 'LEGAL', 'Naskah Akademik', 'WAJIB'),
('PERBUP', 'LEGAL', 'Draft Perbup', 'WAJIB'),
('PERDA', 'LEGAL', 'Naskah Akademik Rancangan Qanun', 'WAJIB'),
('PERDA', 'LEGAL', 'Draft Raperda', 'WAJIB'),
('INSTRUKSI_BUPATI', 'SUBSTANSI', 'Draft Instruksi', 'WAJIB');
