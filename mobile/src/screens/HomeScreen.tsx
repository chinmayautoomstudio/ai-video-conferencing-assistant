import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { generateRoomId } from '../utils/webrtc';

type RootStackParamList = {
  Home: undefined;
  Join: undefined;
  Meeting: { roomId: string; userName: string; isHost: boolean };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const handleCreateMeeting = () => {
    const newRoomId = generateRoomId();
    navigation.navigate('Meeting', {
      roomId: newRoomId,
      userName: userName || 'Anonymous User',
      isHost: true,
    });
  };

  const handleJoinMeeting = () => {
    if (!roomId.trim()) {
      Alert.alert('Error', 'Please enter a meeting ID');
      return;
    }
    navigation.navigate('Meeting', {
      roomId: roomId.trim(),
      userName: userName || 'Anonymous User',
      isHost: false,
    });
  };

  const toggleVideo = () => setIsVideoEnabled(!isVideoEnabled);
  const toggleAudio = () => setIsAudioEnabled(!isAudioEnabled);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1f2937" />
      
      {/* Header */}
      <View style={styles.header}>
        <Icon name="videocam" size={60} color="#3b82f6" />
        <Text style={styles.title}>AI Video Conference</Text>
        <Text style={styles.subtitle}>Connect with anyone, anywhere</Text>
      </View>

      {/* Main Form */}
      <View style={styles.formContainer}>
        {/* User Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Enter your name"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Media Controls */}
        <View style={styles.mediaControls}>
          <TouchableOpacity
            style={[
              styles.mediaButton,
              isVideoEnabled ? styles.mediaButtonActive : styles.mediaButtonInactive,
            ]}
            onPress={toggleVideo}
          >
            <Icon
              name={isVideoEnabled ? 'videocam' : 'videocam-off'}
              size={24}
              color={isVideoEnabled ? '#ffffff' : '#6b7280'}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.mediaButton,
              isAudioEnabled ? styles.mediaButtonActive : styles.mediaButtonInactive,
            ]}
            onPress={toggleAudio}
          >
            <Icon
              name={isAudioEnabled ? 'mic' : 'mic-off'}
              size={24}
              color={isAudioEnabled ? '#ffffff' : '#6b7280'}
            />
          </TouchableOpacity>
        </View>

        {/* Room ID Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Meeting ID</Text>
          <TextInput
            style={styles.input}
            value={roomId}
            onChangeText={(text) => setRoomId(text.toUpperCase())}
            placeholder="Enter meeting ID"
            placeholderTextColor="#9ca3af"
            autoCapitalize="characters"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.joinButton]}
            onPress={handleJoinMeeting}
            disabled={!roomId.trim()}
          >
            <Icon name="group" size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Join Meeting</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.createButton]}
            onPress={handleCreateMeeting}
          >
            <Icon name="add" size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Start New Meeting</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Features */}
      <View style={styles.featuresContainer}>
        <View style={styles.feature}>
          <Icon name="hd" size={32} color="#3b82f6" />
          <Text style={styles.featureTitle}>HD Video</Text>
          <Text style={styles.featureSubtitle}>Crystal clear quality</Text>
        </View>
        <View style={styles.feature}>
          <Icon name="group" size={32} color="#3b82f6" />
          <Text style={styles.featureTitle}>Multi-User</Text>
          <Text style={styles.featureSubtitle}>Up to 12 participants</Text>
        </View>
        <View style={styles.feature}>
          <Icon name="settings" size={32} color="#3b82f6" />
          <Text style={styles.featureTitle}>Easy Setup</Text>
          <Text style={styles.featureSubtitle}>No downloads required</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#d1d5db',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mediaControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 20,
  },
  mediaButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mediaButtonActive: {
    backgroundColor: '#3b82f6',
  },
  mediaButtonInactive: {
    backgroundColor: '#e5e7eb',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  joinButton: {
    backgroundColor: '#3b82f6',
  },
  createButton: {
    backgroundColor: '#6b7280',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
  },
  featureSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default HomeScreen;
