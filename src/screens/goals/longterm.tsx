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

type LongTermGoalsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LongTermGoalsScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<LongTermGoalsScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState(0);
  
  const statusFilters = [
    { id: 0, name: t('ltgAllGoals') },
    { id: 1, name: t('inProgressStatus') },
    { id: 2, name: t('completedStatus') },
    { id: 3, name: t('overdueStatus') },
  ];
  
  const handleCreateGoal = () => {
    navigation.navigate(ROUTES.CREATE_GOAL);
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
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('longTermGoals')}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.createButton, { backgroundColor: theme.colors.background }]}
            onPress={handleCreateGoal}
          >
            <Ionicons name="add-circle" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.tabContainer}>
        {statusFilters.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab.id ? 'white' : theme.colors.text },
              ]}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.emptyContainer}>
          <Ionicons name="flag-outline" size={80} color={theme.colors.textTertiary} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>{t('noGoals')}</Text>
          <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
            {t('noGoalsMessage')}
          </Text>
          <TouchableOpacity 
            style={[styles.createGoalButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleCreateGoal}
          >
            <Ionicons name="add" size={20} color="white" style={styles.createGoalIcon} />
            <Text style={styles.createGoalText}>{t('createGoal')}</Text>
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
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 10,
    margin: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  createGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  createGoalIcon: {
    marginRight: 8,
  },
  createGoalText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default LongTermGoalsScreen; 