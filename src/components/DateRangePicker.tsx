import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import Ionicons from '@expo/vector-icons/Ionicons';

import useTheme from '../styles/theme';

interface DateRangePickerProps {
  isVisible: boolean;
  startDate: Date | null;
  endDate: Date | null;
  onClose: () => void;
  onConfirm: (startDate: Date, endDate: Date) => void;
  minDate?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  isVisible,
  startDate: initialStartDate,
  endDate: initialEndDate,
  onClose,
  onConfirm,
  minDate = new Date().toISOString().split('T')[0],
}) => {
  const theme = useTheme();
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);
  const [selectedDates, setSelectedDates] = useState<{
    [key: string]: { selected: boolean; startingDay?: boolean; endingDay?: boolean; color: string };
  }>({});

  // Initialize with provided dates when modal opens
  useEffect(() => {
    if (isVisible) {
      setTempStartDate(initialStartDate);
      setTempEndDate(initialEndDate);
      
      if (initialStartDate && initialEndDate) {
        setIsSelectingStartDate(false);
        updateSelectedDatesFromRange(initialStartDate, initialEndDate);
      } else {
        setIsSelectingStartDate(true);
        setSelectedDates({});
      }
    }
  }, [isVisible, initialStartDate, initialEndDate]);

  const updateSelectedDatesFromRange = (start: Date, end: Date) => {
    const markedDates: { [key: string]: any } = {};
    const startDate = start < end ? start : end;
    const endDate = start < end ? end : start;
    
    let currentDate = new Date(startDate);
    const endDateTime = new Date(endDate);

    while (currentDate <= endDateTime) {
      const dateString = currentDate.toISOString().split('T')[0];
      markedDates[dateString] = {
        selected: true,
        color: theme.colors.primary,
        startingDay: currentDate.getTime() === startDate.getTime(),
        endingDay: currentDate.getTime() === endDateTime.getTime(),
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setSelectedDates(markedDates);
  };

  const handleDayPress = (day: DateData) => {
    const date = new Date(day.timestamp);
    
    if (isSelectingStartDate) {
      // Đang chọn ngày bắt đầu
      setTempStartDate(date);
      setTempEndDate(date);
      setIsSelectingStartDate(false);
      
      // Đánh dấu ngày bắt đầu
      const newSelectedDates = {
        [day.dateString]: {
          selected: true,
          startingDay: true,
          endingDay: true,
          color: theme.colors.primary,
        },
      };
      setSelectedDates(newSelectedDates);
    } else {
      // Đang chọn ngày kết thúc
      let newStartDate = tempStartDate;
      let newEndDate = date;
      
      if (tempStartDate && date < tempStartDate) {
        // Nếu ngày kết thúc trước ngày bắt đầu, đổi vị trí
        newStartDate = date;
        newEndDate = tempStartDate;
      }
      
      if (newStartDate && newEndDate) {
        setTempStartDate(newStartDate);
        setTempEndDate(newEndDate);
        updateSelectedDatesFromRange(newStartDate, newEndDate);
      }
    }
  };

  const handleConfirmSelection = () => {
    if (tempStartDate && tempEndDate) {
      onConfirm(tempStartDate, tempEndDate);
      resetSelection();
    }
  };

  const resetSelection = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    setSelectedDates({});
    setIsSelectingStartDate(true);
  };

  const handleCloseModal = () => {
    resetSelection();
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCloseModal}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={handleCloseModal}
      >
        <TouchableOpacity 
          style={[styles.calendarContainer, { backgroundColor: theme.colors.card }]}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.calendarHeader}>
            <Text style={[styles.calendarTitle, { color: theme.colors.text }]}>
              {isSelectingStartDate ? 'Chọn ngày bắt đầu' : 'Chọn ngày kết thúc'}
            </Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={resetSelection}
                style={styles.resetButton}
              >
                <Text style={[styles.resetButtonText, { color: theme.colors.primary }]}>Đặt lại</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>
          
          <Calendar
            onDayPress={handleDayPress}
            markedDates={selectedDates}
            markingType="period"
            minDate={minDate}
            theme={{
              backgroundColor: theme.colors.card,
              calendarBackground: theme.colors.card,
              textSectionTitleColor: theme.colors.text,
              selectedDayBackgroundColor: theme.colors.primary,
              selectedDayTextColor: '#ffffff',
              todayTextColor: theme.colors.primary,
              dayTextColor: theme.colors.text,
              textDisabledColor: theme.colors.textTertiary,
              dotColor: theme.colors.primary,
              selectedDotColor: '#ffffff',
              arrowColor: theme.colors.primary,
              monthTextColor: theme.colors.text,
              indicatorColor: theme.colors.primary,
            }}
          />

          <View style={styles.calendarFooter}>
            <TouchableOpacity
              style={[styles.footerButton, styles.cancelButton]}
              onPress={handleCloseModal}
            >
              <Text style={[styles.footerButtonText, { color: theme.colors.text }]}>
                Đóng
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.footerButton,
                styles.confirmButton,
                { 
                  backgroundColor: tempStartDate && tempEndDate ? theme.colors.primary : theme.colors.border,
                  opacity: tempStartDate && tempEndDate ? 1 : 0.5,
                }
              ]}
              onPress={handleConfirmSelection}
              disabled={!tempStartDate || !tempEndDate}
            >
              <Text style={[styles.footerButtonText, { color: '#ffffff' }]}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    width: Dimensions.get('window').width - 32,
    borderRadius: 16,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetButton: {
    marginRight: 16,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
  },
  calendarFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: 16,
  },
  footerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  confirmButton: {
    minWidth: 80,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DateRangePicker; 