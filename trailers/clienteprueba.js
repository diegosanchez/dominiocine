var trailer=  require("./index");
var fs=require("fs");
var instance=new trailer();

instance.search(function(peliculas) 
                 {
				    var buffer="";
					for (var index=0;index<peliculas.length;index++)
					{
					   //buffer+=peliculas[index].trailers+"\n";
					   buffer+=peliculas[index].trailers[0].url;
					   console.log("El trailer es 12345255",peliculas[index].trailers[0]);
					}
					fs.writeFileSync("resultado1.txt",buffer);
					
				 }                   
                );

