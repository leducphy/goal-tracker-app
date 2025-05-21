import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../App';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';

type GoalGroupsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface GoalGroup {
  id: string;
  title: string;
  description: string;
  members: number;
  category: string;
  initial: string;
  activityLevel: 'low' | 'medium' | 'high';
}

const GoalGroupsScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<GoalGroupsScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState(0);
  const [searchText, setSearchText] = useState('');
  
  const tabs = [
    { id: 0, name: t('explore') },
    { id: 1, name: t('joined') },
  ];

  // Mock data cho các nhóm mục tiêu
  const goalGroups: GoalGroup[] = [
    {
      id: '1',
      title: 'Dậy sớm 5h30',
      description: 'Nhóm những người cam kết dậy sớm lúc 5h30 mỗi ngày',
      members: 128,
      category: 'Thể chất',
      initial: 'Dậ',
      activityLevel: 'high',
    },
    {
      id: '2',
      title: 'Thiền 10 phút/ngày',
      description: 'Cùng nhau thiền định 10 phút mỗi ngày để cải thiện sức khỏe tinh thần',
      members: 256,
      category: 'Tinh thần',
      initial: 'Th',
      activityLevel: 'high',
    },
    {
      id: '3',
      title: 'Đọc sách mỗi ngày',
      description: 'Đọc sách ít nhất 30 phút mỗi ngày để mở rộng kiến thức',
      members: 189,
      category: 'Học tập',
      initial: 'Đọ',
      activityLevel: 'medium',
    },
    {
      id: '4',
      title: 'Tiết kiệm 50k mỗi ngày',
      description: 'Cùng nhau tiết kiệm 50.000đ mỗi ngày để đạt được mục tiêu tài chính',
      members: 95,
      category: 'Tài chính',
      initial: 'Ti',
      activityLevel: 'medium',
    },
    {
      id: '5',
      title: 'Luyện nói tiếng Anh',
      description: 'Thực hành nói tiếng Anh 15 phút mỗi ngày',
      members: 147,
      category: 'Học tập',
      initial: 'Lu',
      activityLevel: 'high',
    },
    {
      id: '6',
      title: 'Không dùng mạng xã hội',
      description: 'Giảm thời gian sử dụng mạng xã hội để tập trung vào các hoạt động có ích',
      members: 78,
      category: 'Tinh thần',
      initial: 'Kh',
      activityLevel: 'low',
    },
  ];

  const getActivityColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high':
        return theme.colors.success;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  const getActivityText = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high':
        return t('high');
      case 'medium':
        return t('medium');
      case 'low':
        return t('low');
      default:
        return '';
    }
  };

  const getCategoryBackgroundColor = (category: string) => {
    switch (category) {
      case 'Thể chất':
        return 'rgba(80, 200, 120, 0.1)';
      case 'Tinh thần':
        return 'rgba(100, 120, 255, 0.1)';
      case 'Học tập':
        return 'rgba(255, 180, 50, 0.1)';
      case 'Tài chính':
        return 'rgba(255, 100, 100, 0.1)';
      default:
        return 'rgba(150, 150, 150, 0.1)';
    }
  };

  const renderGroupItem = ({ item }: { item: GoalGroup }) => (
    <View style={[styles.groupCard, { backgroundColor: theme.colors.card }]}>
      <View style={styles.groupCardHeader}>
        <View style={[styles.groupInitial, { backgroundColor: getCategoryBackgroundColor(item.category) }]}>
          <Text style={[styles.groupInitialText, { color: theme.colors.text }]}>{item.initial}</Text>
        </View>
        <View style={styles.groupCategoryBadge}>
          <Text style={[styles.groupCategoryText, { color: theme.colors.textSecondary }]}>
            {item.category}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.groupTitle, { color: theme.colors.text }]}>{item.title}</Text>
      <Text style={[styles.groupDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.groupCardFooter}>
        <View style={styles.groupMembers}>
          <Ionicons name="people" size={14} color={theme.colors.textSecondary} />
          <Text style={[styles.groupMembersText, { color: theme.colors.textSecondary }]}>
            {item.members} {t('members')}
          </Text>
        </View>
        
        <View style={styles.groupActivity}>
          <Text style={[styles.groupActivityLabel, { color: theme.colors.textSecondary }]}>
            {t('activity')}
          </Text>
          <View style={[styles.groupActivityDot, { backgroundColor: getActivityColor(item.activityLevel) }]} />
          <Text style={[styles.groupActivityText, { color: getActivityColor(item.activityLevel) }]}>
            {getActivityText(item.activityLevel)}
          </Text>
        </View>
      </View>
      
      <View style={styles.groupCardActions}>
        <TouchableOpacity style={styles.viewDetailButton}>
          <Text style={[styles.viewDetailText, { color: theme.colors.primary }]}>{t('viewDetails')}</Text>
          <Ionicons name="chevron-forward" size={14} color={theme.colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.joinButton, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={styles.joinButtonText}>{t('join')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('goalGroups')}</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
              {t('participateGroups')}
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.createButton, { backgroundColor: theme.colors.background }]}
          >
            <Ionicons name="add-circle" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.searchTitle, { color: theme.colors.text }]}>{t('exploreGroups')}</Text>
          <Text style={[styles.searchSubtitle, { color: theme.colors.textSecondary }]}>
            {t('findGroups')}
          </Text>
          
          <View style={[styles.searchInputContainer, { backgroundColor: theme.colors.background }]}>
            <Ionicons name="search" size={20} color={theme.colors.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder={t('searchGroups')}
              placeholderTextColor={theme.colors.textTertiary}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>
        
        <View style={styles.tabContainer}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 },
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === tab.id ? theme.colors.primary : theme.colors.textSecondary },
                ]}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <FlatList
          data={goalGroups}
          renderItem={renderGroupItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.groupsList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  searchSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  tab: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginRight: 8,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
  },
  groupsList: {
    padding: 16,
  },
  groupCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  groupCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupInitial: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  groupInitialText: {
    fontSize: 16,
    fontWeight: '600',
  },
  groupCategoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  groupCategoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  groupDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  groupCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupMembers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupMembersText: {
    marginLeft: 4,
    fontSize: 13,
  },
  groupActivity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupActivityLabel: {
    fontSize: 13,
    marginRight: 4,
  },
  groupActivityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  groupActivityText: {
    fontSize: 13,
    fontWeight: '500',
  },
  groupCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    paddingTop: 12,
  },
  viewDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  joinButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  joinButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default GoalGroupsScreen; 