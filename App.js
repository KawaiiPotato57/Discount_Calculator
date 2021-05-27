import  React, { useEffect, useState } from 'react';
import {Alert,View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DataTable } from 'react-native-paper';

function record ({route, navigation }) {
  
 let data = route.params.list;
 const [getList,setList] = useState(data);

const clearRecord =(key)=>{
  data=data.filter(item=>item.key!=key)
  setList(data);
} //checks key and filters form the list


const clear =()=>{

let key=-1; 
  data=data.filter(item=>item.key===key)  //clearrecord
  setList(data);
}
  return (
<View style={styles.containerList}>
    <View style={styles.Records}>

    <DataTable>
    <DataTable.Header>

      <DataTable.Title numeric >Original</DataTable.Title>
      <DataTable.Title numeric >  Discount</DataTable.Title>
      <DataTable.Title numeric> Discounted Price</DataTable.Title>
     
    </DataTable.Header>

    
    {
    getList.map((item) => (
      <DataTable.Row>
        <DataTable.Cell numeric>
        <TouchableOpacity
        onPress={()=>clearRecord(item.key)}
        >
        <Text>Remove</Text>
        </TouchableOpacity>
        </DataTable.Cell>
        <DataTable.Cell numeric>{item.originalPrice}</DataTable.Cell>
        <DataTable.Cell numeric>{item.discPrice}</DataTable.Cell>
        <DataTable.Cell numeric>{item.price}</DataTable.Cell>

        
      </DataTable.Row>
      
    ))
  }
  </DataTable> 
  <View style={{flexDirection:'row'}}>
  <TouchableOpacity
      onPress={clear}
      style={styles.menuButtons}
      >
      <Text style={styles.saveText}>Clear List.</Text>
      </TouchableOpacity>
       <TouchableOpacity
      onPress={() => navigation.navigate('Home', {
            dataList:getList
          })
          }
      style={styles.menuButtons}
      >
      <Text style={styles.saveText}>back</Text>
      </TouchableOpacity>
      </View>
</View>
</View>
  );
}

function HomeScreen({route, navigation }) {

const [input1, setInput1] = useState("");
const [input2, setInput2] = useState("");
const [mssg, setMssg] = useState([]);
const [original, setOriginal] = useState(0);
const [discountt, setDisocunt] = useState(0);
const [save, setSave] = useState(0);
const [discountPrice, setdiscountPrice] = useState(0);
const [recordList,setrecordList] = useState([]);
const [getcounter, setCounter] = useState(0);



 if(route.params!=null){
   
 const {dataList}=route.params;

if(getcounter==0){  //checking for records

  setCounter(-1);
if(dataList.length==0){ //setting key
  let key=-12345;
  setrecordList(recordList.filter(item=>item.key==key))
}else{

for(let i=0; i<recordList.length;i++){
  let bool=0;

  for(let j=0; j<dataList.length;j++){
    if((recordList[i].originalPrice==dataList[j].originalPrice)&&(recordList[i].discPrice==dataList[j].discPrice)){
      bool+=1;
    }
}
 
if(bool==0){
  setrecordList(recordList.filter(item=>item.key!=recordList[i].key))
}
}
}
 }
 }

function discoutCalc(){
if(original === 0 ){
  setdiscountPrice("");
  setSave("");
}else{
 let dis = original * (discountt/100);
 dis=dis.toFixed(2);
 setSave(dis);
 let discount=original - dis;
 discount = discount.toFixed(2);
 setdiscountPrice(discount);
}
}

function validation(price){
  if(price<0){
    setMssg((mssg) => {
                mssg[0] = "Negative Price not allowed."
                return mssg;
            });
    setOriginal(0);
    setdiscountPrice("null");
  }else{
    setOriginal(price);
    setInput1(price);
     setMssg((mssg) => {
                mssg[0] = ""
                return mssg;
            });
  }

}

function Validation(disc){
  if(disc>100){

    setMssg((mssg) => {
                mssg[1] = "Discount cannot be greater than 100."
                return mssg;
            });
    setDisocunt(0);
  }else{
    setDisocunt(disc);
    setInput2(disc);
    setMssg((mssg) => {
                mssg[1] = ""
                return mssg;
            });
  }
}


useEffect(() =>{
  discoutCalc();
})


const savetoList = () => {

  let bool=0;
  for (let i=0; i<recordList.length;i++){
  
       if(recordList[i].originalPrice == original && recordList[i].discPrice == discountt){
          bool++;
       }
  }

  if(bool>0){
    alert("This Entry Already Exist.")
  }else{
    
    setrecordList([...recordList,{originalPrice:original,discPrice:discountt,price:discountPrice}]);
    alert("Record Saved.");
    }
    
}

 navigation.setOptions({
      headerRight: () => (
        
        <TouchableOpacity
            style={styles.menuButtons}
           onPress={() => {
            navigation.navigate('record', {
            list:recordList})
            setCounter(0);
            }
          }
      
      >
      <Text style={styles.saveText}>History</Text>
      </TouchableOpacity>
      ),
    });

  return (
     <View style={styles.container}>
      <Text  style={styles.LabelText}>Original Price</Text>
      <TextInput 
      keyboardType = 'number-pad'
      style={styles.textField}
      placeholder='Enter value:'
      value={input1}
      onChangeText={text => validation(text)}
      />
      
   
      <Text>{mssg[0]}</Text>
      <View style={{justifyContent:'flex-start'}}>
      <Text style={styles.LabelText}>Disount </Text>
      <TextInput 
      style={styles.textField}
      keyboardType = 'number-pad'
      placeholder='Enter value'
      maxLength={3}
      value={input2}
      onChangeText={text => Validation(text)}
      />
      </View>

      <Text style={{fontSize:15, color:'red', margin:5}}>
      {mssg[1]}
      </Text>

      <View>
      <View style={styles.priceStyle}>
      <Text style={styles.discountedPText}>You Save: </Text>
      <Text style={{ fontSize:13, marginTop:15,paddingRight:10}}>{save}</Text>
      </View>
      <View style={styles.priceStyle}>

      <Text style={styles.discountedPText}>Discounted Price:</Text>
     
      <Text style={{ fontSize:12, marginTop:30,paddingRight:10}}> {discountPrice}</Text>
      </View>
      </View>
     
       <TouchableOpacity

      onPress={savetoList}
      disabled={(discountt==0) && (original==0)}
      style={styles.menuButtons}
      
      >
      <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
         <Stack.Screen
         style={styles.menuButtons}
          name="Home"
          component={HomeScreen}
          options={({ navigation, route }) => ({
             title:'Discount Calculator',
             })}
        />
        <Stack.Screen
       style={styles.menuButtons}
          name="record"
          component={record}
          options={({ navigation, route }) => ({
           title:'Saved Records',
           headerLeft:null
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
   flex: 1,
    backgroundColor: 'white',
  //  alignItems: 'center',
    justifyContent: 'center',
    paddingLeft:20,
   
  },
  containerList: {
   flex: 1,
    backgroundColor: 'white',
     alignItems: 'top',
    //justifyContent: 'center',
    paddingLeft:20,
   
  },
  textField: {
    padding: 5,
    margin: 10,
    width: '50%',
    borderWidth: 3,
    borderColor: 'orange',
    borderRadius:10,  
  },
  
  LabelText: {
    fontSize:14,
    fontWeight:'bold',
    color:'gray',
  },
  priceStyle:{
      padding: 5,
    margin: 10,
    
    borderWidth: 3,
    borderColor: 'purple',
    borderRadius:10, 
   
    flexDirection:'row',
    marginTop:10,
    borderWidth:2,
    width:'75%',
    
    
  },
   menuButtons: {
    backgroundColor: 'brown',
    width: 100,
    paddingVertical: 15,
    margin: 10,
    borderColor: 'lavender',
    borderRadius: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 3,
    borderBottomColor: 'lavender',
  },
  discountedPText :{
    padding:20,
    fontSize:14,
    fontWeight:'bold',
    color:'#434747'
  },
  
  buttonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
   saveText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
});



export default App;