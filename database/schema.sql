-- BIS SmartAssist Relational Database Schema
-- Compatible with PostgreSQL & SQLite

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER', -- USER, ADMIN
    organization VARCHAR(255),
    user_type VARCHAR(50), -- MSME, Industry, Startup, Consumer, Student, Laboratory
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversations (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    title VARCHAR(255) NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_profiles (
    id VARCHAR(64) PRIMARY KEY,
    conversation_id VARCHAR(64) UNIQUE NOT NULL,
    product VARCHAR(255),
    material VARCHAR(255),
    intended_use VARCHAR(255),
    target_user VARCHAR(255),
    industry VARCHAR(255),
    market VARCHAR(255),
    location VARCHAR(255),
    raw_attributes TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(64) PRIMARY KEY,
    conversation_id VARCHAR(64) NOT NULL,
    sender VARCHAR(20) NOT NULL, -- user, assistant
    content TEXT NOT NULL,
    intent VARCHAR(50),
    confidence FLOAT DEFAULT 1.0,
    evidence_status VARCHAR(50), -- GROUNDED, LOW_EVIDENCE, UNVERIFIED
    payload_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    standard_number VARCHAR(100),
    document_type VARCHAR(50) NOT NULL, -- STANDARD, SCHEME, GAZETTE, GUIDELINE
    source VARCHAR(255) NOT NULL,
    version VARCHAR(50) DEFAULT '1.0',
    publication_date VARCHAR(50),
    effective_date VARCHAR(50),
    status VARCHAR(50) DEFAULT 'CURRENT', -- CURRENT, SUPERSEDED, NEEDS_REVIEW
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS document_versions (
    id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64) NOT NULL,
    version VARCHAR(50) NOT NULL,
    effective_date VARCHAR(50),
    status VARCHAR(50) NOT NULL,
    changelog TEXT,
    source_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chunks (
    id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64) NOT NULL,
    text TEXT NOT NULL,
    section VARCHAR(255),
    clause VARCHAR(100),
    page INT,
    metadata_json TEXT,
    embedding_reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS standards (
    id VARCHAR(64) PRIMARY KEY,
    standard_number VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    scope TEXT,
    ics_code VARCHAR(50),
    is_mandatory BOOLEAN DEFAULT FALSE,
    scheme_type VARCHAR(100),
    revision_year VARCHAR(10),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS standard_relationships (
    id VARCHAR(64) PRIMARY KEY,
    source_standard_id VARCHAR(64) NOT NULL,
    target_standard_id VARCHAR(64) NOT NULL,
    relationship_type VARCHAR(50) NOT NULL, -- REPLACES, CROSS_REFERENCES, COMPLEMENTS
    description TEXT,
    FOREIGN KEY (source_standard_id) REFERENCES standards(id) ON DELETE CASCADE,
    FOREIGN KEY (target_standard_id) REFERENCES standards(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS schemes (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL, -- ISI, CRS, HALLMARK, ECO, FMCS
    description TEXT,
    applicability TEXT,
    fee_structure TEXT
);

CREATE TABLE IF NOT EXISTS testing_requirements (
    id VARCHAR(64) PRIMARY KEY,
    standard_id VARCHAR(64) NOT NULL,
    test_name VARCHAR(255) NOT NULL,
    clause VARCHAR(100),
    parameter VARCHAR(255),
    methodology TEXT,
    acceptance_criteria TEXT,
    FOREIGN KEY (standard_id) REFERENCES standards(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS laboratories (
    id VARCHAR(64) PRIMARY KEY,
    lab_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    address TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    accreditation_status VARCHAR(50) DEFAULT 'NABL_ACCREDITED',
    is_bis_recognized BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS laboratory_capabilities (
    id VARCHAR(64) PRIMARY KEY,
    lab_id VARCHAR(64) NOT NULL,
    standard_id VARCHAR(64) NOT NULL,
    product_scope TEXT NOT NULL,
    test_capabilities TEXT,
    valid_until VARCHAR(50),
    FOREIGN KEY (lab_id) REFERENCES laboratories(id) ON DELETE CASCADE,
    FOREIGN KEY (standard_id) REFERENCES standards(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS citations (
    id VARCHAR(64) PRIMARY KEY,
    message_id VARCHAR(64) NOT NULL,
    document_id VARCHAR(64) NOT NULL,
    chunk_id VARCHAR(64),
    clause VARCHAR(100),
    page INT,
    veracity_score FLOAT DEFAULT 1.0,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS saved_answers (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    answer_json TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ingestion_jobs (
    id VARCHAR(64) PRIMARY KEY,
    document_title VARCHAR(255) NOT NULL,
    source_file VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL, -- PENDING, PROCESSING, COMPLETED, FAILED
    total_chunks INT DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evaluation_results (
    id VARCHAR(64) PRIMARY KEY,
    test_suite VARCHAR(100) NOT NULL,
    retrieval_precision FLOAT,
    evidence_coverage FLOAT,
    citation_correctness FLOAT,
    groundedness_score FLOAT,
    latency_ms INT,
    unanswered_rate FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
