/*+ ----------------------------------------------------------------------------+
|     TIUN client example for NodeJS
|     Senotrusov Alexey, 2016
|     $Revision: 1.00 $
|     $Date: 2016/04/10 11:49:37 $
|     $Author: Saper, created by Votak (votak.org)
+----------------------------------------------------------------------------+*/
var net=require("net");
var split = require('split');
var PORT = '1234';
var HOST = '192.168.2.106';
var SECRET = '1234';
var client= new net.Socket();

client.connect(PORT, HOST, function(){
    console.log("Client Connected");
    //In the beginning of the session need to send a secret word
    client.write(SECRET+'\r\n');
    //Get help
    client.write('cmdlist\r\n');
    //Get sms last
    //client.write('getsmslast 1 inbox\r\n');  //retrieve last CNT sms type TYPE (draft, failed, inbox, outbox, queued, sent), with out CNT return last sms 
    //Get sms count
    //client.write('getsmscount\r\n');         //retrieve sms count of type TYPE (draft, failed, inbox, outbox, queued, sent), or count of all sms without TYPE
    //Get sms
    //client.write('getsms 2 inbox\r\n');      //retrieve information about N sms type TYPE (draft, failed, inbox, outbox, queued, sent), with out N return all sms
    //Get call count
    //client.write('getcallcount incoming\r\n'); //retrieve call count of type TYPE (incoming, outgoing, missed, voicemail), or count of all calls without TYPE
    //Get call 
    //client.write('getcall 1 incoming\r\n');    //retrieve N call of type TYPE (incoming, outgoing, missed, voicemail), without N return all calls
    //Get call last
    //client.write('getcalllast\r\n');           //retrieve last CNT calls of type TYPE (incoming, outgoing, missed, voicemail), without N return last call
    //Send sms
    //client.write('sendsms {address: 'num', body: 'message'}\r\n'); //send sms with TEXT to number ADDR
    //Make call
    //client.write('makecall num\r\n'); //make a call to number NUM
    //Get contact
    //client.write('getcontact\r\n');        //retrieve information from contact with name like NAME,                                                                                                                      without NAME return all contacts
});
var stream = client.pipe(split());
stream.on('data',function(data){
    try{
        var obj = JSON.parse(data);
    }catch(e){}
    if (!obj) {
      console.log(data.toString('utf8'));
    } else { 
       switch (obj.cmd) {
         case 'cmdlist':     console.log(obj.cmd+':\n', '\nhelp:\n', obj.answer); break;
         case 'getsmslast':  console.log(obj.cmd+':\n', 'all:\n', obj, '\nsms:\n', obj.answer.sms); break;
         case 'getsmscount': console.log(obj.cmd+':\n', 'all:\n', obj, '\ncount:\n', obj.answer.count); break;
         case 'getsms':      console.log(obj.cmd+':\n', 'all:\n', obj, '\nsms:\n', obj.answer.sms); break;
         case 'getcallcount':console.log(obj.cmd+':\n', 'all:\n', obj, '\ncount:\n', obj.answer.count); break;
         case 'getcall':     console.log(obj.cmd+':\n', 'all:\n', obj, '\ncall:\n', obj.answer.call); break;
         case 'getcalllast': console.log(obj.cmd+':\n', 'all:\n', obj, '\ncall:\n', obj.answer.call); break;
         case 'sendsms':     console.log(obj.cmd+':\n', 'to:\n', obj.arg, '\ntext:\n', obj.arg2); break;
         case 'getcontact':  console.log(obj.cmd+':\n', 'conacts:\n', obj.answer.contacts); break;
         case 'makecall':    console.log(obj.cmd+':\n', 'call:\n', obj.arg); break;
         case 'newsms':      console.log(obj.cmd+':\n', 'sms:\n', obj.sms); break;
         default: console.log('uncnown command', obj); break;
       }
      }
});

client.on("close",function(){
    console.log("Client closed");
})