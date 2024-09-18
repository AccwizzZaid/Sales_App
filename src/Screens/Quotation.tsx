import React, { useEffect, useState } from 'react'
import { Text, View, TextInput, Button, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, Image, Modal } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { launchCamera } from 'react-native-image-picker'
import { Dateinput } from '../Components/Dateinput'
import { Timeinput } from '../Components/Timeinput'
import { apiurl } from './Contant'
import CheckBox from '@react-native-community/checkbox'
import Preview from '../Components/Preview'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import SelectDropdown from 'react-native-select-dropdown'
import { faL } from '@fortawesome/free-solid-svg-icons'






type formstructure = {
    societyname: string,
    address: string,
    email: string,
    registrationno: string,
    totalflatsrowhouse: number,
    totalshops: number,
    insurancesecureamt: number,
    secretaryname: string,
    secretaryno: number,
    chairmanname: string,
    chairmanno: number,
    treasurername: string,
    treasurerno: number,
    comm1name: string,
    comm1no: number,
    comm2name: string,
    comm2no: number,
    securityguardno: number,
    securitysupno: number,
    repno: any,
    status: string,
    nextfollowupdate: Date,
    nextFollowuptime: Date

}

type servicelist = {
    servicename: string,
    serviceid: number,
    rate: number | null

}



const Quotation = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<formstructure>({
        defaultValues: {
            societyname: "",
            address: "",
            registrationno: "",
            email: "",
            totalflatsrowhouse: 0,
            totalshops: 0,
            insurancesecureamt: 0,
            secretaryname: "",
            secretaryno: 0,
            chairmanname: "",
            chairmanno: 0,
            treasurername: "",
            treasurerno: 0,
            comm1name: "",
            comm1no: 0,
            comm2name: "",
            comm2no: 0,
            securityguardno: 0,
            securitysupno: 0,
            repno: null,
            status: "",
            nextfollowupdate: new Date(),
            nextFollowuptime: new Date(),


        },
    })

    const navigation: any = useNavigation();

    const [servicelist, setServicelist] = useState<[servicelist] | null>(null);
    const [imageUri, setImageUri] = useState<string | null>(null);
    // const [selectedservices, setSelectedservices] = useState<Array<object>>([])

    const [monthlyaccountingSelected, setMonthlyaccountingselection] = useState<boolean>(false);

    const [accountingandregistercomplianceselected, setAcountingandregistercomplianceselection] = useState<boolean>(false);

    const [accountingcompliancevisit, setAccountingcompliancevisitselection] = useState<boolean>(false);

    const [annualincometax, setAnnualincometax] = useState<boolean>(false);

    const [annualaudit, setAnnualaudit] = useState<boolean>(false);

    const [servicecheckedlist, setServiceCheckedlist] = useState<Array<Number>>([]);

    const [paragraphscheckedlist, setParagraphsCheckedlist] = useState<Array<Number>>([]);

    const [socpic, setSocpic] = useState<ArrayBuffer | string | null>(null);

    const [preview, setPreview] = useState<boolean>(false);

    const [previewdata, setPreviewdata] = useState<object>({});

    const [paragraphslist, setParagraphslist] = useState<[object]>([{}]);

    const [editVisible, setEditVisible] = useState<boolean>(false);

    const [selectedSno, setSelectedSno] = useState<number | null>(null);

    const [inputValue, setInputValue] = useState('');

    const [addresssectionvisible, setAddressSectionVisible] = useState<boolean>(false);

    const [pincode, setPincode] = useState<number | null>(null);

    const [demographicdata, setDemographicdata] = useState();

    const [selectedaddress, setSelectedAddress] = useState({});

    const [companyinformation, setCompanyInformation] = useState();


    // Section states for hiding and displaying parts of the form
    const [section1, setSection1] = useState<boolean>(true);

    const [section2, setSection2] = useState<boolean>(false);

    const [section3, setSection3] = useState<boolean>(false);

    const [section4, setSection4] = useState<boolean>(false);

    const [section5, setSection5] = useState<boolean>(false);



    const GetPdfInformation = async (): Promise<void> => {
        try {
            const serviceresponse = await axios.get(`${apiurl}getservices`);
            setServicelist(serviceresponse.data.payload);

            const paragraphresponse = await axios.get(`${apiurl}getparagraphs`);
            const paragraphdata = paragraphresponse.data.payload;
            setParagraphslist(paragraphdata);

            const serialnumbers = paragraphdata.map((item) => {
                return item.sno
            })

            setParagraphsCheckedlist(serialnumbers);

            const companyinformationresponse = await axios.get(`${apiurl}getcompanyinformation`);

            const companydata = companyinformationresponse.data.payload;



            setCompanyInformation(companydata[0]);




        } catch (error) {
            console.log(error);

        }
    }



    useEffect(() => {
        GetPdfInformation();
    }, [])

    const handleServiceCheckboxChange = (serviceid: number) => {
        setServiceCheckedlist((prevCheckedlist) => {
            if (prevCheckedlist.includes(serviceid)) {
                return prevCheckedlist.filter(id => id !== serviceid);
            } else {
                return [...prevCheckedlist, serviceid];
            }
        });
    };

    const handleParagraphCheckboxChange = (sno: number) => {
        setParagraphsCheckedlist((prevCheckedlist) => {
            if (prevCheckedlist.includes(sno)) {
                return prevCheckedlist.filter(id => id !== sno);
            } else {
                return [...prevCheckedlist, sno];
            }
        });
    };

    const handleRateChange = (index: number, rate: number) => {
        if (servicelist != null) {
            const updatedServices = [...servicelist];
            updatedServices[index].rate = rate;

            setServicelist(updatedServices);
        }



    };

    const filterCheckedService = () => {
        const filtered = servicelist.filter((item) =>
            servicecheckedlist.includes(item.serviceid)
        );

        return filtered
    }

    const filterCheckedParagraphs = () => {
        const filtered = paragraphslist.filter((item) =>
            paragraphscheckedlist.includes(item.sno)
        );

        return filtered
    }




    const handleCameraPress = () => {
        launchCamera({ mediaType: 'photo', quality: 1 }, async (response) => {
            if (response?.assets && response.assets.length > 0) {
                const { uri } = response.assets[0];
                setImageUri(uri || null);

                // Convert image to binary data
                try {
                    const response = await fetch(uri);
                    const blob = await response.blob();
                    const reader = new FileReader();

                    reader.onloadend = () => {
                        const base64Data = reader.result;
                        setSocpic(base64Data);
                    };

                    reader.readAsDataURL(blob);
                } catch (error) {
                    console.error('Error fetching image binary data:', error);
                }
            }
        });
    };

    const togglePopup = (sno) => {
        setSelectedSno(sno);
        setInputValue(dispalayselectedparagraphdata(sno));
        setEditVisible(!editVisible);
    };

    const editparagraph = () => {
        if (selectedSno !== null) {
            const updatedData = paragraphslist.map(obj =>
                obj.sno === selectedSno ? { ...obj, data: inputValue } : obj
            );
            setParagraphslist(updatedData);
            setEditVisible(false);
            setSelectedSno(null);
        }
    };

    const dispalayselectedparagraphdata = (sno) => {
        const filteredParagraph = paragraphslist.find(item => item.sno === sno);
        return filteredParagraph ? filteredParagraph.data : '';
    };

    const RetrieveDemographicData = async () => {
        console.log(pincode);


        try {
            const demographicResponse = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
            const responseData = demographicResponse.data;
            if (responseData.length > 0) {
                console.log(responseData[0].PostOffice);
                setDemographicdata(responseData[0].PostOffice);
                setAddressSectionVisible(true)

            } else {
                console.log("No data found for the given pincode.");
            }
        } catch (error) {
            console.error("Error retrieving demographic data:", error);
        }
    };

    const onError = (errors) => {
        console.error("Form errors:", errors);
    };


    const onSubmit = async (data: object): Promise<void> => {
        console.log("triggerd");

        setPreview(true);
        const selectedservices = filterCheckedService();
        const selectedparagraphs = filterCheckedParagraphs();
        const payload: object = {
            ...data,
            ...selectedaddress,
            ...companyinformation,
            socpic: socpic,  // Include the image URI or Base64 string in the payload
            selectedservices, // Ensure you're spreading/selecting services properly
            selectedparagraphs
        };

        setPreviewdata(payload);

        navigation.navigate('Preview', { payload });

        // try {
        //     // Send payload with correct headers
        //     const addquotationresponse = await axios.post(`${apiurl}addquotation`, payload, {
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //     });

        //     console.log(addquotationresponse);
        // } catch (error) {
        //     console.error("Error submitting form:", error);
        // }
    };



    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.safeArea}
            >
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <View style={styles.header}>
                        <Text style={styles.heading}>Create Quotation</Text>
                    </View>

                    <View style={{ display: section1 ? 'flex' : 'none' }}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>Society Name : </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="  Society Name"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>
                            )}
                            name="societyname"
                        />
                        {errors.societyname && <Text style={styles.errortext}>This is required.</Text>}

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>Registration Number :</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="  Enter Registration Number"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>
                            )}
                            name="registrationno"
                        />

                        {errors.registrationno && <Text style={styles.errortext}>This is required.</Text>}

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>Address :</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="  Enter Address"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>
                            )}
                            name="address"
                        />

                        {errors.address && <Text style={styles.errortext}>This is required.</Text>}



                        <View style={styles.inputcontainer}>
                            <Text style={styles.labels}>Enter Pincode :</Text>
                            <View style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
                                <TextInput
                                    style={{
                                        width: "80%",
                                        height: 40,
                                        borderColor: '#ccc',
                                        borderWidth: 1,
                                        paddingHorizontal: 10,
                                        borderRadius: 5
                                    }}
                                    placeholder=" Enter Pincode"
                                    onChangeText={text => setPincode(parseInt(text))}
                                />
                                <TouchableOpacity
                                    onPress={() => { RetrieveDemographicData(); }}
                                    style={{
                                        width: "15%",
                                        backgroundColor: "#730A11",
                                        justifyContent: 'center',
                                        alignItems: 'center', // Horizontal alignment
                                        height: 40, // Match the TextInput height for better alignment
                                        borderRadius: 5
                                    }}
                                >
                                    <Text style={{ color: "#fff" }}>Go</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {addresssectionvisible && (
                            <View style={styles.inputcontainer}>
                                <Text style={styles.label}>Select Area:</Text>
                                <SelectDropdown
                                    data={demographicdata}
                                    onSelect={(selectedItem, index) => {
                                        setSelectedAddress(selectedItem);
                                    }}
                                    renderButton={(selectedItem, isOpened) => {
                                        return (
                                            <View style={styles.dropdownButtonStyle}>
                                                <Text style={styles.dropdownButtonTxtStyle}>
                                                    {(selectedItem && selectedItem.Name) || 'Select your area'}
                                                </Text>
                                            </View>
                                        );
                                    }}
                                    renderItem={(item, index, isSelected) => {
                                        return (
                                            <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                                <Text style={styles.dropdownItemTxtStyle}>{item.Name}</Text>
                                            </View>
                                        );
                                    }}
                                    showsVerticalScrollIndicator={false}
                                    dropdownStyle={styles.dropdownMenuStyle}
                                />


                                {/* {selectedArea && (
                                <Text style={styles.selectedText}>Selected Area: {selectedArea}</Text>
                            )} */}
                            </View>
                        )}

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>Email :</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="  Enter Email"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>
                            )}
                            name="email"
                        />

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>No of Flats / Row Houses :</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="  Enter Total Flats / Row Houses"
                                        onBlur={onBlur}
                                        keyboardType="numeric"   // Ensures the numeric keyboard pops up
                                        onChangeText={onChange}
                                        value={String(value)}    // Convert the number to a string for TextInput
                                    />
                                </View>
                            )}
                            name="totalflatsrowhouse"
                        />


                        {errors.totalshops && <Text style={styles.errortext}>This is required.</Text>}

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>No of Shops :</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="  Enter Total Shops"
                                        onBlur={onBlur}
                                        keyboardType="numeric"   // Ensures the numeric keyboard pops up
                                        onChangeText={onChange}
                                        value={String(value)}    // Convert the number to a string for TextInput
                                    />
                                </View>
                            )}
                            name="totalshops"
                        />

                        <View style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                style={styles.nextbtn}
                                onPress={() => { setSection1(false); setSection2(true) }}
                            >
                                <Text style={{ margin: 'auto', color: '#fff' }}>Next</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={{ display: section2 ? 'flex' : 'none' }}>



                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>Insurance Secure Amount :</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="  Enter Insurance Secure Amount"
                                        onBlur={onBlur}
                                        keyboardType="numeric"   // Ensures the numeric keyboard pops up
                                        onChangeText={onChange}
                                        value={String(value)}    // Convert the number to a string for TextInput
                                    />

                                </View>
                            )}
                            name="insurancesecureamt"
                        />

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>Secretary Name :</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Secretary Name"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>
                            )}
                            name="secretaryname"
                        />


                        {errors.secretaryname && <Text style={styles.errortext}>This is required.</Text>}
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>Secretary No :</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Secretary No"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={String(value)}
                                    />
                                </View>
                            )}
                            name="secretaryno"
                        />


                        {errors.secretaryno && <Text style={styles.errortext}>This is required.</Text>}


                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>Chairman Name :</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Chairman Name"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>
                            )}
                            name="chairmanname"
                        />


                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>Chairman No :</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Chairman No"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={String(value)}
                                    />
                                </View>
                            )}
                            name="chairmanno"
                        />



                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>Treasurer Name :</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Treasurer Name"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>
                            )}
                            name="treasurername"
                        />


                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>Treasurer No :</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Treasurer No"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={String(value)}
                                    />
                                </View>
                            )}
                            name="treasurerno"
                        />
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>First Committee Member Name :</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter First Committee Member Name"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>
                            )}
                            name="comm1name"
                        />
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>First Committee Member Name :</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter First Committee Member Name"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>
                            )}
                            name="comm1name"
                        />

                        <View style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                style={styles.previousbtn}
                                onPress={() => { setSection2(false); setSection1(true) }}
                            >
                                <Text style={{ margin: 'auto', color: '#fff' }}>Previous</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.nextbtn}
                                onPress={() => { setSection2(false); setSection3(true) }}
                            >
                                <Text style={{ margin: 'auto', color: '#fff' }}>Next</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={{ display: section3 ? 'flex' : 'none' }}>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>First Committee Member Name :</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter First Committee Member Name"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>
                            )}
                            name="comm1name"
                        />


                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>First Committee Member Contact :</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter First Committee Member Contact"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={String(value)}
                                    />
                                </View>
                            )}
                            name="comm1no"
                        />


                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>Second Committee Member Name:</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Second Committee Member Name"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>
                            )}
                            name="comm2name"
                        />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>Second Committee Member Contact:</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Second Committee Member Contact"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={String(value)}
                                    />
                                </View>
                            )}
                            name="comm2no"
                        />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>Security Guard Number :</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Security Guard Number"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={String(value)}
                                    />
                                </View>
                            )}
                            name="securityguardno"
                        />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>Security Superintendent Number :</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Security Superintendent Number"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={String(value)}
                                    />
                                </View>
                            )}
                            name="securitysupno"
                        />

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            name="nextfollowupdate"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>Select Follow Up Date:</Text>
                                    <Dateinput value={value} onChange={onChange} />
                                </View>
                            )}
                        />

                        {errors.nextfollowupdate && <Text style={styles.errortext}>This is required.</Text>}


                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            name="nextFollowuptime"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputcontainer}>
                                    <Text style={styles.labels}>Select Follow Up Date:</Text>
                                    <Timeinput value={value} onChange={onChange} />
                                </View>
                            )}
                        />

                        {errors.nextFollowuptime && <Text style={styles.errortext}>This is required.</Text>}







                        <Text style={styles.labels}>Society Picture:</Text>
                        <TouchableOpacity style={styles.cameraButton} onPress={handleCameraPress}>
                            <Text style={styles.cameraButtonText}>Take a Picture</Text>
                        </TouchableOpacity>

                        {imageUri && (
                            <Image source={{ uri: imageUri }} style={styles.previewImage} />
                        )}

                        <View style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                style={styles.previousbtn}
                                onPress={() => { setSection3(false); setSection2(true) }}
                            >
                                <Text style={{ margin: 'auto', color: '#fff' }}>Previous</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.nextbtn}
                                onPress={() => { setSection3(false); setSection4(true) }}
                            >
                                <Text style={{ margin: 'auto', color: '#fff' }}>Next</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={{ display: section4 ? 'flex' : 'none' }}>
                        {servicelist && servicelist.length > 0 && (
                            <View style={styles.service_section}>
                                <Text style={{ fontSize: 20, color: "black" }}>Services :</Text>

                                {servicelist.map((item, index) => (
                                    <View key={index} style={styles.serviceItem}>
                                        <View style={styles.checkboxContainer}>
                                            {/* Render service name dynamically */}
                                            <Text style={styles.label}>{item.servicename}</Text>

                                            {/* Checkbox for each service */}
                                            <CheckBox
                                                value={servicecheckedlist.includes(item.serviceid)}
                                                onValueChange={() => handleServiceCheckboxChange(item.serviceid)}
                                            />


                                            {/* Conditional input for rate when checkbox is selected */}
                                            {servicecheckedlist.includes(item.serviceid) && (
                                                <TextInput
                                                    style={styles.checkboxinput}
                                                    placeholder='Enter Rate'
                                                    onChangeText={(text) => handleRateChange(index, text)}
                                                />
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                        <View style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                style={styles.previousbtn}
                                onPress={() => { setSection4(false); setSection3(true) }}
                            >
                                <Text style={{ margin: 'auto', color: '#fff' }}>Previous</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.nextbtn}
                                onPress={() => { setSection4(false); setSection5(true) }}
                            >
                                <Text style={{ margin: 'auto', color: '#fff' }}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                    <View style={{ display: section5 ? 'flex' : 'none' }}>
                        {paragraphslist && paragraphslist.length > 0 && (
                            <View style={styles.paragraph_section}>
                                <Text style={{ fontSize: 20, color: 'black' }}>Select Paragraphs:</Text>
                                {paragraphslist.map((item) => (
                                    <View key={item.sno} style={styles.serviceItem}>
                                        <View style={styles.checkboxContainer}>
                                            <Text onPress={() => togglePopup(item.sno)} style={styles.label}>
                                                {item.name}
                                            </Text>
                                            <CheckBox
                                                value={paragraphscheckedlist.includes(item.sno)}
                                                onValueChange={() => handleParagraphCheckboxChange(item.sno)}
                                            />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                        <View style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                style={styles.previousbtn}
                                onPress={() => { setSection5(false); setSection4(true) }}
                            >
                                <Text style={{ margin: 'auto', color: '#fff' }}>Previous</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.previewbtn}
                            onPress={handleSubmit(onSubmit, onError)}
                        >
                            <Text style={{ margin: 'auto', color: '#fff' }}>Preview</Text>
                        </TouchableOpacity>
                    </View>










                    <Modal
                        transparent={true}
                        visible={editVisible}
                        animationType="slide"
                        onRequestClose={() => setEditVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <TextInput
                                    style={styles.ModaltextInput}
                                    value={inputValue}
                                    editable={true}
                                    multiline={true}
                                    textAlignVertical='top'
                                    onChangeText={text => setInputValue(text)}
                                />
                                <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                                    <TouchableOpacity
                                        style={styles.modalEditButton}
                                        onPress={editparagraph}
                                    >
                                        <Text style={{ margin: 'auto' }}>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.modalCloseButton}
                                        onPress={() => setEditVisible(false)}
                                    >
                                        <Text style={{ margin: 'auto' }}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                </ScrollView>



            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        height: "6%",
        width: "100%",
        marginBottom: '5%'
    },
    heading: {
        fontSize: 20,
        color: "#8F0E16",
        textAlign: 'center',
        margin: 'auto'
    },
    inputcontainer: {
        flexDirection: 'column',     // Places label and input in a row
        alignItems: 'flex-start',     // Aligns the label and input vertically at the center
        marginBottom: 10,         // Adds some space between inputs
    },
    labels: {
        color: "black",
        fontSize: 16,             // Label font size
    },
    input: {
        // Makes input take the remaining space in the row
        width: "100%",
        height: 40,               // Input height
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },



    paragraphsection: {
        display: 'flex'
    },

    contentContainer: {
        padding: "5%",
        paddingBottom: 80, // Add padding equal to the height of the bottom tab
    },
    cameraButton: {
        backgroundColor: '#8F0E16',
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 10,

    },
    cameraButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    previewImage: {
        width: 200,
        height: 200,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 10,
    },
    errortext: {
        color: "red"
    },
    checkboxContainer: {
        flexDirection: 'row', // Align text and checkbox horizontally
        alignItems: 'center', // Align vertically centered
        marginBottom: 20,
    },
    label: {
        marginRight: 10, // Spacing between text and checkbox
    },
    service_section: {
        width: "100%",
        backgroundColor: "#dfdede",
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        marginBottom : 10
    },
    paragraph_section: {
        width: "100%",
        backgroundColor: "#dfdede",
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        marginBottom : 10
    },
    checkboxinput: {
        borderColor: '#ccc',
        borderWidth: 1,
        height: 30,
        padding: 5,
        width: "30%",
        marginLeft: "5%"
    },
    editbox: {
        width: "100%",
        height: "50%",
        backgroundColor: "green",

    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalCloseButton: {
        width: 60,
        height: 40,
        marginTop: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    modalEditButton: {
        width: 60,
        height: 40,
        marginTop: 10,
        backgroundColor: '#8F0E16',
        borderRadius: 5,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    ModaltextInput: {
        borderWidth: 2
    },
    dropdownButtonStyle: {
        width: "100%",
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        marginBottom: 10,         // Adds some space between inputs

    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    previewbtn: {
        width: '100%',
        height: 40,
        backgroundColor: "#8F0E16",
        marginTop: 10,
        borderRadius: 10
    },
    nextbtn: {
        width: '30%',
        height: 40,
        backgroundColor: "#8F0E16",
        borderRadius: 10,

    },
    previousbtn: {
        width: '30%',
        height: 40,
        backgroundColor: "#8F0E16",
        borderRadius: 10,

    }
});


export default Quotation