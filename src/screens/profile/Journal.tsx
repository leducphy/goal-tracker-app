import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ROUTES } from '../../constants/routes';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';

type MoodFilter = 'all' | 'happy' | 'normal' | 'sad';

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: 'happy' | 'normal' | 'sad';
  tags: string[];
};

const JournalScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodFilter>('all');
  
  // Mock journal entries
  const journalEntries: JournalEntry[] = [
    {
      id: '1',
      title: 'Hoàn thành dự án React Native',
      content: 'Hôm nay tôi đã hoàn thành dự án React Native và cảm thấy rất hài lòng với kết quả.',
      date: '20/05/2023',
      mood: 'happy',
      tags: ['công việc', 'thành tựu'],
    },
    {
      id: '2',
      title: 'Cuộc họp không hiệu quả',
      content: 'Cuộc họp hôm nay kéo dài quá lâu và không đi đến kết luận nào.',
      date: '18/05/2023',
      mood: 'sad',
      tags: ['công việc', 'cuộc họp'],
    },
    {
      id: '3',
      title: 'Đọc sách về TypeScript',
      content: 'Tôi đã đọc một cuốn sách hay về TypeScript và học được nhiều điều mới.',
      date: '15/05/2023',
      mood: 'normal',
      tags: ['học tập', 'đọc sách'],
    },
  ];
  
  // Filter entries by mood and search query
  const filteredEntries = journalEntries.filter(entry => {
    // Filter by mood
    if (selectedMood !== 'all' && entry.mood !== selectedMood) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query) ||
        entry.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  const getMoodIcon = (mood: 'happy' | 'normal' | 'sad') => {
    switch (mood) {
      case 'happy':
        return { name: 'happy', color: '#4CD964' };
      case 'normal':
        return { name: 'happy-outline', color: '#FF9500' };
      case 'sad':
        return { name: 'sad', color: '#FF3B30' };
    }
  };
  
  const renderJournalEntry = ({ item }: { item: JournalEntry }) => {
    const moodIcon = getMoodIcon(item.mood);
    
    return (
      <TouchableOpacity
        style={[styles.journalCard, { backgroundColor: theme.colors.card }]}
        onPress={() => {}}
      >
        <View style={styles.journalHeader}>
          <Text style={[styles.journalDate, { color: theme.colors.textSecondary }]}>
            {item.date}
          </Text>
          <Ionicons name={moodIcon.name as any} size={20} color={moodIcon.color} />
        </View>
        
        <Text style={[styles.journalTitle, { color: theme.colors.text }]}>{item.title}</Text>
        <Text 
          style={[styles.journalContent, { color: theme.colors.textSecondary }]}
          numberOfLines={2}
        >
          {item.content}
        </Text>
        
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View 
              key={index} 
              style={[styles.tagChip, { backgroundColor: `${theme.colors.primary}15` }]}
            >
              <Text style={[styles.tagText, { color: theme.colors.primary }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('journalTitle')}</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            // @ts-ignore
            navigation.navigate(ROUTES.NEW_JOURNAL_ENTRY);
          }}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.subtitle, { color: theme.colors.text }]}>
        {t('journalDescription')}
      </Text>
      
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder={t('searchGroups')}
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.filtersContainer}>
        <TouchableOpacity 
          style={[
            styles.filterChip,
            selectedMood === 'all' && [styles.activeFilterChip, { backgroundColor: theme.colors.primary }]
          ]}
          onPress={() => setSelectedMood('all')}
        >
          <Text 
            style={[
              styles.filterText,
              selectedMood === 'all' && styles.activeFilterText
            ]}
          >
            {t('allMoods')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterChip,
            selectedMood === 'happy' && [styles.activeFilterChip, { backgroundColor: '#4CD964' }]
          ]}
          onPress={() => setSelectedMood('happy')}
        >
          <Ionicons 
            name="happy" 
            size={16} 
            color={selectedMood === 'happy' ? '#FFF' : '#4CD964'} 
            style={styles.filterIcon}
          />
          <Text 
            style={[
              styles.filterText,
              selectedMood === 'happy' && styles.activeFilterText
            ]}
          >
            {t('happy')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterChip,
            selectedMood === 'normal' && [styles.activeFilterChip, { backgroundColor: '#FF9500' }]
          ]}
          onPress={() => setSelectedMood('normal')}
        >
          <Ionicons 
            name="happy-outline" 
            size={16} 
            color={selectedMood === 'normal' ? '#FFF' : '#FF9500'} 
            style={styles.filterIcon}
          />
          <Text 
            style={[
              styles.filterText,
              selectedMood === 'normal' && styles.activeFilterText
            ]}
          >
            {t('normal')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterChip,
            selectedMood === 'sad' && [styles.activeFilterChip, { backgroundColor: '#FF3B30' }]
          ]}
          onPress={() => setSelectedMood('sad')}
        >
          <Ionicons 
            name="sad" 
            size={16} 
            color={selectedMood === 'sad' ? '#FFF' : '#FF3B30'} 
            style={styles.filterIcon}
          />
          <Text 
            style={[
              styles.filterText,
              selectedMood === 'sad' && styles.activeFilterText
            ]}
          >
            {t('sad')}
          </Text>
        </TouchableOpacity>
      </View>
      
      {filteredEntries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={64} color={theme.colors.textTertiary} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            {t('noJournalEntries')}
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
            {t('startJournaling')}
          </Text>
          <TouchableOpacity 
            style={[styles.newEntryButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              // @ts-ignore
              navigation.navigate(ROUTES.NEW_JOURNAL_ENTRY);
            }}
          >
            <Text style={styles.newEntryButtonText}>{t('newJournalEntry')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredEntries}
          renderItem={renderJournalEntry}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 48,
    marginLeft: 8,
    fontSize: 15,
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#0070FF',
  },
  filterIcon: {
    marginRight: 4,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#FFF',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 24,
  },
  newEntryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newEntryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  listContainer: {
    paddingBottom: 16,
  },
  journalCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  journalDate: {
    fontSize: 14,
  },
  journalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  journalContent: {
    fontSize: 15,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
  },
});

export default JournalScreen; 