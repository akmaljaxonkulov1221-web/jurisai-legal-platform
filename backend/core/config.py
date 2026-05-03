"""
Backend Configuration
O'zbekiston qonunchiligiga moslashgan konfiguratsiya
"""

from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Asosiy sozlamalar
    app_name: str = "JurisAI Backend"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # Server sozlamalari
    host: str = "0.0.0.0"
    port: int = 8000
    
    # Database sozlamalari
    database_url: str = "sqlite:///./jurisai.db"
    
    # JWT sozlamalari
    secret_key: str = "jurisai-secret-key-2024-uzbekistan-legal-platform"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS sozlamalari
    allowed_origins: list = ["http://localhost:3000", "http://localhost:3001"]
    
    # AI servis sozlamalari
    openai_api_key: Optional[str] = None
    ai_model: str = "gpt-3.5-turbo"
    
    # O'zbekiston qonunchilik sozlamalari
    legal_system: str = "uzbekistan"
    supported_languages: list = ["uz", "ru", "en"]
    default_language: str = "uz"
    
    # Fayl sozlamalari
    upload_dir: str = "uploads"
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    
    # Kesh sozlamalari
    cache_ttl: int = 3600  # 1 soat
    
    # Email sozlamalari
    smtp_host: Optional[str] = None
    smtp_port: int = 587
    smtp_user: Optional[str] = None
    smtp_password: Optional[str] = None
    
    # Log sozlamalari
    log_level: str = "INFO"
    log_file: str = "logs/jurisai.log"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Global settings instance
settings = Settings()

# O'zbekiston qonunchilik ma'lumotlari
UZBEKISTAN_LEGAL_CODES = {
    "civil": "O'zbekiston Respublikasi Fuqarolik Kodeksi",
    "criminal": "O'zbekiston Respublikasi Jinoyat Kodeksi",
    "family": "O'zbekiston Respublikasi Oila Kodeksi",
    "labor": "O'zbekiston Respublikasi Mehnat Kodeksi",
    "tax": "O'zbekiston Respublikasi Soliq Kodeksi",
    "land": "O'zbekiston Respublikasi Yer Kodeksi",
    "water": "O'zbekiston Respublikasi Suv Kodeksi",
    "administrative": "O'zbekiston Respublikasi Ma'muriy huquqbuzarlik to'g'risidagi Kodeksi"
}

# IRAC metodologiyasi sozlamalari
IRAC_CONFIG = {
    "issue_keywords": ["masala", "muammo", "savol", "holat", "vaziyat"],
    "rule_keywords": ["qonun", "kodeks", "qoida", "norma", "qaror"],
    "application_keywords": ["qo'llash", "tatbiq etish", "analiz", "baholash"],
    "conclusion_keywords": ["xulosa", "natija", "qaror", "tavsiya"],
    "min_score": 0,
    "max_score": 100,
    "passing_score": 70
}

# AI servis sozlamalari
AI_CONFIG = {
    "max_tokens": 2000,
    "temperature": 0.7,
    "timeout": 30,
    "retry_attempts": 3
}

# Virtual sud sozlamalari
COURT_CONFIG = {
    "roles": ["judge", "prosecutor", "defendant", "lawyer"],
    "session_duration": 1800,  # 30 daqiqa
    "max_participants": 4,
    "decision_timeout": 300  # 5 daqiqa
}
