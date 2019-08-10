
//var androidActivityIndicator = function ( text, bgColor ) {
exports.androidActivityIndicator = function (text, bgColor)
{
  var message = text || 'Loading...';
  var textWidth = ( message.length > 13 ) ? '260dp' : Ti.UI.SIZE;

  var infoWindow = Ti.UI.createView( {
    touchEnabled : false,
    height : '100%',
   	width : '100%',
   	backgroundColor : bgColor != null ? bgColor : '#000',
   	opacity : 0.8
  } );

  var background = Ti.UI.createView( {
    height : Ti.UI.SIZE,
    width : Ti.UI.SIZE,
    borderRadius : 10,
    touchEnabled : false,
    layout : 'vertical'
  } );

  var activityIndicator = Ti.UI.createActivityIndicator( {
    style : Ti.UI.ActivityIndicatorStyle.BIG,
    height : '50%',
    width : '50%'
  } );
  
  //Single threat in Android, activityIndicator cannot tolerate to run while processing or loading large data.
  //activityIndicator.show();
  //background.add( activityIndicator );

  this.message = Ti.UI.createLabel( {
    text : message,
    top : '10dp',
    left : '25dp',
    right : '25dp',
    color : '#fff',
    textAlign : 'center',
    font : {
      fontFamily :  OS_ANDROID ? 'Droid Sans' : 'Helvetica Neue',
      fontSize : '18dp',
      fontWeight : 'bold'
    },
    wordwrap : false,
    height : '44dp',
    width : textWidth 
  } );
  background.add( this.message );

  infoWindow.add( background );
  return infoWindow;
};

//module.exports = androidActivityIndicator;