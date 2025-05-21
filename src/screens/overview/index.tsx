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
        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Mục tiêu dài hạn"
            value="5"
            subtitle="Xem chi tiết"
            onPress={() => {/* Navigate to goals */}}
          />
          <View style={styles.statSpacer} />
          <StatCard
            title="Nhóm mục tiêu"
            value="3"
            subtitle="Xem chi tiết"
            onPress={() => {/* Navigate to goals */}}
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
            onPress={() => {/* Navigate to finance */}}
          />
        </View>
        
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
              onPress={() => {/* Handle goal press */}}
            />
          ))}
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
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statSpacer: {
    width: 12,
  },
  goalsContainer: {
    marginBottom: 24,
  },
});

export default OverviewScreen; 