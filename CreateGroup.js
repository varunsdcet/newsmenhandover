import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Platform,
    TextInput,
    View,
    Image,
    Alert,
    AsyncStorage,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    FlatList
} from 'react-native';
const window = Dimensions.get('window');
const GLOBAL = require('./Global');
import Button from 'react-native-button';
import ImagePicker from 'react-native-image-picker';
const options = {
    title: 'Select Group Icon',
    maxWidth : 500,
    maxHeight : 500,
    storageOptions: {
        skipBackup: true,
        loading :false,
        text:'',
        path: 'images',
    },
    allowsEditing:true
};
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};
export default class CreateGroup extends Component {
    state = {
        text: '',
        passwordtext :'',
        isSecure : true,
        username: '',
        password: '',
        status :'',
        ipAdd : '',
        name:'',
        description:'',imageget:0,

        newsHeading :[],
        loading:'',
        states:'',
        results: [],
        avatarSource:'',

    };

    static navigationOptions = ({ navigation }) => {
        return {
            header: () => null,
            animations: {
                setRoot: {
                    waitForRender: false
                }
            }
        }
    }


    showLoading() {
        this.setState({loading: true})
    }
    changeImage=()=>{
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
//                alert(source.uri)
                GLOBAL.groupImage = response.uri
                this.setState({
                    avatarSource: source,
                    imageget:1
                });
            }
        });

    }

    _renderItemCategs = (item,index)=>{
//alert(JSON.stringify(item))

        return (

            <View>

                <TouchableOpacity
                    onPress={() => this.delete(item.index)}>
                    <View style = {{marginLeft :10 ,marginRight:10,marginTop:1,height:'auto'
                    }}>
                        <Image style = {{width :60 ,height : 60,borderRadius:30  }}
                               source={{uri :item.item.image}}/>

                        <Image style = {{width :20 ,height : 20 ,marginLeft:40,marginTop:-20 }}
                               source={require('./cross.png')}/>

                        <Text style={{textAlign:'center', width:60, height:'auto'}}>{item.item.user_name}</Text>
                    </View>

                </TouchableOpacity>

            </View>

        )
    }

    _handleStateChange = state => {
        this.setState({newsHeading:GLOBAL.array})

    };
    buttonClickListener = () =>{
        var memberid = "";
        for (let i = 0; i< GLOBAL.array.length ;i++){
            memberid = memberid + GLOBAL.array[i]["user_id"] + '|'
        }

        if(this.state.imageget == 0){
            alert('Please Select Group Icon')
        }
        else if (this.state.name == ''){
            alert('Please Enter Name')
        } else if (this.state.description == ''){
            alert('Please Enter Description')
        }


        else {
            this.showLoading()
            const url = GLOBAL.BASE_URL +  'create_group'
            const data = new FormData();
            data.append('user_id', GLOBAL.user_id);
            data.append('title', this.state.name);
            data.append('description', this.state.description);
            data.append('flag',1);
            data.append('member_ids', memberid);
            // you can append anyone.
            data.append('image', {
                uri: GLOBAL.groupImage,
                type: 'image/jpeg', // or photo.type
                name: 'image.png'
            });
//            alert(JSON.stringify(data))
            fetch(url, {
                method: 'post',
                body: data,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }

            }).then((response) => response.json())
                .then((responseJson) => {
                    this.hideLoading()
                    //         alert(JSON.stringify(responseJson))
                    const { navigation } = this.props;
                    navigation.goBack();





                });
        }

    }
    delete = (index) => {

        let { newsHeading } = this.state;
        let targetPost = newsHeading[index];

        // Flip the 'liked' property of the targetPost


        var array = [...this.state.newsHeading]; // make a separate copy of the array

        if (index !== -1) {
            array.splice(index, 1);
            this.setState({newsHeading: array});
            GLOBAL.array = array
        }

    }

    _renderItemCateg = (item,index)=>{


        return (

            <View>
                <TouchableOpacity
                    onPress={() => this.delete(item.index)}>

                    <View style = {{marginLeft :10 ,marginRight:10,marginTop:2, marginBottom:20,width:100,
                        backgroundColor:'white',padding:5}}>
                        <Image style = {{width :80 ,height : 80 ,padding:12,margin:5 ,borderRadius:40 }}
                               source={require('./splash.png')}/>
                        <Text style = {{fontSize: 16,marginBottom:2,fontWeight:'bold',alignSelf:'center'}}>
                            {item.item}
                        </Text>

                    </View>
                </TouchableOpacity>



            </View>

        )
    }

    componentWillMount() {
        this.setState({newsHeading:GLOBAL.array})
      // v
    }

    componentWillUnmount() {
      //   NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }

    handleConnectionChange = (isConnected) => {

        this.setState({ status: isConnected });
        if (this.state.status == false){
            alert('You are not connected to Internet')
        }
        console.log(`is connected: ${this.state.status}`);
    }



    hideLoading() {
        this.setState({loading: false})
    }

    componentDidMount(){
        this.props.navigation.addListener('willFocus',this._handleStateChange);
        this.setState({newsHeading:GLOBAL.array})
    }


    render() {
        if(this.state.loading){
            return(
                <View style={styles.container}>



                    <ActivityIndicator style = {styles.loading}
                                       size="small" color='#c13e44' />
                </View>
            )
        }


        return (
            <SafeAreaView>
            <View>

                <Image style = {{width :window.width ,height : window.height}}
                       source={require('./background.png')}/>
                <View style={{marginTop:-window.height,width:window.width,height:window.height}}>
                    <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>

                        <View style = {{flexDirection:'row',width:window.width,marginTop:50}}>

                            <TouchableOpacity style = {{width :30 ,height : 30 }}
                                              onPress={() => this.props.navigation.goBack()}>
                                <Image style = {{width :20 ,height : 20 ,marginLeft: 20,resizeMode: 'contain'}}
                                       source={require('./arrow.png')}/>

                            </TouchableOpacity>

                            <Text style = {{marginLeft:22,fontSize: 20,color:'#c53b41',fontWeight: 'bold',marginTop:-2}}>
                                Create Group
                            </Text>






                        </View>




                        <View style = {{flexDirection:'row',width:window.width,marginTop:40}}>
                            <TouchableOpacity
                                onPress={() => this.changeImage()}>

                                {this.state.imageget != 0 && (

                                    <Image style = {{width :80 ,height : 80 ,marginLeft: 20,borderRadius:40}}
                                           source={this.state.avatarSource} />
                                )}
                                {this.state.imageget == 0 && (

                                    <Image style = {{width :80 ,height : 80 ,marginLeft: 20,resizeMode: 'contain'}}
                                           source={require('./group.png')}/>
                                )}

                            </TouchableOpacity>

                            <Text style = {{marginLeft:10,fontSize: 20,color:'grey',marginTop:25}}>
                                Add Group Icon
                            </Text>




                        </View>


                        <TextInput
                            style={{ height: 50, borderColor: 'gray',fontSize:20, borderBottomWidth: 1, marginTop:60 ,marginBottom: 20 ,marginLeft:20,width:window.width -40,color:'black' }}
                            // Adding hint in TextInput using Placeholder option.
                            placeholder="Group Title"
                            placeholderTextColor = 'black'
                            // Making the Under line Transparent.
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => this.setState({name:text})}
                        />

                        <TextInput
                            style={{ height: 50, borderColor: 'gray',fontSize:20, borderBottomWidth: 1, marginTop:0 ,marginBottom: 20 ,marginLeft:20,width:window.width -40,color:'black' }}
                            // Adding hint in TextInput using Placeholder option.
                            placeholder="Group Description"
                            placeholderTextColor = 'black'
                            // Making the Under line Transparent.
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => this.setState({description:text})}
                        />

                        <Text style = {{fontSize: 20,fontWeight: 'bold',margin:10,marginLeft:20,color:'grey'}}>
                            Add Members
                        </Text>


                        <View style = {{flexDirection:'row',margin:20}}>
                            <TouchableOpacity style = {{width :60 ,height : 60,marginLeft: 10,zIndex:1 }}
                                              onPress={() => this.props.navigation.navigate('AddMember')}>
                                <Image style = {{width :60 ,height : 60 ,resizeMode: 'contain'}}
                                       source={require('./create.png')}/>
                            </TouchableOpacity>

                            <FlatList style= {{flexGrow:0,marginLeft:60}}
                                      data={this.state.newsHeading}

                                      horizontal
                                      showsHorizontalScrollIndicator={false}
                                      keyExtractor = { (item, index) => index.toString() }
                                      extraData={this.state}
                                      renderItem={this._renderItemCategs}


                            />

                        </View>





                        <Button
                            style={{ fontSize: 20, color: 'white' }}
                            containerStyle={{ marginTop:20,marginLeft:15,width:window.width-30,padding: 10, height: 45, overflow: 'hidden', borderRadius: 20, backgroundColor: '#c13e44',margin:15}}

                            onPress={this.buttonClickListener}
                        >
                            SUBMIT
                        </Button>





                    </KeyboardAwareScrollView>

                </View>

            </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
    },
    loading: {
        position: 'absolute',
        left: window.width/2 - 30,

        top: window.height/2,

        opacity: 0.5,

        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,

    },
    slide1: {

        marginLeft : 50,

        width: window.width - 50,
        height:300,
        resizeMode:'contain',
        marginTop : window.height/2 - 200


    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    }
})
