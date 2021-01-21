var url = "https://tweetwithprofile.herokuapp.com"
// var url = "http://localhost:5000"
var socket = io(url)

socket.on("connect", function () {
    console.log("connected");
});
function signup() {

    axios({
        method: 'post',
        url: url + '/signup',

        data: {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            phone: document.getElementById('phone').value,
            gender: document.getElementById('gender').value,

        },
        withCredentials: true
    })
        .then((response) => {
            if (response.data.status === 200) {
                alert(response.data.message)
                location.href = "./login.html"
            } else {
                alert(response.data.message);
            }
        }).catch((error) => {
            console.log(error);
        });
    return false;
}
function login() {
    axios({
        method: 'post',
        url: url+'/login',
       
        withCredentials: true,
        data: {

            email: document.getElementById('Lemail').value,
            password: document.getElementById('Lpass').value,

        }
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "./profile.html"
            sessionStorage.setItem("email", document.getElementById('Lemail').value)
        } else {
            alert(response.data.message);
        }
    }).catch((error) => {
        console.log(error);
    });
    return false;
}
function logout() {
    axios({
        method: 'post',
        url: url + '/logout',
    }).then((response) => {
        console.log(response);
        location.href = "./login.html"
    }, (error) => {
        console.log(error);
    });
    return false
}
function forget_password() {

    var email = document.getElementById('email12').value
    localStorage.setItem("email", email)

    axios({
        method: 'post',
        url: url + '/forget_password',

        withCredentials: true,
        data: {
            email: email
        }
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "./forget_pass_code.html"
        } else {
            alert(response.data.message);
        }
    }).catch((error) => {
        console.log(error);
    });
    return false;
}
function forget_password_step_2() {
    var email22 = localStorage.getItem("email")
    axios({
        method: 'post',
        url: url + '/forget_password_step_2',

        withCredentials: true,
        data: {
            email: email22,
            code: document.getElementById('code').value,
            newPass: document.getElementById('newPassword').value,
        }
    }).then((response) => {
        console.log(response);
        alert(response.data)
        location.href = "./login.html"
    }).catch((error) => {
        console.log(error);
    });
    return false;
}
function getProfile() {
    axios({
        method: 'get',
        url: url + '/profile',
        credentials: 'include',
    }).then((response) => {
        console.log(response.data.profile)
        document.getElementById("pName").innerHTML = response.data.profile.name
        document.getElementById("profilePic").src = response.data.profile.profilePic
    }, (error) => {
        location.href = "./login.html"
    });
    return false;
}
function post() {
    axios({
        method: 'post',
        url: url + '/tweet',
        credentials: 'include',
        data: {
            userName: document.getElementById('pName').innerHTML,
            tweet: document.getElementById('tweet').value,
        },
    }).then((response) => {
        console.log(response.data);
        document.getElementById('userPosts').innerHTML += `
    <div class="posts">
    <h4>${response.data.data.name}</h4>
    
    <p>${response.data.data.tweets}</p>
    </div>
    `
    }, (error) => {
        console.log(error.message);
    });
    document.getElementById('tweet').value = "";
    return false
}

function getTweets() {
    axios({
        method: 'get',
        url: url + '/getTweets',
        credentials: 'include',
    }).then((response) => {
        console.log(response.data)
        let tweets = response.data.data;
        let html = ""
        for (let i = 0; i < tweets.length; i++) {
            html += `
            <div class="posts">
            <h4>${tweets[i].name}</h4>
            <p>${tweets[i].tweets}</p>
            </div>
            `
        }
        document.getElementById('posts').innerHTML = html;

        let userTweet = response.data.data
        let userHtml = ""
        let userName = document.getElementById('pName').innerHTML;
        for (let i = 0; i < userTweet.length; i++) {
            if (tweets[i].name == userName) {
                userHtml += `
                        <div class="posts">
                        <h4>${tweets[i].name}</h4>
                <p>${tweets[i].tweets}</p>

                        </div>
                        `
            }

        }
        document.getElementById('userPosts').innerHTML = userHtml;
    }, (error) => {
        console.log(error.message);
    });
    return false
}


socket.on('NEW_POST', (newPost) => {
    console.log(newPost)
    let tweets = newPost;
    document.getElementById('posts').innerHTML += `
    <div class="posts">
    <h4>${tweets.name}</h4>
    <p>${tweets.tweets}</p>
    </div>
    `
})
document.getElementById('profile').style.display = "none"
document.getElementById('usersSection').style.display = "none"
function showHome() {
    document.getElementById('profile').style.display = "none"
    document.getElementById('home').style.display = "block"
    document.getElementById('usersSection').style.display = "none"

}


function showProfile() {
    document.getElementById('home').style.display = "none"
    document.getElementById('profile').style.display = "block"
    document.getElementById('usersSection').style.display = "none"

}


function upload() {

    var fileInput = document.getElementById("fileInput");

    // // To convert a File into Blob (not recommended)
    // var blob = null;
    // var file = fileInput.files[0];
    // let reader = new FileReader();
    // reader.readAsArrayBuffer(file)
    // reader.onload = function (e) {
    //     blob = new Blob([new Uint8Array(e.target.result)], { type: file.type });
    //     console.log(blob);
    // }

    console.log("fileInput: ", fileInput);
    console.log("fileInput: ", fileInput.files[0]);

    let formData = new FormData();
    // https://developer.mozilla.org/en-US/docs/Web/API/FormData/append#syntax

    formData.append("myFile", fileInput.files[0]); // file input is for browser only, use fs to read file in nodejs client
    // formData.append("myFile", blob, "myFileNameAbc"); // you can also send file in Blob form (but you really dont need to covert a File into blob since it is Actually same, Blob is just a new implementation and nothing else, and most of the time (as of january 2021) when someone function says I accept Blob it means File or Blob) see: https://stackoverflow.com/questions/33855167/convert-data-file-to-blob
    formData.append("email", sessionStorage.getItem("email")); // this is how you add some text data along with file
    formData.append("myDetails",
        JSON.stringify({
            "subject": "Science",   // this is how you send a json object along with file, you need to stringify (ofcourse you need to parse it back to JSON on server) your json Object since append method only allows either USVString or Blob(File is subclass of blob so File is also allowed)
            "year": "2021"
        })
    );

    // you may use any other library to send from-data request to server, I used axios for no specific reason, I used it just because I'm using it these days, earlier I was using npm request module but last week it get fully depricated, such a bad news.
    axios({
        method: 'post',
        url: url + "/upload",
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
    })
        .then(res => {
            console.log(`upload Success` + res.data);
        })
        .catch(err => {
            console.log(err);
        })

    return false; // dont get confused with return false, it is there to prevent html page to reload/default behaviour, and this have nothing to do with actual file upload process but if you remove it page will reload on submit -->

}
function previewFile() {
    const preview = document.querySelector('img');
    const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function () {
        // convert image file to base64 string
        preview.src = reader.result;
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}
