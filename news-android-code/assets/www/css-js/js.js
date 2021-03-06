// constants	  
	  var COOKIE_NAME = 'news';
	  var COMMA = ',';
	  var EMPTY = '';
	  var REFRESH = 'refresh';
	  var LI = 'li';
	  var PAR = 'p';
	  var ID = 'id';
	  var ITEM = 'item';
	  var TITLE = 'title';
	  var CATEGORY = 'category';
	  var DESCR = 'description';
	  var CAT_ = 'cat_';
	  var _D = '_d';
	  var _LI = '_li';
	  var _A = '_a';
	  var GET = 'GET';
	  var XML = 'xml';
	  var HTML_FRG1 = '<li id="';
	  var HTML_FRG2 = '"><h3><a id="';
	  var HTML_FRG3 = '"  href="#">';
	  var HTML_FRG4 = '</a></h3><p id="';
	  var HTML_FRG5 = '"></p><a href="#" data-transition="slideup" id="';
	  var HTML_FRG6 = '"/></li>';
	  var HTML_FRG7 = '<p>';
	  var HTML_FRG8 = '</p><hr></hr>';	  
	  var NEWS_URI = 'http://rss.news.yahoo.com/rss/';
	  var TWO_SECONDS = 2000;

	  // Variables
	  var hdrCategoriesVar = $('#hdrCategories');
	  var contentCategoriesVar = $('#contentCategories');
	  var ftrCategoriesVar = $('#ftrCategories');
	  var hdrSelectVar = $('#hdrSelect');
	  var contentSelectVar = $('#contentSelect');
	  var ftrSelectVar = $('#ftrSelect');
	  var hdrProgressVar = $('#hdrProgress');
	  var contentProgressVar = $('#contentProgress');
	  var ftrProgressVar = $('#ftrProgress');
	  var hdrNewsVar = $('#hdrNews');
	  var contentNewsVar = $('#contentNews');
	  var ftrNewsVar = $('#ftrNews');
	  var currentNewsVar = $('#currentNews');
	  var buttonFtrShowCategoriesVar = $('#buttonFtrShowCategories');
	  var buttonHdrShowCategoriesVar = $('#buttonHdrShowCategories');
	  var buttonGetCategoryVar = $('#buttonGetCategory');
	  var buttonAddCategoryVar = $('#buttonAddCategory');
	  var categoryVar = $('#category');
	  
	  var numNewsToRestore= 0;
	  var numLi = 0;
	  var storedNewsArr;

	$(document).ready(function () {   	   
     showProgress();
     var storedNewsTxt = $.DSt.get(COOKIE_NAME); 
     
     if(storedNewsTxt != null && storedNewsTxt.length > 0){
      storedNewsArr = storedNewsTxt.split(COMMA);
     }else{
      storedNewsArr = new Array();
     }      
     numNewsToRestore = storedNewsArr.length;     
     restore();
	  });    
	   
	 function restore(){	  
    if(numNewsToRestore > 0){
      getNews(storedNewsArr[--numNewsToRestore],restoreNews);
    }else{
     showCategories();  
    } 
   }

   function hideCategories(){
	hdrCategoriesVar.hide();
	contentCategoriesVar.hide();
	ftrCategoriesVar.hide();      
   }
   
   function hideSelect(){
	hdrSelectVar.hide();
	contentSelectVar.hide();
	ftrSelectVar.hide();      
   }
   
  function showCategories(){
  	hideSelect();
    hideProgress();
    hideNews();
    hdrCategoriesVar.show();
    contentCategoriesVar.show();
    ftrCategoriesVar.show();      
   }
   
   function showSelect(){
   	hideCategories();
    hideProgress();
    hideNews();
    hdrSelectVar.show();
    contentSelectVar.show();
    ftrSelectVar.show();      
   }
   
   function showProgress(){
   	hideCategories();
    hideSelect();
    hideNews();
    hdrProgressVar.show();
    contentProgressVar.show();
    ftrProgressVar.show();
   }
   
   function hideProgress(){
	hdrProgressVar.hide();
	contentProgressVar.hide();
	ftrProgressVar.hide();
   }   
   
   function showNews(){
    hideCategories();
    hideSelect();
    hideProgress();
    hdrNewsVar.show();
    contentNewsVar.show();
    ftrNewsVar.show();
   }
   
   function hideNews(){
	hdrNewsVar.hide();
	contentNewsVar.hide();
	ftrNewsVar.hide();
   }
   
    function animate(pArr,animationTarget,handle){
      var len = pArr.length;
      var currInd = 1;
      animationTarget.doTimeout(handle,TWO_SECONDS, function(){
        this.fadeOut(function(){
          currInd = currInd % len;
          animationTarget.text(pArr[currInd++]);
          animationTarget.fadeIn();            
          });  
        return true;
      });        
    }
            
    function storeCurrentNews(){
      $.DSt.set(COOKIE_NAME, EMPTY);
      var tmp = EMPTY;
      currentNewsVar.find(LI).each(function(){
        tmp = tmp + COMMA + $(this).find(PAR).attr(ID).substring(4);
      });
      
      $.DSt.set(COOKIE_NAME, tmp.substring(1));
    }              
    
    function getNews(varCat,handler){
      var varURI = NEWS_URI + varCat;
      
	  $.ajax({type: GET, dataType: XML, url: varURI, success: handler});
      return false; 
    }
   
    function populateNewsItems(xml){
      var tmpTxt = EMPTY;
      $(xml).find(ITEM).each(function(){
          var txt = $(this).find(DESCR).text();
          tmpTxt = tmpTxt + HTML_FRG7 + txt + HTML_FRG8;                   
      }); 
      
      contentNewsVar.html(tmpTxt);
      showNews();
    }
    
    function populateSingleNews(xml){ 
      var tmpTxt = $(xml).find(CATEGORY).first().text();
      var desc = $(xml).find(DESCR).first().text();
      var category = CAT_ + tmpTxt;
      var categoryDel = category + _D;
      var categoryLi = categoryDel + _LI;
      var categoryA = category + _A;

      $(HTML_FRG1 + categoryLi + HTML_FRG2 + categoryA + HTML_FRG3 + desc + HTML_FRG4 + category + HTML_FRG5 + categoryDel + HTML_FRG6).prependTo(currentNewsVar);
      
      var newDeleteItem = document.getElementById(categoryDel);
      $(newDeleteItem).click(function() {
	    $.doTimeout( categoryLi, false );
        var newListItem = document.getElementById(categoryLi);  
        $(newListItem).remove();
         storeCurrentNews();
      });
      
      var newDescItem = document.getElementById(categoryA);      
      $(newDescItem).click(function() {
	  	showProgress();
        getNews(category.substring(4),populateNewsItems); 
      });
	  
	  var ind = 0;
	  var newsArray = new Array();
      $(xml).find(ITEM).each(function(){
          var txt = $(this).find(TITLE).text();
          newsArray[ind++] = txt;                   
      }); 
	  
	  var newItem = document.getElementById(category);
      $(newItem).text(newsArray[0]);

      currentNewsVar.listview(REFRESH); 
      animate(newsArray,$(newItem),categoryLi);
   }

   function restoreNews(xml){
    populateSingleNews(xml);
    restore();
   }
   
   function addNews(xml){
    populateSingleNews(xml);
    storeCurrentNews();
    showCategories();
   }
   
   function changeLocation(varURI){
   	showProgress();	
	$.get(EMPTY,function(data){
		window.location = varURI;
	});	
   }
   
   
   buttonAddCategoryVar.click(function() {
      showSelect();
      return false;      
    });

    buttonGetCategoryVar.click(function() {     
      if(categoryVar.val() != EMPTY){       
	  	showProgress();  
        return getNews(categoryVar.val(),addNews);
      }else{
        showCategories();
        return false;
      }
    });
    
    buttonHdrShowCategoriesVar.click(function() {
      showCategories();
      return false;      
    });
    
    buttonFtrShowCategoriesVar.click(function() {
      showCategories();
      return false;    
    });