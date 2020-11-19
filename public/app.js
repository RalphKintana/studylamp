/* Welome Header Center*/
var width = $(window).width() / 2.54;
var height = $(window).height() / 3.4;
$(".header_container").css({"top": height, "left": width })

        
        
    /* Cloud Firestore*/    
        firebase.initializeApp({
            apiKey: 'AIzaSyBk-TIhpYd0QJGZj_iUC9_6JVR17aH-6k0',
            authDomain: 'studylamp-d3691.firebaseapp.com',
            projectId: 'studylamp-d3691'
            });
    
            var db = firebase.firestore();
    
            db.collection("user").add({
                username: "NattoObasan",
                email: "sagnoynatalie@gmail.com",
                password: "natalie777",
            })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
    
            db.collection("user").doc("JDIyWnUQVXh6sxozNjuQ").get().then(function(doc) {
                if (doc.exists) {
                    document.getElementById("username").innerHTML = doc.data().username;
                   // console.log("Document data:", doc.data());
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });