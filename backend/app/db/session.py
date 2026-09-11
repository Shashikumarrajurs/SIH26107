from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker
from backend.app.config import settings
from backend.app.db.models import Base

# Support connect_args for SQLite
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args, echo=False)

if settings.DATABASE_URL.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.execute("PRAGMA cache_size=10000")
        cursor.execute("PRAGMA temp_store=MEMORY")
        cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
    
    # Safe SQLite schema migration for users table columns
    if settings.DATABASE_URL.startswith("sqlite"):
        with engine.begin() as conn:
            try:
                result = conn.execute(text("PRAGMA table_info(users)"))
                columns = [row[1] for row in result.fetchall()]
                
                if "mobile" not in columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN mobile VARCHAR(50)"))
                if "email_verified" not in columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT 0"))
                if "mobile_verified" not in columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN mobile_verified BOOLEAN DEFAULT 0"))
                if "account_type" not in columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN account_type VARCHAR(50) DEFAULT 'MANUFACTURER'"))
            except Exception as e:
                # If table does not exist yet or other harmless case, create_all already handled it
                pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

