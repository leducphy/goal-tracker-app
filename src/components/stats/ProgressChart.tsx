import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';

export interface DataPoint {
  date: string;
  value: number;
}

interface ProgressChartProps {
  title: string;
  subtitle?: string;
  longTermData: DataPoint[];
  shortTermData?: DataPoint[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  title,
  subtitle,
  longTermData,
  shortTermData,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const screenWidth = Dimensions.get('window').width - 40; // Padding on both sides
  
  const labels = longTermData.map(item => item.date);
  const longTermValues = longTermData.map(item => item.value);
  const shortTermValues = shortTermData ? shortTermData.map(item => item.value) : [];
  
  const chartData = {
    labels,
    datasets: [
      {
        data: longTermValues,
        color: () => theme.colors.primary,
        strokeWidth: 2,
      },
      ...(shortTermData && shortTermData.length > 0 ? [{
        data: shortTermValues,
        color: () => theme.colors.secondary,
        strokeWidth: 2,
      }] : []),
    ],
    legend: [t('LongTerm'), t('mediumTermGoals')],
  };
  
  const chartConfig = {
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 112, 255, ${opacity})`,
    labelColor: () => theme.colors.textSecondary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
    },
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>
      )}
      
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.colors.primary }]} />
          <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>{t('LongTerm')}</Text>
        </View>
        
        {shortTermData && shortTermData.length > 0 && (
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: theme.colors.secondary }]} />
            <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>{t('mediumTermGoals')}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 10,
    paddingRight: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
});

export default ProgressChart; 