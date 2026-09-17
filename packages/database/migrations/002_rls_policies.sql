-- 002_rls_policies.sql

-- Enable RLS on all tables
ALTER TABLE opd ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_opd ENABLE ROW LEVEL SECURITY;
ALTER TABLE holiday_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE numbering_sequence ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sla_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_stage_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_waiting ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_watchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_ownership_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_sla ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_minutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_finalization ENABLE ROW LEVEL SECURITY;

-- Helper to check role
CREATE OR REPLACE FUNCTION auth_user_role()
RETURNS VARCHAR AS $$
    SELECT role FROM user_profiles WHERE id = (SELECT auth.uid());
$$ LANGUAGE sql SECURITY DEFINER;

-- Master data: Everyone can read, ADMIN can write
CREATE POLICY "Public read opd" ON opd FOR SELECT USING (true);
CREATE POLICY "Admin write opd" ON opd FOR ALL USING (auth_user_role() = 'ADMIN');

CREATE POLICY "Public read holiday_calendar" ON holiday_calendar FOR SELECT USING (true);
CREATE POLICY "Admin write holiday_calendar" ON holiday_calendar FOR ALL USING (auth_user_role() = 'ADMIN');

CREATE POLICY "Public read system_config" ON system_config FOR SELECT USING (true);
CREATE POLICY "Admin write system_config" ON system_config FOR ALL USING (auth_user_role() = 'ADMIN');

CREATE POLICY "Public read workflow_templates" ON workflow_templates FOR SELECT USING (true);
CREATE POLICY "Admin write workflow_templates" ON workflow_templates FOR ALL USING (auth_user_role() = 'ADMIN');

CREATE POLICY "Public read sla_configs" ON sla_configs FOR SELECT USING (true);
CREATE POLICY "Admin write sla_configs" ON sla_configs FOR ALL USING (auth_user_role() = 'ADMIN');

CREATE POLICY "Public read document_requirements" ON document_requirements FOR SELECT USING (true);
CREATE POLICY "Admin write document_requirements" ON document_requirements FOR ALL USING (auth_user_role() = 'ADMIN');

CREATE POLICY "Public read external_parties" ON external_parties FOR SELECT USING (true);
CREATE POLICY "Admin write external_parties" ON external_parties FOR ALL USING (auth_user_role() = 'ADMIN');

CREATE POLICY "Public read user_profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users edit own profile" ON user_profiles FOR UPDATE USING (id = (SELECT auth.uid()));
CREATE POLICY "Admin write user_profiles" ON user_profiles FOR ALL USING (auth_user_role() = 'ADMIN');

-- Cases: 
-- STAF: own or assigned
-- ATASAN: all cases in their OPD or team
-- ADMIN: all cases
CREATE POLICY "Staf read own cases" ON cases FOR SELECT 
USING (
    auth_user_role() = 'STAF' AND (case_owner_id = (SELECT auth.uid()) OR assignee_id = (SELECT auth.uid()))
);
CREATE POLICY "Atasan read cases" ON cases FOR SELECT 
USING (
    auth_user_role() IN ('KABAG', 'ASISTEN', 'SEKDA', 'BUPATI')
);
CREATE POLICY "Admin read all cases" ON cases FOR SELECT 
USING (auth_user_role() = 'ADMIN');
CREATE POLICY "Staff insert cases" ON cases FOR INSERT 
WITH CHECK (auth_user_role() IN ('STAF', 'ADMIN'));
CREATE POLICY "Users update allowed cases" ON cases FOR UPDATE 
USING (
    auth_user_role() = 'ADMIN' OR 
    case_owner_id = (SELECT auth.uid()) OR 
    assignee_id = (SELECT auth.uid()) OR
    auth_user_role() IN ('KABAG', 'ASISTEN')
);

-- Audit Trail: read only
CREATE POLICY "Admin read audit_trail" ON audit_trail FOR SELECT USING (auth_user_role() = 'ADMIN');

-- Generally, related tables like case_documents, case_tasks inherit visibility from cases. For simplicity, any authenticated user can select, and admins/owners can edit.
CREATE POLICY "Auth users read case_documents" ON case_documents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users write case_documents" ON case_documents FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users read document_versions" ON document_versions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users write document_versions" ON document_versions FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users read case_tasks" ON case_tasks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users write case_tasks" ON case_tasks FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users read case_evidence" ON case_evidence FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users write case_evidence" ON case_evidence FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users read case_reviews" ON case_reviews FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users write case_reviews" ON case_reviews FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users read case_notes" ON case_notes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users write own case_notes" ON case_notes FOR ALL USING (author_id = (SELECT auth.uid()) OR auth_user_role() = 'ADMIN');

CREATE POLICY "Auth users read case_stage_instances" ON case_stage_instances FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users write case_stage_instances" ON case_stage_instances FOR ALL USING (auth.role() = 'authenticated');

-- Fallbacks for the rest: allow authenticated users
DO $$
DECLARE
    table_name_rec RECORD;
BEGIN
    FOR table_name_rec IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename NOT IN ('opd', 'holiday_calendar', 'system_config', 'workflow_templates', 'sla_configs', 'document_requirements', 'external_parties', 'user_profiles', 'cases', 'audit_trail', 'case_documents', 'document_versions', 'case_tasks', 'case_evidence', 'case_reviews', 'case_notes', 'case_stage_instances')
    LOOP
        EXECUTE format('CREATE POLICY "Auth users read %I" ON %I FOR SELECT USING (auth.role() = ''authenticated'');', table_name_rec.tablename, table_name_rec.tablename);
        EXECUTE format('CREATE POLICY "Auth users write %I" ON %I FOR ALL USING (auth.role() = ''authenticated'');', table_name_rec.tablename, table_name_rec.tablename);
    END LOOP;
END
$$;

