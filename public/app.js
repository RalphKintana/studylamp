
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
            a.href = "?mygroup="+ doc.data().groupId + "&index=0";
            a.onclick = function (){
                var id = doc.data().groupId;
                displaygroupinfo(id,0);
            };
            var text = document.createTextNode(doc.data().groupname);
            a.appendChild(text);
            node2.appendChild(a);
            node.appendChild(node2);
            var cont =  document.getElementById("groups_container");
            cont.insertBefore(node, cont.childNodes[0]);
            console.log(doc.data());
                
            document.getElementById("welcome_modal").style.zIndex = -5;
            document.getElementById("groups_container").style.visibility = "visible";
            document.getElementById("welcome_modal").style.visibility = "hidden";
            document.getElementsByClassName("group_header")[0].style.visibility = "visible";
            document.getElementsByClassName("group_header")[1].style.visibility = "visible";
            
           }
        })
    })
}
getGroups(userID);


/* Activate selected group page*/
function displaygroupinfo(id,index){

    document.getElementById("group_page").style.visibility = "visible";
    /* get doc in group collection */
    var groupRef = db.collection("group").doc(id);
    
    groupRef.get().then(function(doc) {
        if (doc.exists) {
    
            document.getElementById("groupname").innerHTML = doc.data().groupname;
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    })

    /* get all meetings in grop */
    groupRef.collection("meeting").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());

        var theDate = new Date(doc.data().date.seconds * 1000);
        dateString = theDate.toGMTString();

          var node = document.createElement("div");
          node.className = "p-2 bd-highlight mymeetings";
          var cnter = document.createElement("center");
          var cnter2 = document.createElement("center");
          var h5 = document.createElement("h5");
          h5.className = "meetingHeader";
          var text = document.createTextNode(doc.data().name);
          var p = document.createElement("p");
          p.className = "meetingdate";
          var text2 = document.createTextNode(dateString);
          var a = document.createElement("a");
          var text3 = document.createTextNode("Join");
          a.href = doc.id;
          a.className = "join";

          h5.appendChild(text);
          cnter.appendChild(h5);
          p.appendChild(text2);
          cnter2.appendChild(p);
          a.appendChild(text3);
          node.appendChild(cnter);
          node.appendChild(cnter2);
          node.appendChild(a);
          document.getElementById("meet_cont").appendChild(node);

        });
    });
    

    if(index != undefined){
        mytab(index);
    }
}



/* TO keep  GROUP PAGE when reload */
let url = window.location.href;
if(url.includes('?')){
    var param = new URL(url);
    var c = param.searchParams.get("mygroup");
    var i = param.searchParams.get("index");
    if(c != undefined && i != undefined){
        displaygroupinfo(c,i);
    }
}else{
  console.log('No Parameters in URL');
}



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

                    /* FUNCTION TO ADD GROUP TO EACH MEMBER USER*/
                    function myFunctionAddMember(item) {

                        var docId = "";
                         db.collection("user").where("email", "==", item).get().then(function(querySnapshot) {
                                     querySnapshot.forEach(function(doc) {

                                         docId =  doc.id;
                                         var mygroupsRef = db.collection("user").doc(docId).collection("groups");
                                         mygroupsRef.add({
                                             groupname: grpname,
                                             groupId: docRef.id,
                                             status: "pending",
                                             role: "member"
                             
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

                    /* add admin */
                     db.collection("user").doc(userID).collection("groups").add({
                        groupname: grpname,
                        groupId: docRef.id,
                        status: "confirmed",
                        role: "admin"
                     }).then(function(docRef) {
                        console.log("Document written with ID: ", docRef.id);
                    })
                    .catch(function(error) {
                        console.error("Error adding document: ", error);
                    });

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


/* change group tab */
function mytab(index){
    const url = new URL(window.location);
    if(index == 0){
        document.getElementById("meeting").style.display = "block";
        document.getElementById("plan").style.display = "none";
        document.getElementById("file").style.display = "none";
        url.searchParams.set('index', 0);

    }else if(index == 1){
        document.getElementById("meeting").style.display = "none";
        document.getElementById("plan").style.display = "block";
        document.getElementById("file").style.display = "none";
        url.searchParams.set('index', 1);
    }else if(index == 2){
        document.getElementById("meeting").style.display = "none";
        document.getElementById("plan").style.display = "none";
        document.getElementById("file").style.display = "block";
        url.searchParams.set('index', 2);
    }
    window.history.pushState({}, '', url);
}