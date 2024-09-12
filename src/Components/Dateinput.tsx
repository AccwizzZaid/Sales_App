import React, { useState } from 'react';
import DatePicker from 'react-native-date-picker';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

interface DateinputProps {
  value: Date;
  onChange: (date: Date) => void;
}

export const Dateinput: React.FC<DateinputProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(value);

  return (
    <>
      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={(selectedDate) => {
          setOpen(false);
          setDate(selectedDate);
          onChange(selectedDate); // Notify the parent component about the date change
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <TouchableOpacity onPress={() => setOpen(true)}>
        <View style={styles.container}>
          <View style={styles.button}>
            <Text style={styles.text}>Pick Date</Text>
          </View>
          <View style={styles.viewdate}>
            <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent : 'space-between',
    width : '100%'
  },
  viewdate: {
    width: "40%",
    height: 40,               
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    display : 'flex',
    justifyContent : 'center'
  },
  button: {
    width: 150,
    height: 40,
    backgroundColor: "#8F0E16",
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
