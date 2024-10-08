import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { apiurl } from './Contant';
import { useFocusEffect } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const Reminder = () => {
  type QuotationDetails = {
    _id: string;
    address: string;
    chairmanname: string;
    chairmanno: number;
    cin: string;
    comm1name: string;
    comm1no: number;
    comm2name: string;
    comm2no: number;
    companyaddress: string;
    companyname: string;
    email: string;
    insurancesecureamt: number;
    location: string;
    nextFollowuptime: string; // Consider using Date if you parse this as a date
    nextfollowupdate: string;  // Consider using Date if you parse this as a date
    registrationno: string;
    repno: number | null;
    secretaryname: string;
    secretaryno: number;
    securityguardno: number;
    securitysupno: number;
    selectedparagraphs: any[]; // Replace `any` with a more specific type if possible
    selectedservices: any[];    // Replace `any` with a more specific type if possible
    societyname: string;
    socpic: string | null;
    status: string;
    totalflatsrowhouse: string;
    totalshops: number;
    treasurername: string;
    treasurerno: number;
  };

  const [quotationList, setQuotationList] = useState<QuotationDetails[]>([]);

  const loadData = async () => {
    try {
      const response = await axios.get(`${apiurl}getquotations`);
      console.log(response.data.payload);
      // Assuming response.data.payload contains the array of quotation details
      setQuotationList(response.data.payload);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const arrangeQuotation = (data: QuotationDetails[]) => {
    return data.sort((a, b) => {
      return new Date(a.nextfollowupdate).getTime() - new Date(b.nextfollowupdate).getTime();
    });
  };

 

  useFocusEffect(
    useCallback(() => {
      loadData();
    },[])
  )


  useFocusEffect(
    useCallback(() => {
      if (quotationList.length > 0) {
        const sortedList = arrangeQuotation(quotationList);
        setQuotationList(sortedList);



      }
    }, [quotationList])
  )

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.pageHeading}>Quotation List</Text>
        {quotationList.length > 0 ? (
          <View >
            {/* Render each quotation here */}
            {quotationList.map((quotation) => (
              <View key={quotation._id} style={styles.brick}>
                <View>
                  <Text>{quotation.societyname}</Text>
                </View>
                
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noDataText}>No quotations available</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    maxWidth: width,
    minHeight: height,
    // backgroundColor: 'yellow',
    padding: 25,
  },
  pageHeading: {
    textAlign: 'center',
    fontSize: 20,
    color: '#8F0E16',
    marginBottom: 10,
  },
  brick: {
    width: '100%',
    height: height / 7,
    // backgroundColor: '#8F0E16',
    borderWidth : 2,
    borderColor : '#8F0E16',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  noDataText: {
    textAlign: 'center',
    color: 'gray',
  },
});

export default Reminder;
