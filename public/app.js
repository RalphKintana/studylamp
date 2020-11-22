
/* CLOUD FIRESTORE Document example in the user collection */
var userID = "JDIyWnUQVXh6sxozNjuQ";

/* STILL NOT USED */
var userCollection = ["user","group"];

let mygroups = [];

    /* Cloud Firestore*/    
        firebase.initializeApp({
            apiKey: 'AIzaSyBk-TIhpYd0QJGZj_iUC9_6JVR17aH-6k0',
            authDomain: 'studylamp-d3691.firebaseapp.com',
            projectId: 'studylamp-d3691'
            });
    
            var db = firebase.firestore();
            
            /* ADD USER Doc to User collection 
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


            db.collection("user").doc(userID).get().then(function(doc) {
                if (doc.exists) {
                    document.getElementById("username").innerHTML = doc.data().username;
                    console.log("Document data:", doc.data());
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });


/* Get user Groups From Database */

function getGroups(userid){

    db.collection("user").doc(userID).collection("groups").where("status","==","confirmed").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
           //console.log(doc.id, " => ", doc.data());
           if(doc.exists){

               
            var node = document.createElement("div");
            node.className = "sample";
            var node2 = document.createElement("div");
            node2.className = "infopart";
            var a = document.createElement("a");
            a.className = "grpname";
            a.href = "?mygroup="+ doc.data().groupId;
            var text = document.createTextNode(doc.data().groupname);
            a.appendChild(text);
            node2.appendChild(a);
            node.appendChild(node2);
            var cont =  document.getElementById("groups_container");
            cont.insertBefore(node, cont.childNodes[0]);
            console.log(doc.data());
                
        
            document.getElementById("groups_container").style.visibility = "visible";
            document.getElementById("welcome_modal").style.visibility = "hidden";
            document.getElementById("welcome_modal").style.zIndex = -5;
            document.getElementsByClassName("group_header")[0].style.visibility = "visible";
            document.getElementsByClassName("group_header")[1].style.visibility = "visible";
            
           }
        })
    })
}
getGroups(userID);




/* Unhide add member textbox */
 var addmember =  document.getElementById("addmember");
 addmember.addEventListener("click", function(){
    document.getElementById("member_email").style.visibility = "visible";
    document.getElementById("add").style.visibility = "visible";
  })


/* Add members email to array*/
  var emails = [];
  var add = document.getElementById("add");
  add.addEventListener("click", function(){

    /* Check if email is registered and if yes push email to emails array*/
    var email = document.getElementById("member_email").value;
    var status = "0";
    var userRef = db.collection("user");
    var query = userRef.where("email", "==",email);
    db.collection("user").where("email", "==",email)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {

            if(doc.exists){
                status = "1";
                emails.push(email);

                var node = document.createElement("A");
                node.className = "member";
                node.style.color = "blue";
                node.style.textDecoration = "underline";
                var textnode = document.createTextNode(email);
                node.appendChild(textnode);
                var br = document.createElement("br");
                document.getElementById("addmemberList").appendChild(node);
                document.getElementById("addmemberList").appendChild(br);
    
                document.getElementById("emailnotregistered").style.visibility = "hidden";        
            }
        })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    }); 

    /* Error popup if email is not registered */
    if(status == "0"){
        document.getElementById("emailnotregistered").innerHTML = "Email is not registeresd!";
        document.getElementById("emailnotregistered").style.visibility = "visible";
    }

    /* clear email textbox and set status to 0 */
    document.getElementById("member_email").value = "";
    status = "0";


  });

  
/* CREATE NEW GROUP AND ADD MEMBERS */
  var create_Group = document.getElementById("create_Group");
  create_Group.addEventListener("click", function(){

        var grpname = document.getElementById("group_name").value;
        if(grpname !== ""){

                /* ADD NEW GROUP TO THE DATABASE */
                db.collection("group").add({
                    groupname: grpname,
                    description: "",
                    admin: userID
                })
                .then(function(docRef) {

                    /* FUNCTION TO ADD EACH ADDED GROUP TO USER*/
                    function myFunctionAddMember(item) {

                        var docId = "";
                         db.collection("user").where("email", "==", item).get().then(function(querySnapshot) {
                                     querySnapshot.forEach(function(doc) {

                                         docId =  doc.id;
                                         var mygroupsRef = db.collection("user").doc(docId).collection("groups");
                                         mygroupsRef.add({
                                             groupname: grpname,
                                             groupId: docRef.id,
                                             status: "pending"
                             
                                         })
                                         .then(function(docRef) {
                                             groupId = docRef.id;
                                             console.log("Document written with ID: ", docRef.id);
                                         })
                                         .catch(function(error) {
                                             console.error("Error adding document: ", error);
                                         });
                                     });
                                 })
                                 .catch(function(error) {
                                     console.log("Error getting documents: ", error);
                                 })
     
                     }
                     
                     /*FOREACH FOR EMAILS */
                     emails.forEach(myFunctionAddMember);
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });

                /* TO HIDE VALIDATION MESSAGE */
                document.getElementById("emailnotregistered").style.visibility = "hidden";

                /* SUCCESS MESSAGE */
                document.getElementById("emailnotregistered").innerHTML = "Group created successfully!";
                document.getElementById("emailnotregistered").style.visibility = "visible";

                /*EMPTY GROUP NAME TEXTBOX */
                document.getElementById("group_name").value = "";

        }else{
            /* UNHIDE VALIDATION MESSAGE */
            document.getElementById("emailnotregistered").innerHTML = "Group must have a name!";
            document.getElementById("emailnotregistered").style.visibility = "visible";
        }

  })



  /* Add create new group ver 2 */

