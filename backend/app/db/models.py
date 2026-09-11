import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class UserModel(Base):
    __tablename__ = "users"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="USER") # USER, ADMIN
    organization = Column(String(255), nullable=True)
    user_type = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ConversationModel(Base):
    __tablename__ = "conversations"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    title = Column(String(255), nullable=False)
    language = Column(String(10), default="en")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    messages = relationship("MessageModel", back_populates="conversation", cascade="all, delete-orphan")
    product_profile = relationship("ProductProfileModel", uselist=False, back_populates="conversation", cascade="all, delete-orphan")

class ProductProfileModel(Base):
    __tablename__ = "product_profiles"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    conversation_id = Column(String(64), ForeignKey("conversations.id", ondelete="CASCADE"), unique=True, nullable=False)
    product = Column(String(255), nullable=True)
    material = Column(String(255), nullable=True)
    intended_use = Column(String(255), nullable=True)
    target_user = Column(String(255), nullable=True)
    industry = Column(String(255), nullable=True)
    market = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    raw_attributes = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    conversation = relationship("ConversationModel", back_populates="product_profile")

class MessageModel(Base):
    __tablename__ = "messages"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    conversation_id = Column(String(64), ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False)
    sender = Column(String(20), nullable=False)
    content = Column(Text, nullable=False)
    intent = Column(String(50), nullable=True)
    confidence = Column(Float, default=1.0)
    evidence_status = Column(String(50), default="STRONG EVIDENCE") # STRONG EVIDENCE, PARTIAL EVIDENCE, INSUFFICIENT EVIDENCE, UNVERIFIED
    payload_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    conversation = relationship("ConversationModel", back_populates="messages")

class DocumentModel(Base):
    __tablename__ = "documents"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    standard_number = Column(String(100), nullable=True)
    document_type = Column(String(50), nullable=False)
    source = Column(String(255), nullable=False)
    source_type = Column(String(100), default="DEMO_BENCHMARK") # OFFICIAL_PORTAL, DEMO_BENCHMARK, GAZETTE, UNVERIFIED
    source_name = Column(String(255), default="BIS Demo Knowledge Repository")
    source_url = Column(String(255), default="https://www.services.bis.gov.in")
    authority_level = Column(String(50), default="DEMO_BENCHMARK") # AUTHORIZED_STATUTORY, DEMO_BENCHMARK, UNVERIFIED
    is_demo = Column(Boolean, default=True)
    version = Column(String(50), default="1.0")
    publication_date = Column(String(50), nullable=True)
    effective_date = Column(String(50), nullable=True)
    status = Column(String(50), default="CURRENT") # CURRENT, SUPERSEDED, REVIEW REQUIRED, UNKNOWN
    last_verified = Column(String(50), default="2026-09-10")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class DocumentVersionModel(Base):
    __tablename__ = "document_versions"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    document_id = Column(String(64), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    version = Column(String(50), nullable=False)
    effective_date = Column(String(50), nullable=True)
    status = Column(String(50), nullable=False)
    changelog = Column(Text, nullable=True)
    source_file = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChunkModel(Base):
    __tablename__ = "chunks"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    document_id = Column(String(64), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    text = Column(Text, nullable=False)
    section = Column(String(255), nullable=True)
    clause = Column(String(100), nullable=True)
    page = Column(Integer, nullable=True)
    metadata_json = Column(Text, nullable=True)
    embedding_reference = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class StandardModel(Base):
    __tablename__ = "standards"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    standard_number = Column(String(100), unique=True, nullable=False)
    title = Column(String(255), nullable=False)
    scope = Column(Text, nullable=True)
    ics_code = Column(String(50), nullable=True)
    is_mandatory = Column(Boolean, default=False)
    scheme_type = Column(String(100), nullable=True)
    revision_year = Column(String(10), nullable=True)
    source_type = Column(String(100), default="DEMO_BENCHMARK")
    source_name = Column(String(255), default="BIS Standards Repository")
    source_url = Column(String(255), default="https://www.services.bis.gov.in")
    authority_level = Column(String(50), default="DEMO_BENCHMARK")
    is_demo = Column(Boolean, default=True)
    last_verified = Column(String(50), default="2026-09-10")
    status = Column(String(50), default="CURRENT")
    created_at = Column(DateTime, default=datetime.utcnow)

class StandardRelationshipModel(Base):
    __tablename__ = "standard_relationships"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    source_standard_id = Column(String(64), ForeignKey("standards.id", ondelete="CASCADE"), nullable=False)
    target_standard_id = Column(String(64), ForeignKey("standards.id", ondelete="CASCADE"), nullable=False)
    relationship_type = Column(String(50), nullable=False) # REPLACES, CROSS_REFERENCES, COMPLEMENTS
    description = Column(Text, nullable=True)

class SchemeModel(Base):
    __tablename__ = "schemes"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    applicability = Column(Text, nullable=True)
    fee_structure = Column(Text, nullable=True)
    source_type = Column(String(100), default="OFFICIAL_PORTAL")
    source_name = Column(String(255), default="BIS Manakonline Portal")
    source_url = Column(String(255), default="https://www.manakonline.in")
    authority_level = Column(String(50), default="AUTHORIZED_STATUTORY")
    is_demo = Column(Boolean, default=False)

class TestingRequirementModel(Base):
    __tablename__ = "testing_requirements"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    standard_id = Column(String(64), ForeignKey("standards.id", ondelete="CASCADE"), nullable=False)
    test_name = Column(String(255), nullable=False)
    clause = Column(String(100), nullable=True)
    parameter = Column(String(255), nullable=True)
    methodology = Column(Text, nullable=True)
    acceptance_criteria = Column(Text, nullable=True)

class LaboratoryModel(Base):
    __tablename__ = "laboratories"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    lab_code = Column(String(50), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    address = Column(Text, nullable=True)
    contact_email = Column(String(255), nullable=True)
    contact_phone = Column(String(50), nullable=True)
    accreditation_status = Column(String(50), default="NABL_ACCREDITED")
    is_bis_recognized = Column(Boolean, default=True)
    source_type = Column(String(100), default="DEMO_BENCHMARK")
    source_name = Column(String(255), default="BIS Central Lab Directory")
    source_url = Column(String(255), default="https://www.lims.bis.gov.in")
    authority_level = Column(String(50), default="DEMO_BENCHMARK")
    is_demo = Column(Boolean, default=True)
    last_verified = Column(String(50), default="2026-09-10")
    status = Column(String(50), default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)

class LaboratoryCapabilityModel(Base):
    __tablename__ = "laboratory_capabilities"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    lab_id = Column(String(64), ForeignKey("laboratories.id", ondelete="CASCADE"), nullable=False)
    standard_id = Column(String(64), ForeignKey("standards.id", ondelete="CASCADE"), nullable=False)
    product_scope = Column(Text, nullable=False)
    test_capabilities = Column(Text, nullable=True)
    valid_until = Column(String(50), nullable=True)

class CitationModel(Base):
    __tablename__ = "citations"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    message_id = Column(String(64), ForeignKey("messages.id", ondelete="CASCADE"), nullable=False)
    document_id = Column(String(64), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    chunk_id = Column(String(64), nullable=True)
    clause = Column(String(100), nullable=True)
    page = Column(Integer, nullable=True)
    veracity_score = Column(Float, default=1.0)

class SavedAnswerModel(Base):
    __tablename__ = "saved_answers"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    question = Column(Text, nullable=False)
    answer_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLogModel(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    request_id = Column(String(64), nullable=True)
    user_id = Column(String(64), nullable=True)
    action = Column(String(100), nullable=False)
    intent = Column(String(50), nullable=True)
    latency_ms = Column(Integer, nullable=True)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class IngestionJobModel(Base):
    __tablename__ = "ingestion_jobs"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    document_title = Column(String(255), nullable=False)
    source_file = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False) # PENDING, PROCESSING, COMPLETED, FAILED
    total_chunks = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

class EvaluationResultModel(Base):
    __tablename__ = "evaluation_results"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    test_suite = Column(String(100), nullable=False)
    retrieval_precision = Column(Float, nullable=True)
    evidence_coverage = Column(Float, nullable=True)
    citation_correctness = Column(Float, nullable=True)
    groundedness_score = Column(Float, nullable=True)
    latency_ms = Column(Integer, nullable=True)
    unanswered_rate = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class BISRegistryModel(Base):
    """
    Authoritative BIS CARE Registry database for CM/L and CRS R-Number verification.
    """
    __tablename__ = "bis_registry"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    license_number = Column(String(64), unique=True, nullable=False, index=True) # e.g. CM/L-8400192 or R-41012345
    license_type = Column(String(30), nullable=False) # ISI_CML, CRS_R_NUMBER
    standard_number = Column(String(100), nullable=False) # e.g. IS 2347:2017
    manufacturer_name = Column(String(255), nullable=False)
    brand_name = Column(String(100), nullable=False)
    product_name = Column(String(255), nullable=False)
    factory_address = Column(Text, nullable=False)
    status = Column(String(50), default="OPERATIVE") # OPERATIVE, EXPIRED, SUSPENDED, CANCELLED
    valid_from = Column(String(50), nullable=True)
    valid_to = Column(String(50), nullable=True)
    model_scope = Column(Text, nullable=True)
    is_demo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ConsumerGrievanceModel(Base):
    """
    Consumer grievance dossiers generated under the BIS Act, 2016 for counterfeit marks.
    """
    __tablename__ = "consumer_grievances"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    complaint_ref_no = Column(String(64), unique=True, nullable=False, index=True) # e.g. BIS-GRV-2026-XXXX
    complainant_name = Column(String(255), nullable=True)
    complainant_email = Column(String(255), nullable=True)
    complainant_phone = Column(String(50), nullable=True)
    product_name = Column(String(255), nullable=False)
    alleged_license_number = Column(String(64), nullable=True)
    seller_name = Column(String(255), nullable=False)
    seller_address = Column(Text, nullable=True)
    purchase_platform = Column(String(100), default="RETAIL_STORE") # RETAIL_STORE, E_COMMERCE
    invoice_number = Column(String(100), nullable=True)
    complaint_type = Column(String(100), nullable=False) # FAKE_ISI_MARK, EXPIRED_LICENSE, SUBSTANDARD_QUALITY
    description = Column(Text, nullable=False)
    statutory_violation = Column(String(255), default="BIS Act 2016 Section 14, 15 & 29")
    status = Column(String(50), default="DOSSIER_GENERATED")
    dossier_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class QCOGazetteModel(Base):
    """
    Quality Control Orders (QCO) and Gazette notifications with supersession tracking.
    """
    __tablename__ = "qco_gazette_orders"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    order_number = Column(String(100), unique=True, nullable=False) # e.g. S.O. 3857(E)
    title = Column(String(255), nullable=False)
    ministry = Column(String(255), nullable=False)
    date_of_notification = Column(String(50), nullable=False)
    effective_date = Column(String(50), nullable=False)
    status = Column(String(50), default="CURRENT") # CURRENT, SUPERSEDED, AMENDED, UPCOMING
    superseded_by_order = Column(String(100), nullable=True) # Order number superseding this
    supersedes_order = Column(String(100), nullable=True) # Order number this superseded
    affected_standards = Column(Text, nullable=False) # e.g. IS 2347, IS 17803
    mandatory_scheme = Column(String(50), default="Scheme I")
    msme_exemption_clause = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ProductModel(Base):
    """
    Core Product entity for consumer-friendly product search and compliance graphs.
    """
    __tablename__ = "products"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(255), unique=True, nullable=False, index=True) # e.g. "Mobile Phone"
    category = Column(String(255), nullable=False) # e.g. "Electronics & IT Goods"
    description = Column(Text, nullable=True)
    mandatory_status = Column(String(50), default="MANDATORY") # MANDATORY, VOLUNTARY, CONDITIONAL
    primary_standard_number = Column(String(100), nullable=False) # e.g. "IS 13252 (Part 1):2010"
    certification_scheme = Column(String(100), nullable=False) # e.g. "Scheme II (Compulsory Registration Scheme - CRS)"
    qco_order_number = Column(String(255), nullable=True)
    effective_date = Column(String(50), nullable=True)
    consumer_summary = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    aliases = relationship("ProductAliasModel", back_populates="product", cascade="all, delete-orphan")

class ProductAliasModel(Base):
    """
    Synonyms and colloquial search terms mapping to canonical Product entities.
    """
    __tablename__ = "product_aliases"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    product_id = Column(String(64), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    alias = Column(String(100), nullable=False, index=True) # e.g. "mobile", "smartphone", "cellphone"
    
    product = relationship("ProductModel", back_populates="aliases")

class StandardVersionModel(Base):
    """
    Historical and upcoming version tracking for Indian Standards.
    Never overwrites historical versions.
    """
    __tablename__ = "standard_versions"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    standard_number = Column(String(100), nullable=False, index=True) # e.g. IS 2347:2017 or IS 2347:2006
    base_standard_code = Column(String(50), nullable=False, index=True) # e.g. IS 2347
    version_year = Column(String(10), nullable=False) # e.g. 2017
    title = Column(String(255), nullable=False)
    status = Column(String(50), default="ACTIVE") # ACTIVE, AMENDED, REVISED, SUPERSEDED, WITHDRAWN, UPCOMING, REFERENCE_ONLY, HISTORICAL
    user_status_label = Column(String(100), default="Current") # e.g. "Current", "Replaced by newer standard", "Will apply from 2027-01-01"
    publication_date = Column(String(50), nullable=False)
    effective_date = Column(String(50), nullable=False)
    withdrawal_date = Column(String(50), nullable=True)
    supersedes = Column(String(100), nullable=True) # e.g. IS 2347:2006
    superseded_by = Column(String(100), nullable=True)
    amendment_numbers = Column(String(255), nullable=True) # comma-separated e.g. "Amd 1, Amd 2"
    source_url = Column(String(255), default="https://www.services.bis.gov.in")
    retrieved_at = Column(String(50), default="2026-09-11")
    verified_at = Column(String(50), default="2026-09-11")
    created_at = Column(DateTime, default=datetime.utcnow)

class StandardAmendmentModel(Base):
    """
    Active and upcoming amendments to Indian Standards.
    """
    __tablename__ = "standard_amendments"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    standard_number = Column(String(100), nullable=False, index=True) # e.g. IS 13252 (Part 1):2010
    amendment_no = Column(String(50), nullable=False) # e.g. "Amendment 2"
    title = Column(String(255), nullable=False)
    publication_date = Column(String(50), nullable=False)
    effective_date = Column(String(50), nullable=False)
    status = Column(String(50), default="ACTIVE") # ACTIVE, UPCOMING, SUPERSEDED
    summary = Column(Text, nullable=False)
    affected_clauses = Column(String(255), nullable=True)
    source_url = Column(String(255), default="https://www.services.bis.gov.in")
    created_at = Column(DateTime, default=datetime.utcnow)

class SyncJobModel(Base):
    """
    Synchronization status and health monitoring of official BIS sources.
    Tracks official metadata updates without PDF hashing or speculative diffing.
    """
    __tablename__ = "sync_jobs"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    source_name = Column(String(255), nullable=False) # e.g. "BIS Standards Portal", "DPIIT QCO Gazette", "MeitY Compulsory Registration Scheme"
    source_url = Column(String(255), nullable=False)
    source_type = Column(String(50), default="OFFICIAL_GOVERNMENT")
    last_checked = Column(String(50), default="2026-09-11 11:30:00")
    last_synced = Column(String(50), default="2026-09-11 11:30:00")
    last_official_update = Column(String(255), nullable=True) # e.g. "S.O. 1294(E) Published"
    status = Column(String(50), default="SUCCESS") # SUCCESS, SOURCE_UNAVAILABLE, UPDATE_REVIEW_REQUIRED, IN_PROGRESS
    change_detected = Column(Boolean, default=False)
    documents_count = Column(Integer, default=0)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class SourceDocumentModel(Base):
    """
    Structured official BIS regulatory source records.
    Stores authoritative publication dates, effective dates, amendment numbers,
    and supersession relationships without relying on binary PDF hashing.
    """
    __tablename__ = "source_documents"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    source_name = Column(String(255), nullable=False) # e.g. "BIS Gazette Division"
    document_title = Column(String(255), nullable=False)
    url = Column(String(255), nullable=False) # Source URL
    source_url = Column(String(255), nullable=True) # Alias for clarity
    document_type = Column(String(50), nullable=False) # STANDARD, REVISED_STANDARD, AMENDMENT, CORRIGENDUM, NEW_QCO, QCO_AMENDMENT, GAZETTE_NOTIFICATION, WITHDRAWAL
    standard_number = Column(String(100), nullable=True) # e.g. "IS 13252 (Part 1):2010"
    standard_year = Column(String(20), nullable=True) # e.g. "2010"
    amendment_number = Column(String(50), nullable=True) # e.g. "Amendment 1"
    gazette_notification_number = Column(String(100), nullable=True) # e.g. "S.O. 1294(E)"
    version = Column(String(50), default="1.0")
    publication_date = Column(String(50), nullable=True)
    effective_date = Column(String(50), nullable=True)
    withdrawal_date = Column(String(50), nullable=True)
    supersedes = Column(String(100), nullable=True)
    superseded_by = Column(String(100), nullable=True)
    last_checked = Column(String(50), default="2026-09-11 11:30:00")
    retrieved_at = Column(String(50), default="2026-09-11")
    status = Column(String(50), default="ACTIVE") # ACTIVE, UPCOMING, SUPERSEDED, WITHDRAWN, UPDATE_REVIEW_REQUIRED, SOURCE_UNAVAILABLE
    review_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class DocumentClauseModel(Base):
    """
    Structured document units (Clauses, Subclauses, Tables, Annexures).
    Extracted via Docling parser to enable structural and semantic change detection.
    Canonical identifier format: 'IS 1234|5.2' or '{version_id}|{clause_number}'.
    """
    __tablename__ = "document_clauses"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    version_id = Column(String(64), ForeignKey("standard_versions.id", ondelete="CASCADE"), nullable=True)
    document_id = Column(String(64), ForeignKey("documents.id", ondelete="CASCADE"), nullable=True)
    standard_number = Column(String(100), nullable=False, index=True) # e.g. "IS 2347:2017"
    clause_number = Column(String(100), nullable=False, index=True) # e.g. "5.2", "TABLE-4", "ANNEX-A"
    title = Column(String(255), nullable=True) # e.g. "Material Requirements"
    content = Column(Text, nullable=False) # e.g. "The product shall withstand pressure of 350 kPa."
    clause_type = Column(String(50), default="CLAUSE") # CLAUSE, SUBCLAUSE, TABLE, ANNEXURE, NOTE
    page_number = Column(Integer, default=1)
    table_data_json = Column(Text, nullable=True) # Structured JSON for table rows & columns
    embedding_reference = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class DocumentChangeModel(Base):
    """
    Immutable records of semantic changes detected between document versions.
    Classified via semantic diffing and passed through regulatory validation.
    No binary/hash comparisons are used.
    """
    __tablename__ = "document_changes"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    standard_number = Column(String(100), nullable=False, index=True) # e.g. "IS 2347"
    old_version_id = Column(String(64), nullable=True) # e.g. "ver_2347_2006"
    new_version_id = Column(String(64), nullable=True) # e.g. "ver_2347_2017"
    clause_number = Column(String(100), nullable=False, index=True) # e.g. "5.2"
    change_type = Column(String(50), nullable=False) # ADDED, REMOVED, MODIFIED, UNCHANGED, MOVED, RENAMED, TABLE_CHANGED
    old_content = Column(Text, nullable=True) # e.g. "300 kPa"
    new_content = Column(Text, nullable=True) # e.g. "350 kPa"
    similarity_score = Column(Float, default=1.0)
    impact_category = Column(String(50), default="TESTING") # SAFETY, TESTING, PERFORMANCE, MATERIAL, MARKING, DOCUMENTATION, CERTIFICATION, REGISTRATION, SCOPE, APPLICABILITY, OTHER
    impact_level = Column(String(50), default="HIGH") # LOW, MEDIUM, HIGH, UNKNOWN
    impact_reason = Column(Text, nullable=True) # e.g. "Testing threshold updated from 300 kPa to 350 kPa."
    effective_date = Column(String(50), nullable=True)
    source_reference = Column(String(255), default="Bureau of Indian Standards Official Gazette")
    validation_status = Column(String(50), default="VALIDATED_OFFICIAL")
    affected_products_json = Column(Text, nullable=True) # JSON list: e.g. ["Domestic Pressure Cooker"]
    created_at = Column(DateTime, default=datetime.utcnow)
