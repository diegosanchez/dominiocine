module.exports = function(app,db){
	app.get("/cms", function(req, res, next){
		db.films.find({}, {}, function(err, docs){
			if(err){
				res.render("error", {layout:"layout"});
			}
			else{
				res.render("cms/index", {
					films: docs
				});
			}
		});
	});

	app.get("/save", function(req, res, next){
		var date = new Date();
		req.query.created = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear(); 
		db.films.save(req.query, function(err, docs){
			res.redirect("/cms");
		});
	});

	app.get("/edit", function(req, res, next){
		db.films.find({}, {}, function(err, docs){
			res.render("cms/edit", {
				films: docs
			});
		});
	});
};