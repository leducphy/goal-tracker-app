import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Mục tiêu</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Mục tiêu dài hạn */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Mục tiêu dài hạn</Text>
            </View>
            <TouchableOpacity 
              style={[styles.createButton, { backgroundColor: theme.colors.card }]}
              onPress={goToCreateGoal}
            >
              <Ionicons name="add-circle" size={18} color={theme.colors.primary} />
              <Text style={[styles.createButtonText, { color: theme.colors.primary }]}>Tạo mục tiêu dài hạn</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.sectionContent, { backgroundColor: theme.colors.card }]}
            onPress={goToLongTermGoals}
          >
            <Ionicons name="flag" size={24} color={theme.colors.primary} style={styles.sectionIcon} />
            <View style={styles.sectionTextContainer}>
              <Text style={[styles.sectionContentTitle, { color: theme.colors.text }]}>3 mục tiêu đang thực hiện</Text>
              <Text style={[styles.sectionContentSubtitle, { color: theme.colors.textSecondary }]}>
                Theo dõi và quản lý các mục tiêu dài hạn của bạn
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
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
            style={[styles.sectionContent, { backgroundColor: theme.colors.card }]}
            onPress={goToGoalGroups}
          >
            <Ionicons name="people" size={24} color={theme.colors.primary} style={styles.sectionIcon} />
            <View style={styles.sectionTextContainer}>
              <Text style={[styles.sectionContentTitle, { color: theme.colors.text }]}>2 nhóm đã tham gia</Text>
              <Text style={[styles.sectionContentSubtitle, { color: theme.colors.textSecondary }]}>
                Khám phá và tham gia các nhóm mục tiêu mới
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
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
            style={[styles.sectionContent, { backgroundColor: theme.colors.card }]}
            onPress={goToAchievements}
          >
            <Ionicons name="trophy" size={24} color={theme.colors.primary} style={styles.sectionIcon} />
            <View style={styles.sectionTextContainer}>
              <Text style={[styles.sectionContentTitle, { color: theme.colors.text }]}>12/30 thành tựu đạt được</Text>
              <Text style={[styles.sectionContentSubtitle, { color: theme.colors.textSecondary }]}>
                Cấp độ hiện tại: 5 • Streak: 12 ngày
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
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
  headerTitle: {
    fontSize: 22,
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
    borderRadius: 8,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  sectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  sectionIcon: {
    marginRight: 16,
  },
  sectionTextContainer: {
    flex: 1,
  },
  sectionContentTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  sectionContentSubtitle: {
    fontSize: 14,
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
});

export default GoalsScreen; 