import React from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
import { apiurl } from '../Screens/Contant';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const windowHeight = screenHeight - 300;
const windowWidth = screenWidth - 40;

const Preview = () => {
    const route = useRoute();
    const { payload } = route.params;
    console.log(payload);

    const navigation: any = useNavigation();

    let totalflats = parseInt(payload.totalflatsrowhouse);

    let totalshops = 0;
    if (totalflats != null) {
        totalshops = parseInt(payload.totalshops);
    }

    // Create the table rows from the payload
    const serviceNameColumn = payload.selectedservices.map(service => `
    <tr>
      <td>${service.servicename}</td>
      <td>NA</td>
      <td>${service.rate}</td>
      <td>${service.rate * (totalflats + totalshops)}</td>
    </tr>
  `).join('');

    const iterativeparagraph = payload.selectedparagraphs.filter((item) => item.name != "closingparagraphs" && item.type == 1);
    console.log(iterativeparagraph);

    const closingparagrapharray = payload.selectedparagraphs.filter((item) => item.name == "closingparagraphs" && item.type == 1);

    let ClosingParagraphs = "";
    if (closingparagrapharray.length > 0) {
        const closingParagraphData = closingparagrapharray[0].data;

        // Using map() to create the HTML
        ClosingParagraphs = closingParagraphData.map(element => `
        <p>${element}</p><br><br>
    `).join('');
    }


    // Step 1: Sort paragraphs based on sno
    const sortedParagraphs = iterativeparagraph.sort((a, b) => a.sno - b.sno);

    const length = sortedParagraphs.length;

    console.log(length);




    // Step 2: Slice to include only the first 4
    const FirstParagraphs = sortedParagraphs.slice(0, 4);

    const SecondParagraphs = sortedParagraphs.slice(4, 10);

    let ThirdParagraphs = [];
    if (length > 10) {
        ThirdParagraphs = sortedParagraphs.slice(10, length);
    }




    // Step 3: Map to generate HTML with incremental sno
    const FirstPageParagraphs = FirstParagraphs.map((paragraph, index) => `
    <p style="font-size: 1.1rem; text-align: justify;"><strong>${index + 1}.</strong>&nbsp;${paragraph.data}</p><br>
`).join('');

    const SecondPageParagraphs = SecondParagraphs.map((paragraph, index) => `
<p style="font-size: 1.1rem;  white-space: ${paragraph.autoformat === false ? 'pre' : 'normal'};">
<strong>${index + 5}.</strong>&nbsp;${paragraph.data}
</p><br>
`).join('');

    let ThirdPageParagraphs = '';
    if (length > 10) {
        ThirdPageParagraphs = ThirdParagraphs.map((paragraph, index) => `
        <p style="font-size: 1.1rem; text-align: justify;"><strong>${index + 11}.</strong>&nbsp;${paragraph.data}</p><br>
        `).join('');
    }

    const subjectParagraphobject = payload.selectedparagraphs.filter((item) => item.name == "subject");

    const welcomeParagraphobject = payload.selectedparagraphs.filter((item) => item.name == "welcome_paragraph");

    const subjectParagraph = subjectParagraphobject[0].data;

    const welcomeParagraph = welcomeParagraphobject[0].data;







    // Check if there's a paragraph with a `name` of 'table'
    const containsTableParagraph = payload.selectedparagraphs.some(paragraph => paragraph.name === 'table');

    // Generate the table HTML if `containsTableParagraph` is true
    const tableHTML = containsTableParagraph ? `
        <table class="service-table">
            <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Cost (in Rupees)</th>
                <th>Total</th>
            </tr>
            ${serviceNameColumn}
        </table>
    ` : '';

    const htmlContent = `
<html>

<head>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
            overflow-y: scroll;
            width: 100%;
        }

        .service-table {
            width: 100%;
            border-collapse: collapse;
        }

        tr, td, th {
            border: 2px solid black;
            padding: 2px;
            font-size: 1.1rem;
            
        }

        .pages {
            width: 80vw;
            height: 100vh;
            max-width: 210mm;
            max-height: 297mm;
            box-sizing: border-box;
            border: 1px solid #000;
            margin: auto;
            margin-bottom: 20px;
            margin-top: 2vh;
        }

        .pagecontainer {
            width: 90%;
            background-color: #fff;
            margin: auto;
        }

        .pageheader {
            width: 100%;
            height: 6vh;
            background-color: #fff;
            border-bottom: 5px solid #730A11;
            box-sizing: border-box;
        }

        .topheader {
            width: 100%;
            height: 3vh;
            border-bottom: 2px solid pink;
        }

        .bottomheader {
            width: 100%;
            height: 3vh;
        }

        .companyname {
            padding-top: 1vh;
            margin-bottom: 1vh;
            font-size: 1.5rem;
            text-align: center;
            color: red;
            font-weight: bold;
        }

        .companyaddress {
            font-weight: bold;
            text-align: center;
            padding-top: 0.5vh;
            font-size: 0.9rem;
        }

        .email {
            text-align: center;
            font-size: 0.9rem;
        }

        .pagebody {
            padding: 3%;
            font-size: 1rem;
        }
    </style>
    <script>
        function insertCurrentDate() {
            const currentDate = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = currentDate.toLocaleDateString(undefined, options);

            document.querySelectorAll('.current-date').forEach(el => {
                el.textContent = formattedDate;
            });
        }

        window.onload = insertCurrentDate;
    </script>
</head>

<body>
    <div class="pages">
        <div class="pagecontainer">
            <div class="pageheader">
                <div class="topheader">
                    <p class="companyname">${payload.companyname}</p>
                </div>
                <div class="bottomheader">
                    <p class="companyaddress">
                        ${payload.companyaddress}
                    </p>
                     <div style="display: flex; flex-direction: row; justify-content: center; gap: 10px;">
                        <p class="">${payload.cin}</p> 
                    <p class="">Email - <a href="info@accwizz.com">${payload.email}</a></p>
                    </div>

                    
                </div>
            </div>
            <div class="pagebody">
                <p style="font-size: 2rem; text-align: center; font-weight: bold;">Quotation</p>
                <p style="font-size: 1.2rem; text-align: end; font-weight: bold;">Date - <span class="current-date"></span></p><br>
                <p>To,<br>Management committee,<br>${payload.societyname},<br>${payload.Name}.</p><br>
                <p style="text-indent: 2em;">Subject:- ${subjectParagraph}</p><br>
                <p>Respected Chairman/ Secretary/ Treasurer</p>
                <p style="text-align: justify;">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${welcomeParagraph}</p><br><br>
                 <u><p style="font-weight: bold;">Details of Assignment</p></u><br>
                ${FirstPageParagraphs}

                ${tableHTML} <!-- Only include table if 'table' paragraph is present -->
            </div>
        </div>
    </div>
    <div class="pages">
        <div class="pagecontainer">
            <div class="pageheader">
                <div class="topheader">
                    <p class="companyname">${payload.companyname}</p>

                </div>
                <div class="bottomheader">
                    <p class="companyaddress">
                    ${payload.companyaddress}
                    </p>
                    <div style="display: flex; flex-direction: row; justify-content: center; gap: 10px;">
                        <p class="">${payload.cin}</p> 
                    <p class="">Email - <a href="info@accwizz.com">${payload.email}</a></p>
                    </div>
                </div>
            </div>
            <div class="pagebody" style="padding-top : 3vh">
                ${SecondPageParagraphs}
            </div>

        </div>
       
    </div>
    <div class="pages">
        <div class="pagecontainer">
            <div class="pageheader">
                <div class="topheader">
                    <p class="companyname">${payload.companyname}</p>

                </div>
                <div class="bottomheader">
                    <p class="companyaddress">
                    ${payload.companyaddress}
                    </p>
                    <div style="display: flex; flex-direction: row; justify-content: center; gap: 10px;">
                        <p class="">${payload.cin}</p> 
                    <p class="">Email - <a href="info@accwizz.com">${payload.email}</a></p>
                    </div>
                </div>
            </div>
            <div class="pagebody" style="padding-top : 3vh">
                ${length > 10 ? ThirdPageParagraphs : ''}
                ${ClosingParagraphs}<br>
                <p style="text-align: center; color: #730A11;">${payload.companyname}</p>
                
             


                
            </div>

        </div>
       
    </div>
</body>
</html>
  `;

    type generateresponse = {
        data: {
            message: string,
            path?: string,
            status: boolean
        }

    }

    const generatepdf = async () => {
        try {
          const response: generateresponse = await axios.post(`${apiurl}generatepdf`, payload);
      
          console.log(response.data);
      
          if (response.data.status === true) {
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: response.data.message,
              visibilityTime : 4000,
              autoHide: false,
              position : 'bottom'
            });
      
            setTimeout(() => {
              navigation.navigate('Dashboard');
            }, 4000); // 2 seconds delay
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: response.data.message
            });
          }
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Network Error',
            text2: 'Something went wrong. Please try again later.'
          });
          console.error(error);
        }
      };
      
    return (
        <View style={styles.container}>
            <Toast ref={(ref) => Toast.setRef(ref)} />
            <WebView
                originWhitelist={['*']}
                source={{ html: htmlContent }}
                style={styles.webview}
                javaScriptEnabled={true}
                scalesPageToFit={true}
                automaticallyAdjustContentInsets={true}
                nestedScrollEnabled={true}
            />

            <TouchableOpacity
                style={styles.button}
                activeOpacity={0.6} // Reduce opacity when pressed (0.0 to 1.0)
                onPress={generatepdf} // Move this to TouchableOpacity for better accessibility
            >
                <Text style={{ textAlign: 'center', color: '#fff', margin: 'auto' }}>Press Here</Text>
            </TouchableOpacity>



        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 0.98,
        justifyContent: 'center',
        alignItems: 'center',

    },
    webview: {
        width: windowWidth,
        height: windowHeight - 200,
        marginTop: 20,
        marginBottom: 80,
        borderRadius: 10,
        borderBlockColor: 'yellow',
       
    },
    button: {
        backgroundColor: '#730A11',
        width: "25%",
        height: "4%",
        borderRadius: 10
    }
});

export default Preview;
