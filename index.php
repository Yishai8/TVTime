<html lang="en">
  <head>
    <meta name="google-signin-scope" content="profile email">
    <meta name="google-signin-client_id" content="437453108837-mve7kprdb6u5mbkv9jvtm05bk11bm14t.apps.googleusercontent.com">
    <script src="https://apis.google.com/js/platform.js" async defer></script>
  </head>
  <body>
    <div class="g-signin2" data-onsuccess="onSignIn" data-theme="dark"></div>
    <span id="name"></span>
    <script>
      function onSignIn(googleUser) {
        // Useful data for your client-side scripts:
        var profile = googleUser.getBasicProfile();
        console.log("ID: " + profile.getId()); // Don't send this directly to your server!
        console.log('Full Name: ' + profile.getName());
        console.log('Given Name: ' + profile.getGivenName());
        console.log('Family Name: ' + profile.getFamilyName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());
		document.getElementById("name").textContent="Welcome "+profile.getName();
        // The ID token you need to pass to your backend:
        var id_token = googleUser.getAuthResponse().id_token;
        console.log("ID Token: " + id_token);
        document.getElementById("photo").src= profile.getImageUrl();
        document.getElementById("photo").style.display = "inline";
        document.getElementById("name").style.display = "inline";
        document.getElementById("logout").style.display = "inline";
      };
    </script>
<img id="photo" src=""></img>
    <a id="logout" href="#" onclick="signOut();">Sign out</a>
<script>
  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
      document.getElementById("name").style.display = "none";
      document.getElementById("logout").style.display = "none";
      document.getElementById("photo").style.display = "none";
    });
  }
</script>
  </body>
</html>