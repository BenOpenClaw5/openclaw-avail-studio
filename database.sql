-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meta_user_id VARCHAR(255) UNIQUE NOT NULL,
  meta_user_name VARCHAR(255),
  access_token TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ad Accounts table
CREATE TABLE IF NOT EXISTS ad_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id VARCHAR(255) NOT NULL,
  account_name VARCHAR(255),
  currency VARCHAR(3),
  timezone VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table (for storing session data temporarily)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insights cache (for caching Meta API responses to reduce calls)
CREATE TABLE IF NOT EXISTS insights_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id VARCHAR(255) NOT NULL,
  metric_type VARCHAR(100) NOT NULL,
  date_start DATE,
  date_end DATE,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX idx_users_meta_user_id ON users(meta_user_id);
CREATE INDEX idx_ad_accounts_user_id ON ad_accounts(user_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_insights_account_date ON insights_cache(account_id, date_start, date_end);
