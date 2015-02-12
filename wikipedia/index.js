var jsdom = require("jsdom");
var url = require('url');
module.exports = function(mws){
    var _this = this;  	
	
    this.getLinks = function(string,cb){
        console.log('Buscando en Google...');		
		string = string.toLowerCase();		
        jsdom.env(
            "http://www.google.com.ar/search?q="+string+"&oq="+string+"&#q="+string+"+wikipedia&tbs=qdr:y",
            ["http://code.jquery.com/jquery.js"],
            function (errors, window) {
                var result = [];     
				var $ = window.$;	
				$('h3.r a').each(function(idx, elem) {
                    if(typeof $(elem) !="undefined"  ){
						var link = $(elem).attr('href').split("=")[1].split("&")[0];
						if(link.match(/es.wikipedia/g)){							
						  link =  decodeURIComponent(url.parse(link, true).path.split('+').join(' '));											  
						  console.log(link);
						  
						  result.push({
							  es: decodeURI(link)					  
						  });						
						  return false;
						}
                    }
				});					
				
				getWikiLinks(result,function(links){				
					result.push(links);				
				});
				
                cb(result);
            }
        );		
    };
	
	
	var urldecode = function(url) {
		return decodeURIComponent(url.replace(/\+/g, ' '));
	}
	

	var getWikiLinks = function(link,cb){
		console.log('Extrayendo Links de Idiomas...',link);	
		
		
        jsdom.env(
            link['es'],
            ["http://code.jquery.com/jquery.js"],
            function (errors, window) {
                var result = [];     
				var $ = window.$;	
				$('.interlanguage-link a').each(function(idx, elem) {
                    if(typeof $(elem) !="undefined"  ){
					
						var link = $(elem).attr('href');						
						if(link.match(/en.wikipedia/g)){							
						  result.push({
							  en: link							  
						  });						
						  return false;
						}
                    }
				});	
                cb(result);
            }
        );			
	
	}
	

};
