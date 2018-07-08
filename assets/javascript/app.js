// Steps to complete

//1. Initiate Firebase
//2. Grab input from form on button click and save that information in the database
//3. Display Information from database to the table on the UI
//4. Calculate Next train arrival from First train time (2am, comes every 1 hour) and display on UI
//5. Calculate Minute away (Train arrival-now) and display on UI

//Bonus
// Update Next train time and Minute to arrival every minute
// Functionality to update train info in the table and update it in DB
// Functionality to remove train info in the table and update it in the DB
// Login with only Google or Github(Firebase authentication)


//alert(moment("2017-07-03T15:00:00.027Z").utc().format('hh:mm:ss'));
//alert(moment().format('hh:mm:ss'));
// var dateA = moment().add('hours', 7);
// alert(dateA.fromNow());

var dateB = moment('2014-12-12');
var dateC = moment('2014-12-11');

//alert(dateB.from(dateC));

var now = moment('2018-07-03T08:00:00.27Z').utc().format('hh:mm:ss');
var tTime = moment('2018-07-03T15:00:00.27Z').utc().format('hh:mm:ss');

// alert(tTime.from(now));
//1. Initiate Firebase
var config = {
    apiKey: "AIzaSyBFQbFKWl6UaLqW7ZjyFtGEq9TxzeQyX8g",
    authDomain: "train-scheduler-8762f.firebaseapp.com",
    databaseURL: "https://train-scheduler-8762f.firebaseio.com",
    projectId: "train-scheduler-8762f",
    storageBucket: "",
    messagingSenderId: "1030115543424"
  };

firebase.initializeApp(config);
var database = firebase.database();

//2. Grab input from form on button click and save that information in the database
$("#add-train-btn").on("click", function(event){
    event.preventDefault();
    // $("tbody").empty();

    //Grap user input
    var trainName = $("#train-name").val().trim();
    var trainDestination = $("#train-destination").val().trim();
    var firstTrainTime = $("#train-time").val().trim();
    var trainFrequency = $("#train-frequency").val().trim();

    //Create local temporary object to hold data
    var trainInfo = {
        name: trainName,
        destination: trainDestination,
        time: firstTrainTime,
        frequency: trainFrequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    }

    //Upload data to the database
    database.ref().push(trainInfo);

    //Log everything to console
    console.log(trainInfo.name);
    console.log(trainInfo.destination);
    console.log(trainInfo.time);
    console.log(trainInfo.frequency);

    //Log that train info added successfully
    console.log("Train info added successfully");

    //Clear all info from the form
    $("#train-name").val("");
    $("#train-destination").val("");
    $("#train-time").val("");
    $("#train-frequency").val("");
    
})

//3. Display Information from database to the table on the UI

database.ref().orderByChild("dateAdded").limitToLast(25).on("child_added", function(snapshot) {

    // Store everything into a variable.
    var trainName = snapshot.val().name;
    var trainDestination = snapshot.val().destination;
    var firstTrainTime = snapshot.val().time;
    var trainFrequency = snapshot.val().frequency;

    console.log("New Train name: " + trainName);
    console.log("New Train destination: " + trainDestination);
    console.log("New Train time: " + firstTrainTime);
    console.log("New Train frequency: " + trainFrequency);


    //4. Calculate Next train arrival from First train time (2am, comes every 1 hour) and display on UI
    var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1,"years");
    console.log("FTC : " + firstTimeConverted.format("hh:mm"));

    var currentTime = moment();
    console.log("CT : " + currentTime.format("hh:mm"));

    //Difference in current time and firstTrain time
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("difference in time" + diffTime);  

    //Minutes away - Next arrival - now
    var minAway = trainFrequency - (diffTime % trainFrequency);
    console.log("Minutes away :" + minAway);

    //Next Train time 
    var nextTrainTime = moment().add(minAway, "minutes").format("hh:mm");
    console.log("Next Train time:" + nextTrainTime);

    //6. Display data in the table
    function displayInfo(){
        $("tbody").append("<tr><td>" + firstTrainTime + "</td><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + nextTrainTime + "</td><td>" + minAway + "</td><td><button class='remove'>Remove</tr>");
    }
    displayInfo();

    // var refresh = setInterval(function(){
    //     console.log("Time" + moment().format("HH:mm"));
    //     document.location.reload();
    // },60000); 

   // Handle the errors
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
});

//On Child deleted

//Remove train info
// $(document).on("click", ".remove", function(){
//     console.log($(this).parent());

    //parent element

// })



