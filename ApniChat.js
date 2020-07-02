import React, {Component} from 'react';
import { StyleSheet,Text,Platform,TextInput,FlatList, View,Image ,Alert,AsyncStorage,Dimensions ,TouchableOpacity,ActivityIndicator,SafeAreaView} from 'react-native';
const window = Dimensions.get('window');
import Video from 'react-native-video';
import NetInfo from "@react-native-community/netinfo";

import Button from 'react-native-button';
const GLOBAL = require('./Global');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};

export default class ApniChat extends Component {
    state = {
        text: '',
        passwordtext :'',
        isSecure : true,
        username: '',
        password: '',
        status :true,
        ipAdd : '',
        loading:'',
        states:'',
        results: [],
        newsHeading :['Application','Novel','Stock',"Topic","Election"],
        selected :[],
        author :[],
        tag :[],

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

    componentDidMount() {
        this.props.navigation.addListener('willFocus',this._handleStateChange);

    }
    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
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
    _handleCategorySelect = (item,index) => {

        var array = this.state.selected
        var c = array.push(item.item)


        this.setState({selected:c})



    }

    getNewsUpdate(){
//      alert(GLOBAL.user_id)
        const url = GLOBAL.BASE_URL +'recent_activity_history'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.user_id,
                types : "chat"

            }),
        }).then((response) => response.json())
            .then((responseJson) => {
//                alert(JSON.stringify(responseJson))



                if (responseJson.status == true) {
                //    alert(JSON.stringify(responseJson))
                   // this.getNewsUpdate()
                    this.setState({author:responseJson.history})
                    //
                    // this.setState({tag:responseJson.tags_list})



                }else {
                    alert('No Data Found')
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }

    author = (item,index) => {
//      alert(JSON.stringify(item))
        //    alert('sender name ' + item.sender_name + 'rec_name '+ item.receiver_name)
        GLOBAL.another =  item.reciever_id;
//        GLOBAL.anotherUsername = item.receiver_name;

        if (GLOBAL.user_id == GLOBAL.another ){
            GLOBAL.another = item.sender_id
            GLOBAL.anotherUsername = item.sender_name;
        }else{
            GLOBAL.anotherUsername = item.receiver_name;
        }
        //        alert(GLOBAL.another + ' ' + GLOBAL.user_id)

        //
        // if (item.type == "news_chat"){
        //     GLOBAL.newsid = item.news_id
        //     this.props.navigation.navigate('NewsDetail')
        // } else if( item.type == "normal") {
        if( item.type == "normal" || item.type == "news_chat") {

            GLOBAL.newsWhich = "2";
            GLOBAL.guid ="0";


            const url = GLOBAL.BASE_URL +  'create_chat_group'


            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id : GLOBAL.user_id,
                    other_id :GLOBAL.another

                }),
            }).then((response) => response.json())
                .then((responseJson) => {



                    if (responseJson.status == true) {
                        //                            alert(JSON.stringify(responseJson))
                        GLOBAL.muid= responseJson.chat_group_id
//                              alert('chat_group_id' + GLOBAL.muid)
                        this.props.navigation.navigate('Chat')
                        //is_follow
                        //              this.setState({is_follow:responseJson.user_detail.is_follow})

                        //            this.setState({results:responseJson.user_detail})

                    }else {
                        alert('No News Found')
                    }
                })
                .catch((error) => {
                    console.error(error);
                });

        }else{
            GLOBAL.muid = 'g' + item.group_id

            GLOBAL.groupId = item.group_id
            GLOBAL.groupName = item.group_name
            GLOBAL.anotherUsername = item.group_name
            GLOBAL.newsWhich = "2";
            GLOBAL.guid = item.group_id
            this.props.navigation.navigate('Chat')
        }

    }
    authors = (item,index) => {
        GLOBAL.author_id = ''
        GLOBAL.type = ''
        GLOBAL.keyword = item
        GLOBAL.author = item
        this.props.navigation.navigate('DiscoverDetail')

    }

    _renderItemCategs = (item,index)=>{
//        alert(JSON.stringify(item.item.is_read))

        var k ;
        //receiver_image
        k = item.item.sender_image

        return (
            <TouchableOpacity
                onPress={() => this.author(item.item,index)}>
                {item.item.type == 'normal' && (
                    <View style = {{margin :10 ,backgroundColor:'white',width:window.width-20,height:'auto',
                        flexDirection:'row'}}>




                        <Image style = {{width :40 ,height : 40 ,padding:4,borderRadius:20,margin:10 }}
                               source={{uri : k}}/>

                        <View style = {{flexDirection:'column',width:window.width-40,marginLeft:10,marginTop:10,marginBottom:5}}>
                            <Text style = {{fontSize:18,fontWeight:'bold', width:'85%', height:'auto'}}>
                                {item.item.sender_name}
                            </Text>

                            <Text style = {{color:'#cdcdcd', fontSize:13, width:'80%'}}>
                                {item.item.message}
                            </Text>

                        </View>
                    </View>
                )}

                {item.item.type == 'group_post' && (
                    <View style = {{margin :10 ,backgroundColor:'white',width:window.width-20,height:'auto',
                        flexDirection:'row'}}>
                        <Image style = {{width :40 ,height : 40 ,padding:4,borderRadius:20,margin:10 }}
                               source={{uri :item.item.image}}/>

                        <View style = {{flexDirection:'column',width:window.width-40,marginLeft:10,marginTop:10,marginBottom:5}}>
                            <Text style = {{fontSize:18,fontWeight:'bold', width:'85%', height:'auto'}}>
                                {item.item.group_name}
                            </Text>

                            <Text style = {{color:'#cdcdcd', fontSize:13, width:'80%'}}>
                                {item.item.comment}
                            </Text>

                        </View>
                    </View>
                )}


                {item.item.type == "news_chat" && (
                    <View style = {{margin :10 ,backgroundColor:'white',width:window.width-20,height:'auto',
                        flexDirection:'row'}}>
                        <Image style = {{width :40 ,height : 40 ,padding:4,borderRadius:20,margin:10 }}
                               source={{uri :item.item.image}}/>

                        <View style = {{flexDirection:'column',width:window.width-40,marginLeft:10,marginTop:10,marginBottom:5, marginRight:10}}>
                            <Text style = {{fontSize:18,fontWeight:'bold', width:'85%', height:'auto'}}>
                                {item.item.news_title}
                            </Text>

                            <Text style = {{color:'#cdcdcd', fontSize:13, width:'80%'}}>
                                {item.item.message}
                            </Text>
                        </View>
                    </View>
                )}

                {item.item.is_read == 0 && (
                    <View style={{backgroundColor:'red', width:30, height:30, borderRadius:15, position:'absolute', right:10,justifyContent:'center', alignSelf:'center'}}>
                        <Text style = {{color:'white', fontSize:13, width:'100%', alignSelf:'center', textAlign:'center'}}>
                            {item.item.total_unread_messages}
                        </Text>

                    </View>


                )}



                <View style={{height:1, backgroundColor:'#efefef', width:window.width-20,marginLeft:10,marginTop:-10}}>
                </View>


            </TouchableOpacity>


        )
    }



    _handleStateChange = state => {
        //alert('hoho')
//       this.getMoviesFromApiAsync()
        this.getNewsUpdate()

    };

    // componentDidMount(){
    //     this.getNewsUpdate()
    // }


    render() {


        return (
            <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
                <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
                    <View style = {{flexDirection:'row',width:window.width,justifyContent:'space-between',marginTop:30}}>


                        <TouchableOpacity style = {{width :30 ,height : 30, zIndex:1 }}
                                          onPress={() => this.props.navigation.goBack()}>
                            <Image style = {{width :20 ,height : 20 ,marginLeft: 10,resizeMode: 'contain'}}
                                   source={require('./arrow.png')}/>

                        </TouchableOpacity>
                    </View>

                    <Text style = {{fontSize: 34,color:'black',fontWeight: 'bold',margin:10, width:'80%'}}>
                        Recent Chats
                    </Text>

                    <View style = {{width:window.width,height:'auto'}}>

                        {GLOBAL.user_id == '' &&(
                            <Text style = {{fontSize: 18,color:'black',fontWeight: 'bold',margin:10, width:'80%', alignSelf:'center', textAlign:'center'}}>
                                Login First to View Recent Chats
                            </Text>

                        )}

                        {GLOBAL.user_id!='' &&(

                            <FlatList style= {{marginTop:10, marginBottom: 10}}
                                      data={this.state.author}


                                      showsHorizontalScrollIndicator={false}
                                      keyExtractor = { (item, index) => index.toString() }
                                      extraData={this.state}
                                      renderItem={this._renderItemCategs}
                            />


                        )}
                    </View>

                </KeyboardAwareScrollView>
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
    },
    video: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
})
