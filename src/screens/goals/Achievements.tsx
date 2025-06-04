import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../App';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';

type AchievementsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Achievement {
  id: string;
  title: string;
  description: string;
  xp: number;
  icon: keyof typeof Ionicons.glyphMap;
  isUnlocked: boolean;
  date?: string;
}

const AchievementsScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<AchievementsScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState(0);
  
  const tabs = [
    { id: 0, name: t('allAchievements') },
    { id: 1, name: t('unlockedAchievements') },
    { id: 2, name: t('lockedAchievements') },
  ];

  // Mock data cho thành tựu
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Khởi đầu',
      description: 'Tạo mục tiêu đầu tiên',
      xp: 100,
      icon: 'rocket',
      isUnlocked: true,
      date: '01/05/2025',
    },
    {
      id: '2',
      title: 'Kiên trì',
      description: 'Check-in 7 ngày liên tiếp',
      xp: 200,
      icon: 'flame',
      isUnlocked: true,
      date: '08/05/2025',
    },
    {
      id: '3',
      title: 'Người hòa đồng',
      description: 'Tham gia nhóm đầu tiên',
      xp: 150,
      icon: 'people',
      isUnlocked: true,
      date: '03/05/2025',
    },
    {
      id: '4',
      title: 'Tiết kiệm',
      description: 'Hoàn thành mục tiêu tài chính đầu tiên',
      xp: 200,
      icon: 'cash',
      isUnlocked: true,
      date: '10/05/2025',
    },
    {
      id: '5',
      title: 'Thói quen lành mạnh',
      description: 'Hoàn thành mục tiêu thể chất 10 ngày liên tiếp',
      xp: 300,
      icon: 'thumbs-up',
      isUnlocked: false,
    },
    {
      id: '6',
      title: 'Người có tầm ảnh hưởng',
      description: 'Có 5 người tham gia nhóm của bạn',
      xp: 250,
      icon: 'star',
      isUnlocked: false,
    },
    {
      id: '7',
      title: 'Chuyên gia',
      description: 'Hoàn thành 30 mục tiêu',
      xp: 400,
      icon: 'trophy',
      isUnlocked: false,
    },
    {
      id: '8',
      title: 'Nhà vô địch',
      description: 'Check-in 30 ngày liên tiếp',
      xp: 500,
      icon: 'ribbon',
      isUnlocked: false,
    },
  ];

  const filteredAchievements = () => {
    switch (activeTab) {
      case 1:
        return achievements.filter(achievement => achievement.isUnlocked);
      case 2:
        return achievements.filter(achievement => !achievement.isUnlocked);
      default:
        return achievements;
    }
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
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('achievementsTitle')}</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
              {t('trackProgress')}
            </Text>
          </View>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="trophy" size={18} color="#FFD700" />
            </View>
            <Text style={[styles.statTitle, { color: theme.colors.textSecondary }]}>{t('totalAchievements')}</Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>12/30</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="layers" size={18} color={theme.colors.primary} />
            </View>
            <Text style={[styles.statTitle, { color: theme.colors.textSecondary }]}>{t('currentLevel')}</Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>5</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="time" size={18} color={theme.colors.success} />
            </View>
            <Text style={[styles.statTitle, { color: theme.colors.textSecondary }]}>{t('currentStreak')}</Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>12 ngày</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="flame" size={18} color={theme.colors.error} />
            </View>
            <Text style={[styles.statTitle, { color: theme.colors.textSecondary }]}>{t('longestStreak')}</Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>21 ngày</Text>
          </View>
        </View>
        
        <View style={[styles.levelContainer, { backgroundColor: theme.colors.card }]}>
          <View style={styles.levelHeader}>
            <Text style={[styles.levelTitle, { color: theme.colors.text }]}>{t('levelProgress')}</Text>
            <Text style={[styles.levelInfo, { color: theme.colors.textSecondary }]}>
              {t('levelInfo', { level: 5, current: 2500, next: 3000, nextLevel: 6 })}
            </Text>
          </View>
          
          <View style={[styles.progressBarContainer, { backgroundColor: theme.colors.border }]}>
            <View 
              style={[
                styles.progressBar, 
                { width: '85%', backgroundColor: theme.colors.primary }
              ]} 
            />
          </View>
          
          <View style={styles.xpContainer}>
            <Text style={[styles.xpText, { color: theme.colors.textSecondary }]}>2500 XP</Text>
            <Text style={[styles.xpText, { color: theme.colors.textSecondary }]}>3000 XP</Text>
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
        
        <View style={styles.achievementsContainer}>
          {filteredAchievements().map(achievement => (
            <View 
              key={achievement.id} 
              style={[
                styles.achievementCard, 
                { 
                  backgroundColor: theme.colors.card,
                  opacity: achievement.isUnlocked ? 1 : 0.6,
                }
              ]}
            >
              <View style={styles.achievementHeader}>
                <View 
                  style={[
                    styles.achievementIconContainer, 
                    { 
                      backgroundColor: achievement.isUnlocked 
                        ? `${theme.colors.primary}20` 
                        : 'rgba(150, 150, 150, 0.2)',
                    }
                  ]}
                >
                  <Ionicons 
                    name={achievement.icon} 
                    size={24} 
                    color={achievement.isUnlocked ? theme.colors.primary : theme.colors.textTertiary} 
                  />
                </View>
                
                {!achievement.isUnlocked && (
                  <View style={styles.lockIconContainer}>
                    <Ionicons name="lock-closed" size={16} color={theme.colors.textTertiary} />
                  </View>
                )}
              </View>
              
              <Text 
                style={[
                  styles.achievementTitle, 
                  { color: achievement.isUnlocked ? theme.colors.text : theme.colors.textSecondary }
                ]}
              >
                {achievement.title}
              </Text>
              
              <Text 
                style={[
                  styles.achievementDescription, 
                  { color: theme.colors.textSecondary }
                ]}
              >
                {achievement.description}
              </Text>
              
              <View style={styles.achievementFooter}>
                <View style={styles.xpBadge}>
                  <Ionicons name="flash" size={12} color="#FFD700" />
                  <Text style={styles.xpValue}>+{achievement.xp} XP</Text>
                </View>
                
                {achievement.date && (
                  <Text style={[styles.achievementDate, { color: theme.colors.textTertiary }]}>
                    {achievement.date}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  levelContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  levelHeader: {
    marginBottom: 16,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  levelInfo: {
    fontSize: 13,
  },
  progressBarContainer: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
  },
  xpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xpText: {
    fontSize: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  achievementHeader: {
    position: 'relative',
    marginBottom: 12,
  },
  achievementIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIconContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    marginBottom: 12,
  },
  achievementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  xpValue: {
    fontSize: 11,
    fontWeight: '500',
    color: '#FFD700',
    marginLeft: 2,
  },
  achievementDate: {
    fontSize: 11,
  },
});

export default AchievementsScreen; 