
//Change this to true for a stretchy canvas!
//
var RESIZEABLE_CANVAS=false;

//Start us up!
//
window.onload=function( e ){

	if( RESIZEABLE_CANVAS ){
		window.onresize=function( e ){
			var canvas=document.getElementById( "GameCanvas" );

			//This vs window.innerWidth, which apparently doesn't account for scrollbar?
			var width=document.body.clientWidth;
			
			//This vs document.body.clientHeight, which does weird things - document seems to 'grow'...perhaps canvas resize pushing page down?
			var height=window.innerHeight;			

			canvas.width=width;
			canvas.height=height;
		}
		window.onresize( null );
	}

	BBMonkeyGame.Main( document.getElementById( "GameCanvas" ) );
}

//${CONFIG_BEGIN}
CFG_BINARY_FILES="*.bin|*.dat";
CFG_BRL_GAMETARGET_IMPLEMENTED="1";
CFG_BRL_THREAD_IMPLEMENTED="1";
CFG_CONFIG="debug";
CFG_HOST="winnt";
CFG_IMAGE_FILES="*.png|*.jpg";
CFG_LANG="js";
CFG_MOJO_AUTO_SUSPEND_ENABLED="0";
CFG_MOJO_DRIVER_IMPLEMENTED="1";
CFG_MUSIC_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_OPENGL_GLES20_ENABLED="0";
CFG_SAFEMODE="0";
CFG_SOUND_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_TARGET="html5";
CFG_TEXT_FILES="*.txt|*.xml|*.json";
//${CONFIG_END}

//${METADATA_BEGIN}
var META_DATA="[mojo_font.png];type=image/png;width=864;height=13;\n";
//${METADATA_END}

//${TRANSCODE_BEGIN}

// Javascript Monkey runtime.
//
// Placed into the public domain 24/02/2011.
// No warranty implied; use at your own risk.

//***** JavaScript Runtime *****

var D2R=0.017453292519943295;
var R2D=57.29577951308232;

var err_info="";
var err_stack=[];

var dbg_index=0;

function push_err(){
	err_stack.push( err_info );
}

function pop_err(){
	err_info=err_stack.pop();
}

function stackTrace(){
	if( !err_info.length ) return "";
	var str=err_info+"\n";
	for( var i=err_stack.length-1;i>0;--i ){
		str+=err_stack[i]+"\n";
	}
	return str;
}

function print( str ){
	var cons=document.getElementById( "GameConsole" );
	if( cons ){
		cons.value+=str+"\n";
		cons.scrollTop=cons.scrollHeight-cons.clientHeight;
	}else if( window.console!=undefined ){
		window.console.log( str );
	}
	return 0;
}

function alertError( err ){
	if( typeof(err)=="string" && err=="" ) return;
	alert( "Monkey Runtime Error : "+err.toString()+"\n\n"+stackTrace() );
}

function error( err ){
	throw err;
}

function debugLog( str ){
	if( window.console!=undefined ) window.console.log( str );
}

function debugStop(){
	debugger;	//	error( "STOP" );
}

function dbg_object( obj ){
	if( obj ) return obj;
	error( "Null object access" );
}

function dbg_charCodeAt( str,index ){
	if( index<0 || index>=str.length ) error( "Character index out of range" );
	return str.charCodeAt( index );
}

function dbg_array( arr,index ){
	if( index<0 || index>=arr.length ) error( "Array index out of range" );
	dbg_index=index;
	return arr;
}

function new_bool_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=false;
	return arr;
}

function new_number_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=0;
	return arr;
}

function new_string_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]='';
	return arr;
}

function new_array_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=[];
	return arr;
}

function new_object_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=null;
	return arr;
}

function resize_bool_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=false;
	return arr;
}

function resize_number_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=0;
	return arr;
}

function resize_string_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]="";
	return arr;
}

function resize_array_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=[];
	return arr;
}

function resize_object_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=null;
	return arr;
}

function string_compare( lhs,rhs ){
	var n=Math.min( lhs.length,rhs.length ),i,t;
	for( i=0;i<n;++i ){
		t=lhs.charCodeAt(i)-rhs.charCodeAt(i);
		if( t ) return t;
	}
	return lhs.length-rhs.length;
}

function string_replace( str,find,rep ){	//no unregex replace all?!?
	var i=0;
	for(;;){
		i=str.indexOf( find,i );
		if( i==-1 ) return str;
		str=str.substring( 0,i )+rep+str.substring( i+find.length );
		i+=rep.length;
	}
}

function string_trim( str ){
	var i=0,i2=str.length;
	while( i<i2 && str.charCodeAt(i)<=32 ) i+=1;
	while( i2>i && str.charCodeAt(i2-1)<=32 ) i2-=1;
	return str.slice( i,i2 );
}

function string_startswith( str,substr ){
	return substr.length<=str.length && str.slice(0,substr.length)==substr;
}

function string_endswith( str,substr ){
	return substr.length<=str.length && str.slice(str.length-substr.length,str.length)==substr;
}

function string_tochars( str ){
	var arr=new Array( str.length );
	for( var i=0;i<str.length;++i ) arr[i]=str.charCodeAt(i);
	return arr;
}

function string_fromchars( chars ){
	var str="",i;
	for( i=0;i<chars.length;++i ){
		str+=String.fromCharCode( chars[i] );
	}
	return str;
}

function object_downcast( obj,clas ){
	if( obj instanceof clas ) return obj;
	return null;
}

function object_implements( obj,iface ){
	if( obj && obj.implments && obj.implments[iface] ) return obj;
	return null;
}

function extend_class( clas ){
	var tmp=function(){};
	tmp.prototype=clas.prototype;
	return new tmp;
}

function ThrowableObject(){
}

ThrowableObject.prototype.toString=function(){ 
	return "Uncaught Monkey Exception"; 
}


function BBGameEvent(){}
BBGameEvent.KeyDown=1;
BBGameEvent.KeyUp=2;
BBGameEvent.KeyChar=3;
BBGameEvent.MouseDown=4;
BBGameEvent.MouseUp=5;
BBGameEvent.MouseMove=6;
BBGameEvent.TouchDown=7;
BBGameEvent.TouchUp=8;
BBGameEvent.TouchMove=9;
BBGameEvent.MotionAccel=10;

function BBGameDelegate(){}
BBGameDelegate.prototype.StartGame=function(){}
BBGameDelegate.prototype.SuspendGame=function(){}
BBGameDelegate.prototype.ResumeGame=function(){}
BBGameDelegate.prototype.UpdateGame=function(){}
BBGameDelegate.prototype.RenderGame=function(){}
BBGameDelegate.prototype.KeyEvent=function( ev,data ){}
BBGameDelegate.prototype.MouseEvent=function( ev,data,x,y ){}
BBGameDelegate.prototype.TouchEvent=function( ev,data,x,y ){}
BBGameDelegate.prototype.MotionEvent=function( ev,data,x,y,z ){}
BBGameDelegate.prototype.DiscardGraphics=function(){}

function BBGame(){
	BBGame._game=this;
	this._delegate=null;
	this._keyboardEnabled=false;
	this._updateRate=0;
	this._started=false;
	this._suspended=false;
	this._debugExs=(CFG_CONFIG=="debug");
	this._startms=Date.now();
}

BBGame.Game=function(){
	return BBGame._game;
}

BBGame.prototype.SetDelegate=function( delegate ){
	this._delegate=delegate;
}

BBGame.prototype.Delegate=function(){
	return this._delegate;
}

BBGame.prototype.SetUpdateRate=function( updateRate ){
	this._updateRate=updateRate;
}

BBGame.prototype.SetKeyboardEnabled=function( keyboardEnabled ){
	this._keyboardEnabled=keyboardEnabled;
}

BBGame.prototype.Started=function(){
	return this._started;
}

BBGame.prototype.Suspended=function(){
	return this._suspended;
}

BBGame.prototype.Millisecs=function(){
	return Date.now()-this._startms;
}

BBGame.prototype.GetDate=function( date ){
	var n=date.length;
	if( n>0 ){
		var t=new Date();
		date[0]=t.getFullYear();
		if( n>1 ){
			date[1]=t.getMonth()+1;
			if( n>2 ){
				date[2]=t.getDate();
				if( n>3 ){
					date[3]=t.getHours();
					if( n>4 ){
						date[4]=t.getMinutes();
						if( n>5 ){
							date[5]=t.getSeconds();
							if( n>6 ){
								date[6]=t.getMilliseconds();
							}
						}
					}
				}
			}
		}
	}
}

BBGame.prototype.SaveState=function( state ){
	localStorage.setItem( "monkeystate@"+document.URL,state );	//key can't start with dot in Chrome!
	return 1;
}

BBGame.prototype.LoadState=function(){
	var state=localStorage.getItem( "monkeystate@"+document.URL );
	if( state ) return state;
	return "";
}

BBGame.prototype.LoadString=function( path ){

	var xhr=new XMLHttpRequest();
	xhr.open( "GET",this.PathToUrl( path ),false );
	
	xhr.send( null );
	
	if( xhr.status==200 || xhr.status==0 ) return xhr.responseText;
	
	return "";
}

BBGame.prototype.PollJoystick=function( port,joyx,joyy,joyz,buttons ){
	return false;
}

BBGame.prototype.OpenUrl=function( url ){
	window.location=url;
}

BBGame.prototype.SetMouseVisible=function( visible ){
	if( visible ){
		this._canvas.style.cursor='default';	
	}else{
		this._canvas.style.cursor="url('data:image/cur;base64,AAACAAEAICAAAAAAAACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAgBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA55ZXBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOeWVxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADnllcGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9////////////////////+////////f/////////8%3D'), auto";
	}
}

BBGame.prototype.PathToFilePath=function( path ){
	return "";
}

//***** js Game *****

BBGame.prototype.PathToUrl=function( path ){
	return path;
}

BBGame.prototype.LoadData=function( path ){

	var xhr=new XMLHttpRequest();
	xhr.open( "GET",this.PathToUrl( path ),false );

	if( xhr.overrideMimeType ) xhr.overrideMimeType( "text/plain; charset=x-user-defined" );

	xhr.send( null );
	if( xhr.status!=200 && xhr.status!=0 ) return null;

	var r=xhr.responseText;
	var buf=new ArrayBuffer( r.length );
	var bytes=new Int8Array( buf );
	for( var i=0;i<r.length;++i ){
		bytes[i]=r.charCodeAt( i );
	}
	return buf;
}

//***** INTERNAL ******

BBGame.prototype.Die=function( ex ){

	this._delegate=new BBGameDelegate();
	
	if( !ex.toString() ){
		return;
	}
	
	if( this._debugExs ){
		print( "Monkey Runtime Error : "+ex.toString() );
		print( stackTrace() );
	}
	
	throw ex;
}

BBGame.prototype.StartGame=function(){

	if( this._started ) return;
	this._started=true;
	
	if( this._debugExs ){
		try{
			this._delegate.StartGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.StartGame();
	}
}

BBGame.prototype.SuspendGame=function(){

	if( !this._started || this._suspended ) return;
	this._suspended=true;
	
	if( this._debugExs ){
		try{
			this._delegate.SuspendGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.SuspendGame();
	}
}

BBGame.prototype.ResumeGame=function(){

	if( !this._started || !this._suspended ) return;
	this._suspended=false;
	
	if( this._debugExs ){
		try{
			this._delegate.ResumeGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.ResumeGame();
	}
}

BBGame.prototype.UpdateGame=function(){

	if( !this._started || this._suspended ) return;

	if( this._debugExs ){
		try{
			this._delegate.UpdateGame();
		}catch( ex ){
			this.Die( ex );
		}	
	}else{
		this._delegate.UpdateGame();
	}
}

BBGame.prototype.RenderGame=function(){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.RenderGame();
		}catch( ex ){
			this.Die( ex );
		}	
	}else{
		this._delegate.RenderGame();
	}
}

BBGame.prototype.KeyEvent=function( ev,data ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.KeyEvent( ev,data );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.KeyEvent( ev,data );
	}
}

BBGame.prototype.MouseEvent=function( ev,data,x,y ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.MouseEvent( ev,data,x,y );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.MouseEvent( ev,data,x,y );
	}
}

BBGame.prototype.TouchEvent=function( ev,data,x,y ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.TouchEvent( ev,data,x,y );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.TouchEvent( ev,data,x,y );
	}
}

BBGame.prototype.MotionEvent=function( ev,data,x,y,z ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.MotionEvent( ev,data,x,y,z );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.MotionEvent( ev,data,x,y,z );
	}
}

BBGame.prototype.DiscardGraphics=function(){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.DiscardGraphics();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.DiscardGraphics();
	}
}


function BBHtml5Game( canvas ){
	BBGame.call( this );
	BBHtml5Game._game=this;
	this._canvas=canvas;
	this._loading=0;
	this._timerSeq=0;
	this._gl=null;
	if( CFG_OPENGL_GLES20_ENABLED=="1" ){
		this._gl=this._canvas.getContext( "webgl" );
		if( !this._gl ) this._gl=this._canvas.getContext( "experimental-webgl" );
		if( !this._gl ) this.Die( "Can't create WebGL" );
		gl=this._gl;
	}
}

BBHtml5Game.prototype=extend_class( BBGame );

BBHtml5Game.Html5Game=function(){
	return BBHtml5Game._game;
}

BBHtml5Game.prototype.ValidateUpdateTimer=function(){

	++this._timerSeq;

	if( !this._updateRate || this._suspended ) return;
	
	var game=this;
	var updatePeriod=1000.0/this._updateRate;
	var nextUpdate=Date.now()+updatePeriod;
	var seq=game._timerSeq;
	
	function timeElapsed(){
		if( seq!=game._timerSeq ) return;

		var time;		
		var updates;
		
		for( updates=0;updates<4;++updates ){
		
			nextUpdate+=updatePeriod;
			
			game.UpdateGame();
			if( seq!=game._timerSeq ) return;
			
			if( nextUpdate-Date.now()>0 ) break;
		}
		
		game.RenderGame();
		if( seq!=game._timerSeq ) return;
		
		if( updates==4 ){
			nextUpdate=Date.now();
			setTimeout( timeElapsed,0 );
		}else{
			var delay=nextUpdate-Date.now();
			setTimeout( timeElapsed,delay>0 ? delay : 0 );
		}
	}

	setTimeout( timeElapsed,updatePeriod );
}

//***** BBGame methods *****

BBHtml5Game.prototype.SetUpdateRate=function( updateRate ){

	BBGame.prototype.SetUpdateRate.call( this,updateRate );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.GetMetaData=function( path,key ){
	if( path.indexOf( "monkey://data/" )!=0 ) return "";
	path=path.slice(14);

	var i=META_DATA.indexOf( "["+path+"]" );
	if( i==-1 ) return "";
	i+=path.length+2;

	var e=META_DATA.indexOf( "\n",i );
	if( e==-1 ) e=META_DATA.length;

	i=META_DATA.indexOf( ";"+key+"=",i )
	if( i==-1 || i>=e ) return "";
	i+=key.length+2;

	e=META_DATA.indexOf( ";",i );
	if( e==-1 ) return "";

	return META_DATA.slice( i,e );
}

BBHtml5Game.prototype.PathToUrl=function( path ){
	if( path.indexOf( "monkey:" )!=0 ){
		return path;
	}else if( path.indexOf( "monkey://data/" )==0 ) {
		return "data/"+path.slice( 14 );
	}
	return "";
}

BBHtml5Game.prototype.GetLoading=function(){
	return this._loading;
}

BBHtml5Game.prototype.IncLoading=function(){
	++this._loading;
	return this._loading;
}

BBHtml5Game.prototype.DecLoading=function(){
	--this._loading;
	return this._loading;
}

BBHtml5Game.prototype.GetCanvas=function(){
	return this._canvas;
}

BBHtml5Game.prototype.GetWebGL=function(){
	return this._gl;
}

//***** INTERNAL *****

BBHtml5Game.prototype.UpdateGame=function(){

	if( !this._loading ) BBGame.prototype.UpdateGame.call( this );
}

BBHtml5Game.prototype.SuspendGame=function(){

	BBGame.prototype.SuspendGame.call( this );
	
	BBGame.prototype.RenderGame.call( this );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.ResumeGame=function(){

	BBGame.prototype.ResumeGame.call( this );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.Run=function(){

	var game=this;
	var canvas=game._canvas;
	
	var touchIds=new Array( 32 );
	for( i=0;i<32;++i ) touchIds[i]=-1;
	
	function eatEvent( e ){
		if( e.stopPropagation ){
			e.stopPropagation();
			e.preventDefault();
		}else{
			e.cancelBubble=true;
			e.returnValue=false;
		}
	}
	
	function keyToChar( key ){
		switch( key ){
		case 8:case 9:case 13:case 27:case 32:return key;
		case 33:case 34:case 35:case 36:case 37:case 38:case 39:case 40:case 45:return key|0x10000;
		case 46:return 127;
		}
		return 0;
	}
	
	function mouseX( e ){
		var x=e.clientX+document.body.scrollLeft;
		var c=canvas;
		while( c ){
			x-=c.offsetLeft;
			c=c.offsetParent;
		}
		return x;
	}
	
	function mouseY( e ){
		var y=e.clientY+document.body.scrollTop;
		var c=canvas;
		while( c ){
			y-=c.offsetTop;
			c=c.offsetParent;
		}
		return y;
	}

	function touchX( touch ){
		var x=touch.pageX;
		var c=canvas;
		while( c ){
			x-=c.offsetLeft;
			c=c.offsetParent;
		}
		return x;
	}			
	
	function touchY( touch ){
		var y=touch.pageY;
		var c=canvas;
		while( c ){
			y-=c.offsetTop;
			c=c.offsetParent;
		}
		return y;
	}
	
	canvas.onkeydown=function( e ){
		game.KeyEvent( BBGameEvent.KeyDown,e.keyCode );
		var chr=keyToChar( e.keyCode );
		if( chr ) game.KeyEvent( BBGameEvent.KeyChar,chr );
		if( e.keyCode<48 || (e.keyCode>111 && e.keyCode<122) ) eatEvent( e );
	}

	canvas.onkeyup=function( e ){
		game.KeyEvent( BBGameEvent.KeyUp,e.keyCode );
	}

	canvas.onkeypress=function( e ){
		if( e.charCode ){
			game.KeyEvent( BBGameEvent.KeyChar,e.charCode );
		}else if( e.which ){
			game.KeyEvent( BBGameEvent.KeyChar,e.which );
		}
	}

	canvas.onmousedown=function( e ){
		switch( e.button ){
		case 0:game.MouseEvent( BBGameEvent.MouseDown,0,mouseX(e),mouseY(e) );break;
		case 1:game.MouseEvent( BBGameEvent.MouseDown,2,mouseX(e),mouseY(e) );break;
		case 2:game.MouseEvent( BBGameEvent.MouseDown,1,mouseX(e),mouseY(e) );break;
		}
		eatEvent( e );
	}
	
	canvas.onmouseup=function( e ){
		switch( e.button ){
		case 0:game.MouseEvent( BBGameEvent.MouseUp,0,mouseX(e),mouseY(e) );break;
		case 1:game.MouseEvent( BBGameEvent.MouseUp,2,mouseX(e),mouseY(e) );break;
		case 2:game.MouseEvent( BBGameEvent.MouseUp,1,mouseX(e),mouseY(e) );break;
		}
		eatEvent( e );
	}
	
	canvas.onmousemove=function( e ){
		game.MouseEvent( BBGameEvent.MouseMove,-1,mouseX(e),mouseY(e) );
		eatEvent( e );
	}

	canvas.onmouseout=function( e ){
		game.MouseEvent( BBGameEvent.MouseUp,0,mouseX(e),mouseY(e) );
		game.MouseEvent( BBGameEvent.MouseUp,1,mouseX(e),mouseY(e) );
		game.MouseEvent( BBGameEvent.MouseUp,2,mouseX(e),mouseY(e) );
		eatEvent( e );
	}
	
	canvas.onclick=function( e ){
		if( game.Suspended() ){
			canvas.focus();
		}
		eatEvent( e );
		return;
	}
	
	canvas.oncontextmenu=function( e ){
		return false;
	}
	
	canvas.ontouchstart=function( e ){
		if( game.Suspended() ){
			canvas.focus();
		}
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=-1 ) continue;
				touchIds[j]=touch.identifier;
				game.TouchEvent( BBGameEvent.TouchDown,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	canvas.ontouchmove=function( e ){
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=touch.identifier ) continue;
				game.TouchEvent( BBGameEvent.TouchMove,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	canvas.ontouchend=function( e ){
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=touch.identifier ) continue;
				touchIds[j]=-1;
				game.TouchEvent( BBGameEvent.TouchUp,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	window.ondevicemotion=function( e ){
		var tx=e.accelerationIncludingGravity.x/9.81;
		var ty=e.accelerationIncludingGravity.y/9.81;
		var tz=e.accelerationIncludingGravity.z/9.81;
		var x,y;
		switch( window.orientation ){
		case   0:x=+tx;y=-ty;break;
		case 180:x=-tx;y=+ty;break;
		case  90:x=-ty;y=-tx;break;
		case -90:x=+ty;y=+tx;break;
		}
		game.MotionEvent( BBGameEvent.MotionAccel,0,x,y,tz );
		eatEvent( e );
	}

	canvas.onfocus=function( e ){
		if( CFG_MOJO_AUTO_SUSPEND_ENABLED=="1" ){
			game.ResumeGame();
		}
	}
	
	canvas.onblur=function( e ){
		for( var i=0;i<256;++i ) game.KeyEvent( BBGameEvent.KeyUp,i );
		if( CFG_MOJO_AUTO_SUSPEND_ENABLED=="1" ){
			game.SuspendGame();
		}
	}
	
	canvas.focus();
	
	game.StartGame();

	game.RenderGame();
}


function BBMonkeyGame( canvas ){
	BBHtml5Game.call( this,canvas );
}

BBMonkeyGame.prototype=extend_class( BBHtml5Game );

BBMonkeyGame.Main=function( canvas ){

	var game=new BBMonkeyGame( canvas );

	try{

		bbInit();
		bbMain();

	}catch( ex ){
	
		game.Die( ex );
		return;
	}

	if( !game.Delegate() ) return;
	
	game.Run();
}


// HTML5 mojo runtime.
//
// Copyright 2011 Mark Sibly, all rights reserved.
// No warranty implied; use at your own risk.

//***** gxtkGraphics class *****

function gxtkGraphics(){
	this.game=BBHtml5Game.Html5Game();
	this.canvas=this.game.GetCanvas()
	this.width=this.canvas.width;
	this.height=this.canvas.height;
	this.gl=null;
	this.gc=this.canvas.getContext( '2d' );
	this.tmpCanvas=null;
	this.r=255;
	this.b=255;
	this.g=255;
	this.white=true;
	this.color="rgb(255,255,255)"
	this.alpha=1;
	this.blend="source-over";
	this.ix=1;this.iy=0;
	this.jx=0;this.jy=1;
	this.tx=0;this.ty=0;
	this.tformed=false;
	this.scissorX=0;
	this.scissorY=0;
	this.scissorWidth=0;
	this.scissorHeight=0;
	this.clipped=false;
}

gxtkGraphics.prototype.BeginRender=function(){
	this.width=this.canvas.width;
	this.height=this.canvas.height;
	if( !this.gc ) return 0;
	this.gc.save();
	if( this.game.GetLoading() ) return 2;
	return 1;
}

gxtkGraphics.prototype.EndRender=function(){
	if( this.gc ) this.gc.restore();
}

gxtkGraphics.prototype.Width=function(){
	return this.width;
}

gxtkGraphics.prototype.Height=function(){
	return this.height;
}

gxtkGraphics.prototype.LoadSurface=function( path ){
	var game=this.game;

	var ty=game.GetMetaData( path,"type" );
	if( ty.indexOf( "image/" )!=0 ) return null;
	
	function onloadfun(){
		game.DecLoading();
	}
	
	game.IncLoading();

	var image=new Image();
	image.onload=onloadfun;
	image.meta_width=parseInt( game.GetMetaData( path,"width" ) );
	image.meta_height=parseInt( game.GetMetaData( path,"height" ) );
	image.src=game.PathToUrl( path );

	return new gxtkSurface( image,this );
}

gxtkGraphics.prototype.CreateSurface=function( width,height ){
	var canvas=document.createElement( 'canvas' );
	
	canvas.width=width;
	canvas.height=height;
	canvas.meta_width=width;
	canvas.meta_height=height;
	canvas.complete=true;
	
	var surface=new gxtkSurface( canvas,this );
	
	surface.gc=canvas.getContext( '2d' );
	
	return surface;
}

gxtkGraphics.prototype.SetAlpha=function( alpha ){
	this.alpha=alpha;
	this.gc.globalAlpha=alpha;
}

gxtkGraphics.prototype.SetColor=function( r,g,b ){
	this.r=r;
	this.g=g;
	this.b=b;
	this.white=(r==255 && g==255 && b==255);
	this.color="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;
}

gxtkGraphics.prototype.SetBlend=function( blend ){
	switch( blend ){
	case 1:
		this.blend="lighter";
		break;
	default:
		this.blend="source-over";
	}
	this.gc.globalCompositeOperation=this.blend;
}

gxtkGraphics.prototype.SetScissor=function( x,y,w,h ){
	this.scissorX=x;
	this.scissorY=y;
	this.scissorWidth=w;
	this.scissorHeight=h;
	this.clipped=(x!=0 || y!=0 || w!=this.canvas.width || h!=this.canvas.height);
	this.gc.restore();
	this.gc.save();
	if( this.clipped ){
		this.gc.beginPath();
		this.gc.rect( x,y,w,h );
		this.gc.clip();
		this.gc.closePath();
	}
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;	
	this.gc.globalAlpha=this.alpha;	
	this.gc.globalCompositeOperation=this.blend;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.SetMatrix=function( ix,iy,jx,jy,tx,ty ){
	this.ix=ix;this.iy=iy;
	this.jx=jx;this.jy=jy;
	this.tx=tx;this.ty=ty;
	this.gc.setTransform( ix,iy,jx,jy,tx,ty );
	this.tformed=(ix!=1 || iy!=0 || jx!=0 || jy!=1 || tx!=0 || ty!=0);
}

gxtkGraphics.prototype.Cls=function( r,g,b ){
	if( this.tformed ) this.gc.setTransform( 1,0,0,1,0,0 );
	this.gc.fillStyle="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.globalAlpha=1;
	this.gc.globalCompositeOperation="source-over";
	this.gc.fillRect( 0,0,this.canvas.width,this.canvas.height );
	this.gc.fillStyle=this.color;
	this.gc.globalAlpha=this.alpha;
	this.gc.globalCompositeOperation=this.blend;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.DrawPoint=function( x,y ){
	if( this.tformed ){
		var px=x;
		x=px * this.ix + y * this.jx + this.tx;
		y=px * this.iy + y * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
		this.gc.fillRect( x,y,1,1 );
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
		this.gc.fillRect( x,y,1,1 );
	}
}

gxtkGraphics.prototype.DrawRect=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
	this.gc.fillRect( x,y,w,h );
}

gxtkGraphics.prototype.DrawLine=function( x1,y1,x2,y2 ){
	if( this.tformed ){
		var x1_t=x1 * this.ix + y1 * this.jx + this.tx;
		var y1_t=x1 * this.iy + y1 * this.jy + this.ty;
		var x2_t=x2 * this.ix + y2 * this.jx + this.tx;
		var y2_t=x2 * this.iy + y2 * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1_t,y1_t );
	  	this.gc.lineTo( x2_t,y2_t );
	  	this.gc.stroke();
	  	this.gc.closePath();
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1,y1 );
	  	this.gc.lineTo( x2,y2 );
	  	this.gc.stroke();
	  	this.gc.closePath();
	}
}

gxtkGraphics.prototype.DrawOval=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
  	var w2=w/2,h2=h/2;
	this.gc.save();
	this.gc.translate( x+w2,y+h2 );
	this.gc.scale( w2,h2 );
  	this.gc.beginPath();
	this.gc.arc( 0,0,1,0,Math.PI*2,false );
	this.gc.fill();
  	this.gc.closePath();
	this.gc.restore();
}

gxtkGraphics.prototype.DrawPoly=function( verts ){
	if( verts.length<2 ) return;
	this.gc.beginPath();
	this.gc.moveTo( verts[0],verts[1] );
	for( var i=2;i<verts.length;i+=2 ){
		this.gc.lineTo( verts[i],verts[i+1] );
	}
	this.gc.fill();
	this.gc.closePath();
}

gxtkGraphics.prototype.DrawPoly2=function( verts,surface,srx,srcy ){
	if( verts.length<4 ) return;
	this.gc.beginPath();
	this.gc.moveTo( verts[0],verts[1] );
	for( var i=4;i<verts.length;i+=4 ){
		this.gc.lineTo( verts[i],verts[i+1] );
	}
	this.gc.fill();
	this.gc.closePath();
}

gxtkGraphics.prototype.DrawSurface=function( surface,x,y ){
	if( !surface.image.complete ) return;
	
	if( this.white ){
		this.gc.drawImage( surface.image,x,y );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,0,0,surface.swidth,surface.sheight );
}

gxtkGraphics.prototype.DrawSurface2=function( surface,x,y,srcx,srcy,srcw,srch ){
	if( !surface.image.complete ) return;

	if( srcw<0 ){ srcx+=srcw;srcw=-srcw; }
	if( srch<0 ){ srcy+=srch;srch=-srch; }
	if( srcw<=0 || srch<=0 ) return;

	if( this.white ){
		this.gc.drawImage( surface.image,srcx,srcy,srcw,srch,x,y,srcw,srch );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,srcx,srcy,srcw,srch  );
}

gxtkGraphics.prototype.DrawImageTinted=function( image,dx,dy,sx,sy,sw,sh ){

	if( !this.tmpCanvas ){
		this.tmpCanvas=document.createElement( "canvas" );
	}

	if( sw>this.tmpCanvas.width || sh>this.tmpCanvas.height ){
		this.tmpCanvas.width=Math.max( sw,this.tmpCanvas.width );
		this.tmpCanvas.height=Math.max( sh,this.tmpCanvas.height );
	}
	
	var tmpGC=this.tmpCanvas.getContext( "2d" );
	tmpGC.globalCompositeOperation="copy";
	
	tmpGC.drawImage( image,sx,sy,sw,sh,0,0,sw,sh );
	
	var imgData=tmpGC.getImageData( 0,0,sw,sh );
	
	var p=imgData.data,sz=sw*sh*4,i;
	
	for( i=0;i<sz;i+=4 ){
		p[i]=p[i]*this.r/255;
		p[i+1]=p[i+1]*this.g/255;
		p[i+2]=p[i+2]*this.b/255;
	}
	
	tmpGC.putImageData( imgData,0,0 );
	
	this.gc.drawImage( this.tmpCanvas,0,0,sw,sh,dx,dy,sw,sh );
}

gxtkGraphics.prototype.ReadPixels=function( pixels,x,y,width,height,offset,pitch ){

	var imgData=this.gc.getImageData( x,y,width,height );
	
	var p=imgData.data,i=0,j=offset,px,py;
	
	for( py=0;py<height;++py ){
		for( px=0;px<width;++px ){
			pixels[j++]=(p[i+3]<<24)|(p[i]<<16)|(p[i+1]<<8)|p[i+2];
			i+=4;
		}
		j+=pitch-width;
	}
}

gxtkGraphics.prototype.WritePixels2=function( surface,pixels,x,y,width,height,offset,pitch ){

	if( !surface.gc ){
		if( !surface.image.complete ) return;
		var canvas=document.createElement( "canvas" );
		canvas.width=surface.swidth;
		canvas.height=surface.sheight;
		surface.gc=canvas.getContext( "2d" );
		surface.gc.globalCompositeOperation="copy";
		surface.gc.drawImage( surface.image,0,0 );
		surface.image=canvas;
	}

	var imgData=surface.gc.createImageData( width,height );

	var p=imgData.data,i=0,j=offset,px,py,argb;
	
	for( py=0;py<height;++py ){
		for( px=0;px<width;++px ){
			argb=pixels[j++];
			p[i]=(argb>>16) & 0xff;
			p[i+1]=(argb>>8) & 0xff;
			p[i+2]=argb & 0xff;
			p[i+3]=(argb>>24) & 0xff;
			i+=4;
		}
		j+=pitch-width;
	}
	
	surface.gc.putImageData( imgData,x,y );
}

//***** gxtkSurface class *****

function gxtkSurface( image,graphics ){
	this.image=image;
	this.graphics=graphics;
	this.swidth=image.meta_width;
	this.sheight=image.meta_height;
}

//***** GXTK API *****

gxtkSurface.prototype.Discard=function(){
	if( this.image ){
		this.image=null;
	}
}

gxtkSurface.prototype.Width=function(){
	return this.swidth;
}

gxtkSurface.prototype.Height=function(){
	return this.sheight;
}

gxtkSurface.prototype.Loaded=function(){
	return this.image.complete;
}

gxtkSurface.prototype.OnUnsafeLoadComplete=function(){
	return true;
}

//***** gxtkChannel class *****
function gxtkChannel(){
	this.sample=null;
	this.audio=null;
	this.volume=1;
	this.pan=0;
	this.rate=1;
	this.flags=0;
	this.state=0;
}

//***** gxtkAudio class *****
function gxtkAudio(){
	this.game=BBHtml5Game.Html5Game();
	this.okay=typeof(Audio)!="undefined";
	this.music=null;
	this.channels=new Array(33);
	for( var i=0;i<33;++i ){
		this.channels[i]=new gxtkChannel();
		if( !this.okay ) this.channels[i].state=-1;
	}
}

gxtkAudio.prototype.Suspend=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.state==1 ){
			if( chan.audio.ended && !chan.audio.loop ){
				chan.state=0;
			}else{
				chan.audio.pause();
				chan.state=3;
			}
		}
	}
}

gxtkAudio.prototype.Resume=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.state==3 ){
			chan.audio.play();
			chan.state=1;
		}
	}
}

gxtkAudio.prototype.LoadSample=function( path ){
	if( !this.okay ) return null;

	var audio=new Audio( this.game.PathToUrl( path ) );
	if( !audio ) return null;
	
	return new gxtkSample( audio );
}

gxtkAudio.prototype.PlaySample=function( sample,channel,flags ){
	if( !this.okay ) return;
	
	var chan=this.channels[channel];

	if( chan.state>0 ){
		chan.audio.pause();
		chan.state=0;
	}
	
	for( var i=0;i<33;++i ){
		var chan2=this.channels[i];
		if( chan2.state==1 && chan2.audio.ended && !chan2.audio.loop ) chan.state=0;
		if( chan2.state==0 && chan2.sample ){
			chan2.sample.FreeAudio( chan2.audio );
			chan2.sample=null;
			chan2.audio=null;
		}
	}

	var audio=sample.AllocAudio();
	if( !audio ) return;

	audio.loop=(flags&1)!=0;
	audio.volume=chan.volume;
	audio.play();

	chan.sample=sample;
	chan.audio=audio;
	chan.flags=flags;
	chan.state=1;
}

gxtkAudio.prototype.StopChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state>0 ){
		chan.audio.pause();
		chan.state=0;
	}
}

gxtkAudio.prototype.PauseChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state==1 ){
		if( chan.audio.ended && !chan.audio.loop ){
			chan.state=0;
		}else{
			chan.audio.pause();
			chan.state=2;
		}
	}
}

gxtkAudio.prototype.ResumeChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state==2 ){
		chan.audio.play();
		chan.state=1;
	}
}

gxtkAudio.prototype.ChannelState=function( channel ){
	var chan=this.channels[channel];
	if( chan.state==1 && chan.audio.ended && !chan.audio.loop ) chan.state=0;
	if( chan.state==3 ) return 1;
	return chan.state;
}

gxtkAudio.prototype.SetVolume=function( channel,volume ){
	var chan=this.channels[channel];
	if( chan.state>0 ) chan.audio.volume=volume;
	chan.volume=volume;
}

gxtkAudio.prototype.SetPan=function( channel,pan ){
	var chan=this.channels[channel];
	chan.pan=pan;
}

gxtkAudio.prototype.SetRate=function( channel,rate ){
	var chan=this.channels[channel];
	chan.rate=rate;
}

gxtkAudio.prototype.PlayMusic=function( path,flags ){
	this.StopMusic();
	
	this.music=this.LoadSample( path );
	if( !this.music ) return;
	
	this.PlaySample( this.music,32,flags );
}

gxtkAudio.prototype.StopMusic=function(){
	this.StopChannel( 32 );

	if( this.music ){
		this.music.Discard();
		this.music=null;
	}
}

gxtkAudio.prototype.PauseMusic=function(){
	this.PauseChannel( 32 );
}

gxtkAudio.prototype.ResumeMusic=function(){
	this.ResumeChannel( 32 );
}

gxtkAudio.prototype.MusicState=function(){
	return this.ChannelState( 32 );
}

gxtkAudio.prototype.SetMusicVolume=function( volume ){
	this.SetVolume( 32,volume );
}

//***** gxtkSample class *****

function gxtkSample( audio ){
	this.audio=audio;
	this.free=new Array();
	this.insts=new Array();
}

gxtkSample.prototype.FreeAudio=function( audio ){
	this.free.push( audio );
}

gxtkSample.prototype.AllocAudio=function(){
	var audio;
	while( this.free.length ){
		audio=this.free.pop();
		try{
			audio.currentTime=0;
			return audio;
		}catch( ex ){
			print( "AUDIO ERROR1!" );
		}
	}
	
	//Max out?
	if( this.insts.length==8 ) return null;
	
	audio=new Audio( this.audio.src );
	
	//yucky loop handler for firefox!
	//
	audio.addEventListener( 'ended',function(){
		if( this.loop ){
			try{
				this.currentTime=0;
				this.play();
			}catch( ex ){
				print( "AUDIO ERROR2!" );
			}
		}
	},false );

	this.insts.push( audio );
	return audio;
}

gxtkSample.prototype.Discard=function(){
}


function BBThread(){
	this.result=null;
	this.running=false;
}

BBThread.prototype.Start=function(){
	this.result=null;
	this.running=true;
	this.Run__UNSAFE__();
}

BBThread.prototype.IsRunning=function(){
	return this.running;
}

BBThread.prototype.Result=function(){
	return this.result;
}

BBThread.prototype.Run__UNSAFE__=function(){
	this.running=false;
}


function BBAsyncImageLoaderThread(){
	this._running=false;
}

BBAsyncImageLoaderThread.prototype.Start=function(){

	var thread=this;
	var image=new Image();

	image.onload=function( e ){
		image.meta_width=image.width;
		image.meta_height=image.height;
		thread._surface=new gxtkSurface( image,thread._device )
		thread._running=false;
	}
	
	image.onerror=function( e ){
		thread._surface=null;
		thread._running=false;
	}
	
	thread._running=true;
	
	image.src=BBGame.Game().PathToUrl( thread._path );
}

BBAsyncImageLoaderThread.prototype.IsRunning=function(){
	return this._running;
}



function BBAsyncSoundLoaderThread(){
}

BBAsyncSoundLoaderThread.prototype.Start=function(){
	this._sample=this._device.LoadSample( this._path );
}

BBAsyncSoundLoaderThread.prototype.IsRunning=function(){
	return false;
}

function c_App(){
	Object.call(this);
}
c_App.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<104>";
	if((bb_app__app)!=null){
		err_info="C:/MonkeyX77a/modules/mojo/app.monkey<104>";
		error("App has already been created");
	}
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<105>";
	bb_app__app=this;
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<106>";
	bb_app__delegate=c_GameDelegate.m_new.call(new c_GameDelegate);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<107>";
	bb_app__game.SetDelegate(bb_app__delegate);
	pop_err();
	return this;
}
c_App.prototype.p_OnCreate=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnSuspend=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnResume=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnUpdate=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnLoading=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnRender=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnClose=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<129>";
	bb_app_EndApp();
	pop_err();
	return 0;
}
c_App.prototype.p_OnBack=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<133>";
	this.p_OnClose();
	pop_err();
	return 0;
}
function c_Game(){
	c_App.call(this);
	this.m_circle=null;
	this.m_constVec=null;
	this.m_mouse=null;
	this.m_p2=null;
	this.m_line=null;
	this.m_rect=null;
	this.m_tri=null;
	this.m_mouseObject=0;
	this.m_rectAngle=.0;
	this.m_circleAngle=.0;
	this.m_triAngle=.0;
	this.m_intersectsCircle=false;
	this.m_intersectsRect=false;
	this.m_intersectsLine=false;
	this.m_intersectsTri=false;
}
c_Game.prototype=extend_class(c_App);
c_Game.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<10>";
	c_App.m_new.call(this);
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<10>";
	pop_err();
	return this;
}
c_Game.prototype.p_OnCreate=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<36>";
	bb_app_SetUpdateRate(60);
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<38>";
	this.m_circle=c_Circle.m_new.call(new c_Circle,200.0,200.0,96.0,16);
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<40>";
	this.m_constVec=c_Vector.m_new.call(new c_Vector,150.0,0.0);
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<41>";
	this.m_mouse=c_Vector.m_new.call(new c_Vector,bb_input_MouseX(),bb_input_MouseY());
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<42>";
	this.m_p2=c_Vector.m_new.call(new c_Vector,0.0,0.0);
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<43>";
	this.m_line=c_Line.m_new2.call(new c_Line,this.m_mouse,this.m_constVec);
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<45>";
	this.m_rect=c_Rectangle.m_new.call(new c_Rectangle,300.0,400.0,128.0,32.0);
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<47>";
	this.m_tri=c_Circle.m_new.call(new c_Circle,400.0,200.0,64.0,3);
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<49>";
	pop_err();
	return 0;
}
c_Game.prototype.p_OnUpdate=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<55>";
	if((bb_input_KeyDown(1))!=0){
		err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<56>";
		var t_1=this.m_mouseObject;
		err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<57>";
		if(t_1==0){
			err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<58>";
			var t_=this.m_constVec;
			this.m_constVec.p_Angle2(t_.p_Angle()+1.0);
		}else{
			err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<59>";
			if(t_1==1){
				err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<60>";
				this.m_rectAngle=this.m_rectAngle+1.0;
			}else{
				err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<61>";
				if(t_1==2){
					err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<62>";
					this.m_circleAngle=this.m_circleAngle+1.0;
				}else{
					err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<63>";
					if(t_1==3){
						err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<64>";
						this.m_triAngle=this.m_triAngle+1.0;
					}
				}
			}
		}
	}
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<67>";
	if((bb_input_KeyDown(2))!=0){
		err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<68>";
		var t_2=this.m_mouseObject;
		err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<69>";
		if(t_2==0){
			err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<70>";
			var t_3=this.m_constVec;
			this.m_constVec.p_Angle2(t_3.p_Angle()-1.0);
		}else{
			err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<71>";
			if(t_2==1){
				err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<72>";
				this.m_rectAngle=this.m_rectAngle-1.0;
			}else{
				err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<73>";
				if(t_2==2){
					err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<74>";
					this.m_circleAngle=this.m_circleAngle-1.0;
				}else{
					err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<75>";
					if(t_2==3){
						err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<76>";
						this.m_triAngle=this.m_triAngle-1.0;
					}
				}
			}
		}
	}
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<80>";
	if((bb_input_KeyHit(32))!=0){
		err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<81>";
		this.m_mouseObject+=1;
		err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<82>";
		if(this.m_mouseObject>=4){
			err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<82>";
			this.m_mouseObject=0;
		}
	}
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<85>";
	this.m_mouse.p_Set(bb_input_MouseX(),bb_input_MouseY());
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<87>";
	var t_32=this.m_mouseObject;
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<88>";
	if(t_32==0){
		err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<89>";
		this.m_line.p_Set4(this.m_mouse,this.m_mouse.p_Add2(this.m_constVec));
	}else{
		err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<90>";
		if(t_32==1){
			err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<91>";
			this.m_rect.p_SetLocation(this.m_mouse);
			err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<92>";
			this.m_rect.p_Rotate(this.m_rectAngle);
		}else{
			err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<93>";
			if(t_32==2){
				err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<94>";
				this.m_circle.p_SetLocation(this.m_mouse);
				err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<95>";
				this.m_circle.p_Rotate(this.m_circleAngle);
			}else{
				err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<96>";
				if(t_32==3){
					err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<97>";
					this.m_tri.p_SetLocation(this.m_mouse);
					err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<98>";
					this.m_tri.p_Rotate(this.m_triAngle);
				}
			}
		}
	}
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<102>";
	this.m_intersectsCircle=this.m_circle.p_Intersects(this.m_line) || this.m_circle.p_Intersects(this.m_rect) || this.m_circle.p_Intersects(this.m_tri);
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<103>";
	this.m_intersectsRect=this.m_rect.p_Intersects(this.m_line) || this.m_rect.p_Intersects(this.m_circle) || this.m_rect.p_Intersects(this.m_tri);
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<104>";
	this.m_intersectsLine=this.m_line.p_Intersects(this.m_circle) || this.m_line.p_Intersects(this.m_rect) || this.m_line.p_Intersects(this.m_tri);
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<105>";
	this.m_intersectsTri=this.m_tri.p_Intersects(this.m_circle) || this.m_tri.p_Intersects(this.m_rect) || this.m_tri.p_Intersects(this.m_line);
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<107>";
	pop_err();
	return 0;
}
c_Game.prototype.p_OnRender=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<112>";
	bb_graphics_Cls(0.0,0.0,0.0);
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<114>";
	var t_4=this.m_intersectsCircle;
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<115>";
	if(t_4==true){
		err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<116>";
		bb_graphics_SetColor(255.0,0.0,0.0);
	}else{
		err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<117>";
		if(t_4==false){
			err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<118>";
			bb_graphics_SetColor(0.0,255.0,0.0);
		}
	}
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<121>";
	this.m_circle.p_Draw();
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<127>";
	var t_5=this.m_intersectsRect;
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<128>";
	if(t_5==true){
		err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<129>";
		bb_graphics_SetColor(255.0,0.0,0.0);
	}else{
		err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<130>";
		if(t_5==false){
			err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<131>";
			bb_graphics_SetColor(0.0,255.0,0.0);
		}
	}
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<134>";
	this.m_rect.p_Draw();
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<138>";
	var t_6=this.m_intersectsLine;
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<139>";
	if(t_6==true){
		err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<140>";
		bb_graphics_SetColor(255.0,0.0,0.0);
	}else{
		err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<141>";
		if(t_6==false){
			err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<142>";
			bb_graphics_SetColor(0.0,255.0,0.0);
		}
	}
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<144>";
	this.m_line.p_Draw();
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<147>";
	var t_7=this.m_intersectsTri;
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<148>";
	if(t_7==true){
		err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<149>";
		bb_graphics_SetColor(255.0,0.0,0.0);
	}else{
		err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<150>";
		if(t_7==false){
			err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<151>";
			bb_graphics_SetColor(0.0,255.0,0.0);
		}
	}
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<153>";
	this.m_tri.p_Draw();
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<166>";
	bb_graphics_SetColor(255.0,255.0,255.0);
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<167>";
	var t_8=this.m_mouseObject;
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<168>";
	if(t_8==0){
		err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<169>";
		bb_graphics_DrawText("Shape: Line (SPACE to change)",2.0,2.0,0.0,0.0);
	}else{
		err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<170>";
		if(t_8==1){
			err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<171>";
			bb_graphics_DrawText("Shape: Rectangle (SPACE to change)",2.0,2.0,0.0,0.0);
		}else{
			err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<172>";
			if(t_8==2){
				err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<173>";
				bb_graphics_DrawText("Shape: Circle (SPACE to change)",2.0,2.0,0.0,0.0);
			}
		}
	}
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<176>";
	bb_graphics_DrawText("LMB: rotate to counter-clockwise",2.0,14.0,0.0,0.0);
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<177>";
	bb_graphics_DrawText("RMB: rotate to clockwise",2.0,26.0,0.0,0.0);
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<179>";
	pop_err();
	return 0;
}
c_Game.prototype.p_OnLoading=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<185>";
	pop_err();
	return 0;
}
c_Game.prototype.p_OnSuspend=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<199>";
	pop_err();
	return 0;
}
c_Game.prototype.p_OnResume=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<205>";
	pop_err();
	return 0;
}
c_Game.prototype.p_OnClose=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<213>";
	var t_=c_App.prototype.p_OnClose.call(this);
	pop_err();
	return t_;
}
c_Game.prototype.p_OnBack=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<219>";
	var t_=c_App.prototype.p_OnBack.call(this);
	pop_err();
	return t_;
}
var bb_app__app=null;
function c_GameDelegate(){
	BBGameDelegate.call(this);
	this.m__graphics=null;
	this.m__audio=null;
	this.m__input=null;
}
c_GameDelegate.prototype=extend_class(BBGameDelegate);
c_GameDelegate.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<24>";
	pop_err();
	return this;
}
c_GameDelegate.prototype.StartGame=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<33>";
	this.m__graphics=(new gxtkGraphics);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<34>";
	bb_graphics_SetGraphicsDevice(this.m__graphics);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<35>";
	bb_graphics_SetFont(null,32);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<37>";
	this.m__audio=(new gxtkAudio);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<38>";
	bb_audio_SetAudioDevice(this.m__audio);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<40>";
	this.m__input=c_InputDevice.m_new.call(new c_InputDevice);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<41>";
	bb_input_SetInputDevice(this.m__input);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<43>";
	bb_app__app.p_OnCreate();
	pop_err();
}
c_GameDelegate.prototype.SuspendGame=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<47>";
	bb_app__app.p_OnSuspend();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<48>";
	this.m__audio.Suspend();
	pop_err();
}
c_GameDelegate.prototype.ResumeGame=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<52>";
	this.m__audio.Resume();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<53>";
	bb_app__app.p_OnResume();
	pop_err();
}
c_GameDelegate.prototype.UpdateGame=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<57>";
	this.m__input.p_BeginUpdate();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<58>";
	bb_app__app.p_OnUpdate();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<59>";
	this.m__input.p_EndUpdate();
	pop_err();
}
c_GameDelegate.prototype.RenderGame=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<63>";
	var t_mode=this.m__graphics.BeginRender();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<64>";
	if((t_mode)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/app.monkey<64>";
		bb_graphics_BeginRender();
	}
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<65>";
	if(t_mode==2){
		err_info="C:/MonkeyX77a/modules/mojo/app.monkey<65>";
		bb_app__app.p_OnLoading();
	}else{
		err_info="C:/MonkeyX77a/modules/mojo/app.monkey<65>";
		bb_app__app.p_OnRender();
	}
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<66>";
	if((t_mode)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/app.monkey<66>";
		bb_graphics_EndRender();
	}
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<67>";
	this.m__graphics.EndRender();
	pop_err();
}
c_GameDelegate.prototype.KeyEvent=function(t_event,t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<71>";
	this.m__input.p_KeyEvent(t_event,t_data);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<72>";
	if(t_event!=1){
		pop_err();
		return;
	}
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<73>";
	var t_1=t_data;
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<74>";
	if(t_1==432){
		err_info="C:/MonkeyX77a/modules/mojo/app.monkey<75>";
		bb_app__app.p_OnClose();
	}else{
		err_info="C:/MonkeyX77a/modules/mojo/app.monkey<76>";
		if(t_1==416){
			err_info="C:/MonkeyX77a/modules/mojo/app.monkey<77>";
			bb_app__app.p_OnBack();
		}
	}
	pop_err();
}
c_GameDelegate.prototype.MouseEvent=function(t_event,t_data,t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<82>";
	this.m__input.p_MouseEvent(t_event,t_data,t_x,t_y);
	pop_err();
}
c_GameDelegate.prototype.TouchEvent=function(t_event,t_data,t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<86>";
	this.m__input.p_TouchEvent(t_event,t_data,t_x,t_y);
	pop_err();
}
c_GameDelegate.prototype.MotionEvent=function(t_event,t_data,t_x,t_y,t_z){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<90>";
	this.m__input.p_MotionEvent(t_event,t_data,t_x,t_y,t_z);
	pop_err();
}
c_GameDelegate.prototype.DiscardGraphics=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<94>";
	this.m__graphics.DiscardGraphics();
	pop_err();
}
var bb_app__delegate=null;
var bb_app__game=null;
function bbMain(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<6>";
	c_Game.m_new.call(new c_Game);
	err_info="C:/MonkeyX77a/modules/mgev2/tests/circle2line intersection test.monkey<7>";
	pop_err();
	return 0;
}
var bb_graphics_device=null;
function bb_graphics_SetGraphicsDevice(t_dev){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<59>";
	bb_graphics_device=t_dev;
	pop_err();
	return 0;
}
function c_Image(){
	Object.call(this);
	this.m_surface=null;
	this.m_width=0;
	this.m_height=0;
	this.m_frames=[];
	this.m_flags=0;
	this.m_tx=.0;
	this.m_ty=.0;
	this.m_source=null;
}
c_Image.m_DefaultFlags=0;
c_Image.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<66>";
	pop_err();
	return this;
}
c_Image.prototype.p_SetHandle=function(t_tx,t_ty){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<110>";
	dbg_object(this).m_tx=t_tx;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<111>";
	dbg_object(this).m_ty=t_ty;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<112>";
	dbg_object(this).m_flags=dbg_object(this).m_flags&-2;
	pop_err();
	return 0;
}
c_Image.prototype.p_ApplyFlags=function(t_iflags){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<188>";
	this.m_flags=t_iflags;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<190>";
	if((this.m_flags&2)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<191>";
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<191>";
		var t_=this.m_frames;
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<191>";
		var t_2=0;
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<191>";
		while(t_2<t_.length){
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<191>";
			var t_f=dbg_array(t_,t_2)[dbg_index];
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<191>";
			t_2=t_2+1;
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<192>";
			dbg_object(t_f).m_x+=1;
		}
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<194>";
		this.m_width-=2;
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<197>";
	if((this.m_flags&4)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<198>";
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<198>";
		var t_3=this.m_frames;
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<198>";
		var t_4=0;
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<198>";
		while(t_4<t_3.length){
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<198>";
			var t_f2=dbg_array(t_3,t_4)[dbg_index];
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<198>";
			t_4=t_4+1;
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<199>";
			dbg_object(t_f2).m_y+=1;
		}
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<201>";
		this.m_height-=2;
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<204>";
	if((this.m_flags&1)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<205>";
		this.p_SetHandle((this.m_width)/2.0,(this.m_height)/2.0);
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<208>";
	if(this.m_frames.length==1 && dbg_object(dbg_array(this.m_frames,0)[dbg_index]).m_x==0 && dbg_object(dbg_array(this.m_frames,0)[dbg_index]).m_y==0 && this.m_width==this.m_surface.Width() && this.m_height==this.m_surface.Height()){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<209>";
		this.m_flags|=65536;
	}
	pop_err();
	return 0;
}
c_Image.prototype.p_Init=function(t_surf,t_nframes,t_iflags){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<146>";
	this.m_surface=t_surf;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<148>";
	this.m_width=((this.m_surface.Width()/t_nframes)|0);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<149>";
	this.m_height=this.m_surface.Height();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<151>";
	this.m_frames=new_object_array(t_nframes);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<152>";
	for(var t_i=0;t_i<t_nframes;t_i=t_i+1){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<153>";
		dbg_array(this.m_frames,t_i)[dbg_index]=c_Frame.m_new.call(new c_Frame,t_i*this.m_width,0)
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<156>";
	this.p_ApplyFlags(t_iflags);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<157>";
	pop_err();
	return this;
}
c_Image.prototype.p_Init2=function(t_surf,t_x,t_y,t_iwidth,t_iheight,t_nframes,t_iflags,t_src,t_srcx,t_srcy,t_srcw,t_srch){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<161>";
	this.m_surface=t_surf;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<162>";
	this.m_source=t_src;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<164>";
	this.m_width=t_iwidth;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<165>";
	this.m_height=t_iheight;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<167>";
	this.m_frames=new_object_array(t_nframes);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<169>";
	var t_ix=t_x;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<169>";
	var t_iy=t_y;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<171>";
	for(var t_i=0;t_i<t_nframes;t_i=t_i+1){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<172>";
		if(t_ix+this.m_width>t_srcw){
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<173>";
			t_ix=0;
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<174>";
			t_iy+=this.m_height;
		}
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<176>";
		if(t_ix+this.m_width>t_srcw || t_iy+this.m_height>t_srch){
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<177>";
			error("Image frame outside surface");
		}
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<179>";
		dbg_array(this.m_frames,t_i)[dbg_index]=c_Frame.m_new.call(new c_Frame,t_ix+t_srcx,t_iy+t_srcy)
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<180>";
		t_ix+=this.m_width;
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<183>";
	this.p_ApplyFlags(t_iflags);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<184>";
	pop_err();
	return this;
}
c_Image.prototype.p_Width=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<77>";
	pop_err();
	return this.m_width;
}
c_Image.prototype.p_Height=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<81>";
	pop_err();
	return this.m_height;
}
c_Image.prototype.p_Frames=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<89>";
	var t_=this.m_frames.length;
	pop_err();
	return t_;
}
function c_GraphicsContext(){
	Object.call(this);
	this.m_defaultFont=null;
	this.m_font=null;
	this.m_firstChar=0;
	this.m_matrixSp=0;
	this.m_ix=1.0;
	this.m_iy=.0;
	this.m_jx=.0;
	this.m_jy=1.0;
	this.m_tx=.0;
	this.m_ty=.0;
	this.m_tformed=0;
	this.m_matDirty=0;
	this.m_color_r=.0;
	this.m_color_g=.0;
	this.m_color_b=.0;
	this.m_alpha=.0;
	this.m_blend=0;
	this.m_scissor_x=.0;
	this.m_scissor_y=.0;
	this.m_scissor_width=.0;
	this.m_scissor_height=.0;
	this.m_matrixStack=new_number_array(192);
}
c_GraphicsContext.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<25>";
	pop_err();
	return this;
}
c_GraphicsContext.prototype.p_Validate=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<36>";
	if((this.m_matDirty)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<37>";
		bb_graphics_renderDevice.SetMatrix(dbg_object(bb_graphics_context).m_ix,dbg_object(bb_graphics_context).m_iy,dbg_object(bb_graphics_context).m_jx,dbg_object(bb_graphics_context).m_jy,dbg_object(bb_graphics_context).m_tx,dbg_object(bb_graphics_context).m_ty);
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<38>";
		this.m_matDirty=0;
	}
	pop_err();
	return 0;
}
var bb_graphics_context=null;
function bb_data_FixDataPath(t_path){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/data.monkey<3>";
	var t_i=t_path.indexOf(":/",0);
	err_info="C:/MonkeyX77a/modules/mojo/data.monkey<4>";
	if(t_i!=-1 && t_path.indexOf("/",0)==t_i+1){
		err_info="C:/MonkeyX77a/modules/mojo/data.monkey<4>";
		pop_err();
		return t_path;
	}
	err_info="C:/MonkeyX77a/modules/mojo/data.monkey<5>";
	if(string_startswith(t_path,"./") || string_startswith(t_path,"/")){
		err_info="C:/MonkeyX77a/modules/mojo/data.monkey<5>";
		pop_err();
		return t_path;
	}
	err_info="C:/MonkeyX77a/modules/mojo/data.monkey<6>";
	var t_="monkey://data/"+t_path;
	pop_err();
	return t_;
}
function c_Frame(){
	Object.call(this);
	this.m_x=0;
	this.m_y=0;
}
c_Frame.m_new=function(t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<19>";
	dbg_object(this).m_x=t_x;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<20>";
	dbg_object(this).m_y=t_y;
	pop_err();
	return this;
}
c_Frame.m_new2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<14>";
	pop_err();
	return this;
}
function bb_graphics_LoadImage(t_path,t_frameCount,t_flags){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<238>";
	var t_surf=bb_graphics_device.LoadSurface(bb_data_FixDataPath(t_path));
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<239>";
	if((t_surf)!=null){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<239>";
		var t_=(c_Image.m_new.call(new c_Image)).p_Init(t_surf,t_frameCount,t_flags);
		pop_err();
		return t_;
	}
	pop_err();
	return null;
}
function bb_graphics_LoadImage2(t_path,t_frameWidth,t_frameHeight,t_frameCount,t_flags){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<243>";
	var t_surf=bb_graphics_device.LoadSurface(bb_data_FixDataPath(t_path));
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<244>";
	if((t_surf)!=null){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<244>";
		var t_=(c_Image.m_new.call(new c_Image)).p_Init2(t_surf,0,0,t_frameWidth,t_frameHeight,t_frameCount,t_flags,null,0,0,t_surf.Width(),t_surf.Height());
		pop_err();
		return t_;
	}
	pop_err();
	return null;
}
function bb_graphics_SetFont(t_font,t_firstChar){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<545>";
	if(!((t_font)!=null)){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<546>";
		if(!((dbg_object(bb_graphics_context).m_defaultFont)!=null)){
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<547>";
			dbg_object(bb_graphics_context).m_defaultFont=bb_graphics_LoadImage("mojo_font.png",96,2);
		}
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<549>";
		t_font=dbg_object(bb_graphics_context).m_defaultFont;
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<550>";
		t_firstChar=32;
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<552>";
	dbg_object(bb_graphics_context).m_font=t_font;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<553>";
	dbg_object(bb_graphics_context).m_firstChar=t_firstChar;
	pop_err();
	return 0;
}
var bb_audio_device=null;
function bb_audio_SetAudioDevice(t_dev){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/audio.monkey<18>";
	bb_audio_device=t_dev;
	pop_err();
	return 0;
}
function c_InputDevice(){
	Object.call(this);
	this.m__joyStates=new_object_array(4);
	this.m__keyDown=new_bool_array(512);
	this.m__keyHitPut=0;
	this.m__keyHitQueue=new_number_array(33);
	this.m__keyHit=new_number_array(512);
	this.m__charGet=0;
	this.m__charPut=0;
	this.m__charQueue=new_number_array(32);
	this.m__mouseX=.0;
	this.m__mouseY=.0;
	this.m__touchX=new_number_array(32);
	this.m__touchY=new_number_array(32);
	this.m__accelX=.0;
	this.m__accelY=.0;
	this.m__accelZ=.0;
}
c_InputDevice.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<22>";
	for(var t_i=0;t_i<4;t_i=t_i+1){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<23>";
		dbg_array(this.m__joyStates,t_i)[dbg_index]=c_JoyState.m_new.call(new c_JoyState)
	}
	pop_err();
	return this;
}
c_InputDevice.prototype.p_PutKeyHit=function(t_key){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<233>";
	if(this.m__keyHitPut==this.m__keyHitQueue.length){
		pop_err();
		return;
	}
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<234>";
	dbg_array(this.m__keyHit,t_key)[dbg_index]+=1
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<235>";
	dbg_array(this.m__keyHitQueue,this.m__keyHitPut)[dbg_index]=t_key
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<236>";
	this.m__keyHitPut+=1;
	pop_err();
}
c_InputDevice.prototype.p_BeginUpdate=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<185>";
	for(var t_i=0;t_i<4;t_i=t_i+1){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<186>";
		var t_state=dbg_array(this.m__joyStates,t_i)[dbg_index];
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<187>";
		if(!BBGame.Game().PollJoystick(t_i,dbg_object(t_state).m_joyx,dbg_object(t_state).m_joyy,dbg_object(t_state).m_joyz,dbg_object(t_state).m_buttons)){
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<187>";
			break;
		}
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<188>";
		for(var t_j=0;t_j<32;t_j=t_j+1){
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<189>";
			var t_key=256+t_i*32+t_j;
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<190>";
			if(dbg_array(dbg_object(t_state).m_buttons,t_j)[dbg_index]){
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<191>";
				if(!dbg_array(this.m__keyDown,t_key)[dbg_index]){
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<192>";
					dbg_array(this.m__keyDown,t_key)[dbg_index]=true
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<193>";
					this.p_PutKeyHit(t_key);
				}
			}else{
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<196>";
				dbg_array(this.m__keyDown,t_key)[dbg_index]=false
			}
		}
	}
	pop_err();
}
c_InputDevice.prototype.p_EndUpdate=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<203>";
	for(var t_i=0;t_i<this.m__keyHitPut;t_i=t_i+1){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<204>";
		dbg_array(this.m__keyHit,dbg_array(this.m__keyHitQueue,t_i)[dbg_index])[dbg_index]=0
	}
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<206>";
	this.m__keyHitPut=0;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<207>";
	this.m__charGet=0;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<208>";
	this.m__charPut=0;
	pop_err();
}
c_InputDevice.prototype.p_KeyEvent=function(t_event,t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<107>";
	var t_1=t_event;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<108>";
	if(t_1==1){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<109>";
		if(!dbg_array(this.m__keyDown,t_data)[dbg_index]){
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<110>";
			dbg_array(this.m__keyDown,t_data)[dbg_index]=true
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<111>";
			this.p_PutKeyHit(t_data);
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<112>";
			if(t_data==1){
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<113>";
				dbg_array(this.m__keyDown,384)[dbg_index]=true
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<114>";
				this.p_PutKeyHit(384);
			}else{
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<115>";
				if(t_data==384){
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<116>";
					dbg_array(this.m__keyDown,1)[dbg_index]=true
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<117>";
					this.p_PutKeyHit(1);
				}
			}
		}
	}else{
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<120>";
		if(t_1==2){
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<121>";
			if(dbg_array(this.m__keyDown,t_data)[dbg_index]){
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<122>";
				dbg_array(this.m__keyDown,t_data)[dbg_index]=false
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<123>";
				if(t_data==1){
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<124>";
					dbg_array(this.m__keyDown,384)[dbg_index]=false
				}else{
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<125>";
					if(t_data==384){
						err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<126>";
						dbg_array(this.m__keyDown,1)[dbg_index]=false
					}
				}
			}
		}else{
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<129>";
			if(t_1==3){
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<130>";
				if(this.m__charPut<this.m__charQueue.length){
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<131>";
					dbg_array(this.m__charQueue,this.m__charPut)[dbg_index]=t_data
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<132>";
					this.m__charPut+=1;
				}
			}
		}
	}
	pop_err();
}
c_InputDevice.prototype.p_MouseEvent=function(t_event,t_data,t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<138>";
	var t_2=t_event;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<139>";
	if(t_2==4){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<140>";
		this.p_KeyEvent(1,1+t_data);
	}else{
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<141>";
		if(t_2==5){
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<142>";
			this.p_KeyEvent(2,1+t_data);
			pop_err();
			return;
		}else{
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<144>";
			if(t_2==6){
			}else{
				pop_err();
				return;
			}
		}
	}
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<148>";
	this.m__mouseX=t_x;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<149>";
	this.m__mouseY=t_y;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<150>";
	dbg_array(this.m__touchX,0)[dbg_index]=t_x
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<151>";
	dbg_array(this.m__touchY,0)[dbg_index]=t_y
	pop_err();
}
c_InputDevice.prototype.p_TouchEvent=function(t_event,t_data,t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<155>";
	var t_3=t_event;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<156>";
	if(t_3==7){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<157>";
		this.p_KeyEvent(1,384+t_data);
	}else{
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<158>";
		if(t_3==8){
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<159>";
			this.p_KeyEvent(2,384+t_data);
			pop_err();
			return;
		}else{
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<161>";
			if(t_3==9){
			}else{
				pop_err();
				return;
			}
		}
	}
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<165>";
	dbg_array(this.m__touchX,t_data)[dbg_index]=t_x
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<166>";
	dbg_array(this.m__touchY,t_data)[dbg_index]=t_y
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<167>";
	if(t_data==0){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<168>";
		this.m__mouseX=t_x;
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<169>";
		this.m__mouseY=t_y;
	}
	pop_err();
}
c_InputDevice.prototype.p_MotionEvent=function(t_event,t_data,t_x,t_y,t_z){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<174>";
	var t_4=t_event;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<175>";
	if(t_4==10){
	}else{
		pop_err();
		return;
	}
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<179>";
	this.m__accelX=t_x;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<180>";
	this.m__accelY=t_y;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<181>";
	this.m__accelZ=t_z;
	pop_err();
}
c_InputDevice.prototype.p_MouseX=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<65>";
	pop_err();
	return this.m__mouseX;
}
c_InputDevice.prototype.p_MouseY=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<69>";
	pop_err();
	return this.m__mouseY;
}
c_InputDevice.prototype.p_KeyDown=function(t_key){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<43>";
	if(t_key>0 && t_key<512){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<43>";
		pop_err();
		return dbg_array(this.m__keyDown,t_key)[dbg_index];
	}
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<44>";
	pop_err();
	return false;
}
c_InputDevice.prototype.p_KeyHit=function(t_key){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<48>";
	if(t_key>0 && t_key<512){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<48>";
		pop_err();
		return dbg_array(this.m__keyHit,t_key)[dbg_index];
	}
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<49>";
	pop_err();
	return 0;
}
function c_JoyState(){
	Object.call(this);
	this.m_joyx=new_number_array(2);
	this.m_joyy=new_number_array(2);
	this.m_joyz=new_number_array(2);
	this.m_buttons=new_bool_array(32);
}
c_JoyState.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<10>";
	pop_err();
	return this;
}
var bb_input_device=null;
function bb_input_SetInputDevice(t_dev){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/input.monkey<18>";
	bb_input_device=t_dev;
	pop_err();
	return 0;
}
var bb_graphics_renderDevice=null;
function bb_graphics_SetMatrix(t_ix,t_iy,t_jx,t_jy,t_tx,t_ty){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<311>";
	dbg_object(bb_graphics_context).m_ix=t_ix;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<312>";
	dbg_object(bb_graphics_context).m_iy=t_iy;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<313>";
	dbg_object(bb_graphics_context).m_jx=t_jx;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<314>";
	dbg_object(bb_graphics_context).m_jy=t_jy;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<315>";
	dbg_object(bb_graphics_context).m_tx=t_tx;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<316>";
	dbg_object(bb_graphics_context).m_ty=t_ty;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<317>";
	dbg_object(bb_graphics_context).m_tformed=((t_ix!=1.0 || t_iy!=0.0 || t_jx!=0.0 || t_jy!=1.0 || t_tx!=0.0 || t_ty!=0.0)?1:0);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<318>";
	dbg_object(bb_graphics_context).m_matDirty=1;
	pop_err();
	return 0;
}
function bb_graphics_SetMatrix2(t_m){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<307>";
	bb_graphics_SetMatrix(dbg_array(t_m,0)[dbg_index],dbg_array(t_m,1)[dbg_index],dbg_array(t_m,2)[dbg_index],dbg_array(t_m,3)[dbg_index],dbg_array(t_m,4)[dbg_index],dbg_array(t_m,5)[dbg_index]);
	pop_err();
	return 0;
}
function bb_graphics_SetColor(t_r,t_g,t_b){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<253>";
	dbg_object(bb_graphics_context).m_color_r=t_r;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<254>";
	dbg_object(bb_graphics_context).m_color_g=t_g;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<255>";
	dbg_object(bb_graphics_context).m_color_b=t_b;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<256>";
	bb_graphics_renderDevice.SetColor(t_r,t_g,t_b);
	pop_err();
	return 0;
}
function bb_graphics_SetAlpha(t_alpha){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<270>";
	dbg_object(bb_graphics_context).m_alpha=t_alpha;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<271>";
	bb_graphics_renderDevice.SetAlpha(t_alpha);
	pop_err();
	return 0;
}
function bb_graphics_SetBlend(t_blend){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<279>";
	dbg_object(bb_graphics_context).m_blend=t_blend;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<280>";
	bb_graphics_renderDevice.SetBlend(t_blend);
	pop_err();
	return 0;
}
function bb_graphics_DeviceWidth(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<230>";
	var t_=bb_graphics_device.Width();
	pop_err();
	return t_;
}
function bb_graphics_DeviceHeight(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<234>";
	var t_=bb_graphics_device.Height();
	pop_err();
	return t_;
}
function bb_graphics_SetScissor(t_x,t_y,t_width,t_height){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<288>";
	dbg_object(bb_graphics_context).m_scissor_x=t_x;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<289>";
	dbg_object(bb_graphics_context).m_scissor_y=t_y;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<290>";
	dbg_object(bb_graphics_context).m_scissor_width=t_width;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<291>";
	dbg_object(bb_graphics_context).m_scissor_height=t_height;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<292>";
	bb_graphics_renderDevice.SetScissor(((t_x)|0),((t_y)|0),((t_width)|0),((t_height)|0));
	pop_err();
	return 0;
}
function bb_graphics_BeginRender(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<216>";
	bb_graphics_renderDevice=bb_graphics_device;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<217>";
	dbg_object(bb_graphics_context).m_matrixSp=0;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<218>";
	bb_graphics_SetMatrix(1.0,0.0,0.0,1.0,0.0,0.0);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<219>";
	bb_graphics_SetColor(255.0,255.0,255.0);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<220>";
	bb_graphics_SetAlpha(1.0);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<221>";
	bb_graphics_SetBlend(0);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<222>";
	bb_graphics_SetScissor(0.0,0.0,(bb_graphics_DeviceWidth()),(bb_graphics_DeviceHeight()));
	pop_err();
	return 0;
}
function bb_graphics_EndRender(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<226>";
	bb_graphics_renderDevice=null;
	pop_err();
	return 0;
}
function c_BBGameEvent(){
	Object.call(this);
}
function bb_app_EndApp(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<186>";
	error("");
	pop_err();
	return 0;
}
var bb_app__updateRate=0;
function bb_app_SetUpdateRate(t_hertz){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<151>";
	bb_app__updateRate=t_hertz;
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<152>";
	bb_app__game.SetUpdateRate(t_hertz);
	pop_err();
	return 0;
}
function c_Component(){
	Object.call(this);
	this.implments={c_IComponent:1};
}
c_Component.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/component/component.monkey<13>";
	pop_err();
	return this;
}
function c_Shape(){
	c_Component.call(this);
	this.m_pointsDirty=false;
	this.m_center=c_Vector.m_new.call(new c_Vector,0.0,0.0);
	this.m_points=[];
	this.m_min=c_Vector.m_new.call(new c_Vector,0.0,0.0);
	this.m_max=c_Vector.m_new.call(new c_Vector,0.0,0.0);
	this.m_rotation=0.0;
	this.implments={c_IShape:1,c_IComponent:1};
}
c_Shape.prototype=extend_class(c_Component);
c_Shape.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<11>";
	c_Component.m_new.call(this);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<12>";
	this.m_pointsDirty=true;
	pop_err();
	return this;
}
c_Shape.prototype.p_CreatePoints=function(){
}
c_Shape.prototype.p_FindCenter=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<156>";
	if(this.m_center==null){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<156>";
		this.m_center=c_Vector.m_new.call(new c_Vector,0.0,0.0);
	}
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<170>";
	dbg_object(this.m_center).m_x=dbg_object(this.m_min).m_x+(dbg_object(this.m_max).m_x-dbg_object(this.m_min).m_x)/2.0;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<171>";
	dbg_object(this.m_center).m_y=dbg_object(this.m_min).m_y+(dbg_object(this.m_max).m_y-dbg_object(this.m_min).m_y)/2.0;
	pop_err();
}
c_Shape.prototype.p_CheckPoints=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<134>";
	if(this.m_pointsDirty){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<135>";
		this.p_CreatePoints();
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<136>";
		this.p_FindCenter();
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<139>";
		if(this.m_points.length>0){
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<140>";
			this.m_min.p_Set2(dbg_array(this.m_points,0)[dbg_index]);
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<141>";
			this.m_max.p_Set2(this.m_min);
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<143>";
			for(var t_i=0;t_i<this.m_points.length;t_i=t_i+1){
				err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<144>";
				dbg_object(this.m_max).m_x=bb_math2_Max2(dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_x,dbg_object(this.m_max).m_x);
				err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<145>";
				dbg_object(this.m_max).m_y=bb_math2_Max2(dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_y,dbg_object(this.m_max).m_y);
				err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<146>";
				dbg_object(this.m_min).m_x=bb_math2_Min2(dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_x,dbg_object(this.m_min).m_x);
				err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<147>";
				dbg_object(this.m_min).m_y=bb_math2_Min2(dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_y,dbg_object(this.m_min).m_y);
			}
		}
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<151>";
		this.m_pointsDirty=false;
	}
	pop_err();
}
c_Shape.prototype.p_SetX=function(t_x){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<24>";
	if(t_x!=dbg_object(this.m_center).m_x){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<25>";
		var t_dx=t_x-dbg_object(this.m_center).m_x;
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<27>";
		if(dbg_array(this.m_points,0)[dbg_index]==null || this.m_center==null){
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<28>";
			this.p_CheckPoints();
		}
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<31>";
		for(var t_i=0;t_i<this.m_points.length;t_i=t_i+1){
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<32>";
			dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_x+=t_dx;
		}
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<35>";
		dbg_object(this.m_center).m_x+=t_dx;
	}
	pop_err();
}
c_Shape.prototype.p_SetY=function(t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<46>";
	if(t_y!=dbg_object(this.m_center).m_y){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<47>";
		var t_dy=t_y-dbg_object(this.m_center).m_y;
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<49>";
		if(dbg_array(this.m_points,0)[dbg_index]==null || this.m_center==null){
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<50>";
			this.p_CheckPoints();
		}
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<53>";
		for(var t_i=0;t_i<this.m_points.length;t_i=t_i+1){
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<54>";
			dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_y+=t_dy;
		}
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<57>";
		dbg_object(this.m_center).m_y+=t_dy;
	}
	pop_err();
}
c_Shape.prototype.p_SetLocation=function(t_location){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<68>";
	this.p_SetX(dbg_object(t_location).m_x);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<69>";
	this.p_SetY(dbg_object(t_location).m_y);
	pop_err();
}
c_Shape.prototype.p_Rotate=function(t_toAngle){
}
c_Shape.prototype.p_Intersects=function(t_other){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<175>";
	this.p_CheckPoints();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<177>";
	var t_result=false;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<178>";
	var t_unknownA=.0;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<178>";
	var t_unknownB=.0;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<179>";
	var t_nextI=0;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<179>";
	var t_nextJ=0;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<185>";
	for(var t_i=0;t_i<this.m_points.length;t_i=t_i+1){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<186>";
		t_nextI=t_i+1;
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<187>";
		if(t_nextI>=this.m_points.length){
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<187>";
			t_nextI=0;
		}
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<189>";
		for(var t_j=0;t_j<dbg_object(t_other).m_points.length;t_j=t_j+1){
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<190>";
			t_nextJ=t_j+1;
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<191>";
			if(t_nextJ>=dbg_object(t_other).m_points.length){
				err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<191>";
				t_nextJ=0;
			}
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<193>";
			t_unknownA=((dbg_object(dbg_array(this.m_points,t_nextI)[dbg_index]).m_x-dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_x)*(dbg_object(dbg_array(dbg_object(t_other).m_points,t_j)[dbg_index]).m_y-dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_y)-(dbg_object(dbg_array(this.m_points,t_nextI)[dbg_index]).m_y-dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_y)*(dbg_object(dbg_array(dbg_object(t_other).m_points,t_j)[dbg_index]).m_x-dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_x))/((dbg_object(dbg_array(this.m_points,t_nextI)[dbg_index]).m_y-dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_y)*(dbg_object(dbg_array(dbg_object(t_other).m_points,t_nextJ)[dbg_index]).m_x-dbg_object(dbg_array(dbg_object(t_other).m_points,t_j)[dbg_index]).m_x)-(dbg_object(dbg_array(this.m_points,t_nextI)[dbg_index]).m_x-dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_x)*(dbg_object(dbg_array(dbg_object(t_other).m_points,t_nextJ)[dbg_index]).m_y-dbg_object(dbg_array(dbg_object(t_other).m_points,t_j)[dbg_index]).m_y));
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<194>";
			t_unknownB=((dbg_object(dbg_array(dbg_object(t_other).m_points,t_nextJ)[dbg_index]).m_x-dbg_object(dbg_array(dbg_object(t_other).m_points,t_j)[dbg_index]).m_x)*(dbg_object(dbg_array(dbg_object(t_other).m_points,t_j)[dbg_index]).m_y-dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_y)-(dbg_object(dbg_array(dbg_object(t_other).m_points,t_nextJ)[dbg_index]).m_y-dbg_object(dbg_array(dbg_object(t_other).m_points,t_j)[dbg_index]).m_y)*(dbg_object(dbg_array(dbg_object(t_other).m_points,t_j)[dbg_index]).m_x-dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_x))/((dbg_object(dbg_array(this.m_points,t_nextI)[dbg_index]).m_y-dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_y)*(dbg_object(dbg_array(dbg_object(t_other).m_points,t_nextJ)[dbg_index]).m_x-dbg_object(dbg_array(dbg_object(t_other).m_points,t_j)[dbg_index]).m_x)-(dbg_object(dbg_array(this.m_points,t_nextI)[dbg_index]).m_x-dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_x)*(dbg_object(dbg_array(dbg_object(t_other).m_points,t_nextJ)[dbg_index]).m_y-dbg_object(dbg_array(dbg_object(t_other).m_points,t_j)[dbg_index]).m_y));
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<196>";
			if(t_unknownA>=0.0 && t_unknownA<=1.0 && t_unknownB>=0.0 && t_unknownB<=1.0){
				err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<197>";
				t_result=true;
				err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<198>";
				break;
			}
		}
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<202>";
		if(t_result){
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<203>";
			break;
		}
	}
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<207>";
	pop_err();
	return t_result;
}
c_Shape.prototype.p_GetPoints=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<123>";
	pop_err();
	return this.m_points;
}
c_Shape.prototype.p_Draw=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<223>";
	this.p_CheckPoints();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<225>";
	var t_iNext=0;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<226>";
	for(var t_i=0;t_i<this.m_points.length;t_i=t_i+1){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<227>";
		t_iNext=t_i+1;
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<228>";
		if(t_iNext>=this.m_points.length){
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<228>";
			t_iNext=0;
		}
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<230>";
		bb_graphics_DrawLine(dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_x,dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_y,dbg_object(dbg_array(this.m_points,t_iNext)[dbg_index]).m_x,dbg_object(dbg_array(this.m_points,t_iNext)[dbg_index]).m_y);
	}
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<233>";
	bb_graphics_DrawCircle(dbg_object(this.m_center).m_x,dbg_object(this.m_center).m_y,2.0);
	pop_err();
}
function c_Circle(){
	c_Shape.call(this);
	this.m_radius=.0;
	this.m_segments=0;
	this.m_rectLines=new_object_array(4);
	this.m_projection=c_Vector.m_new.call(new c_Vector,0.0,0.0);
	this.implments={c_IShape:1,c_IComponent:1};
}
c_Circle.prototype=extend_class(c_Shape);
c_Circle.m_new=function(t_x,t_y,t_radius,t_segment_count){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<524>";
	c_Shape.m_new.call(this);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<525>";
	dbg_object(dbg_object(this).m_center).m_x=t_x;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<526>";
	dbg_object(dbg_object(this).m_center).m_y=t_y;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<527>";
	dbg_object(this).m_radius=t_radius;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<528>";
	dbg_object(this).m_segments=t_segment_count;
	pop_err();
	return this;
}
c_Circle.m_new2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<516>";
	c_Shape.m_new.call(this);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<516>";
	pop_err();
	return this;
}
c_Circle.prototype.p_CreatePoints=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<623>";
	var t_tempPoints=c_List.m_new.call(new c_List);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<625>";
	this.m_min.p_Set(9999.0,9999.0);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<626>";
	this.m_max.p_Set(-9999.0,-9999.0);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<628>";
	var t_start=0.0;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<629>";
	var t_stop=359.0;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<631>";
	var t_lstep=((360/this.m_segments)|0);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<633>";
	var t_ang=.0;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<633>";
	var t_a=t_start;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<633>";
	var t_newX=.0;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<633>";
	var t_newY=.0;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<635>";
	while(t_a<=t_stop+(t_lstep)){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<636>";
		t_ang=t_a;
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<637>";
		if(t_ang>t_stop){
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<637>";
			t_ang=t_stop;
		}
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<639>";
		t_newX=dbg_object(this.m_center).m_x+Math.cos((t_ang+this.m_rotation)*D2R)*this.m_radius;
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<640>";
		t_newY=dbg_object(this.m_center).m_y-Math.sin((t_ang+this.m_rotation)*D2R)*this.m_radius;
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<642>";
		if(t_newX<dbg_object(this.m_min).m_x){
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<642>";
			dbg_object(this.m_min).m_x=t_newX;
		}
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<643>";
		if(t_newY<dbg_object(this.m_min).m_y){
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<643>";
			dbg_object(this.m_min).m_y=t_newY;
		}
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<644>";
		if(t_newX>dbg_object(this.m_max).m_x){
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<644>";
			dbg_object(this.m_max).m_x=t_newX;
		}
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<645>";
		if(t_newY>dbg_object(this.m_max).m_y){
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<645>";
			dbg_object(this.m_max).m_y=t_newY;
		}
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<647>";
		t_tempPoints.p_AddLast(c_Vector.m_new.call(new c_Vector,t_newX,t_newY));
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<648>";
		t_a=t_a+(t_lstep);
	}
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<651>";
	this.m_points=t_tempPoints.p_ToArray();
	pop_err();
}
c_Circle.prototype.p_Rotate=function(t_toAngle){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<532>";
	this.m_rotation=t_toAngle;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<533>";
	this.p_CreatePoints();
	pop_err();
}
c_Circle.prototype.p_IntersectLine=function(t_line){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<608>";
	var t_circleToLine=c_Vector.m_MakeBetween(this.m_center,dbg_object(t_line).m_p1);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<609>";
	var t_lineVec=c_Vector.m_MakeBetween(dbg_object(t_line).m_p2,dbg_object(t_line).m_p1);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<611>";
	var t_amt=t_lineVec.p_ProjectionAmount(t_circleToLine);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<613>";
	t_amt=bb_math2_Min2(1.0,bb_math2_Max2(0.0,t_amt));
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<615>";
	this.m_projection.p_Set2(dbg_object(t_line).m_p1.p_Add2(t_lineVec.p_Multiply2(t_amt)));
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<617>";
	var t_distance=this.m_projection.p_DistanceTo(this.m_center);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<619>";
	var t_=t_distance<=this.m_radius;
	pop_err();
	return t_;
}
c_Circle.prototype.p_IntersectRectangle=function(t_rect){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<577>";
	if(t_rect.p_ContainsPoint(dbg_object(this.m_center).m_x,dbg_object(this.m_center).m_y)){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<577>";
		pop_err();
		return true;
	}
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<579>";
	var t_rectPoints=t_rect.p_GetPoints();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<581>";
	if(dbg_array(this.m_rectLines,0)[dbg_index]==null){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<582>";
		this.m_rectLines=new_object_array(4);
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<584>";
		dbg_array(this.m_rectLines,0)[dbg_index]=c_Line.m_new.call(new c_Line,0.0,0.0,0.0,0.0)
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<585>";
		dbg_array(this.m_rectLines,1)[dbg_index]=c_Line.m_new.call(new c_Line,0.0,0.0,0.0,0.0)
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<586>";
		dbg_array(this.m_rectLines,2)[dbg_index]=c_Line.m_new.call(new c_Line,0.0,0.0,0.0,0.0)
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<587>";
		dbg_array(this.m_rectLines,3)[dbg_index]=c_Line.m_new.call(new c_Line,0.0,0.0,0.0,0.0)
	}
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<590>";
	if(t_rectPoints.length==0){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<590>";
		pop_err();
		return false;
	}
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<591>";
	if(dbg_array(t_rectPoints,0)[dbg_index]==null){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<591>";
		pop_err();
		return false;
	}
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<593>";
	dbg_array(this.m_rectLines,0)[dbg_index].p_Set4(dbg_array(t_rectPoints,0)[dbg_index],dbg_array(t_rectPoints,1)[dbg_index]);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<594>";
	dbg_array(this.m_rectLines,1)[dbg_index].p_Set4(dbg_array(t_rectPoints,1)[dbg_index],dbg_array(t_rectPoints,2)[dbg_index]);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<595>";
	dbg_array(this.m_rectLines,2)[dbg_index].p_Set4(dbg_array(t_rectPoints,2)[dbg_index],dbg_array(t_rectPoints,3)[dbg_index]);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<596>";
	dbg_array(this.m_rectLines,3)[dbg_index].p_Set4(dbg_array(t_rectPoints,3)[dbg_index],dbg_array(t_rectPoints,0)[dbg_index]);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<598>";
	var t_result=false;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<599>";
	for(var t_i=0;t_i<4;t_i=t_i+1){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<600>";
		t_result=this.p_IntersectLine(dbg_array(this.m_rectLines,t_i)[dbg_index]);
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<601>";
		if(t_result){
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<601>";
			break;
		}
	}
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<604>";
	pop_err();
	return t_result;
}
c_Circle.prototype.p_Intersects=function(t_other){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<537>";
	if((object_downcast((t_other),c_Circle))!=null){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<538>";
		var t_circle=object_downcast((t_other),c_Circle);
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<540>";
		var t_totalRad=dbg_object(this).m_radius+dbg_object(t_circle).m_radius;
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<542>";
		if(bb_math2_Abs2(dbg_object(dbg_object(t_other).m_center).m_x-dbg_object(this.m_center).m_x)>t_totalRad){
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<542>";
			pop_err();
			return false;
		}
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<543>";
		if(bb_math2_Abs2(dbg_object(dbg_object(t_other).m_center).m_y-dbg_object(this.m_center).m_y)>t_totalRad){
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<543>";
			pop_err();
			return false;
		}
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<545>";
		t_totalRad*=t_totalRad;
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<547>";
		var t_dx=bb_math2_Abs2(dbg_object(dbg_object(t_other).m_center).m_x-dbg_object(this.m_center).m_x);
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<548>";
		var t_dy=bb_math2_Abs2(dbg_object(dbg_object(t_other).m_center).m_y-dbg_object(this.m_center).m_y);
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<550>";
		var t_=t_totalRad>=t_dx*t_dx+t_dy*t_dy;
		pop_err();
		return t_;
	}else{
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<551>";
		if((object_downcast((t_other),c_Rectangle))!=null){
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<552>";
			var t_2=this.p_IntersectRectangle(object_downcast((t_other),c_Rectangle));
			pop_err();
			return t_2;
		}else{
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<553>";
			if((object_downcast((t_other),c_Line))!=null){
				err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<554>";
				var t_3=this.p_IntersectLine(object_downcast((t_other),c_Line));
				pop_err();
				return t_3;
			}else{
				err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<556>";
				var t_4=c_Shape.prototype.p_Intersects.call(this,t_other);
				pop_err();
				return t_4;
			}
		}
	}
}
function c_Vector(){
	Object.call(this);
	this.m_x=.0;
	this.m_y=.0;
}
c_Vector.prototype.p_Set=function(t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<20>";
	dbg_object(this).m_x=t_x;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<21>";
	dbg_object(this).m_y=t_y;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<22>";
	pop_err();
	return this;
}
c_Vector.prototype.p_Set2=function(t_other){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<26>";
	var t_=this.p_Set(dbg_object(t_other).m_x,dbg_object(t_other).m_y);
	pop_err();
	return t_;
}
c_Vector.m_new=function(t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<9>";
	this.p_Set(t_x,t_y);
	pop_err();
	return this;
}
c_Vector.m_new2=function(t_other){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<13>";
	this.p_Set2(t_other);
	pop_err();
	return this;
}
c_Vector.prototype.p_Angle=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<127>";
	var t_=180.0-(Math.atan2(-dbg_object(this).m_y,-dbg_object(this).m_x)*R2D);
	pop_err();
	return t_;
}
c_Vector.prototype.p_Length=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<151>";
	var t_=Math.sqrt(this.m_x*this.m_x+this.m_y*this.m_y);
	pop_err();
	return t_;
}
c_Vector.m_tmpVec=null;
c_Vector.prototype.p_Multiply=function(t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<68>";
	c_Vector.m_tmpVec=c_Vector.m_new2.call(new c_Vector,this);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<69>";
	dbg_object(c_Vector.m_tmpVec).m_x*=t_x;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<70>";
	dbg_object(c_Vector.m_tmpVec).m_y*=t_y;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<71>";
	pop_err();
	return c_Vector.m_tmpVec;
}
c_Vector.prototype.p_Multiply2=function(t_amount){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<75>";
	c_Vector.m_tmpVec=c_Vector.m_new2.call(new c_Vector,this);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<76>";
	dbg_object(c_Vector.m_tmpVec).m_x*=t_amount;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<77>";
	dbg_object(c_Vector.m_tmpVec).m_y*=t_amount;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<78>";
	pop_err();
	return c_Vector.m_tmpVec;
}
c_Vector.prototype.p_Multiply3=function(t_other){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<82>";
	c_Vector.m_tmpVec=c_Vector.m_new2.call(new c_Vector,this);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<83>";
	dbg_object(c_Vector.m_tmpVec).m_x*=dbg_object(t_other).m_x;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<84>";
	dbg_object(c_Vector.m_tmpVec).m_y*=dbg_object(t_other).m_y;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<85>";
	pop_err();
	return c_Vector.m_tmpVec;
}
c_Vector.prototype.p_Length2=function(t_value){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<155>";
	if(t_value==0.0){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<156>";
		dbg_object(this).m_x=0.0;
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<157>";
		dbg_object(this).m_y=0.0;
		pop_err();
		return;
	}
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<161>";
	if(this.p_Length()>0.0){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<162>";
		this.p_Set2(this.p_Multiply2(t_value/this.p_Length()));
	}else{
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<164>";
		this.m_y=0.0;
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<165>";
		this.m_x=t_value;
	}
	pop_err();
}
c_Vector.prototype.p_Angle2=function(t_value){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<131>";
	var t_len=this.p_Length();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<132>";
	t_value=c_Math.m_WrapAngle(t_value);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<133>";
	dbg_object(this).m_x=Math.cos((t_value)*D2R)*t_len;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<134>";
	dbg_object(this).m_y=-Math.sin((t_value)*D2R)*t_len;
	pop_err();
}
c_Vector.prototype.p_Add=function(t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<34>";
	c_Vector.m_tmpVec=c_Vector.m_new2.call(new c_Vector,this);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<35>";
	dbg_object(c_Vector.m_tmpVec).m_x+=t_x;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<36>";
	dbg_object(c_Vector.m_tmpVec).m_y+=t_y;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<37>";
	pop_err();
	return c_Vector.m_tmpVec;
}
c_Vector.prototype.p_Add2=function(t_other){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<41>";
	c_Vector.m_tmpVec=c_Vector.m_new2.call(new c_Vector,this);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<42>";
	dbg_object(c_Vector.m_tmpVec).m_x+=dbg_object(t_other).m_x;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<43>";
	dbg_object(c_Vector.m_tmpVec).m_y+=dbg_object(t_other).m_y;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<44>";
	pop_err();
	return c_Vector.m_tmpVec;
}
c_Vector.m_MakeBetween=function(t_vecFrom,t_vecTo){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<315>";
	c_Vector.m_tmpVec=c_Vector.m_new.call(new c_Vector,0.0,0.0);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<316>";
	if(t_vecFrom==null || t_vecTo==null){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<316>";
		pop_err();
		return c_Vector.m_tmpVec;
	}
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<317>";
	dbg_object(c_Vector.m_tmpVec).m_x=dbg_object(t_vecFrom).m_x-dbg_object(t_vecTo).m_x;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<318>";
	dbg_object(c_Vector.m_tmpVec).m_y=dbg_object(t_vecFrom).m_y-dbg_object(t_vecTo).m_y;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<319>";
	pop_err();
	return c_Vector.m_tmpVec;
}
c_Vector.prototype.p_Normalize=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<173>";
	if(this.p_Length()==0.0){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<174>";
		pop_err();
		return this;
	}
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<177>";
	c_Vector.m_tmpVec=c_Vector.m_new2.call(new c_Vector,this);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<179>";
	dbg_object(c_Vector.m_tmpVec).m_x/=this.p_Length();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<180>";
	dbg_object(c_Vector.m_tmpVec).m_y/=this.p_Length();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<181>";
	pop_err();
	return c_Vector.m_tmpVec;
}
c_Vector.prototype.p_Dot=function(t_other){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<188>";
	var t_=dbg_object(this).m_x*dbg_object(t_other).m_x+dbg_object(this).m_y*dbg_object(t_other).m_y;
	pop_err();
	return t_;
}
c_Vector.prototype.p_ProjectionAmount=function(t_other){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<214>";
	var t_=this.p_Normalize().p_Dot(t_other)/this.p_Length();
	pop_err();
	return t_;
}
c_Vector.prototype.p_DistanceTo=function(t_other){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<299>";
	var t_dx=dbg_object(this).m_x-dbg_object(t_other).m_x;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<300>";
	var t_dy=dbg_object(this).m_y-dbg_object(t_other).m_y;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/vector.monkey<301>";
	var t_=Math.sqrt(t_dx*t_dx+t_dy*t_dy);
	pop_err();
	return t_;
}
function bb_input_MouseX(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/input.monkey<54>";
	var t_=bb_input_device.p_MouseX();
	pop_err();
	return t_;
}
function bb_input_MouseY(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/input.monkey<58>";
	var t_=bb_input_device.p_MouseY();
	pop_err();
	return t_;
}
function c_Line(){
	c_Shape.call(this);
	this.m_p1=null;
	this.m_p2=null;
	this.m_intersection=c_Vector.m_new.call(new c_Vector,0.0,0.0);
	this.implments={c_IShape:1,c_IComponent:1};
}
c_Line.prototype=extend_class(c_Shape);
c_Line.m_new=function(t_x1,t_y1,t_x2,t_y2){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<250>";
	c_Shape.m_new.call(this);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<251>";
	this.m_p1=c_Vector.m_new.call(new c_Vector,t_x1,t_y1);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<252>";
	this.m_p2=c_Vector.m_new.call(new c_Vector,t_x2,t_y2);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<253>";
	this.m_intersection=c_Vector.m_new.call(new c_Vector,0.0,0.0);
	pop_err();
	return this;
}
c_Line.m_new2=function(t_v1,t_v2){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<257>";
	c_Shape.m_new.call(this);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<258>";
	this.m_p1=c_Vector.m_new2.call(new c_Vector,t_v1);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<259>";
	this.m_p2=c_Vector.m_new2.call(new c_Vector,t_v2);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<260>";
	this.m_intersection=c_Vector.m_new.call(new c_Vector,0.0,0.0);
	pop_err();
	return this;
}
c_Line.m_new3=function(t_seg){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<264>";
	c_Shape.m_new.call(this);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<265>";
	this.m_p1=c_Vector.m_new2.call(new c_Vector,dbg_object(t_seg).m_p1);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<266>";
	this.m_p2=c_Vector.m_new2.call(new c_Vector,dbg_object(t_seg).m_p2);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<267>";
	this.m_intersection=c_Vector.m_new.call(new c_Vector,0.0,0.0);
	pop_err();
	return this;
}
c_Line.m_new4=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<245>";
	c_Shape.m_new.call(this);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<245>";
	pop_err();
	return this;
}
c_Line.prototype.p_Set3=function(t_x1,t_y1,t_x2,t_y2){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<302>";
	this.m_p1.p_Set(t_x1,t_y1);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<303>";
	this.m_p2.p_Set(t_x2,t_y2);
	pop_err();
}
c_Line.prototype.p_Set4=function(t_v1,t_v2){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<307>";
	this.m_p1.p_Set(dbg_object(t_v1).m_x,dbg_object(t_v1).m_y);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<308>";
	this.m_p2.p_Set(dbg_object(t_v2).m_x,dbg_object(t_v2).m_y);
	pop_err();
}
c_Line.prototype.p_Set5=function(t_seg){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<312>";
	this.p_Set4(dbg_object(t_seg).m_p1,dbg_object(t_seg).m_p2);
	pop_err();
}
c_Line.prototype.p_IntersectLine=function(t_other){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<373>";
	var t_rn=(dbg_object(this.m_p1).m_y-dbg_object(dbg_object(t_other).m_p1).m_y)*(dbg_object(dbg_object(t_other).m_p2).m_x-dbg_object(dbg_object(t_other).m_p1).m_x)-(dbg_object(this.m_p1).m_x-dbg_object(dbg_object(t_other).m_p1).m_x)*(dbg_object(dbg_object(t_other).m_p2).m_y-dbg_object(dbg_object(t_other).m_p1).m_y);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<374>";
	var t_rd=(dbg_object(this.m_p2).m_x-dbg_object(this.m_p1).m_x)*(dbg_object(dbg_object(t_other).m_p2).m_y-dbg_object(dbg_object(t_other).m_p1).m_y)-(dbg_object(this.m_p2).m_y-dbg_object(this.m_p1).m_y)*(dbg_object(dbg_object(t_other).m_p2).m_x-dbg_object(dbg_object(t_other).m_p1).m_x);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<376>";
	if(t_rd==0.0){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<377>";
		pop_err();
		return false;
	}else{
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<379>";
		var t_sn=(dbg_object(this.m_p1).m_y-dbg_object(dbg_object(t_other).m_p1).m_y)*(dbg_object(this.m_p2).m_x-dbg_object(this.m_p1).m_x)-(dbg_object(this.m_p1).m_x-dbg_object(dbg_object(t_other).m_p1).m_x)*(dbg_object(this.m_p2).m_y-dbg_object(this.m_p1).m_y);
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<380>";
		var t_intersection_AB=t_rn/t_rd;
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<381>";
		var t_intersection_CD=t_sn/t_rd;
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<383>";
		if(t_intersection_AB>1.0 || t_intersection_CD>1.0 || t_intersection_AB<0.0 || t_intersection_CD<0.0){
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<383>";
			pop_err();
			return false;
		}
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<385>";
		dbg_object(this.m_intersection).m_x=dbg_object(this.m_p1).m_x+t_intersection_AB*(dbg_object(this.m_p2).m_x-dbg_object(this.m_p1).m_x);
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<386>";
		dbg_object(this.m_intersection).m_y=dbg_object(this.m_p1).m_y+t_intersection_AB*(dbg_object(this.m_p2).m_y-dbg_object(this.m_p1).m_y);
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<388>";
		pop_err();
		return true;
	}
}
c_Line.prototype.p_Intersects=function(t_shape){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<363>";
	if((object_downcast((t_shape),c_Line))!=null){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<364>";
		var t_=this.p_IntersectLine(object_downcast((t_shape),c_Line));
		pop_err();
		return t_;
	}else{
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<365>";
		if((object_downcast((t_shape),c_Circle))!=null){
			err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<366>";
			var t_2=object_downcast((t_shape),c_Circle).p_Intersects(this);
			pop_err();
			return t_2;
		}
	}
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<369>";
	var t_3=c_Shape.prototype.p_Intersects.call(this,t_shape);
	pop_err();
	return t_3;
}
c_Line.prototype.p_Rotate=function(t_toAngle){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<271>";
	this.m_rotation=t_toAngle;
	pop_err();
}
c_Line.prototype.p_GetP1=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<275>";
	pop_err();
	return this.m_p1;
}
c_Line.prototype.p_GetP2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<279>";
	pop_err();
	return this.m_p2;
}
c_Line.prototype.p_CreatePoints=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<407>";
	this.m_points=new_object_array(2);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<408>";
	dbg_array(this.m_points,0)[dbg_index]=this.p_GetP1()
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<409>";
	dbg_array(this.m_points,1)[dbg_index]=this.p_GetP2()
	pop_err();
}
function c_Rectangle(){
	c_Shape.call(this);
	this.m_x=.0;
	this.m_y=.0;
	this.m_width=.0;
	this.m_height=.0;
	this.implments={c_IShape:1,c_IComponent:1};
}
c_Rectangle.prototype=extend_class(c_Shape);
c_Rectangle.m_new=function(t_x,t_y,t_width,t_height){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<433>";
	c_Shape.m_new.call(this);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<434>";
	dbg_object(this).m_center.p_Set(t_x,t_y);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<435>";
	dbg_object(this).m_x=t_x;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<436>";
	dbg_object(this).m_y=t_y;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<437>";
	dbg_object(this).m_width=t_width;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<438>";
	dbg_object(this).m_height=t_height;
	pop_err();
	return this;
}
c_Rectangle.m_new2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<430>";
	c_Shape.m_new.call(this);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<430>";
	pop_err();
	return this;
}
c_Rectangle.prototype.p_CreatePoints=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<471>";
	if(this.m_points.length==0){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<472>";
		this.m_points=new_object_array(4);
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<474>";
		dbg_array(this.m_points,0)[dbg_index]=c_Vector.m_new.call(new c_Vector,0.0,0.0)
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<475>";
		dbg_array(this.m_points,1)[dbg_index]=c_Vector.m_new.call(new c_Vector,0.0,0.0)
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<476>";
		dbg_array(this.m_points,2)[dbg_index]=c_Vector.m_new.call(new c_Vector,0.0,0.0)
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<477>";
		dbg_array(this.m_points,3)[dbg_index]=c_Vector.m_new.call(new c_Vector,0.0,0.0)
	}
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<480>";
	var t_halfWidth=this.m_width/2.0;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<481>";
	var t_halfHeight=this.m_height/2.0;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<482>";
	var t_theCos=Math.cos((this.m_rotation)*D2R);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<483>";
	var t_theSin=-Math.sin((this.m_rotation)*D2R);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<485>";
	dbg_array(this.m_points,0)[dbg_index].p_Set(dbg_object(this.m_center).m_x+t_halfWidth*t_theCos-t_halfHeight*t_theSin,dbg_object(this.m_center).m_y+t_halfHeight*t_theCos+t_halfWidth*t_theSin);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<486>";
	dbg_array(this.m_points,1)[dbg_index].p_Set(dbg_object(this.m_center).m_x-t_halfWidth*t_theCos-t_halfHeight*t_theSin,dbg_object(this.m_center).m_y+t_halfHeight*t_theCos-t_halfWidth*t_theSin);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<487>";
	dbg_array(this.m_points,2)[dbg_index].p_Set(dbg_object(this.m_center).m_x-t_halfWidth*t_theCos+t_halfHeight*t_theSin,dbg_object(this.m_center).m_y-t_halfHeight*t_theCos-t_halfWidth*t_theSin);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<488>";
	dbg_array(this.m_points,3)[dbg_index].p_Set(dbg_object(this.m_center).m_x+t_halfWidth*t_theCos+t_halfHeight*t_theSin,dbg_object(this.m_center).m_y-t_halfHeight*t_theCos+t_halfWidth*t_theSin);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<490>";
	this.m_min.p_Set(9999.0,9999.0);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<491>";
	this.m_max.p_Set(-9999.0,-9999.0);
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<493>";
	for(var t_i=0;t_i<4;t_i=t_i+1){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<494>";
		dbg_object(this.m_min).m_x=bb_math2_Min2(dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_x,dbg_object(this.m_min).m_x);
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<495>";
		dbg_object(this.m_min).m_y=bb_math2_Min2(dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_y,dbg_object(this.m_min).m_y);
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<496>";
		dbg_object(this.m_max).m_x=bb_math2_Max2(dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_x,dbg_object(this.m_max).m_x);
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<497>";
		dbg_object(this.m_max).m_y=bb_math2_Max2(dbg_object(dbg_array(this.m_points,t_i)[dbg_index]).m_y,dbg_object(this.m_max).m_y);
	}
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<500>";
	this.p_FindCenter();
	pop_err();
}
c_Rectangle.prototype.p_Rotate=function(t_toAngle){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<442>";
	this.m_rotation=t_toAngle;
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<443>";
	this.p_CreatePoints();
	pop_err();
}
c_Rectangle.prototype.p_ContainsPoint=function(t_xp,t_yp){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<447>";
	if(t_xp<=this.m_x){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<447>";
		pop_err();
		return false;
	}
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<448>";
	if(t_yp<=this.m_y){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<448>";
		pop_err();
		return false;
	}
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<449>";
	if(t_xp>=this.m_x+this.m_width){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<449>";
		pop_err();
		return false;
	}
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<450>";
	if(t_yp>=this.m_y+this.m_height){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<450>";
		pop_err();
		return false;
	}
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<451>";
	pop_err();
	return true;
}
c_Rectangle.prototype.p_Intersects=function(t_other){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/geom/shape.monkey<467>";
	var t_=c_Shape.prototype.p_Intersects.call(this,t_other);
	pop_err();
	return t_;
}
function bb_input_KeyDown(t_key){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/input.monkey<36>";
	var t_=((bb_input_device.p_KeyDown(t_key))?1:0);
	pop_err();
	return t_;
}
function c_Math(){
	Object.call(this);
}
c_Math.m_WrapAngle=function(t_angle){
	push_err();
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/math.monkey<9>";
	while(t_angle>360.0){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/math.monkey<10>";
		t_angle=t_angle-360.0;
	}
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/math.monkey<12>";
	while(t_angle<0.0){
		err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/math.monkey<13>";
		t_angle=t_angle+360.0;
	}
	err_info="C:/MonkeyX77a/modules/mgev2/src/utils/math/math.monkey<16>";
	pop_err();
	return t_angle;
}
function bb_input_KeyHit(t_key){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/input.monkey<40>";
	var t_=bb_input_device.p_KeyHit(t_key);
	pop_err();
	return t_;
}
function bb_math2_Max(t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/math.monkey<56>";
	if(t_x>t_y){
		err_info="C:/MonkeyX77a/modules/monkey/math.monkey<56>";
		pop_err();
		return t_x;
	}
	err_info="C:/MonkeyX77a/modules/monkey/math.monkey<57>";
	pop_err();
	return t_y;
}
function bb_math2_Max2(t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/math.monkey<83>";
	if(t_x>t_y){
		err_info="C:/MonkeyX77a/modules/monkey/math.monkey<83>";
		pop_err();
		return t_x;
	}
	err_info="C:/MonkeyX77a/modules/monkey/math.monkey<84>";
	pop_err();
	return t_y;
}
function bb_math2_Min(t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/math.monkey<51>";
	if(t_x<t_y){
		err_info="C:/MonkeyX77a/modules/monkey/math.monkey<51>";
		pop_err();
		return t_x;
	}
	err_info="C:/MonkeyX77a/modules/monkey/math.monkey<52>";
	pop_err();
	return t_y;
}
function bb_math2_Min2(t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/math.monkey<78>";
	if(t_x<t_y){
		err_info="C:/MonkeyX77a/modules/monkey/math.monkey<78>";
		pop_err();
		return t_x;
	}
	err_info="C:/MonkeyX77a/modules/monkey/math.monkey<79>";
	pop_err();
	return t_y;
}
function c_List(){
	Object.call(this);
	this.m__head=(c_HeadNode.m_new.call(new c_HeadNode));
}
c_List.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_List.prototype.p_AddLast=function(t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<108>";
	var t_=c_Node.m_new.call(new c_Node,this.m__head,dbg_object(this.m__head).m__pred,t_data);
	pop_err();
	return t_;
}
c_List.m_new2=function(t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	var t_=t_data;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	var t_2=0;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	while(t_2<t_.length){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
		var t_t=dbg_array(t_,t_2)[dbg_index];
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
		t_2=t_2+1;
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<14>";
		this.p_AddLast(t_t);
	}
	pop_err();
	return this;
}
c_List.prototype.p_Count=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<41>";
	var t_n=0;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<41>";
	var t_node=dbg_object(this.m__head).m__succ;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<42>";
	while(t_node!=this.m__head){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<43>";
		t_node=dbg_object(t_node).m__succ;
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<44>";
		t_n+=1;
	}
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<46>";
	pop_err();
	return t_n;
}
c_List.prototype.p_ObjectEnumerator=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<186>";
	var t_=c_Enumerator.m_new.call(new c_Enumerator,this);
	pop_err();
	return t_;
}
c_List.prototype.p_ToArray=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<19>";
	var t_arr=new_object_array(this.p_Count());
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<19>";
	var t_i=0;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<20>";
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<20>";
	var t_=this.p_ObjectEnumerator();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<20>";
	while(t_.p_HasNext()){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<20>";
		var t_t=t_.p_NextObject();
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<21>";
		dbg_array(t_arr,t_i)[dbg_index]=t_t
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<22>";
		t_i+=1;
	}
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<24>";
	pop_err();
	return t_arr;
}
function c_Node(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node.m_new=function(t_succ,t_pred,t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<261>";
	this.m__succ=t_succ;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<262>";
	this.m__pred=t_pred;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<263>";
	dbg_object(this.m__succ).m__pred=this;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<264>";
	dbg_object(this.m__pred).m__succ=this;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<265>";
	this.m__data=t_data;
	pop_err();
	return this;
}
c_Node.m_new2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<258>";
	pop_err();
	return this;
}
function c_HeadNode(){
	c_Node.call(this);
}
c_HeadNode.prototype=extend_class(c_Node);
c_HeadNode.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<310>";
	c_Node.m_new2.call(this);
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<311>";
	this.m__succ=(this);
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<312>";
	this.m__pred=(this);
	pop_err();
	return this;
}
function c_Enumerator(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator.m_new=function(t_list){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<326>";
	this.m__list=t_list;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<327>";
	this.m__curr=dbg_object(dbg_object(t_list).m__head).m__succ;
	pop_err();
	return this;
}
c_Enumerator.m_new2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<323>";
	pop_err();
	return this;
}
c_Enumerator.prototype.p_HasNext=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<331>";
	while(dbg_object(dbg_object(this.m__curr).m__succ).m__pred!=this.m__curr){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<332>";
		this.m__curr=dbg_object(this.m__curr).m__succ;
	}
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<334>";
	var t_=this.m__curr!=dbg_object(this.m__list).m__head;
	pop_err();
	return t_;
}
c_Enumerator.prototype.p_NextObject=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<338>";
	var t_data=dbg_object(this.m__curr).m__data;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<339>";
	this.m__curr=dbg_object(this.m__curr).m__succ;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<340>";
	pop_err();
	return t_data;
}
function bb_math2_Abs(t_x){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/math.monkey<46>";
	if(t_x>=0){
		err_info="C:/MonkeyX77a/modules/monkey/math.monkey<46>";
		pop_err();
		return t_x;
	}
	err_info="C:/MonkeyX77a/modules/monkey/math.monkey<47>";
	var t_=-t_x;
	pop_err();
	return t_;
}
function bb_math2_Abs2(t_x){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/math.monkey<73>";
	if(t_x>=0.0){
		err_info="C:/MonkeyX77a/modules/monkey/math.monkey<73>";
		pop_err();
		return t_x;
	}
	err_info="C:/MonkeyX77a/modules/monkey/math.monkey<74>";
	var t_=-t_x;
	pop_err();
	return t_;
}
function bb_graphics_DebugRenderDevice(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<49>";
	if(!((bb_graphics_renderDevice)!=null)){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<49>";
		error("Rendering operations can only be performed inside OnRender");
	}
	pop_err();
	return 0;
}
function bb_graphics_Cls(t_r,t_g,t_b){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<376>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<378>";
	bb_graphics_renderDevice.Cls(t_r,t_g,t_b);
	pop_err();
	return 0;
}
function bb_graphics_DrawLine(t_x1,t_y1,t_x2,t_y2){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<399>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<401>";
	bb_graphics_context.p_Validate();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<402>";
	bb_graphics_renderDevice.DrawLine(t_x1,t_y1,t_x2,t_y2);
	pop_err();
	return 0;
}
function bb_graphics_DrawCircle(t_x,t_y,t_r){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<415>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<417>";
	bb_graphics_context.p_Validate();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<418>";
	bb_graphics_renderDevice.DrawOval(t_x-t_r,t_y-t_r,t_r*2.0,t_r*2.0);
	pop_err();
	return 0;
}
function bb_graphics_DrawImage(t_image,t_x,t_y,t_frame){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<449>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<450>";
	if(t_frame<0 || t_frame>=dbg_object(t_image).m_frames.length){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<450>";
		error("Invalid image frame");
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<453>";
	var t_f=dbg_array(dbg_object(t_image).m_frames,t_frame)[dbg_index];
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<455>";
	bb_graphics_context.p_Validate();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<457>";
	if((dbg_object(t_image).m_flags&65536)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<458>";
		bb_graphics_renderDevice.DrawSurface(dbg_object(t_image).m_surface,t_x-dbg_object(t_image).m_tx,t_y-dbg_object(t_image).m_ty);
	}else{
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<460>";
		bb_graphics_renderDevice.DrawSurface2(dbg_object(t_image).m_surface,t_x-dbg_object(t_image).m_tx,t_y-dbg_object(t_image).m_ty,dbg_object(t_f).m_x,dbg_object(t_f).m_y,dbg_object(t_image).m_width,dbg_object(t_image).m_height);
	}
	pop_err();
	return 0;
}
function bb_graphics_PushMatrix(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<332>";
	var t_sp=dbg_object(bb_graphics_context).m_matrixSp;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<333>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+0)[dbg_index]=dbg_object(bb_graphics_context).m_ix
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<334>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+1)[dbg_index]=dbg_object(bb_graphics_context).m_iy
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<335>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+2)[dbg_index]=dbg_object(bb_graphics_context).m_jx
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<336>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+3)[dbg_index]=dbg_object(bb_graphics_context).m_jy
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<337>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+4)[dbg_index]=dbg_object(bb_graphics_context).m_tx
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<338>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+5)[dbg_index]=dbg_object(bb_graphics_context).m_ty
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<339>";
	dbg_object(bb_graphics_context).m_matrixSp=t_sp+6;
	pop_err();
	return 0;
}
function bb_graphics_Transform(t_ix,t_iy,t_jx,t_jy,t_tx,t_ty){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<353>";
	var t_ix2=t_ix*dbg_object(bb_graphics_context).m_ix+t_iy*dbg_object(bb_graphics_context).m_jx;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<354>";
	var t_iy2=t_ix*dbg_object(bb_graphics_context).m_iy+t_iy*dbg_object(bb_graphics_context).m_jy;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<355>";
	var t_jx2=t_jx*dbg_object(bb_graphics_context).m_ix+t_jy*dbg_object(bb_graphics_context).m_jx;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<356>";
	var t_jy2=t_jx*dbg_object(bb_graphics_context).m_iy+t_jy*dbg_object(bb_graphics_context).m_jy;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<357>";
	var t_tx2=t_tx*dbg_object(bb_graphics_context).m_ix+t_ty*dbg_object(bb_graphics_context).m_jx+dbg_object(bb_graphics_context).m_tx;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<358>";
	var t_ty2=t_tx*dbg_object(bb_graphics_context).m_iy+t_ty*dbg_object(bb_graphics_context).m_jy+dbg_object(bb_graphics_context).m_ty;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<359>";
	bb_graphics_SetMatrix(t_ix2,t_iy2,t_jx2,t_jy2,t_tx2,t_ty2);
	pop_err();
	return 0;
}
function bb_graphics_Transform2(t_m){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<349>";
	bb_graphics_Transform(dbg_array(t_m,0)[dbg_index],dbg_array(t_m,1)[dbg_index],dbg_array(t_m,2)[dbg_index],dbg_array(t_m,3)[dbg_index],dbg_array(t_m,4)[dbg_index],dbg_array(t_m,5)[dbg_index]);
	pop_err();
	return 0;
}
function bb_graphics_Translate(t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<363>";
	bb_graphics_Transform(1.0,0.0,0.0,1.0,t_x,t_y);
	pop_err();
	return 0;
}
function bb_graphics_Rotate(t_angle){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<371>";
	bb_graphics_Transform(Math.cos((t_angle)*D2R),-Math.sin((t_angle)*D2R),Math.sin((t_angle)*D2R),Math.cos((t_angle)*D2R),0.0,0.0);
	pop_err();
	return 0;
}
function bb_graphics_Scale(t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<367>";
	bb_graphics_Transform(t_x,0.0,0.0,t_y,0.0,0.0);
	pop_err();
	return 0;
}
function bb_graphics_PopMatrix(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<343>";
	var t_sp=dbg_object(bb_graphics_context).m_matrixSp-6;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<344>";
	bb_graphics_SetMatrix(dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+0)[dbg_index],dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+1)[dbg_index],dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+2)[dbg_index],dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+3)[dbg_index],dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+4)[dbg_index],dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+5)[dbg_index]);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<345>";
	dbg_object(bb_graphics_context).m_matrixSp=t_sp;
	pop_err();
	return 0;
}
function bb_graphics_DrawImage2(t_image,t_x,t_y,t_rotation,t_scaleX,t_scaleY,t_frame){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<467>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<468>";
	if(t_frame<0 || t_frame>=dbg_object(t_image).m_frames.length){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<468>";
		error("Invalid image frame");
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<471>";
	var t_f=dbg_array(dbg_object(t_image).m_frames,t_frame)[dbg_index];
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<473>";
	bb_graphics_PushMatrix();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<475>";
	bb_graphics_Translate(t_x,t_y);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<476>";
	bb_graphics_Rotate(t_rotation);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<477>";
	bb_graphics_Scale(t_scaleX,t_scaleY);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<479>";
	bb_graphics_Translate(-dbg_object(t_image).m_tx,-dbg_object(t_image).m_ty);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<481>";
	bb_graphics_context.p_Validate();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<483>";
	if((dbg_object(t_image).m_flags&65536)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<484>";
		bb_graphics_renderDevice.DrawSurface(dbg_object(t_image).m_surface,0.0,0.0);
	}else{
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<486>";
		bb_graphics_renderDevice.DrawSurface2(dbg_object(t_image).m_surface,0.0,0.0,dbg_object(t_f).m_x,dbg_object(t_f).m_y,dbg_object(t_image).m_width,dbg_object(t_image).m_height);
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<489>";
	bb_graphics_PopMatrix();
	pop_err();
	return 0;
}
function bb_graphics_DrawText(t_text,t_x,t_y,t_xalign,t_yalign){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<574>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<576>";
	if(!((dbg_object(bb_graphics_context).m_font)!=null)){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<576>";
		pop_err();
		return 0;
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<578>";
	var t_w=dbg_object(bb_graphics_context).m_font.p_Width();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<579>";
	var t_h=dbg_object(bb_graphics_context).m_font.p_Height();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<581>";
	t_x-=Math.floor((t_w*t_text.length)*t_xalign);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<582>";
	t_y-=Math.floor((t_h)*t_yalign);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<584>";
	for(var t_i=0;t_i<t_text.length;t_i=t_i+1){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<585>";
		var t_ch=dbg_charCodeAt(t_text,t_i)-dbg_object(bb_graphics_context).m_firstChar;
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<586>";
		if(t_ch>=0 && t_ch<dbg_object(bb_graphics_context).m_font.p_Frames()){
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<587>";
			bb_graphics_DrawImage(dbg_object(bb_graphics_context).m_font,t_x+(t_i*t_w),t_y,t_ch);
		}
	}
	pop_err();
	return 0;
}
function bbInit(){
	bb_app__app=null;
	bb_app__delegate=null;
	bb_app__game=BBGame.Game();
	bb_graphics_device=null;
	bb_graphics_context=c_GraphicsContext.m_new.call(new c_GraphicsContext);
	c_Image.m_DefaultFlags=0;
	bb_audio_device=null;
	bb_input_device=null;
	bb_graphics_renderDevice=null;
	bb_app__updateRate=0;
	c_Vector.m_tmpVec=c_Vector.m_new.call(new c_Vector,0.0,0.0);
}
//${TRANSCODE_END}
