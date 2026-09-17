-- 001_initial_schema.sql

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. opd
CREATE TABLE opd (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode VARCHAR(50) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. user_profiles
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY, -- FK to auth.users
    name VARCHAR(255) NOT NULL,
    jabatan VARCHAR(255),
    unit VARCHAR(255),
    phone VARCHAR(50),
    avatar_url TEXT,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. user_opd
CREATE TABLE user_opd (
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    opd_id UUID REFERENCES opd(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, opd_id)
);

-- 4. holiday_calendar
CREATE TABLE holiday_calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'PUBLIC_HOLIDAY',
    is_recurring BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX idx_holiday_date ON holiday_calendar(date);

-- 5. numbering_sequence
CREATE TABLE numbering_sequence (
    year INT PRIMARY KEY,
    last_number INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. system_config
CREATE TABLE system_config (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by UUID REFERENCES user_profiles(id)
);

-- 7. workflow_templates
CREATE TABLE workflow_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    description TEXT,
    stages JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. sla_configs
CREATE TABLE sla_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type VARCHAR(100) NOT NULL,
    stage VARCHAR(100) NOT NULL,
    duration_hours INT DEFAULT 48,
    duration_type VARCHAR(50) DEFAULT 'WORKING_HOURS',
    warning_threshold_percent INT DEFAULT 80,
    escalation_rules JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (document_type, stage)
);

-- 9. document_requirements
CREATE TABLE document_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    requirement_name VARCHAR(255) NOT NULL,
    requirement_status VARCHAR(50) DEFAULT 'WAJIB',
    condition_rules JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. external_parties
CREATE TABLE external_parties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization VARCHAR(255),
    contact_name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    reference TEXT,
    party_type VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. cases
CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    harm_number VARCHAR(100) UNIQUE,
    title TEXT NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    opd_id UUID REFERENCES opd(id),
    applicant_name VARCHAR(255),
    applicant_email VARCHAR(255),
    case_owner_id UUID REFERENCES user_profiles(id),
    assignee_id UUID REFERENCES user_profiles(id),
    reviewer_id UUID REFERENCES user_profiles(id),
    approver_id UUID REFERENCES user_profiles(id),
    official_status VARCHAR(100) DEFAULT 'DIAJUKAN',
    operational_state VARCHAR(100) DEFAULT 'IN_PROGRESS',
    priority VARCHAR(50) DEFAULT 'NORMAL',
    risk VARCHAR(50) DEFAULT 'LOW',
    health VARCHAR(50) DEFAULT 'GREEN',
    current_stage_instance_id UUID, -- FK will be added later
    next_action TEXT,
    next_action_owner_id UUID REFERENCES user_profiles(id),
    next_action_due TIMESTAMPTZ,
    waiting_for VARCHAR(100),
    waiting_for_detail JSONB,
    sla_deadline TIMESTAMPTZ,
    sla_state VARCHAR(50) DEFAULT 'ON_TRACK',
    completeness_score NUMERIC DEFAULT 0,
    health_score NUMERIC DEFAULT 0,
    intake_source VARCHAR(50) DEFAULT 'INTERNAL',
    intake_confirmed BOOLEAN DEFAULT false,
    intake_confirmed_at TIMESTAMPTZ,
    intake_confirmed_by UUID REFERENCES user_profiles(id),
    retention_class VARCHAR(50) DEFAULT 'active',
    legal_hold BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    is_archived BOOLEAN DEFAULT false,
    archived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES user_profiles(id)
);

-- 12. intake_submissions
CREATE TABLE intake_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_token VARCHAR(255) UNIQUE,
    opd_name VARCHAR(255),
    applicant_name VARCHAR(255),
    applicant_email VARCHAR(255),
    applicant_phone VARCHAR(50),
    document_type VARCHAR(100),
    title TEXT,
    nomor_surat VARCHAR(100),
    tanggal_surat DATE,
    description TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    confirmed_case_id UUID REFERENCES cases(id),
    file_paths JSONB,
    sha256_hashes JSONB,
    validation_result JSONB,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 13. case_stage_instances
CREATE TABLE case_stage_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    stage_template_name VARCHAR(255) NOT NULL,
    stage_order INT NOT NULL,
    instance_number INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'NOT_STARTED',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    outcome VARCHAR(255),
    actor_id UUID REFERENCES user_profiles(id),
    skip_reason TEXT,
    notes TEXT,
    evidence_ids UUID[],
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 14. case_documents
CREATE TABLE case_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    requirement_status VARCHAR(50) DEFAULT 'WAJIB',
    original_filename TEXT NOT NULL,
    system_filename TEXT NOT NULL,
    current_version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    source VARCHAR(50) DEFAULT 'UPLOAD',
    confidentiality VARCHAR(50) DEFAULT 'INTERNAL',
    retention_class VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES user_profiles(id),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 15. document_versions
CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES case_documents(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    revision_reason TEXT,
    change_summary TEXT,
    filename TEXT NOT NULL,
    mime_type VARCHAR(100),
    file_size BIGINT,
    sha256_hash VARCHAR(64),
    storage_path TEXT NOT NULL,
    drive_file_id TEXT,
    uploaded_by UUID REFERENCES user_profiles(id),
    uploaded_at TIMESTAMPTZ DEFAULT now(),
    is_replacement BOOLEAN DEFAULT false,
    replaced_version_id UUID REFERENCES document_versions(id),
    replacement_reason TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- 16. case_evidence
CREATE TABLE case_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    source VARCHAR(100) NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    actor_id UUID REFERENCES user_profiles(id),
    file_path TEXT,
    sha256_hash VARCHAR(64),
    description TEXT,
    confidentiality VARCHAR(50) DEFAULT 'INTERNAL',
    mime_type VARCHAR(100),
    file_size BIGINT,
    drive_file_id TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES user_profiles(id)
);

-- 17. evidence_relations
CREATE TABLE evidence_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evidence_id UUID REFERENCES case_evidence(id) ON DELETE CASCADE,
    related_type VARCHAR(100) NOT NULL,
    related_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES user_profiles(id)
);

-- 18. case_reviews
CREATE TABLE case_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    document_version_id UUID REFERENCES document_versions(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES user_profiles(id),
    status VARCHAR(50) DEFAULT 'OPEN',
    checklist JSONB,
    summary TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 19. review_threads
CREATE TABLE review_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID REFERENCES case_reviews(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES review_threads(id) ON DELETE CASCADE,
    author_id UUID REFERENCES user_profiles(id),
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'COMMENT',
    status VARCHAR(50) DEFAULT 'OPEN',
    assignee_id UUID REFERENCES user_profiles(id),
    priority VARCHAR(50),
    due_date TIMESTAMPTZ,
    mention_ids UUID[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES user_profiles(id)
);

-- 20. annotations
CREATE TABLE annotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID REFERENCES case_reviews(id) ON DELETE CASCADE,
    document_version_id UUID REFERENCES document_versions(id) ON DELETE CASCADE,
    page INT,
    coordinates JSONB,
    annotation_type VARCHAR(50),
    content TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    author_id UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 21. case_decisions
CREATE TABLE case_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    decision_type VARCHAR(100) NOT NULL,
    decision TEXT NOT NULL,
    rationale TEXT,
    actor_id UUID REFERENCES user_profiles(id),
    supporting_evidence_ids UUID[],
    related_review_id UUID REFERENCES case_reviews(id),
    approval_status VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 22. case_tasks
CREATE TABLE case_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    stage_instance_id UUID REFERENCES case_stage_instances(id),
    title TEXT NOT NULL,
    description TEXT,
    assignee_id UUID REFERENCES user_profiles(id),
    creator_id UUID REFERENCES user_profiles(id),
    priority VARCHAR(50) DEFAULT 'NORMAL',
    due_date TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'TODO',
    source VARCHAR(100),
    evidence_required BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- 23. case_activities
CREATE TABLE case_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    stage_instance_id UUID REFERENCES case_stage_instances(id),
    activity_type VARCHAR(100) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now(),
    actor_id UUID REFERENCES user_profiles(id),
    external_party_id UUID REFERENCES external_parties(id),
    description TEXT,
    result TEXT,
    next_action TEXT,
    evidence_ids UUID[],
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 24. case_waiting
CREATE TABLE case_waiting (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    waiting_type VARCHAR(100) NOT NULL,
    description TEXT,
    contact VARCHAR(255),
    reference_number VARCHAR(100),
    expected_date TIMESTAMPTZ,
    actual_date TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    escalation_level INT DEFAULT 0,
    evidence_id UUID REFERENCES case_evidence(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES user_profiles(id),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES user_profiles(id)
);

-- 25. case_notes
CREATE TABLE case_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'GENERAL',
    color VARCHAR(50),
    is_pinned BOOLEAN DEFAULT false,
    visibility VARCHAR(50) DEFAULT 'TEAM',
    author_id UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    is_archived BOOLEAN DEFAULT false
);

-- 26. case_relations
CREATE TABLE case_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    related_case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    relation_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES user_profiles(id)
);

-- 27. case_tags
CREATE TABLE case_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES user_profiles(id)
);

-- 28. case_watchers
CREATE TABLE case_watchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 29. case_ownership_history
CREATE TABLE case_ownership_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    old_user_id UUID REFERENCES user_profiles(id),
    new_user_id UUID REFERENCES user_profiles(id),
    reason TEXT,
    changed_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 30. case_sla
CREATE TABLE case_sla (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    sla_config_id UUID REFERENCES sla_configs(id),
    started_at TIMESTAMPTZ NOT NULL,
    deadline_at TIMESTAMPTZ NOT NULL,
    paused_at TIMESTAMPTZ,
    total_paused_seconds INT DEFAULT 0,
    state VARCHAR(50) DEFAULT 'ON_TRACK',
    extension_reason TEXT,
    extended_by UUID REFERENCES user_profiles(id),
    completed_at TIMESTAMPTZ,
    history JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 31. meetings
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255),
    meeting_type VARCHAR(100),
    agenda TEXT,
    status VARCHAR(50) DEFAULT 'PLANNED',
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 32. meeting_participants
CREATE TABLE meeting_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id),
    external_party_id UUID REFERENCES external_parties(id),
    attended BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT participant_check CHECK (user_id IS NOT NULL OR external_party_id IS NOT NULL)
);

-- 33. meeting_minutes
CREATE TABLE meeting_minutes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    decisions JSONB,
    action_items JSONB,
    attachments JSONB,
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 34. action_items
CREATE TABLE action_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    owner_id UUID REFERENCES user_profiles(id),
    due_date TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'OPEN',
    evidence_id UUID REFERENCES case_evidence(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 35. notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    channel VARCHAR(50) DEFAULT 'IN_APP',
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    action_url TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 36. notification_preferences
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,
    preferences JSONB DEFAULT '{}',
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    digest_enabled BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 37. audit_trail (IMMUTABLE)
CREATE TABLE audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    correlation_id UUID DEFAULT gen_random_uuid(),
    actor_id UUID,
    action VARCHAR(100) NOT NULL,
    object_type VARCHAR(100),
    object_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Prevent update and delete on audit_trail
CREATE RULE no_update_audit_trail AS ON UPDATE TO audit_trail DO INSTEAD NOTHING;
CREATE RULE no_delete_audit_trail AS ON DELETE TO audit_trail DO INSTEAD NOTHING;

-- 38. access_log
CREATE TABLE access_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id),
    action VARCHAR(100) NOT NULL,
    file_path TEXT,
    document_version_id UUID REFERENCES document_versions(id),
    purpose TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 39. security_events
CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    event_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 40. jobs
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'QUEUED',
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 3,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error TEXT,
    result JSONB,
    correlation_id UUID,
    priority INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    scheduled_at TIMESTAMPTZ DEFAULT now()
);

-- 41. error_log
CREATE TABLE error_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service VARCHAR(100),
    error_type VARCHAR(100),
    message TEXT NOT NULL,
    stack_trace TEXT,
    correlation_id UUID,
    user_id UUID,
    retry_status VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 42. case_finalization
CREATE TABLE case_finalization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID UNIQUE REFERENCES cases(id) ON DELETE CASCADE,
    metadata_complete BOOLEAN DEFAULT false,
    documents_complete BOOLEAN DEFAULT false,
    review_resolved BOOLEAN DEFAULT false,
    evidence_complete BOOLEAN DEFAULT false,
    decision_recorded BOOLEAN DEFAULT false,
    final_document_selected BOOLEAN DEFAULT false,
    numbering_verified BOOLEAN DEFAULT false,
    approval_complete BOOLEAN DEFAULT false,
    retention_class_set BOOLEAN DEFAULT false,
    override_reason TEXT,
    override_by UUID REFERENCES user_profiles(id),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);


-- ALTER TABLE cases ADD CONSTRAINT
ALTER TABLE cases ADD CONSTRAINT fk_current_stage FOREIGN KEY (current_stage_instance_id) REFERENCES case_stage_instances(id);

-- INDEXES
CREATE INDEX idx_cases_harm_number ON cases(harm_number);
CREATE INDEX idx_cases_opd_id ON cases(opd_id);
CREATE INDEX idx_cases_document_type ON cases(document_type);
CREATE INDEX idx_cases_assignee_id ON cases(assignee_id);
CREATE INDEX idx_cases_status ON cases(official_status);
CREATE INDEX idx_cases_created_at ON cases(created_at);

-- ADD FULL TEXT SEARCH INDEXES
CREATE INDEX idx_cases_title_fts ON cases USING gin(to_tsvector('indonesian', title));
CREATE INDEX idx_case_documents_filename_fts ON case_documents USING gin(to_tsvector('indonesian', original_filename));
CREATE INDEX idx_case_evidence_description_fts ON case_evidence USING gin(to_tsvector('indonesian', description));
CREATE INDEX idx_case_notes_content_fts ON case_notes USING gin(to_tsvector('indonesian', content));

-- Triggers for updated_at
CREATE TRIGGER trg_opd_updated_at BEFORE UPDATE ON opd FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_numbering_sequence_updated_at BEFORE UPDATE ON numbering_sequence FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_system_config_updated_at BEFORE UPDATE ON system_config FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_workflow_templates_updated_at BEFORE UPDATE ON workflow_templates FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_cases_updated_at BEFORE UPDATE ON cases FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_intake_submissions_updated_at BEFORE UPDATE ON intake_submissions FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_case_stage_instances_updated_at BEFORE UPDATE ON case_stage_instances FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_case_documents_updated_at BEFORE UPDATE ON case_documents FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_case_reviews_updated_at BEFORE UPDATE ON case_reviews FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_review_threads_updated_at BEFORE UPDATE ON review_threads FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_annotations_updated_at BEFORE UPDATE ON annotations FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_case_tasks_updated_at BEFORE UPDATE ON case_tasks FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_case_notes_updated_at BEFORE UPDATE ON case_notes FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_case_sla_updated_at BEFORE UPDATE ON case_sla FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_meetings_updated_at BEFORE UPDATE ON meetings FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_meeting_minutes_updated_at BEFORE UPDATE ON meeting_minutes FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_action_items_updated_at BEFORE UPDATE ON action_items FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trg_case_finalization_updated_at BEFORE UPDATE ON case_finalization FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Functions

-- Allocate HARM Number
CREATE OR REPLACE FUNCTION allocate_harm_number(p_year INT)
RETURNS VARCHAR AS $$
DECLARE
    v_last_number INT;
    v_harm_number VARCHAR;
BEGIN
    INSERT INTO numbering_sequence (year, last_number)
    VALUES (p_year, 1)
    ON CONFLICT (year) DO UPDATE
    SET last_number = numbering_sequence.last_number + 1
    RETURNING last_number INTO v_last_number;

    v_harm_number := 'HARM-' || p_year || '-' || LPAD(v_last_number::TEXT, 6, '0');
    RETURN v_harm_number;
END;
$$ LANGUAGE plpgsql;

-- Compute Case Health
CREATE OR REPLACE FUNCTION compute_case_health(p_case_id UUID)
RETURNS VARCHAR AS $$
DECLARE
    v_health VARCHAR;
    v_sla_state VARCHAR;
BEGIN
    SELECT sla_state INTO v_sla_state FROM cases WHERE id = p_case_id;

    IF v_sla_state = 'BREACHED' THEN
        v_health := 'RED';
    ELSIF v_sla_state = 'AT_RISK' THEN
        v_health := 'YELLOW';
    ELSE
        v_health := 'GREEN';
    END IF;

    UPDATE cases SET health = v_health WHERE id = p_case_id;
    
    RETURN v_health;
END;
$$ LANGUAGE plpgsql;
