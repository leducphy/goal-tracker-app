import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';

type Mood = 'happy' | 'normal' | 'sad';

const NewJournalEntryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useTheme();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood>('normal');
  const [tags, setTags] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const handleSave = () => {
    // Save journal entry logic
    console.log({
      title,
      content,
      selectedMood,
      tags: tags.split(',').map(tag => tag.trim()),
      date
    });
    
    navigation.goBack();
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('newJournalEntry')}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>{t('journalEntryInfo')}</Text>
        
        {/* Title */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('entryTitle')}</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            value={title}
            onChangeText={setTitle}
            placeholder={t('entryTitle')}
            placeholderTextColor={theme.colors.text + '80'}
          />
        </View>
        
        {/* Content */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('entryContent')}</Text>
          <TextInput
            style={[styles.textArea, { borderColor: theme.colors.border, color: theme.colors.text }]}
            value={content}
            onChangeText={setContent}
            placeholder={t('entryContent')}
            placeholderTextColor={theme.colors.text + '80'}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>
        
        {/* Date */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('entryDate')}</Text>
          <TouchableOpacity 
            style={[styles.dateButton, { borderColor: theme.colors.border }]}
          >
            <Text style={{ color: theme.colors.text }}>{date}</Text>
            <Ionicons name="calendar" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        
        {/* Mood */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('mood')}</Text>
          <View style={styles.moodContainer}>
            <TouchableOpacity 
              style={[
                styles.moodButton,
                selectedMood === 'happy' && { backgroundColor: '#E0F8E6' }
              ]}
              onPress={() => setSelectedMood('happy')}
            >
              <Ionicons 
                name="happy" 
                size={28} 
                color="#4CD964" 
              />
              <Text 
                style={[
                  styles.moodText, 
                  { color: theme.colors.text },
                  selectedMood === 'happy' && { fontWeight: 'bold', color: '#4CD964' }
                ]}
              >
                {t('happy')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.moodButton,
                selectedMood === 'normal' && { backgroundColor: '#FFF9EB' }
              ]}
              onPress={() => setSelectedMood('normal')}
            >
              <Ionicons 
                name="happy-outline" 
                size={28} 
                color="#FF9500" 
              />
              <Text 
                style={[
                  styles.moodText, 
                  { color: theme.colors.text },
                  selectedMood === 'normal' && { fontWeight: 'bold', color: '#FF9500' }
                ]}
              >
                {t('normal')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.moodButton,
                selectedMood === 'sad' && { backgroundColor: '#FFF0F0' }
              ]}
              onPress={() => setSelectedMood('sad')}
            >
              <Ionicons 
                name="sad" 
                size={28} 
                color="#FF3B30" 
              />
              <Text 
                style={[
                  styles.moodText, 
                  { color: theme.colors.text },
                  selectedMood === 'sad' && { fontWeight: 'bold', color: '#FF3B30' }
                ]}
              >
                {t('sad')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Tags */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('tags')}</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            value={tags}
            onChangeText={setTags}
            placeholder={t('tagExample')}
            placeholderTextColor={theme.colors.text + '80'}
          />
        </View>
        
        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>{t('saveEntry')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
    minHeight: 120,
  },
  dateButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  moodText: {
    fontSize: 14,
    marginTop: 8,
  },
  saveButton: {
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default NewJournalEntryScreen; 