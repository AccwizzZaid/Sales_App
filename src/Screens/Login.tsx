import React, { useState } from 'react';
import {
    Button,
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableHighlight
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

import { apiurl } from './Contant';

import { setUser } from '../Store/Slices/UserSlice';
import { useDispatch } from 'react-redux';



const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
    const navigation : any = useNavigation();
    const dispatch = useDispatch();

    const InitiateLogin = async (data: { username: string; password: string }) => {

        try {
            const response = await axios.post(`${apiurl}login`, data);
            console.log(response.data);

            if (response.status === 200) {
                dispatch(setUser("Zaid"));
                // Navigate to Home on successful login
                navigation.navigate('Home');
            }
            // Handle successful login
        } catch (error : any) {
            console.log('Full error:', error.toJSON());
        }
    };


    const handleSubmit = () => {
        let isValid = true;
        const newErrors: { username?: string; password?: string } = {};

        if (!username) {
            newErrors.username = 'Username is required';
            isValid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);

        if (isValid) {
            InitiateLogin({ username, password });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headertext}>Hello</Text>
                <Text style={styles.headertext}>Sign in!</Text>
            </View>
            <View style={styles.formcontainer}>
                <View style={styles.form}>
                    <Text style={styles.formlabel}>Username</Text>
                    <TextInput
                        style={styles.forminput}
                        placeholder="xyz@123"
                        onChangeText={setUsername}
                        value={username}
                    />
                    {errors.username && (
                        <Text style={styles.errorText}>{errors.username}</Text>
                    )}

                    <Text style={styles.formlabel}>Password</Text>
                    <TextInput
                        secureTextEntry={true}
                        style={styles.forminput}
                        placeholder="xxxxxxxxxx"
                        onChangeText={setPassword}
                        value={password}
                    />
                    {errors.password && (
                        <Text style={styles.errorText}>{errors.password}</Text>
                    )}

                    <Text style={{ textAlign: 'right', fontSize: 20, color: "#730A11", marginBottom: 40 }}>
                        Forgot Password?
                    </Text>

                    <TouchableHighlight onPress={handleSubmit}>
                        <Text style={styles.button}>
                            Sign Up
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#730A11"
    },
    headertext: {
        fontSize: 35,
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: 'Arial'
    },
    header: {
        flex: 1,
        marginLeft: 40,
        marginTop: 60
    },
    formcontainer: {
        flex: 3.5,
        backgroundColor: '#FFF',
        width: '100%',
        height: 90,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingLeft: "10%",
        paddingTop: "25%"
    },
    form: {
        width: "90%",
        minHeight: 100,
    },
    formlabel: {
        color: "#730A11",
        fontSize: 20,
    },
    forminput: {
        borderBottomWidth: 2,
        borderBottomColor: "gray",
        height: 40,
        marginBottom: 20,
    },
    button: {
        width: "100%",
        backgroundColor: "#730A11",
        padding: 15,
        color: '#fff',
        fontSize: 15,
        borderRadius: 40,
        textAlign: 'center'
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
    }
});

export default Login;
