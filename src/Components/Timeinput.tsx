import React, { useState } from 'react';
import DatePicker from 'react-native-date-picker';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

interface TimeinputProps {
    value: Date | null; // Allow value to be null
    onChange: (date: Date) => void;
}

export const Timeinput: React.FC<TimeinputProps> = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | null>(value); // Initialize with null

    return (
        <>
            <DatePicker
                modal
                mode="time"
                open={open}
                date={date || new Date()} // Provide a default date if date is null
                onConfirm={(selectedDate) => {
                    setOpen(false);
                    setDate(selectedDate);
                    onChange(selectedDate); // Notify the parent component about the time change
                }}
                onCancel={() => {
                    setOpen(false);
                }}
            />
            <TouchableOpacity onPress={() => setOpen(true)}>
                <View style={styles.container}>
                    <View style={styles.button}>
                        <Text style={styles.text}>Pick Time</Text>
                    </View>
                    <View style={styles.viewtime}>
                        {date ? (
                            <Text style={styles.dateText}>{date.toLocaleTimeString()}</Text>
                        ) : (
                            <Text style={styles.dateText}>No Time Selected</Text>
                        )}
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
        justifyContent: 'space-between',
        width: '100%',
    },
    viewtime: {
        width: "40%",
        height: 40,               // Input height
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
    },
    button: {
        width: 150,
        height: 40,
        backgroundColor: '#8F0E16',
        justifyContent: 'center',
        borderRadius: 5,
        paddingHorizontal: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    text: {
        color: '#fff',
        textAlign: 'center',
    },
    dateText: {
        fontSize: 14,
        textAlign: 'center',
    },
});
