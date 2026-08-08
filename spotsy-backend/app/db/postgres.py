import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

# Format URL for asyncpg driver if needed
db_url = settings.DATABASE_URL
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

# Automatically resolve Docker container hostname '@db:5432' to '@localhost:5435' when running outside Docker
if not os.path.exists("/.dockerenv"):
    if "@db:5432" in db_url:
        db_url = db_url.replace("@db:5432", "@localhost:5435", 1)
    elif "@db:" in db_url:
        db_url = db_url.replace("@db:", "@localhost:5435", 1)
    elif "@localhost:5432" in db_url:
        db_url = db_url.replace("@localhost:5432", "@localhost:5435", 1)

engine = create_async_engine(
    db_url,
    echo=False,
    future=True,
    pool_pre_ping=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
