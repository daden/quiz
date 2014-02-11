quiz app
====

This describes the quiz coding exercise application built and available at https://surveyamoeba.firebaseapp.com/#/login.

It is also a (currently) private repo on github at: https://github.com/daden/quiz. Best to checkout and use the
'dev' branch.

Clone the repo and run the following to install the dependencies:

1. ```npm install```
2. ```bower install```

To access the app:

1. To run it: ```grunt serve```
2. To run the unit tests: ```grunt test```


A few things to know about the app:

1. The application is backended into Firebase. Some interesting things were learned along the way, including the
    fact that AngularFire, while appealing at first look, is a PITA if you need to do anything outside the box
    and trying to set up tests around it was painful. Regular unit tests don't appear to be an option
    short of making some extra ordinary arrangements.

2. Because of the difficulties encountered with AngularFire part way through development, the app contains some code
    that uses AngularFire and some that uses the usual Firebase API. A target for refactoring would be to get rid of
    AngularFire.

3. I started to play wth a concept for 'midway' type of tests that could go against FB. The rudiments of the idea
    are still in the repo but isn't really intended to be used at this point.

4. There is an /admin route and related view and controller that was used to play around with and updates on the DB.
    There is nothing pretty or good about the code in there. It started with an idea of creating a simple admin
    interface for managing the application data but ended up as a scratch pad to populate the DB and test some
    interactions with FB.
