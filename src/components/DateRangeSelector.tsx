import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import useTheme from '../styles/theme';
import DateRangePicker from './DateRangePicker';

interface DateRangeSelectorProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  onClear?: () => void;
  label?: string;
  placeholder?: string;
  minDate?: string;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  onDateRangeChange,
  onClear,
  label = 'Thời gian',
  placeholder = 'Chọn khoảng thời gian',
  minDate,
}) => {
  const theme = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const formatDateRange = () => {
    if (!startDate || !endDate) return placeholder;
    
    if (startDate.getTime() === endDate.getTime()) {
      return formatDate(startDate);
    }
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const handleConfirm = (start: Date, end: Date) => {
    onDateRangeChange(start, end);
    setShowPicker(false);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
          {(startDate || endDate) && onClear && (
            <TouchableOpacity onPress={onClear}>
              <Text style={[styles.clearText, { color: theme.colors.error }]}>Xóa</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.selectorButton,
            { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
          ]}
          onPress={() => setShowPicker(true)}
        >
          <Ionicons name="calendar" size={24} color={theme.colors.primary} />
          <Text style={[styles.selectorText, { color: theme.colors.text }]}>
            {formatDateRange()}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <DateRangePicker
        isVisible={showPicker}
        startDate={startDate}
        endDate={endDate}
        onClose={() => setShowPicker(false)}
        onConfirm={handleConfirm}
        minDate={minDate}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectorText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
});

export default DateRangeSelector; 