/**
 * Wrapper JS file to supports Facebook authentication
 * Created by sminrana@gmail.com on 3/3/16.
 *
 * Facebook JS SDK website: https://developers.facebook.com/docs/javascript
 */

var FacebookAuthentication;
FacebookAuthentication = function () {


};

var _callback;
var _callbackFailure;

FacebookAuthentication.prototype.authenticateFacebook =
    function(appId, callback, callbackFailure) {

    window.fbAsyncInit = function () {
        FB.init({
            appId: appId,
            xfbml: true,
            version: 'v2.5'
        });

        // Save reference of functions
        _callback = callback;
        _callbackFailure = callbackFailure;

        // Check login status
        checkLoginState();
    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
};

/**
 * Call Facebook Login with public_profile and email scope
 */
FacebookAuthentication.prototype.login = function () {
     FB.login(function(response) {
        statusChangeCallback(response);
     }, {scope: 'public_profile,email'});
};

FacebookAuthentication.prototype.logOut = function () {
    FB.logout(function(response) {
        statusChangeCallback(response);
    });
};

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
       var accessToken = response.authResponse.accessToken;
       var expiresIn = response.authResponse.expiresIn;

       callFacebookAPI('email', accessToken, expiresIn);
    } else if (response.status === 'not_authorized') {

        if (_callbackFailure && typeof(_callbackFailure) === "function") {
          _callbackFailure(status);
        }

    } else {

        if (_callbackFailure && typeof(_callbackFailure) === "function") {
          _callbackFailure(status);
        }
    }
}

function callFacebookAPI(api_type, accessToken, expiresIn) {
    switch (api_type) {
        case 'email':
            FB.api('/me/?fields=name,email', function(response) {
                var name = response.name;
                var email = response.email;
                var fbId = response.id;

                if (_callback && typeof(_callback) === "function") {
                    _callback(name, email, fbId, accessToken, expiresIn);
                }
            });
            break;
    }
}
