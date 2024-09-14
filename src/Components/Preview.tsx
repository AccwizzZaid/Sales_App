import React from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
import { apiurl } from '../Screens/Contant';
import axios from 'axios';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const windowHeight = screenHeight - 300;
const windowWidth = screenWidth - 40;

const Preview = () => {
    const route = useRoute();
    const { payload } = route.params;
    console.log(payload);

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

    // Step 1: Sort paragraphs based on sno
    const sortedParagraphs = payload.selectedparagraphs.sort((a, b) => a.sno - b.sno);

    // Step 2: Slice to include only the first 4
    const FirstParagraphs = sortedParagraphs.slice(0, 4);

    const SecondParagraphs = sortedParagraphs.slice(4, 8);

    const ThirdParagraphs = sortedParagraphs.slice(8, 12);



    // Step 3: Map to generate HTML with incremental sno
    const FirstPageParagraphs = FirstParagraphs.map((paragraph, index) => `
    <p style="font-size: 1.1rem; text-align: justify;"><strong>${index + 1}.</strong>&nbsp;${paragraph.data}</p><br>
`).join('');

    const SecondPageParagraphs = SecondParagraphs.map((paragraph, index) => `
    <p style="font-size: 1.1rem; text-align: justify;"><strong>${index + 5}.</strong>&nbsp;${paragraph.data}</p><br>
`).join('');

    const ThirdPageParagraphs = ThirdParagraphs.map((paragraph, index) => `
<p style="font-size: 1.1rem; text-align: justify;"><strong>${index + 9}.</strong>&nbsp;${paragraph.data}</p><br>
`).join('');







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
                    <p class="companyname">ACCWIZZ BUSINESS SOLUTIONS PRIVATE LIMITED</p>
                </div>
                <div class="bottomheader">
                    <p class="companyaddress">
                        A-204, Bhaskar Commercial Complex, Mayekar Wadi, Virat Nagar, Near Platform no. 1 Virar west – 401303
                    </p>
                    <p class="email">Email- <a href="info@accwizz.com">info@accwizz.com</a></p>
                </div>
            </div>
            <div class="pagebody">
                <p style="font-size: 2rem; text-align: center; font-weight: bold;">Quotation</p>
                <p style="font-size: 1.2rem; text-align: end; font-weight: bold;">Date - <span class="current-date"></span></p><br>
                <p>To,<br>Management committee,<br>Viva Raj Maitry CHSL,<br>Virar(W).</p><br>
                <p style="text-indent: 2em;">Subject:- Quotation for Accounting & Facility Management Services of your Society premises.</p><br>
                <p>Respected Chairman/ Secretary/ Treasurer</p>
                <p style="text-align: justify;">
                    Thank you for considering Accwizz Business Solutions Private Limited for your accounting management and society management needs. We are pleased to provide you with a quotation for the services we offer, tailored to meet the requirements of your society.
                </p><br><br>
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
                    <p class="companyname">ACCWIZZ BUSINESS SOLUTIONS PRIVATE LIMITED</p>

                </div>
                <div class="bottomheader">
                    <p class="companyaddress">
                        A-204, Bhaskar Commercial Complex, Mayekar Wadi, Virat Nagar, Near Platform no. 1 Virar west –
                        401303
                    </p>
                    <p class="email">Email- <a href="info@accwizz.com">info@accwizz.com</a></p>
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
                    <p class="companyname">ACCWIZZ BUSINESS SOLUTIONS PRIVATE LIMITED</p>

                </div>
                <div class="bottomheader">
                    <p class="companyaddress">
                        A-204, Bhaskar Commercial Complex, Mayekar Wadi, Virat Nagar, Near Platform no. 1 Virar west –
                        401303
                    </p>
                    <p class="email">Email- <a href="info@accwizz.com">info@accwizz.com</a></p>
                </div>
            </div>
            <div class="pagebody" style="padding-top : 3vh">
                ${ThirdPageParagraphs}
            </div>

        </div>
       
    </div>
</body>
</html>
  `;

    const generatepdf = async() => {
        const response = await axios.post(`${apiurl}generatepdf`,payload);

    }

    return (
        <View style={styles.container}>
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

            >
                <Text onPress={generatepdf}>Press Here</Text>
            </TouchableOpacity>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    webview: {
        width: windowWidth,
        height: windowHeight,
        marginTop: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "red",
    },
    button: {
        backgroundColor: 'green'
    }
});

export default Preview;
