import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SectionHeader from '../../components/common/SectionHeader';
import GoalListItem from '../../components/goals/GoalListItem';
import GoalProgressCard from '../../components/goals/GoalProgressCard';
import ProgressChart, { DataPoint } from '../../components/stats/ProgressChart';
import StatCard from '../../components/stats/StatCard';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';

import { RootStackParamList } from '../../App';
import { ROUTES } from '../../constants/routes';

type OverviewScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Define interfaces for goals and activities
interface UpcomingGoal {
  id: string;
  title: string;
  category: string;
  categoryType: 'work' | 'finance' | 'study';
  deadline: string;
  route: string;
}

interface RecentActivity {
  id: string;
  title: string;
  timestamp: string;
  type: 'completed' | 'joined' | 'badge' | 'saved' | 'other';
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  route: string;
}

const OverviewScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<OverviewScreenNavigationProp>();
  
  // Mock data for the overview screen
  const mockGoals = [
    {
      id: '1',
      title: 'Đọc sách 30 phút',
      category: 'Học tập',
      status: 'completed' as const,
    },
    {
      id: '2',
      title: 'Tập thể dục buổi sáng',
      category: 'Thể chất',
      status: 'completed' as const,
    },
    {
      id: '3',
      title: 'Thiền 10 phút',
      category: 'Tinh thần',
      status: 'completed' as const,
    },
    {
      id: '4',
      title: 'Học tiếng Anh',
      category: 'Học tập',
      status: 'inProgress' as const,
    },
    {
      id: '5',
      title: 'Tiết kiệm 50.000đ',
      category: 'Tài chính',
      status: 'inProgress' as const,
    },
  ];

  // Mock data for upcoming goals
  const upcomingGoals: UpcomingGoal[] = [
    {
      id: '1',
      title: 'Hoàn thành dự án cá nhân',
      category: 'Công việc',
      categoryType: 'work',
      deadline: '15/05/2025',
      route: ROUTES.LONG_TERM_GOALS,
    },
    {
      id: '2',
      title: 'Tiết kiệm 2 triệu',
      category: 'Tài chính',
      categoryType: 'finance',
      deadline: '31/05/2025',
      route: ROUTES.MAIN,
    },
    {
      id: '3',
      title: 'Đọc xong sách Atomic Habits',
      category: 'Học tập',
      categoryType: 'study',
      deadline: '20/05/2025',
      route: ROUTES.MAIN,
    },
  ];

  // Mock data for recent activities
  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      title: 'Bạn đã hoàn thành mục tiêu Đọc sách 30 phút',
      timestamp: 'Hôm nay, 10:30',
      type: 'completed',
      icon: 'checkmark-circle',
      iconColor: '#4CAF50',
      route: ROUTES.MAIN,
    },
    {
      id: '2',
      title: 'Bạn đã tham gia nhóm Thiền mỗi ngày',
      timestamp: 'Hôm qua, 18:45',
      type: 'joined',
      icon: 'people',
      iconColor: '#2196F3',
      route: ROUTES.GOAL_GROUPS,
    },
    {
      id: '3',
      title: 'Bạn đã đạt được huy hiệu 7 ngày liên tiếp',
      timestamp: '14/05/2025',
      type: 'badge',
      icon: 'trophy',
      iconColor: '#FFC107',
      route: ROUTES.ACHIEVEMENTS,
    },
    {
      id: '4',
      title: 'Bạn đã tiết kiệm được 500.000đ cho mục tiêu Du lịch',
      timestamp: '13/05/2025',
      type: 'saved',
      icon: 'wallet',
      iconColor: '#9C27B0',
      route: ROUTES.MAIN,
    },
    {
      id: '5',
      title: 'Bạn đã hoàn thành mục tiêu Tập thể dục buổi sáng',
      timestamp: '12/05/2025',
      type: 'completed',
      icon: 'checkmark-circle',
      iconColor: '#4CAF50',
      route: ROUTES.MAIN,
    },
  ];

  // Mock data for progress chart
  const longTermData: DataPoint[] = [
    { date: '15/5', value: 45 },
    { date: '16/5', value: 50 },
    { date: '17/5', value: 65 },
    { date: '18/5', value: 80 },
    { date: '19/5', value: 90 },
    { date: '20/5', value: 75 },
    { date: '21/5', value: 0 },
  ];

  const shortTermData: DataPoint[] = [
    { date: '15/5', value: 40 },
    { date: '16/5', value: 55 },
    { date: '17/5', value: 70 },
    { date: '18/5', value: 80 },
    { date: '19/5', value: 95 },
    { date: '20/5', value: 90 },
    { date: '21/5', value: 0 },
  ];

  const handleNavigateToCheckIn = () => {
    navigation.navigate(ROUTES.CHECK_IN);
  };

  const handleNavigateToStats = () => {
    navigation.navigate(ROUTES.STATS);
  };

  const handleNavigateToJournal = () => {
    navigation.navigate(ROUTES.JOURNAL);
  };

  const handleCreateJournalEntry = () => {
    navigation.navigate(ROUTES.NEW_JOURNAL_ENTRY);
  };

  const navigateToMainTab = (initialTab: string) => {
    // For tab navigation, we'd use a different approach in a real app
    // This is a simplified version since the actual tab switching logic would depend on navigation setup
    navigation.navigate(ROUTES.MAIN);
  };

  const getCategoryIcon = (categoryType: UpcomingGoal['categoryType']) => {
    switch (categoryType) {
      case 'work':
        return 'briefcase-outline';
      case 'finance':
        return 'cash-outline';
      case 'study':
        return 'book-outline';
      default:
        return 'flag-outline';
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Xin chào, Minh!</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
              Hôm nay là một ngày tuyệt vời để tiến bộ
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.checkInButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleNavigateToCheckIn}
          >
            <Ionicons name="today-outline" size={16} color="white" style={styles.checkInIcon} />
            <Text style={styles.checkInButtonText}>Check in</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today's Progress */}
        <SectionHeader
          title="Tiến độ mục tiêu hôm nay"
          actionText="Xem tất cả"
          onAction={handleNavigateToCheckIn}
        />
        
        <GoalProgressCard
          title="Hoàn thành 3/5 mục tiêu"
          completed={3}
          total={5}
          percentage={60}
        />
        
        {/* Today's Goals */}
        <View style={styles.goalsContainer}>
          {mockGoals.map((goal) => (
            <GoalListItem
              key={goal.id}
              title={goal.title}
              category={goal.category}
              status={goal.status}
              onPress={() => navigateToMainTab('Goals')}
            />
          ))}
        </View>
        
        {/* Upcoming Goals Section */}
        <SectionHeader
          title="Mục tiêu sắp đến"
          actionText="Xem tất cả"
          onAction={() => navigateToMainTab('Goals')}
        />
        <View style={styles.upcomingGoalsContainer}>
          <Text style={[styles.upcomingGoalsSubtitle, { color: theme.colors.textSecondary }]}>
            Các mục tiêu sắp đến hạn của bạn
          </Text>
          
          {upcomingGoals.map((goal) => (
            <TouchableOpacity 
              key={goal.id}
              style={[styles.upcomingGoalItem, { borderBottomColor: theme.colors.border }]}
              onPress={() => {
                if (goal.route === ROUTES.MAIN) {
                  navigateToMainTab(goal.categoryType === 'finance' ? 'Finance' : 'Goals');
                } else {
                  navigation.navigate(goal.route as keyof RootStackParamList);
                }
              }}
            >
              <View style={styles.upcomingGoalIconContainer}>
                <Ionicons name={getCategoryIcon(goal.categoryType) as any} size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.upcomingGoalContent}>
                <Text style={[styles.upcomingGoalTitle, { color: theme.colors.text }]}>{goal.title}</Text>
                <View style={styles.upcomingGoalMeta}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{goal.category}</Text>
                  </View>
                  <Text style={[styles.deadlineText, { color: theme.colors.textSecondary }]}>Hạn: {goal.deadline}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activities */}
        <SectionHeader
          title="Hoạt động gần đây"
          actionText="Xem tất cả"
          onAction={() => navigation.navigate(ROUTES.STATS)}
        />
        <View style={styles.recentActivitiesContainer}>
          {recentActivities.map((activity) => (
            <TouchableOpacity 
              key={activity.id}
              style={[styles.activityItem, { borderBottomColor: theme.colors.border }]}
              onPress={() => {
                if (activity.route === ROUTES.MAIN) {
                  navigateToMainTab(activity.type === 'saved' ? 'Finance' : 'Goals');
                } else {
                  navigation.navigate(activity.route as keyof RootStackParamList);
                }
              }}
            >
              <View style={[styles.activityIconContainer, { backgroundColor: `${activity.iconColor}15` }]}>
                <Ionicons name={activity.icon} size={20} color={activity.iconColor} />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: theme.colors.text }]}>{activity.title}</Text>
                <Text style={[styles.activityTimestamp, { color: theme.colors.textSecondary }]}>{activity.timestamp}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Journal Section */}
        <SectionHeader
          title="Nhật ký gần đây"
          actionText="Xem tất cả"
          onAction={handleNavigateToJournal}
        />
        
        <View style={[styles.journalContainer, { backgroundColor: theme.colors.card }]}>
          <View style={styles.journalContent}>
            <Ionicons name="book-outline" size={32} color={theme.colors.textSecondary} style={styles.journalIcon} />
            <Text style={[styles.journalEmptyText, { color: theme.colors.textSecondary }]}>
              Bạn chưa có nhật ký nào
            </Text>
            <Text style={[styles.journalSubtext, { color: theme.colors.textSecondary }]}>
              Viết nhật ký để ghi lại suy nghĩ và cảm xúc của bạn
            </Text>
            <TouchableOpacity 
              style={[styles.newJournalButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleCreateJournalEntry}
            >
              <Text style={styles.newJournalButtonText}>Viết nhật ký mới</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Stats Row */}
        <SectionHeader
          title="Thống kê mục tiêu"
          actionText="Xem thêm"
          onAction={() => navigation.navigate(ROUTES.STATS)}
        />
        
        <View style={styles.statsContainer}>
          <StatCard
            title="Mục tiêu dài hạn"
            value="5"
            subtitle="Xem chi tiết"
            onPress={() => navigation.navigate(ROUTES.LONG_TERM_GOALS)}
          />
          <View style={styles.statSpacer} />
          <StatCard
            title="Nhóm mục tiêu"
            value="3"
            subtitle="Xem chi tiết"
            onPress={() => navigation.navigate(ROUTES.GOAL_GROUPS)}
          />
        </View>
        
        <View style={styles.statsContainer}>
          <StatCard
            title="Ngày check-in liên tiếp"
            value="12"
            subtitle="Check-in ngày"
            onPress={handleNavigateToCheckIn}
          />
          <View style={styles.statSpacer} />
          <StatCard
            title="Khoản vay chưa trả"
            value="3"
            subtitle="Xem chi tiết"
            onPress={() => navigateToMainTab('Finance')}
          />
        </View>
        
        {/* Progress Chart */}
        <SectionHeader
          title="Biểu đồ tiến độ theo thời gian"
          actionText="Xem thống kê"
          onAction={handleNavigateToStats}
        />
        
        <ProgressChart
          title="Theo dõi tiến độ của các mục tiêu theo thời gian"
          subtitle="Theo dõi tiến độ của các mục tiêu theo thời gian"
          longTermData={longTermData}
          shortTermData={shortTermData}
        />

        {/* Add bottom padding to avoid content being hidden by nav bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 16,
    maxWidth: '65%',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  checkInButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    minWidth: 90,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  checkInIcon: {
    marginRight: 5,
  },
  checkInButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 24,
  },
  upcomingGoalsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 28,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  upcomingGoalsSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  upcomingGoalItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  upcomingGoalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 112, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  upcomingGoalContent: {
    flex: 1,
  },
  upcomingGoalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  upcomingGoalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 112, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#0070FF',
    fontWeight: '500',
  },
  deadlineText: {
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statSpacer: {
    width: 12,
  },
  recentActivitiesContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 28,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
    justifyContent: 'center',
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  activityTimestamp: {
    fontSize: 12,
  },
  goalsContainer: {
    marginBottom: 24,
  },
  journalContainer: {
    borderRadius: 12,
    padding: 24,
    marginBottom: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  journalContent: {
    alignItems: 'center',
    padding: 16,
  },
  journalIcon: {
    marginBottom: 16,
  },
  journalEmptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  journalSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  newJournalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  newJournalButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 80, // Add extra space to avoid content being hidden by tab bar
  },
});

export default OverviewScreen; 