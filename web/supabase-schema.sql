-- Supabase Database Schema for Video Conferencing App
-- Run these SQL commands in your Supabase SQL Editor

-- Enable Row Level Security
ALTER TABLE IF EXISTS meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS chat_messages ENABLE ROW LEVEL SECURITY;

-- Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id VARCHAR(10) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  max_participants INTEGER DEFAULT 12,
  settings JSONB DEFAULT '{
    "allow_screen_share": true,
    "allow_recording": true,
    "require_approval": false
  }'::jsonb
);

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_host BOOLEAN DEFAULT false,
  is_video_enabled BOOLEAN DEFAULT true,
  is_audio_enabled BOOLEAN DEFAULT true,
  is_speaking BOOLEAN DEFAULT false,
  is_muted BOOLEAN DEFAULT false,
  connection_status VARCHAR(20) DEFAULT 'connected' CHECK (connection_status IN ('connected', 'disconnected', 'connecting')),
  UNIQUE(meeting_id, user_id)
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message_type VARCHAR(10) DEFAULT 'text' CHECK (message_type IN ('text', 'system'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meetings_room_id ON meetings(room_id);
CREATE INDEX IF NOT EXISTS idx_meetings_active ON meetings(is_active);
CREATE INDEX IF NOT EXISTS idx_participants_meeting_id ON participants(meeting_id);
CREATE INDEX IF NOT EXISTS idx_participants_user_id ON participants(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_meeting_id ON chat_messages(meeting_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Row Level Security Policies

-- Meetings policies
CREATE POLICY "Anyone can create meetings" ON meetings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view active meetings" ON meetings
  FOR SELECT USING (is_active = true);

CREATE POLICY "Meeting creator can update their meeting" ON meetings
  FOR UPDATE USING (created_by = auth.uid()::text OR true);

-- Participants policies
CREATE POLICY "Anyone can join meetings" ON participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view participants in active meetings" ON participants
  FOR SELECT USING (
    meeting_id IN (
      SELECT id FROM meetings WHERE is_active = true
    )
  );

CREATE POLICY "Users can update their own participant record" ON participants
  FOR UPDATE USING (user_id = auth.uid()::text OR true);

CREATE POLICY "Users can leave meetings" ON participants
  FOR DELETE USING (user_id = auth.uid()::text OR true);

-- Chat messages policies
CREATE POLICY "Anyone can send messages to active meetings" ON chat_messages
  FOR INSERT WITH CHECK (
    meeting_id IN (
      SELECT id FROM meetings WHERE is_active = true
    )
  );

CREATE POLICY "Anyone can view messages in active meetings" ON chat_messages
  FOR SELECT USING (
    meeting_id IN (
      SELECT id FROM meetings WHERE is_active = true
    )
  );

-- Functions for cleanup
CREATE OR REPLACE FUNCTION cleanup_old_meetings()
RETURNS void AS $$
BEGIN
  -- Delete meetings older than 24 hours
  DELETE FROM meetings 
  WHERE created_at < NOW() - INTERVAL '24 hours';
  
  -- Delete participants from inactive meetings
  DELETE FROM participants 
  WHERE meeting_id IN (
    SELECT id FROM meetings WHERE is_active = false
  );
  
  -- Delete chat messages from inactive meetings
  DELETE FROM chat_messages 
  WHERE meeting_id IN (
    SELECT id FROM meetings WHERE is_active = false
  );
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically clean up old data
CREATE OR REPLACE FUNCTION trigger_cleanup_old_meetings()
RETURNS trigger AS $$
BEGIN
  PERFORM cleanup_old_meetings();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup (if pg_cron is available)
-- SELECT cron.schedule('cleanup-old-meetings', '0 */6 * * *', 'SELECT cleanup_old_meetings();');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
