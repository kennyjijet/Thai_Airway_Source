/**
 * Activity Indicator View - Titanium JS
 * @author Anthony Njuguna
 */
/**
 * Open an Activity view anywhere in the app.
 * @param {String} text
 * @param {Object} params
 */
var ANActivityIndicator = function ( text, bgColor ) {
  var message = text || 'Loading...';

  var infoWindow;
  var textWidth = ( message.length > 13 ) ? '260dp' : Ti.UI.SIZE;

  this.infoWindow = Ti.UI.createWindow( {
    touchEnabled : true,
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

  this.activityIndicator = Ti.UI.createActivityIndicator( {
    style : Ti.UI.ActivityIndicatorStyle.BIG,
    top : '15dp',
    height : Ti.UI.SIZE,
    width : Ti.UI.SIZE
  } );

  background.add( this.activityIndicator );

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

  this.infoWindow.add( background );
};

ANActivityIndicator.prototype.show = function ( ) {
  this.infoWindow.open( );
  this.activityIndicator.show( );
};

ANActivityIndicator.prototype.hide = function ( ) {
  this.activityIndicator.hide( );
  this.infoWindow.close( );
};

module.exports = ANActivityIndicator;