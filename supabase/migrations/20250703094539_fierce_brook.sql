-- KarmaQuest Dynamic Localization Migration
-- Version: v0.6.0
-- Date: 2025-01-03

-- 1.1 Central quest keys table
CREATE TABLE IF NOT EXISTS quests (
  key           TEXT PRIMARY KEY,
  default_en    TEXT NOT NULL,
  description_en TEXT,
  category      TEXT CHECK (category IN ('health','relationships','finances','spirituality','career')),
  priority      INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  xp_reward     INTEGER DEFAULT 20,
  belief_system TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- 1.2 Localized versions
CREATE TABLE IF NOT EXISTS quest_locales (
  quest_key     TEXT REFERENCES quests(key) ON DELETE CASCADE,
  lng           TEXT CHECK (lng IN ('ru','kz','en')),
  title         TEXT NOT NULL,
  description   TEXT,
  translated_by TEXT CHECK (translated_by IN ('human','gpt','auto')),
  quality_score DECIMAL(3,2) DEFAULT 0.8,
  updated_at    TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (quest_key, lng)
);

-- 1.3 Translation jobs queue
CREATE TABLE IF NOT EXISTS translation_jobs (
  id            SERIAL PRIMARY KEY,
  quest_key     TEXT REFERENCES quests(key) ON DELETE CASCADE,
  target_lng    TEXT NOT NULL,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed')),
  attempts      INTEGER DEFAULT 0,
  error_message TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  completed_at  TIMESTAMPTZ
);

-- 1.4 Indexes for performance
CREATE INDEX IF NOT EXISTS quest_locales_lng_idx ON quest_locales(lng);
CREATE INDEX IF NOT EXISTS quest_locales_updated_idx ON quest_locales(updated_at DESC);
CREATE INDEX IF NOT EXISTS translation_jobs_status_idx ON translation_jobs(status, created_at);
CREATE INDEX IF NOT EXISTS quests_category_idx ON quests(category);
CREATE INDEX IF NOT EXISTS quests_belief_system_idx ON quests(belief_system);

-- 1.5 Update trigger for quests
CREATE OR REPLACE FUNCTION update_quest_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quest_update_timestamp
  BEFORE UPDATE ON quests
  FOR EACH ROW
  EXECUTE FUNCTION update_quest_timestamp();

-- 1.6 Seed some initial English quests
INSERT INTO quests (key, default_en, description_en, category, priority, xp_reward, belief_system) VALUES
  ('meditation_daily', 'Practice daily meditation', 'Spend 10 minutes in mindful meditation to center yourself', 'spirituality', 4, 25, 'psychology'),
  ('gratitude_journal', 'Write in gratitude journal', 'List 3 things you are grateful for today', 'spirituality', 3, 20, 'psychology'),
  ('chakra_balance', 'Balance your chakras', 'Perform chakra balancing meditation focusing on energy centers', 'health', 4, 30, 'chakras'),
  ('astro_moon_ritual', 'Moon phase ritual', 'Align your intentions with the current moon phase', 'spirituality', 3, 25, 'astrology'),
  ('mindful_eating', 'Practice mindful eating', 'Eat one meal today with full awareness and gratitude', 'health', 2, 15, 'psychology'),
  ('relationship_check', 'Connect with loved ones', 'Reach out to someone important and have a meaningful conversation', 'relationships', 4, 30, 'psychology'),
  ('financial_review', 'Review your finances', 'Spend 15 minutes reviewing your budget and financial goals', 'finances', 3, 20, 'psychology'),
  ('tarot_reflection', 'Daily tarot reflection', 'Draw a card and reflect on its message for your day', 'spirituality', 2, 15, 'tarot'),
  ('numerology_calc', 'Calculate your daily number', 'Find your personal day number and reflect on its meaning', 'spirituality', 2, 15, 'numerology'),
  ('career_visioning', 'Visualize career goals', 'Spend 10 minutes visualizing your ideal career path', 'career', 3, 25, 'psychology')
ON CONFLICT (key) DO NOTHING;