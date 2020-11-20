/* Welome Header Center*/
var width = $(window).width() / 2.54;
var height = $(window).height() / 3.4;
$(".header_container").css({"top": height, "left": width })

var userCollection = ["user","group"];       
        
    /* Cloud Firestore*/    
        firebase.initializeApp({
            apiKey: 'AIzaSyBk-TIhpYd0QJGZj_iUC9_6JVR17aH-6k0',
            authDomain: 'studylamp-d3691.firebaseapp.com',
            projectId: 'studylamp-d3691'
            });
    
            var db = firebase.firestore();
            
            /* ADD USER
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
            });*/

            /* Document example in the user collection */
            var userID = "JDIyWnUQVXh6sxozNjuQ";

            db.collection("user").doc(userID).get().then(function(doc) {
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

/* Unhide add member textbox */
 var addmember =  document.getElementById("addmember");

 addmember.addEventListener("click", function(){
    document.getElementById("member_email").style.visibility = "visible";
    document.getElementById("add").style.visibility = "visible";
  })

/* Add members */
  var emails = [];
  var add = document.getElementById("add");
  add.addEventListener("click", function(){

    var email = document.getElementById("member_email").value;
    var memDoc = "";
    var userRef = db.collection("user");
    var query = userRef.where("email", "==",email);
    db.collection("user").where("email", "==",email)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            
           if(doc.exists){

            emails.push(email);

            var node = document.createElement("A");
            node.className = "member";
            node.style.color = "blue";
            node.style.textDecoration = "underline";
            var textnode = document.createTextNode(email + ",");
            node.appendChild(textnode);
            document.getElementById("addmemberList").appendChild(node);
    
            document.getElementById("member_email").value = "";
            document.getElementById("emailnotregistered").style.visibility = "hidden";
    
        }else{
            document.getElementById("emailnotregistered").style.visibility = "visible";
        }
        })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });


    if( email !== "" && memDoc === email){

        emails.push(email);

        var node = document.createElement("A");
        node.className = "member";
        node.style.color = "blue";
        node.style.textDecoration = "underline";
        var textnode = document.createTextNode(email + ",");
        node.appendChild(textnode);
        document.getElementById("addmemberList").appendChild(node);

        document.getElementById("member_email").value = "";
        document.getElementById("emailnotregistered").style.visibility = "hidden";

    }else{
        document.getElementById("emailnotregistered").style.visibility = "visible";
    }

    document.getElementById("member_email").value = "";
  })

  

  var create_Group = document.getElementById("create_Group");
  var groupId;
  create_Group.addEventListener("click", function(){

        var grpname = document.getElementById("group_name").value;

        if(grpname !== ""){

                db.collection("group").add({
                    groupname: grpname,
                    description: ""
                })
                .then(function(docRef) {
                    groupId = docRef.id;
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });
        
                function myFunctionAddMember(item) {

                   var docId;
                    db.collection("user").where("email", "==", item).get().then(function(querySnapshot) {
                                querySnapshot.forEach(function(doc) {
                                    docId = doc.id;
                                });
                            })
                            .catch(function(error) {
                                console.log("Error getting documents: ", error);
                            });
        
                    var mygroupsRef = db.collection("user").doc(docId).collection("groups").doc();
                    
                    mygroupsRef.set({
                        groupname: grpname,
                        groupId: groupId
        
                    })
                    .then(function(docRef) {
                        groupId = docRef.id;
                        console.log("Document written with ID: ", docRef.id);
                    })
                    .catch(function(error) {
                        console.error("Error adding document: ", error);
                    });

                }
        
                emails.forEach(myFunctionAddMember);
        }
      

  })

  
         