import React, { useEffect, useState } from 'react'
import { Text, View, TextInput, Button, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native'
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

    const [paragraphslist, setParagraphslist] = useState<[object]>({});


    const GetServices = async (): Promise<void> => {
        try {
            const response = await axios.get(`${apiurl}getservices`);
            setServicelist(response.data.payload);
        } catch (error) {
            console.log(error);
        }
    };

    const GetParagraphs = async (): Promise<void> => {
        try {
            const response = await axios.get(`${apiurl}getparagraphs`);
            const paragraphdata = response.data.payload;
            setParagraphslist(paragraphdata);
            
            const serialnumbers = paragraphdata.map((item) => {
                return item.sno
            }) 

            console.log(serialnumbers , "This");
            
            setParagraphsCheckedlist(serialnumbers);

        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        GetServices();
        GetParagraphs();
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


    const onSubmit = async (data: object): Promise<void> => {
        setPreview(true);
        const selectedservices = filterCheckedService();
        const selectedparagraphs = filterCheckedParagraphs();
        const payload: object = {
            ...data,
            socpic: socpic,  // Include the image URI or Base64 string in the payload
            selectedservices, // Ensure you're spreading/selecting services properly
            selectedparagraphs
        };

        setPreviewdata(payload);

        navigation.navigate('Preview', { payload });



        try {
            // Send payload with correct headers
            const addquotationresponse = await axios.post(`${apiurl}addquotation`, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log(addquotationresponse);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
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
                                    placeholder="Society Name"
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
                                    placeholder="Enter Registration Number"
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
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={styles.inputcontainer}>
                                <Text style={styles.labels}>Email :</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Total"
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
                                    placeholder="Enter Total Flats / Row Houses"
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
                                    placeholder="Enter Total Shops"
                                    onBlur={onBlur}
                                    keyboardType="numeric"   // Ensures the numeric keyboard pops up
                                    onChangeText={onChange}
                                    value={String(value)}    // Convert the number to a string for TextInput
                                />
                            </View>
                        )}
                        name="totalshops"
                    />


                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={styles.inputcontainer}>
                                <Text style={styles.labels}>Insurance Secure Amount :</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Insurance Secure Amount"
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

                    {
                        paragraphslist && paragraphslist.length > 0 && (
                            <View style={styles.service_section}>
                                <Text style={{ fontSize: 20, color: "black" }}>Select Paragraphs :</Text>

                                {paragraphslist.map((item, index) => (
                                    <View key={index} style={styles.serviceItem}>
                                        <View style={styles.checkboxContainer}>
                                            {/* Render service name dynamically */}
                                            <Text style={styles.label}>{item.name}</Text>

                                            {/* Checkbox for each service */}
                                            <CheckBox
                                                value={paragraphscheckedlist.includes(item.sno)}
                                                onValueChange={() => handleParagraphCheckboxChange(item.sno)}
                                            />


                                            {/* Conditional input for rate when checkbox is selected */}
                                            {paragraphscheckedlist.includes(item.serviceid) && (
                                                <TextInput
                                                    style={styles.checkboxinput}
                                                    placeholder='Enter Rate'
                                                    // onChangeText={(text) => handleRateChange(index, text)}
                                                />
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )
                    }






                    <Button title="Preview" onPress={handleSubmit(onSubmit)} />
                    {/* {preview && (
                        <Preview previewdata = {previewdata}/>
                    )} */}


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
        height: "3%",
        width: "100%",
        // backgroundColor: "#8F0E16",
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '5%'
    },
    heading: {
        fontSize: 20,
        color: "#8F0E16",
        textAlign: 'center',
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
        paddingHorizontal: 10,
        borderRadius: 5,
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
        padding: 10
    },
    checkboxinput: {
        borderColor: '#ccc',
        borderWidth: 1,
        height: 30,
        padding: 5,
        width: "30%",
        marginLeft: "5%"
    }
});


export default Quotation