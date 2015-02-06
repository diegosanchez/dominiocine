var jsdom = require("jsdom");
module.exports = function(mws){
    var _this = this;  	
	
    this.getLinks = function(string,cb){
        console.log('Buscando en Wikipedia...');
        jsdom.env(
            "http://es.wikipedia.org/wiki/" + string,
            ["http://code.jquery.com/jquery.js"],
            function (errors, window) {
                var links = [];
				var languageLinks = window.$(".interlanguage-link a");
                
                for(var t in languageLinks){

                    if(typeof languageLinks[t].src !="undefined"){
                        links.push({
                            link: languageLinks[t].src
                        });
                    }//end if
                }//end for
                cb(links);
            }
        );		
    };	

};
