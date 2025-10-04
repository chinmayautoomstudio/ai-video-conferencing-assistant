# 🚀 Supabase Setup Guide for Video Conferencing

## 📋 **Step-by-Step Setup**

### **Step 1: Create Supabase Project**

1. **Go to**: [supabase.com](https://supabase.com)
2. **Sign up/Login** with your account
3. **Click "New Project"**
4. **Fill in details**:
   - Organization: Choose or create
   - Project Name: `video-conference-app`
   - Database Password: Create a strong password
   - Region: Choose closest to your users
5. **Click "Create new project"**
6. **Wait 2-3 minutes** for project to be ready

### **Step 2: Get Your Credentials**

1. **Go to Project Dashboard**
2. **Click "Settings" → "API"**
3. **Copy these values**:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **Step 3: Setup Database Schema**

1. **Go to "SQL Editor"** in your Supabase dashboard
2. **Click "New Query"**
3. **Copy and paste** the contents of `supabase-schema.sql`
4. **Click "Run"** to create tables and policies

### **Step 4: Configure Your App**

1. **Create config file**:
   ```bash
   cd web
   cp supabase-config.example.ts supabase-config.ts
   ```

2. **Edit `supabase-config.ts`**:
   ```typescript
   export const supabaseConfig = {
     url: 'https://your-project-id.supabase.co',
     anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
   }
   ```

3. **Replace with your actual values** from Step 2

### **Step 5: Test the Integration**

1. **Start your app**:
   ```bash
   npm run dev
   ```

2. **Create a meeting** and check Supabase dashboard
3. **Verify data** is being created in tables

## 🗄️ **Database Tables Created**

### **meetings**
- `id`: Unique meeting ID
- `room_id`: Meeting room code (e.g., "ABC123")
- `created_by`: User who created the meeting
- `is_active`: Whether meeting is still active
- `max_participants`: Maximum participants allowed
- `settings`: Meeting configuration (JSON)

### **participants**
- `id`: Unique participant ID
- `meeting_id`: Reference to meeting
- `user_id`: Unique user identifier
- `user_name`: Display name
- `is_host`: Whether user is meeting host
- `is_video_enabled`: Video status
- `is_audio_enabled`: Audio status
- `is_speaking`: Speaking indicator
- `is_muted`: Mute status
- `connection_status`: Connection state

### **chat_messages**
- `id`: Unique message ID
- `meeting_id`: Reference to meeting
- `user_id`: Message sender
- `user_name`: Sender display name
- `message`: Message content
- `message_type`: 'text' or 'system'
- `created_at`: Timestamp

## 🔧 **Features Enabled**

### **Real-time Updates**
- ✅ **Participant Status**: Video/audio changes sync instantly
- ✅ **Chat Messages**: Messages appear in real-time
- ✅ **User Join/Leave**: Participants appear/disappear instantly
- ✅ **Speaking Indicators**: Real-time speaking detection

### **Data Persistence**
- ✅ **Meeting History**: Meetings stored in database
- ✅ **Chat History**: Messages persist during meeting
- ✅ **Participant Tracking**: Who joined when
- ✅ **Settings**: Meeting configuration saved

### **Security**
- ✅ **Row Level Security**: Users can only access their meetings
- ✅ **Public Access**: No authentication required (can be added later)
- ✅ **Data Validation**: Proper constraints and checks

## 🎯 **How It Works**

### **Creating a Meeting**
1. User clicks "Start New Meeting"
2. App generates Meeting ID (e.g., "ABC123")
3. Meeting record created in `meetings` table
4. User added to `participants` table as host
5. Real-time subscription started

### **Joining a Meeting**
1. User enters Meeting ID
2. App looks up meeting in database
3. If found, user added to `participants` table
4. Real-time subscription started
5. User sees existing participants and chat

### **Real-time Updates**
1. User changes video/audio status
2. Update sent to Supabase
3. Real-time subscription broadcasts to all participants
4. All users see the change instantly

## 🚀 **Next Steps**

### **Immediate Testing**
1. **Create meeting** → Check `meetings` table
2. **Join meeting** → Check `participants` table
3. **Send chat** → Check `chat_messages` table
4. **Open multiple browsers** → Test real-time sync

### **Advanced Features**
1. **Authentication**: Add user accounts
2. **Meeting History**: Show past meetings
3. **File Sharing**: Add file upload/download
4. **Recording**: Store meeting recordings
5. **Analytics**: Track meeting usage

## 🔍 **Troubleshooting**

### **Common Issues**

#### **"Meeting not found"**
- Check if meeting exists in `meetings` table
- Verify `is_active` is true
- Check room_id matches exactly

#### **"Real-time not working"**
- Verify Supabase project is active
- Check browser console for WebSocket errors
- Ensure RLS policies are correct

#### **"Permission denied"**
- Check RLS policies in Supabase
- Verify anon key is correct
- Check table permissions

### **Debug Steps**
1. **Check Supabase Dashboard** → See if data is being created
2. **Check Browser Console** → Look for error messages
3. **Check Network Tab** → Verify API calls are working
4. **Check Real-time Logs** → See if subscriptions are active

## 📊 **Monitoring**

### **Supabase Dashboard**
- **Table Editor**: View/edit data
- **SQL Editor**: Run queries
- **Logs**: See API calls and errors
- **Real-time**: Monitor subscriptions

### **Useful Queries**
```sql
-- See all active meetings
SELECT * FROM meetings WHERE is_active = true;

-- See participants in a meeting
SELECT * FROM participants WHERE meeting_id = 'your-meeting-id';

-- See recent chat messages
SELECT * FROM chat_messages ORDER BY created_at DESC LIMIT 10;
```

## 🎉 **You're Ready!**

After completing these steps:
- ✅ **Database**: Tables created and configured
- ✅ **Real-time**: Live updates working
- ✅ **Security**: Proper access controls
- ✅ **Integration**: App connected to Supabase

**Your video conferencing app now has a real database and real-time features!** 🎥📱💻
