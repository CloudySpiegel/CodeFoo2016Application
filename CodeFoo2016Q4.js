
var winHeight =screen.height;
var winWidth=screen.width;
var sizeAdjustmentFactor=.84;
var
currText="";
thumbnailArr=[];
mouseX=0;
mouseY=0;
xClick=0;
yClick=0;

var isMouseOverListing=false;
var listingMouseOver;
var listingMouseOverLast;
var listingSelected;
var videoButtonUnderlined=false;
var articleButtonUnderlined=false;

blackRectX=0;
blackRectY=0;                                           //a bunch of variables, some needed for the program logic, 
blackRectHeight=1.02*sizeAdjustmentFactor*winHeight;	//many just for making things the right size.
blackRectWidth=sizeAdjustmentFactor* winHeight/2;		//A lot of these are superfluous and could be cleaned up
graphicCenterX=(blackRectWidth+blackRectX)/2;

whiteRectWidth=.9*blackRectWidth;
whiteRectHeight= .9*blackRectHeight;
whiteRectX=(blackRectWidth-whiteRectWidth)/2;
whiteRectY=blackRectY+(.07*blackRectHeight);

spaceBetweenListings=whiteRectHeight/16;
listingRectWidth=whiteRectWidth;
listingAreaHeight=10*spaceBetweenListings;

topOfFirstListingAreaY=whiteRectHeight/5;
spaceBetweenListings=whiteRectHeight/16;
listingDistfromTopDividingLine=.5*spaceBetweenListings;
subListingDistfromTopDividingLine=.75*spaceBetweenListings;

label="VIDEOS";
labelSize=Math.round(sizeAdjustmentFactor*winHeight/30);
buttonTextSize=labelSize/2;
listingTextSize=whiteRectWidth/30;
labelFont="bold "+labelSize.toString().concat("px")+" Calibri";
buttonFont="bold "+buttonTextSize.toString().concat("px")+" Calibri";
listingFont="bold "+listingTextSize.toString().concat("px")+" Calibri";
typeLabelX=whiteRectX*2.5;
typeLabelY=whiteRectY*.75;


buttonY=whiteRectY+whiteRectHeight/40;
buttonWidth=whiteRectWidth*.85;
buttonHeight=whiteRectHeight/20;
buttonX=graphicCenterX-buttonWidth/2;
buttonRadius=buttonWidth/17;
buttonPartWidth=buttonWidth/2+buttonRadius;
buttonClickRectX=buttonX+buttonRadius;
buttonClickRectWidth=buttonWidth-2*buttonRadius;
buttonClickCircHeight=buttonY+buttonHeight/2;
buttonClickRCircX=buttonClickRectX+buttonClickRectWidth;

touchUpRectX=graphicCenterX;
otherTouchUpRectX=graphicCenterX-buttonRadius;
touchUpRectY=buttonY;
touchUpRectWidth=buttonPartWidth/4;
touchUpRectHeight=buttonHeight;

articlesTextX=(graphicCenterX-buttonX)/2+buttonRadius/2;
videosTextX=(graphicCenterX)+buttonX+buttonRadius/2;
buttonTextY=buttonY+buttonHeight/2+buttonTextSize/3;

redColor="#bf1313";
listingColor="#333435";
subListingColor="#8a8a8a";

buttonColor1=redColor;
buttonColor2="white";
buttonStyle1=true;
buttonStyle2=false;
videoButtonSelected=true;

maxListingWidth=.1*listingRectWidth;
maxSubListingWidth=25;

listingNumbersX=buttonX;
firstListingY=buttonY+whiteRectY+70;

listingTextX=buttonX+2*buttonRadius;
dividingLineSpacing=2.5*listingTextSize;
dividingLineSize=listingTextSize/10;

videoDurationTextX=(buttonX+buttonWidth)-.85*listingTextSize;

mainRectScreenWidthRatio=.8;
mainRectOffsetFromTop=.15;
mainRectOffsetFromBottom=.2;
widthToHeightRatio=470/979;
graphicHeight=winHeight;
graphicWidth=Math.round((470*graphicHeight)/979);
labelOffsetFromTop=30;

selectorRectAtListing=0;
selectorRectHeight=buttonHeight*.75;
selectorRectWidth=selectorRectHeight/4;
selectorRectX=whiteRectX-selectorRectWidth/2;
selectorRectY=firstListingY-buttonTextSize+listingTextSize/1.25;;

loadMoreTextSize=listingTextSize*1.1;
loadMoreBoxY=whiteRectY+whiteRectHeight-1.2*loadMoreTextSize;
loadMoreClickX=whiteRectX;
loadMoreClickY=topOfFirstListingAreaY+spaceBetweenListings;
loadMoreClickWidth=whiteRectWidth;
loadMoreClickHeight=spaceBetweenListings;
loadMoreSelectorY=topOfFirstListingAreaY+spaceBetweenListings*10.5;

currStartIndex=0;
var listingText="";
var sublistingText="";
var videoDurationText="";
var parsedJsonArr=[];
var parsedJsonArrLast=[];
var durationArr=[];
var requestOngoing=false;
var
htmlCanvas = document.getElementById('c'),// Obtain a reference to the canvas element using its id.
context = htmlCanvas.getContext('2d'); // Obtain a graphics context on the canvas element for drawing.
document.addEventListener("DOMContentLoaded", initialize, false);// Start listening to resize events and draw canvas.


function initialize() {
// Register an event listener to
// call the resizeCanvas() function each time
// the window is resized.
//window.addEventListener('resize', resizeCanvas, false);
 //var canvas = document.getElementById("c");
 //htmlCanvas.addEventListener("mousedown", switchButtonColors, false);
 window.addEventListener('resize', resizeCanvas, false);
 htmlCanvas.addEventListener("mousedown", getClickPosition, false);
 htmlCanvas.addEventListener("mousedown", handleInput, false);
 htmlCanvas.addEventListener('mousemove',getMousePosition,false);
 htmlCanvas.addEventListener('mousemove',clearCanvasOverEntry,false);
 htmlCanvas.addEventListener('mousemove',buttonUnderlineHandler,false);
drawUpdate();// Draw canvas for the first time.
currStartIndex=0;
makeRequest() ;
resizeCanvas();
}

function resizeCanvas() {
htmlCanvas.width = window.innerWidth;
htmlCanvas.height = window.innerHeight;
drawUpdate();
refillText();
}


function makeRequest() {                                                //pull the appropriate data and display it in listings
	requestOngoing=true;
	var request;
	var itemId=1;
	try{
		request = new XMLHttpRequest();
	} catch(e) {
		try {
			request = new ActiveXObject("Microsoft.XMLHTTP");
		} catch(e) {
			alert("Error creating XMLHttpRequest \n" + e);
		}
	}
	if(videoButtonSelected){
		request.open("GET","http://ign-apis.herokuapp.com/videos?startIndex="+currStartIndex+"\u0026count=10",true);


	  }
	if(videoButtonSelected==false){
		request.open("GET","http://ign-apis.herokuapp.com/articles?startIndex="+currStartIndex+"\u0026count=10",true);
	  }	
	
	
	request.onreadystatechange = function(){
		if (request.readyState == 4 ){
		currText=request.responseText;
		parsedJsonArrLast=parsedJsonArr;
		 parsedJsonArr= JSON.parse(request.responseText);
		context.fillStyle="listingColor";
		context.font=listingFont;
		drawUpdate();
		for (i = 0; i <10; i++) { 
		if(videoButtonSelected){
		listingText=(parsedJsonArr.data[i].metadata.name);
		subListingText=(parsedJsonArr.data[i].metadata.description);
		videoDurationText=(parsedJsonArr.data[i].metadata.duration);
		}
		else{
		listingText=(parsedJsonArr.data[i].metadata.headline);
		subListingText=(parsedJsonArr.data[i].metadata.subHeadline);
		}
		
		context.fillStyle=listingColor;
		
		if(currStartIndex<=10&&i!=9){
		context.fillText("0"+(i+1).toString(),listingNumbersX,topOfFirstListingAreaY+listingDistfromTopDividingLine+i*spaceBetweenListings);
		}
		else{
			context.fillText((currStartIndex+i+1-10).toString(),listingNumbersX,topOfFirstListingAreaY+listingDistfromTopDividingLine+i*spaceBetweenListings);
		}
		
		if(videoButtonSelected){
			context.fillStyle=subListingColor;
			var adjustedVideoDurationText=Math.floor(videoDurationText/60).toString()+":"+adjustSecs((videoDurationText%60).toString());
			durationArr[i]=adjustedVideoDurationText;
			context.fillText(adjustedVideoDurationText,videoDurationTextX,topOfFirstListingAreaY+listingDistfromTopDividingLine+i*spaceBetweenListings);
		}
		context.fillStyle=listingColor;
		context.fillText(shortenText(listingText,maxListingWidth),listingTextX,topOfFirstListingAreaY+listingDistfromTopDividingLine+i*spaceBetweenListings);
		context.fillStyle=subListingColor;
		context.strokeStyle=subListingColor;
		
		if (subListingText!=null){
		context.fillText(shortenText(subListingText,maxListingWidth),listingTextX, topOfFirstListingAreaY+subListingDistfromTopDividingLine+i*spaceBetweenListings);
		}

		 if(i!=9){
		 drawDividingLine(context,whiteRectX,listingTextX,whiteRectX+whiteRectWidth,topOfFirstListingAreaY+(i+1)*spaceBetweenListings,dividingLineSize);
		 }
		}
		}
		context.fillStyle=subListingColor;

	};

	request.send(); 
	
	currStartIndex+=10;
	requestOngoing=false;
};



function refillText(){                     //doing to the drawing and listing without a new data pull
		for (i = 0; i <10; i++) { 
		if(videoButtonSelected){
		listingText=(parsedJsonArr.data[i].metadata.name);
		subListingText=(parsedJsonArr.data[i].metadata.description);
		videoDurationText=(parsedJsonArr.data[i].metadata.duration);
		}
		else{
		listingText=(parsedJsonArr.data[i].metadata.headline);
		subListingText=(parsedJsonArr.data[i].metadata.subHeadline);
		}
		
		context.fillStyle=listingColor;
		
		if(currStartIndex<=10&&i!=9){
		context.fillText("0"+(i+1).toString(),listingNumbersX,topOfFirstListingAreaY+listingDistfromTopDividingLine+i*spaceBetweenListings);
		}
		else{
			context.fillText((currStartIndex+i+1-10).toString(),listingNumbersX,topOfFirstListingAreaY+listingDistfromTopDividingLine+i*spaceBetweenListings);
		}
		
		if(videoButtonSelected){
			context.fillStyle=subListingColor;
			var adjustedVideoDurationText=Math.floor(videoDurationText/60).toString()+":"+adjustSecs((videoDurationText%60).toString());
			durationArr[i]=adjustedVideoDurationText;
			context.fillText(adjustedVideoDurationText,videoDurationTextX,topOfFirstListingAreaY+listingDistfromTopDividingLine+i*spaceBetweenListings);
		}
		context.fillStyle=listingColor;
		context.fillText(shortenText(listingText,maxListingWidth),listingTextX,topOfFirstListingAreaY+listingDistfromTopDividingLine+i*spaceBetweenListings);
		context.fillStyle=subListingColor;
		context.strokeStyle=subListingColor;
		
		if (subListingText!=null){
		context.fillText(shortenText(subListingText,maxListingWidth),listingTextX, topOfFirstListingAreaY+subListingDistfromTopDividingLine+i*spaceBetweenListings);
		}

		 if(i!=9){
		 drawDividingLine(context,whiteRectX,listingTextX,whiteRectX+whiteRectWidth,topOfFirstListingAreaY+(i+1)*spaceBetweenListings,dividingLineSize);
		 }
		}
		context.fillStyle=subListingColor;
}












function shortenText(text,shortenTo){                   //shorten text to fit in listing area
	var adjustedText=text;
	if(text!=null){
	if(text.length >shortenTo){
		 adjustedText=text.slice(0,shortenTo)+"...";
	}
	}
	return adjustedText;
}


function show_image(src,id, width,left, top, alt) {       //display a thumbnail
    var img = document.createElement("img");
    img.src = src;
	img.id=id;
    img.width = width;
    img.alt = alt;
	img.style.position="absolute";
	img.style.left=left;
	img.style.top=top;
    document.body.appendChild(img);
}

function openVideoContent(videoListingSelected) {                         //link to content if clicked on
var url_to_open=parsedJsonArr.data[videoListingSelected].metadata.url
window.open(url_to_open);
}

function openArticleContent(listingSelected) {
var date=(parsedJsonArr.data[listingSelected].metadata.publishDate);
var dateString1=date.slice(0,4);
var dateString2=date.slice(5,7);
var dateString3=date.slice(8,10);
var slug=(parsedJsonArr.data[listingSelected].metadata.slug);;
var url_to_open='http://www.ign.com/articles/'+dateString1+'/'+dateString2+'/'+dateString3+'/'+slug;
window.open(url_to_open);
}


function adjustSecs(secs){     //display video runing time in minutes and seconds
	if(secs.length<2){
		return ("0"+secs);	
		}		
	else{
		return secs;
	}
}

function handleInput(){                //see what user if selecting and do something in response
	
	if(requestOngoing==false){
	if (checkRect(buttonClickRectX,buttonY,buttonClickRectWidth,buttonHeight,xClick,yClick)||checkCircle(buttonClickRectX,buttonClickCircHeight,buttonRadius,xClick,yClick)||checkCircle(buttonClickRCircX,buttonClickCircHeight,buttonRadius,xClick,yClick)){

		if(xClick<=graphicCenterX&&videoButtonSelected==true){
		label="VIDEOS";
		videoButtonSelected=false;
		drawUpdate();
		currStartIndex=0;
		makeRequest();
		}
		if(xClick>=graphicCenterX&&videoButtonSelected==false){
		label="ARTICLES";
		videoButtonSelected=true;
		drawUpdate();
		currStartIndex=0;
		makeRequest();
		
		}
	}



	if(checkRect(whiteRectX,loadMoreSelectorY-.5*spaceBetweenListings,whiteRectWidth,loadMoreClickHeight,xClick,yClick)){
		selectorRectAtListing=0;
		drawUpdate();
		makeRequest();
	}
		if(isMouseOverListing&&videoButtonSelected){

		listingSelected=listingMouseOver;
			if (listingSelected!=selectorRectAtListing){
				eraseSelectorRect(selectorRectAtListing);
				drawSelectorRect(listingSelected);
				selectorRectAtListing=listingSelected;
			}
		openVideoContent(listingSelected);
		}	
		if(isMouseOverListing&&videoButtonSelected==false){

		listingSelected=listingMouseOver;
				if (listingSelected!=selectorRectAtListing){
				eraseSelectorRect(selectorRectAtListing);
				drawSelectorRect(listingSelected);
				selectorRectAtListing=listingSelected;
			}
		
		openArticleContent(listingSelected);
		}	
	}
}


function drawSelectorRect(listingSelectorAt){
	context.fillStyle=redColor;
	context.fillRect(whiteRectX-selectorRectWidth/2,topOfFirstListingAreaY+listingSelectorAt*spaceBetweenListings+spaceBetweenListings/4,selectorRectWidth,selectorRectHeight);
}

function eraseSelectorRect(listingSelectorAt){	
	context.clearRect(whiteRectX-selectorRectWidth/2,topOfFirstListingAreaY+listingSelectorAt*spaceBetweenListings+spaceBetweenListings/4,selectorRectWidth,selectorRectHeight);
	context.fillStyle="white";
	context.fillRect(whiteRectX,topOfFirstListingAreaY+listingSelectorAt*spaceBetweenListings+spaceBetweenListings/4,selectorRectWidth/2,selectorRectHeight);
	context.fillStyle='black';
	context.fillRect(whiteRectX-selectorRectWidth/2,topOfFirstListingAreaY+listingSelectorAt*spaceBetweenListings+spaceBetweenListings/4,selectorRectWidth/2,selectorRectHeight);
}


   function getClickPosition(event){
     if(requestOngoing==false){
        var x = new Number();
        var y = new Number();
        var canvas = document.getElementById("c");

        if (event.x != undefined && event.y != undefined)
        {
          xClick = event.x;
          yClick = event.y;
        }
        else // Firefox method to get the position
        {
          xClick = event.clientX + document.body.scrollLeft +
              document.documentElement.scrollLeft;
          yClick = event.clientY + document.body.scrollTop +
              document.documentElement.scrollTop;
        }
        xClick -= canvas.offsetLeft;
        yClick -= canvas.offsetTop;
		}
     }
	  
	  
	function getMousePosition(event){
      if(requestOngoing==false){
        var x = new Number();
        var y = new Number();
        var canvas = document.getElementById("c");

        if (event.x != undefined && event.y != undefined)
        {
          mouseX = event.x;
          mouseY= event.y;
        }
        else // Firefox method to get the position
        {
          mouseX = event.clientX + document.body.scrollLeft +
              document.documentElement.scrollLeft;
          mouseY = event.clientY + document.body.scrollTop +
              document.documentElement.scrollTop;
        }
        mouseX -= canvas.offsetLeft;
        mouseY -= canvas.offsetTop;
	  }
  }
	  

  function checkRect(xTopLeft,yTopLeft,width,height,xPt,yPt){
	 return(xTopLeft<=xPt&&xPt<=xTopLeft+width&&yTopLeft<=yPt&&yPt<=yTopLeft+height);
 }
 
 function checkCircle(x,y,radius,xpt,ypt){
	 var distSquared=(x-xpt)*(x-xpt)+(y-ypt)*(y-ypt);
	 return distSquared<=radius*radius;
 }
 
 function mouseOverEntry(){
	if(checkRect(0,topOfFirstListingAreaY,listingRectWidth, listingAreaHeight,mouseX,mouseY)){   //see what listing the mouse is over
		var overEntry=Math.ceil((mouseY-topOfFirstListingAreaY)/spaceBetweenListings)-1;
		isMouseOverListing=true;
		listingMouseOver=overEntry;
		return overEntry;
		
	}
	else{
		isMouseOverListing=false;
	}
 }
   
		  
		  
	function drawUnderLine(color,size, isUnderVideoButton){
			context.strokeStyle=color;
			context.lineWidth=size;
			context.beginPath();
			
			if(isUnderVideoButton==true){
		  	context.moveTo(videosTextX, buttonTextY+.1*labelSize);
			context.lineTo(videosTextX+1.6*labelSize, buttonTextY+.1*labelSize);
			context.stroke();
			}
			else{
		  	context.moveTo(articlesTextX, buttonTextY+.1*labelSize);
			context.lineTo(articlesTextX+2*labelSize, buttonTextY+.1*labelSize);
			context.stroke();
		}
		context.lineWidth=1;
	}	
	
	function checkAndClearVideoUnderline(){
			if(videoButtonUnderlined){
			drawUnderLine(redColor,3,true);
			videoButtonUnderlined=false;
		}
	}
	
		function checkAndClearArticleUnderline(){
			if(articleButtonUnderlined){
			drawUnderLine('white',3,false);
			articleButtonUnderlined=false;
		}
	}
		
		  
		  
 function buttonUnderlineHandler(){
	if((checkRect(buttonClickRectX,buttonY,buttonClickRectWidth,buttonHeight,mouseX,mouseY)||checkCircle(buttonClickRectX,buttonClickCircHeight,buttonRadius,mouseX,mouseY)||checkCircle(buttonClickRCircX,buttonClickCircHeight,buttonRadius,mouseX,mouseY))==false){
		mouseOverButton="notOverButton";
	}
	
	else{
		  if(mouseX<=graphicCenterX){
				mouseOverButton="articles";
				}
			if(mouseX>graphicCenterX){
				mouseOverButton="videos";
				}
		}
	  if(mouseOverButton=="videos"&&videoButtonUnderlined==false){
			drawUnderLine('white',1,true);
			videoButtonUnderlined=true;
			checkAndClearArticleUnderline();
		}
			
		if(mouseOverButton=="articles"&&articleButtonUnderlined==false){
			drawUnderLine(redColor,1,false);
			articleButtonUnderlined=true;
			checkAndClearVideoUnderline();		
		}
	
		if(mouseOverButton=='notOverButton'){
			checkAndClearArticleUnderline();
			checkAndClearVideoUnderline();
		}
		
 }		


 function clearCanvasOverEntry(){        //messy, cluttered function for clearing a 'window' of listing mouse is over to display thumbnail, and covering up the window the mouse was over last
	 var entry=mouseOverEntry();		//this needs cleaned up and should consist of two subfunctions, one for clearing and one for covering, to get rid of all the redundant code
	 
	 if ((entry!=null)&&(entry!=listingMouseOverLast)){
		context.fillStyle="white";
		if(videoButtonSelected&&listingMouseOverLast!=null){
	
			context.fillRect(whiteRectX,topOfFirstListingAreaY+listingMouseOverLast*spaceBetweenListings,whiteRectWidth, spaceBetweenListings);
			context.fillStyle=listingColor;
			context.fillText(shortenText(parsedJsonArr.data[listingMouseOverLast].metadata.name,maxListingWidth),listingTextX,topOfFirstListingAreaY+listingDistfromTopDividingLine+listingMouseOverLast*spaceBetweenListings);
			context.fillStyle=subListingColor;
			context.fillText(durationArr[listingMouseOverLast],videoDurationTextX,topOfFirstListingAreaY+listingDistfromTopDividingLine+listingMouseOverLast*spaceBetweenListings);
			if(parsedJsonArr.data[listingMouseOverLast].metadata.description!=null){
			context.fillText(shortenText(parsedJsonArr.data[listingMouseOverLast].metadata.description,maxListingWidth),listingTextX,topOfFirstListingAreaY+subListingDistfromTopDividingLine+listingMouseOverLast*spaceBetweenListings);
			}
			var image_x = document.getElementById('picture');
			image_x.parentNode.removeChild(image_x);
		}
		if(videoButtonSelected==false&&listingMouseOverLast!=null){
			context.fillRect(whiteRectX,topOfFirstListingAreaY+listingMouseOverLast*spaceBetweenListings,whiteRectWidth,spaceBetweenListings);
			context.fillStyle=listingColor;
			context.fillText(shortenText(parsedJsonArr.data[listingMouseOverLast].metadata.headline,maxListingWidth),listingTextX,topOfFirstListingAreaY+listingDistfromTopDividingLine+listingMouseOverLast*spaceBetweenListings);
			context.fillStyle=subListingColor;
			if(parsedJsonArr.data[listingMouseOverLast].metadata.subHeadline!=null){
			context.fillText(shortenText(parsedJsonArr.data[listingMouseOverLast].metadata.subHeadline,maxListingWidth),listingTextX,topOfFirstListingAreaY+subListingDistfromTopDividingLine+listingMouseOverLast*spaceBetweenListings);
			}
			var image_x = document.getElementById('picture');
			image_x.parentNode.removeChild(image_x);
		}

		 context.clearRect(whiteRectX, topOfFirstListingAreaY+(entry)*spaceBetweenListings,listingRectWidth,spaceBetweenListings);
		 show_image(parsedJsonArr.data[entry].thumbnail,'picture',whiteRectWidth,whiteRectX+'px',topOfFirstListingAreaY-75+entry*spaceBetweenListings+'px','alt');
		
		if(listingMouseOverLast==selectorRectAtListing){
			drawSelectorRect(listingMouseOverLast);
		}
		if(entry==selectorRectAtListing){
			drawSelectorRect(entry);
		}

		
		 context.fillStyle='white';
		 if(videoButtonSelected){
			 context.fillText(shortenText(parsedJsonArr.data[entry].metadata.name,maxListingWidth),listingTextX,topOfFirstListingAreaY+listingDistfromTopDividingLine+entry*spaceBetweenListings);
			 context.fillStyle="#D3D3D3";
			 context.fillText(durationArr[entry],videoDurationTextX,topOfFirstListingAreaY+listingDistfromTopDividingLine+entry*spaceBetweenListings);
			 if(parsedJsonArr.data[entry].metadata.description!=null){
			 context.fillText(shortenText(parsedJsonArr.data[entry].metadata.description,maxListingWidth),listingTextX,topOfFirstListingAreaY+subListingDistfromTopDividingLine+entry*spaceBetweenListings);
			 }
			 context.fillStyle=subListingColor;
			 context.fillText(durationArr[listingMouseOverLast],videoDurationTextX,topOfFirstListingAreaY+listingDistfromTopDividingLine+listingMouseOverLast*spaceBetweenListings);
		 }
		 else{
			 context.fillText(shortenText(parsedJsonArr.data[entry].metadata.headline,maxListingWidth),listingTextX,topOfFirstListingAreaY+listingDistfromTopDividingLine+entry*spaceBetweenListings);
			 context.fillStyle="#D3D3D3";
			 if(parsedJsonArr.data[entry].metadata.subHeadline!=null){
			 context.fillText(shortenText(parsedJsonArr.data[entry].metadata.subHeadline,maxListingWidth), listingTextX,topOfFirstListingAreaY+subListingDistfromTopDividingLine+entry*spaceBetweenListings);
			 }
		 }

		 if(listingMouseOverLast!=9){
		 drawDividingLine(context,whiteRectX,listingTextX,whiteRectX+whiteRectWidth,topOfFirstListingAreaY+(listingMouseOverLast+1)*spaceBetweenListings,dividingLineSize);
		 }
		  if(listingMouseOverLast!=0){
		 drawDividingLine(context,whiteRectX,listingTextX,whiteRectX+whiteRectWidth,topOfFirstListingAreaY+(listingMouseOverLast)*spaceBetweenListings,dividingLineSize);
		  }
		
		
		if(currStartIndex<=10&&(listingMouseOverLast==9||entry==9)){
			if (listingMouseOverLast==9){
			context.fillStyle='black';
			context.fillText("10",listingNumbersX,topOfFirstListingAreaY+listingDistfromTopDividingLine+listingMouseOverLast*spaceBetweenListings);
			context.fillStyle='white';
			context.fillText("0"+(entry+1).toString(),listingNumbersX,topOfFirstListingAreaY+listingDistfromTopDividingLine+entry*spaceBetweenListings);
			}
			if (entry==9){
			context.fillStyle='white';
			context.fillText("10",listingNumbersX,topOfFirstListingAreaY+listingDistfromTopDividingLine+entry*spaceBetweenListings);
			context.fillStyle='black';
			context.fillText("0"+(listingMouseOverLast+1).toString(),listingNumbersX,topOfFirstListingAreaY+listingDistfromTopDividingLine+listingMouseOverLast*spaceBetweenListings);
			}
		}

		
		if(currStartIndex<=10&&listingMouseOverLast!=9&&entry!=9){
		context.fillStyle='black';
		context.fillText("0"+(listingMouseOverLast+1).toString(),listingNumbersX,topOfFirstListingAreaY+listingDistfromTopDividingLine+listingMouseOverLast*spaceBetweenListings);
		context.fillStyle='white';
		context.fillText("0"+(entry+1).toString(),listingNumbersX,topOfFirstListingAreaY+listingDistfromTopDividingLine+entry*spaceBetweenListings);
		}
		if(currStartIndex>10){
			context.fillStyle='black';
			context.fillText((currStartIndex+listingMouseOverLast+1-10).toString(),listingNumbersX,topOfFirstListingAreaY+listingDistfromTopDividingLine+listingMouseOverLast*spaceBetweenListings);
			context.fillStyle='white';
			context.fillText((currStartIndex+entry+1-10).toString(),listingNumbersX,topOfFirstListingAreaY+listingDistfromTopDividingLine+entry*spaceBetweenListings);
		}
	
		context.fillStyle=listingColor;
		listingMouseOverLast=entry;

	 }
	 
 }

  function drawDottedLine(cntx,xStart,xEnd,y,lineSize){

  var currX=xStart;
	while(currX < xEnd){
			currX+=lineSize;
			cntx.beginPath(); 
			cntx.moveTo(currX, y);
	
			cntx.lineTo(currX+lineSize, y);
			cntx.stroke();
			currX=currX+lineSize;
		}
 }
	
function drawDividingLine(cntx,xStart,xMid,xEnd,y,lineSize){  //function for drawing lines between listings
	cntx.strokeStyle=subListingColor;
	drawDottedLine(cntx,xStart,xMid,y,lineSize);
	cntx.moveTo(xMid, y);
	cntx.lineTo(xEnd, y);
	cntx.stroke();
	cntx.lineWidth=1;
}

 
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {  //function for drawing round button at top of screen
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();
  }        
}


function drawButton() {
	context.strokeStyle=redColor;
	context.font = buttonFont;
	context.fillStyle=redColor;
	roundRect(context, graphicCenterX-buttonRadius,buttonY,buttonPartWidth,buttonHeight,buttonRadius,true,true);
	context.fillStyle="white";
	context.fillRect(touchUpRectX-touchUpRectWidth, touchUpRectY, touchUpRectWidth, touchUpRectHeight*3);
	roundRect(context, buttonX,buttonY,buttonPartWidth,buttonHeight,buttonRadius,false,true);
	context.fillStyle=redColor;
	context.fillText("ARTICLES",articlesTextX,buttonTextY);
	context.fillStyle='white';
	context.fillText("VIDEOS",videosTextX,buttonTextY);



}

function drawUpdate() {
	context.clearRect(0, 0, c.width, c.height);
	context.fillStyle="black";
	context.fillRect(blackRectX,blackRectY,blackRectWidth,blackRectHeight);
	context.fillStyle="white";
	roundRect(context, whiteRectX,whiteRectY,whiteRectWidth,whiteRectHeight,5,true,true);
	context.font=labelFont;
	context.fillStyle="black";
	context.fillText(label,typeLabelX,typeLabelY);

	drawButton();
	drawSelectorRect(selectorRectAtListing);
	context.fillStyle=subListingColor;
	if(videoButtonSelected){
	context.fillText("See More Videos",listingTextX,loadMoreSelectorY);
	}
	else{
	context.fillText("See More Articles",listingTextX,loadMoreSelectorY);
	}

}

