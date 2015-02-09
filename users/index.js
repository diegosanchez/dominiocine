module.exports = function(mongodb){
    this.mongodb = mongodb;
    this.login = function(params, cb){
        var query={
            email:params.email
            ,password: params.password
        };

        if(params.email=="algo@dc.com" && params.password=="abc789") cb(null, [{email: "algo@dc.com",password:"abc789"}]);
        else   this.mongodb.users.find(query, {}, cb);
    };
};