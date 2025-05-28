import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../App';
import { ROUTES } from '../../constants/routes';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';

type GoalsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GoalsScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<GoalsScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState(0);
  const { width } = useWindowDimensions();

  const goToLongTermGoals = () => {
    navigation.navigate(ROUTES.LONG_TERM_GOALS);
  };

  const goToGoalGroups = () => {
    navigation.navigate(ROUTES.GOAL_GROUPS);
  };

  const goToAchievements = () => {
    navigation.navigate(ROUTES.ACHIEVEMENTS);
  };

  const goToCreateGoal = () => {
    navigation.navigate(ROUTES.CREATE_GOAL);
  };

  const renderTab = (label: string, index: number, iconName: keyof typeof Ionicons.glyphMap) => (
    <TouchableOpacity
      style={[
        styles.tabItem,
        activeTab === index && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 },
      ]}
      onPress={() => setActiveTab(index)}
    >
      <Ionicons
        name={iconName}
        size={22}
        color={activeTab === index ? theme.colors.primary : theme.colors.textSecondary}
        style={styles.tabIcon}
      />
      <Text
        style={[
          styles.tabLabel,
          { color: activeTab === index ? theme.colors.primary : theme.colors.textSecondary },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Mục tiêu dài hạn */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Mục tiêu dài hạn</Text>
            </View>
            <TouchableOpacity 
              style={[styles.createButton, { backgroundColor: `${theme.colors.primary}20` }]}
              onPress={goToCreateGoal}
            >
              <Ionicons name="add-circle" size={18} color={theme.colors.primary} />
              <Text style={[styles.createButtonText, { color: theme.colors.primary }]}>Tạo mục tiêu dài hạn</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.cardShadow}
            onPress={goToLongTermGoals}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4776E6', '#8E54E9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientCard}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="flag" size={28} color="#fff" />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>3 mục tiêu đang thực hiện</Text>
                  <Text style={styles.cardSubtitle}>
                    Theo dõi và quản lý các mục tiêu dài hạn của bạn
                  </Text>
                </View>
              </View>
              
              <View style={styles.cardProgressSection}>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBar, { width: '60%', backgroundColor: '#fff' }]} />
                </View>
                <Text style={styles.progressText}>60% hoàn thành</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Nhóm mục tiêu */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Nhóm mục tiêu</Text>
              <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
                Tham gia các nhóm để cùng nhau phát triển
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.cardShadow}
            onPress={goToGoalGroups}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF5F6D', '#FFC371']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientCard}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="people" size={28} color="#fff" />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>2 nhóm đã tham gia</Text>
                  <Text style={styles.cardSubtitle}>
                    Khám phá và tham gia các nhóm mục tiêu mới
                  </Text>
                </View>
              </View>
              
              <View style={styles.groupMembersRow}>
                {[1, 2, 3, 4].map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.memberAvatar, 
                      { 
                        backgroundColor: ['#FFD6E3', '#D2FFFC', '#FFF7D6', '#D6FCFF'][index],
                        marginLeft: index > 0 ? -10 : 0
                      }
                    ]}
                  >
                    <Text style={styles.memberInitial}>{['M', 'T', 'H', 'N'][index]}</Text>
                  </View>
                ))}
                <View style={styles.moreMembers}>
                  <Text style={styles.moreMembersText}>+12</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Thành tựu */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Thành tựu</Text>
              <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
                Theo dõi tiến độ và thành tựu của bạn
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.cardShadow}
            onPress={goToAchievements}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#11998e', '#38ef7d']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientCard}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="trophy" size={28} color="#fff" />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>12/30 thành tựu đạt được</Text>
                  <Text style={styles.cardSubtitle}>
                    Cấp độ hiện tại: 5 • Streak: 12 ngày
                  </Text>
                </View>
              </View>
              
              <View style={styles.achievementsContainer}>
                <View style={styles.achievementBadge}>
                  <Ionicons name="flame" size={18} color="#fff" />
                </View>
                <View style={styles.achievementBadge}>
                  <Ionicons name="star" size={18} color="#fff" />
                </View>
                <View style={[styles.achievementBadge, styles.lockedBadge]}>
                  <Ionicons name="medal" size={18} color="rgba(255,255,255,0.5)" />
                </View>
                <View style={[styles.achievementBadge, styles.lockedBadge]}>
                  <Ionicons name="ribbon" size={18} color="rgba(255,255,255,0.5)" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  cardShadow: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  gradientCard: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cardProgressSection: {
    width: '100%',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 6,
    textAlign: 'right',
  },
  groupMembersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  memberInitial: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },
  moreMembers: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginLeft: -10,
  },
  moreMembersText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  achievementsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  achievementBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  lockedBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 80, // Add extra space to avoid content being hidden by tab bar
  },
});

export default GoalsScreen; 