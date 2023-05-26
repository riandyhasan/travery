import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

export interface DatePickerProps {
  setSelectedDate: (date: Date) => void;
  isVisible: boolean;
  setVisibility: (isVisible: boolean) => void;
}

const DatePicker = ({ setSelectedDate, isVisible, setVisibility }: DatePickerProps) => {
  const hideDatePicker = () => {
    setVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  return <DateTimePickerModal isVisible={isVisible} mode='date' onConfirm={handleConfirm} onCancel={hideDatePicker} />;
};

export default DatePicker;
