import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../App';
import SectionHeader from '../../components/common/SectionHeader';
import ProgressChart, { DataPoint } from '../../components/stats/ProgressChart';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';

type StatsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const StatsScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<StatsScreenNavigationProp>();
  
  // Mock data for charts
  const longTermData: DataPoint[] = [
    { date: '10/5', value: 50 },
    { date: '12/5', value: 65 },
    { date: '14/5', value: 78 },
    { date: '16/5', value: 91 },
    { date: '18/5', value: 84 },
    { date: '20/5', value: 0 },
    { date: '22/5', value: 0 },
    { date: '24/5', value: 0 },
    { date: '26/5', value: 0 },
  ];

  const shortTermData: DataPoint[] = [
    { date: '10/5', value: 42 },
    { date: '12/5', value: 58 },
    { date: '14/5', value: 70 },
    { date: '16/5', value: 95 },
    { date: '18/5', value: 10 },
    { date: '20/5', value: 0 },
    { date: '22/5', value: 0 },
    { date: '24/5', value: 0 },
    { date: '26/5', value: 0 },
  ];
  
  const renderTimePeriodSelection = () => {
    const options = [t('sevenDays'), t('fourteenDays'), t('thirtyDays'), t('ninetyDays')];
    const [selectedOption, setSelectedOption] = useState(0);
    
    return (
      <View style={styles.periodSelectorContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.periodOption,
              selectedOption === index && { 
                backgroundColor: `${theme.colors.primary}20`,
                borderColor: theme.colors.primary,
              }
            ]}
            onPress={() => setSelectedOption(index)}
          >
            <Text
              style={[
                styles.periodOptionText,
                { color: selectedOption === index ? theme.colors.primary : theme.colors.textSecondary }
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  const renderMetricSelector = () => {
    const options = [t('progressMetric'), t('dailyCompletion')];
    const [selectedOption, setSelectedOption] = useState(0);
    
    return (
      <View style={[styles.metricSelector, { backgroundColor: theme.colors.card }]}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.metricOption,
              selectedOption === index && { 
                backgroundColor: theme.colors.primary,
              }
            ]}
            onPress={() => setSelectedOption(index)}
          >
            <Text
              style={[
                styles.metricOptionText,
                { color: selectedOption === index ? 'white' : theme.colors.textSecondary }
              ]}
            >
              {option}
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
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('statisticsTitle')}</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
              {t('analyzeProgress')}
            </Text>
          </View>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        {renderMetricSelector()}
        
        <SectionHeader
          title={t('timeProgressChart')}
          actionText=""
        />
        
        {renderTimePeriodSelection()}
        
        <ProgressChart
          title={t('trackGoalsOverTime')}
          subtitle={t('trackGoalsOverTime')}
          longTermData={longTermData}
          shortTermData={shortTermData}
        />
        
        <View style={styles.analysisSection}>
          <SectionHeader title={t('goalAnalysis')} />
          <View style={[styles.analysisCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.analysisLabel, { color: theme.colors.textSecondary }]}>
              {t('completionRateByType')}
            </Text>
            <View style={styles.analysisPlaceholder}>
              <Text style={[styles.placeholderText, { color: theme.colors.textTertiary }]}>
                {t('developing')}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.analysisSection}>
          <SectionHeader title={t('activityTime')} />
          <View style={[styles.analysisCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.analysisLabel, { color: theme.colors.textSecondary }]}>
              {t('timeSpentByGoalType')}
            </Text>
            <View style={styles.analysisPlaceholder}>
              <Text style={[styles.placeholderText, { color: theme.colors.textTertiary }]}>
                {t('developing')}
              </Text>
            </View>
          </View>
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
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  metricSelector: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  metricOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  metricOptionText: {
    fontWeight: '500',
    fontSize: 14,
  },
  periodSelectorContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  periodOption: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  periodOptionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  analysisSection: {
    marginVertical: 10,
  },
  analysisCard: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  analysisLabel: {
    fontSize: 14,
    marginBottom: 16,
  },
  analysisPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 14,
  },
});

export default StatsScreen; 