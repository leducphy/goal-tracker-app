import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../App';
import SectionHeader from '../../components/common/SectionHeader';
import GoalListItem, { GoalStatus } from '../../components/goals/GoalListItem';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';

interface Goal {
  id: string;
  title: string;
  category: string;
  status: GoalStatus;
}

type CheckInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CheckInScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<CheckInScreenNavigationProp>();
  
  // Mock goals data
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Đọc sách 30 phút',
      category: 'Học tập',
      status: 'completed',
    },
    {
      id: '2',
      title: 'Tập thể dục buổi sáng',
      category: 'Thể chất',
      status: 'completed',
    },
    {
      id: '3',
      title: 'Thiền 10 phút',
      category: 'Tinh thần',
      status: 'completed',
    },
    {
      id: '4',
      title: 'Học tiếng Anh',
      category: 'Học tập',
      status: 'inProgress',
    },
    {
      id: '5',
      title: 'Tiết kiệm 50.000đ',
      category: 'Tài chính',
      status: 'inProgress',
    },
  ]);
  
  const handleToggleGoalStatus = (id: string) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === id 
          ? { 
              ...goal, 
              status: goal.status === 'completed' ? 'inProgress' : 'completed' 
            }
          : goal
      )
    );
  };
  
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const completionPercentage = Math.round((completedGoals.length / goals.length) * 100);
  
  const renderTabs = () => {
    const tabs = [t('all'), t('goals'), t('work')];
    const [activeTab, setActiveTab] = useState(0);
    
    return (
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tab, 
              activeTab === index && { 
                borderBottomWidth: 2, 
                borderBottomColor: theme.colors.primary 
              }
            ]}
            onPress={() => setActiveTab(index)}
          >
            <Text 
              style={[
                styles.tabText, 
                { 
                  color: activeTab === index 
                    ? theme.colors.primary 
                    : theme.colors.textSecondary 
                }
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
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
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('dailyCheckin')}</Text>
            <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
              {t('todayDate', { date: '22/5/2025' })}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <Text style={[styles.progressTitle, { color: theme.colors.text }]}>{t('todayProgress')}</Text>
          <Text style={[styles.progressSubtitle, { color: theme.colors.textSecondary }]}>
            {t('completionStatus', { 
              completed: completedGoals.length, 
              total: goals.length, 
              percentage: completionPercentage 
            })}
          </Text>
        </View>
      
        {renderTabs()}
      
        <View style={styles.emptyMessage}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            {t('noGoalsToday')}
          </Text>
        </View>
        
        <SectionHeader title={t('yourGoalsList')} />
        
        <View style={styles.goalsList}>
          {goals.map((goal) => (
            <GoalListItem
              key={goal.id}
              title={goal.title}
              category={goal.category}
              status={goal.status}
              onPress={() => {}}
              onComplete={() => handleToggleGoalStatus(goal.id)}
            />
          ))}
        </View>
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
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    lineHeight: 18,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 20,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
  },
  emptyMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
  },
  goalsList: {
    marginTop: 10,
  },
});

export default CheckInScreen; 