/*+ ----------------------------------------------------------------------------+
|     TIUN terminal client for NodeJS
|     Senotrusov Alexey, 2016
|     $Revision: 1.00 $
|     $Date: 2016/04/10 11:49:37 $
|     $Author: Saper, created by Votak (votak.org)
+----------------------------------------------------------------------------+*/
var program = require('commander');
var split = require('split');
var stdin = process.openStdin();
var net=require("net");

program
  .version('0.0.1')
  .option('-h, --host [host]', 'Address host')
  .option('-p, --port [port]', 'Address port')
  .option('-s, --secret [secret]', 'Secret phrase')
  .parse(process.argv);

if (!program.host || !program.port || !program.secret) {
  console.log('ERROR: You didn\'t specify HOST, PORT or SECRET')
  return;
} 

if (program.host) console.log(' %s - host', program.host);
if (program.port) console.log(' %s - port', program.port);

//connect terminal
var client= new net.Socket();
client.connect(program.port, program.host, function(){
    console.log("Client Connected");
    //In the beginning of the session need to send a secret word
    client.write(program.secret+'\r\n');  
});

//event get data
var stream = client.pipe(split());
stream.on('data',function(data){
    try{
        var obj = JSON.parse(data);
    }catch(e){}
    if (!obj) {
      console.log(data)
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
         case 'makecall':    console.log(obj.cmd+':\n', 'to:\n', obj.arg); break;
         case 'getcontact':  console.log(obj.cmd+':\n', 'conacts:\n', obj.answer.contacts); break;
         case 'incomingcall':console.log(obj.cmd+':\n', 'call:\n', obj.answer); break;
         case 'newsms':      console.log(obj.cmd+':\n', obj, 'sms:\n', obj.answer.sms); break;
         default: console.log('unknown command', obj); break;
       }
      }
});
//event close connection
client.on("close",function(){
    console.log("Client closed");
})

//wait input command
stdin.addListener("data", function(d) { 
    client.write(d);      
});