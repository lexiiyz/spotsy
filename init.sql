-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users (Optional registered or anonymous sessions)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: place_cache (Store real places & popular times JSON to reduce external API hits)
CREATE TABLE IF NOT EXISTS place_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    place_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    area VARCHAR(255) NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    rating DECIMAL(2, 1) DEFAULT 4.5,
    price_level VARCHAR(10) DEFAULT '$$',
    wifi_available BOOLEAN DEFAULT true,
    power_outlets BOOLEAN DEFAULT true,
    noise_level VARCHAR(50) DEFAULT 'Quiet',
    opening_hours VARCHAR(100) DEFAULT '08:00 - 23:00',
    popular_times_json JSONB,
    last_scraped_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_place_cache_place_id ON place_cache(place_id);
CREATE INDEX IF NOT EXISTS idx_place_cache_category ON place_cache(category);

-- Table: chat_sessions (Store conversation sessions)
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_title VARCHAR(255) DEFAULT 'Percakapan Baru',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: chat_messages (Store user & assistant message logs)
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender VARCHAR(20) CHECK (sender IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
