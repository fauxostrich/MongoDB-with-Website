let app = require("express")();
let mongoClient = require("mongodb").MongoClient;
let port = 9090;
let n = 1;
let url = "mongodb://localhost:27017";

let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true})); // enables body part data
app.use(bodyParser.json());                      // enables json data

app.get("/", (request, response) => {
    response.sendFile(__dirname + "/index.html");
});
app.get("/insert", (request, response) => {
    response.sendFile(__dirname + "/insert.html");
});

app.get("/update", (request, response) => {
    response.sendFile(__dirname + "/update.html");
});

app.get("/delete", (request, response) => {
    response.sendFile(__dirname + "/delete.html");
});

app.post("/deleteValidation", (request, response) => {
    let id = request.body.cID;

    mongoClient.connect(url,{ useUnifiedTopology: true },(err1,client)=> {
        if(!err1){
            let db = client.db("meanstack");
            db.collection("Courses").deleteOne({courseID: id},(err2,result)=> {
                if(!err2){
                       if(result.deletedCount>0){
                            console.log("Record deleted successfully")
                       }else {
                            console.log("Record not present")
                       }
    
                }
                client.close();
            })           
        }
    })
});
app.post("/updateValidation", (request, response) => {
    let id = request.body.cID;
    let ammount = request.body.cAmt;

    mongoClient.connect(url,{ useUnifiedTopology: true },(err1,client)=> {
        if(!err1){
            let db = client.db("meanstack");
            db.collection("Courses").updateOne({courseID: id},{$set:{courseAmmount: ammount}},(err2,result)=> {
                if(!err2){
                       // console.log(result);
                       if(result.modifiedCount>0){
                            console.log("Record updated successfully")
                       }else {
                            console.log("Record didn't update");
                       }
                }
                client.close();
            })           
        }
    })
});

app.post("/insertValidation", (request, response) => {
    let id = request.body.cID;
    let name = request.body.cName;
    let descripition = request.body.cDesc;
    let ammount = request.body.cAmt;

    mongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
        let db = client.db("meanstack");    // meanstack is the name of the database we created in class (database holds collections!
        if(!err){
             console.log("Connected");
             db.collection("Courses").insertOne({_id: id, courseID: id, courseName: name, courseDescription: descripition, courseAmmount:ammount}, (err2, result) => {
                if(!err2){
                    console.log(result)
                    n++;
                } 
                else console.log(err2);
                client.close();
             });
        }
        else console.log("Error: " + err);
    });
});


app.get("/display", (request, response) => {
    let docArr = new Array();
    mongoClient.connect(url, {useUnifiedTopology: true}, (err1, client) => {
        if(!err1){
            let db = client.db("meanstack");
            let cursor = db.collection("Courses").find();
            cursor.each((err2,doc) => {
                if(doc!=null) docArr.push(doc);
                else{
                    let displayHTML = 
                    ` 
                    <h3>Fetch Courses</h3>
                    <table border = 2>
                        <tr>
                            <th>Course ID</th>
                            <th>Course Name</th>
                            <th>Course Description</th>
                            <th>Ammount</th>
                        </tr>
                    `
                    for(c of docArr){
                        displayHTML +=
                                `
                                    <tr>
                                        <td>${c._id}</td>
                                        <td>${c.courseName}</td>
                                        <td>${c.courseDescription}</td>
                                        <td>${c.courseAmmount}</td>
                                    </tr>
                                `
                    }
                    displayHTML += `</table>`
                    response.send(displayHTML);
                }
                client.close(); 
            });   
        }
    });

   
});
app.listen(port, ()=> console.log(`Listening on port ${port}...`));