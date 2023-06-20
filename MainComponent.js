import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Input, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';


const App = () => {
  const [gridData, setGridData] = useState([]);
  const rows = 10;
  const columns = 5;

  const handleInputChange = (rowIndex, colIndex, value) => {
    const updatedData = [...gridData];
    updatedData[rowIndex][colIndex] = value;
    setGridData(updatedData);
    AsyncStorage.setItem('gridData', JSON.stringify(updatedData));
  };
  

  const renderGrid = () => {
    const grid = [];

    for (let i = 0; i < rows; i++) {
      const row = [];

      for (let j = 0; j < columns; j++) {
        const value = gridData[i]?.[j] || '';
        row.push(
          <Input
            key={`${i}-${j}`}
            value={value}
            onChangeText={(text) => handleInputChange(i, j, text)}
            containerStyle={styles.inputContainer}
          />
        );
      }

      grid.push(
        <View key={i} style={styles.rowContainer}>
          {row}
        </View>
      );
    }

    return grid;
  };

  const handleDownload = async () => {
    try {
      const data = [];
      const headers = [];
  
      for (let i = 0; i < columns; i++) {
        headers.push(gridData[0]?.[i] || '');
      }
  
      data.push(headers);
  
      for (let i = 1; i < rows; i++) {
        const row = [];
  
        for (let j = 0; j < columns; j++) {
          row.push(gridData[i]?.[j] || '');
        }
  
        data.push(row);
      }
  
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, {
        type: 'base64',
        bookType: 'xlsx',
      });
      const uri = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${excelBuffer}`;
  
      // Save or download the file using the uri
  
    } catch (error) {
      console.error('Error generating Excel file:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {renderGrid()}
      </ScrollView>
      <Button
        title="Download"
        onPress={handleDownload}
        containerStyle={styles.buttonContainer}
      />
    </View>
  );
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('gridData');
        if (savedData) {
          setGridData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
      }
    };
  
    fetchData();
  }, []);
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  scrollView: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
    marginRight: 5,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

export default App;
