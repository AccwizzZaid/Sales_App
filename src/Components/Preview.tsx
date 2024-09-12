import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const windowHeight = screenHeight - 300;
const windowWidth = screenWidth - 40;

const Preview = () => {
  const route = useRoute();
  const { payload } = route.params;
  console.log(payload);

  // Create the table rows from the payload
  const serviceRows = payload.selectedservices.map(service => `
    <tr>
      <td>${service.servicename}</td>
      <td>${service.description || ''}</td>
      <td>${service.cost || ''}</td>
      <td>${service.total || ''}</td>
    </tr>
  `).join(''); // Join to avoid commas between rows

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

        .service-table{
            width: 100%;
            border-collapse: collapse;
        }

        tr,td,th {
            border: 2px solid black;
            padding: 2px;
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
            display: flex;
            justify-content: center;
            margin-top: 2vh;
        }

        .pagecontainer {
            width: 90%;
            background-color: #fff;
        }

        .pageheader {
            width: 100%;
            height: 7vh;
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
            height: 4vh;
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
            margin-bottom: 0.5vh;
        }

        .pagebody {
            padding: 3%;
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

                <table class="service-table">
                    <tr>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Cost (in Rupees)</th>
                        <th>Total</th>
                    </tr>
                    ${serviceRows} <!-- Dynamically populated rows here -->
                </table>
            </div>
        </div>
    </div>
</body>
</html>
  `;

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
});

export default Preview;
