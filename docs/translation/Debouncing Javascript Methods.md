# Debouncing Javascript Methodshttp://unscriptable.com/author/john-hann/)

http://unscriptable.com/2009/03/20/debouncing-javascript-methods/

Back in 2006, I was the lead front-end architect for a mission-critical Web 2.0 application. Yah-yah, aren’t they all mission-critical? Yes, but this one really was critical since it was one of those make-or-break moments for the product. What made this project really interesting were the unrealistic expectations the product managers had of web apps.

Sometimes, pressure like this can lead to creativity and innovation. On this occasion, it helped me reach back in to my electrical engineering coursework to apply a hardware concept to software programming.
Just imagine this:

1. You are tasked to write the entire Javascript-based framework from scratch, including the core functions (inheritance, declarations, event connections), DOM manipulation and querying, a widget framework, MVC, drag-and-drop, and dozens of custom widgets to boot.
2. You are given unintuitive and un-web-like requirements to ensure that the app allowed customers to adhere to strict FDA regulations.
3. The product managers had no experience with web app development so they designed the requirements for a Windows application. You know: modal dialogs, instant retrieval of large amounts of data (as if it were coming straight from the disk), workflows that depended on sequenced calls to/from the back-end systems, etc.

Oh, and did I mention there was a deadline and only two of us were hired to code the entire UI side of the project?

Well, I am always up for a challenge, especially if somebody says, “It can’t be done”. So needless to say, I had to really use my brain on this project.

One of the more interesting requirements was to show the user a summary side-bar of information pertaining to the current field (i.e. the input element that had focus). This side-bar information could be from several kilobytes to more than 100 kB. The data had to be fetched via XHR from the back-end and displayed each time the user entered a new field.

This presented a major problem if the user was keyboard-oriented and preferred to use the Tab key to move from field to field. There could be hundreds of fields on the screen, and a user could simply lean on the Tab key to navigate from one end of the form to the other. If the user were lucky enough to be on a fast network connection and had a fast enough browser, this would go fairly smoothly. However, the server would get absolutely hammered by all of the XHR requests necessary to populate the side-bar!

Luckily, I had handled this situation several times before. A simple setTimeout and a few state variables fixes this problem fairly easily. But there were several of these situations in this project, and I wanted to build something reusable.

The more I thought about it, the more it felt like [contact debouncing](http://en.wikipedia.org/wiki/Switch#Contact_bounce). Debouncing means to coalesce several temporally close signals into one signal. For example, your computer keyboard does this. Every time you hit a key, the contacts actually bounce a few times, causing several signals to be sent to the circuitry. The circuitry determines that the bouncing has ended when no bounces are detected within a certain period (the “detection period”). Since people can’t really type faster than roughly 10 keys per second, any signals happening within 100 msec of each other, for example, are likely part of the same key press. (In practice, you should at least halve this, so about 50 msec for our keyboard example. I have no idea what keyboards really use, by the way. This is just an illustration.)

## Debouncing != Throttling

Whenever I bring up the concept of debouncing, developers try to cast it as just a means of throttling. But that’s not true at all. Throttling is the reduction in rate of a repeating event. Throttling is good for reducing mousemove events to a lesser, manageable rate, for instance.

Debouncing is quite more precise. Debouncing ensures that exactly one signal is sent for an event that may be happening several times — or even several hundreds of times over an extended period. As long as the events are occurring fast enough to happen at least once in every detection period, the signal will not be sent!

Let’s relate this back to our keyboard-oriented user and our huge set of form fields. Throttling here would certainly help. We could reduce the number of XHR requests to a lower rate than the computer’s key repeat rate for sure! However, we’d still be fetching from the back-end more times than necessary, and the occasional re-rendering of the fetched data could temporarily freeze up the browser, deteriorating the user experience.

Debouncing on the other hand could better detect when the user stopped leaning on the keyboard and had arrived at their destination. It’s certainly not perfect. The user still may overshoot their destination, hesitate, and back-track, causing enough delay for the debounce detection period to expire. However, our tests showed that debouncing did a much better job of reducing XHR requests than throttling.

## Implementation

The original debounce method was rather large and clunky. I consider it a prototype. A proof of concept. I ended up needing debouncing a few times since that project and rewrote it each time, trying to improve it. I’ve finally devised something that feels good enough to share.

The latest rendition takes two parameters: the detection period (“threshold”) and a Boolean indicating whether the signal should happen at the beginning of the detection period (true) or the end (“execAsap”).

Here it is:

```js
Function.prototype.debounce = function (threshold, execAsap) {
    var func = this, // reference to original function
        timeout; // handle to setTimeout async task (detection period)
    // return the new debounced function which executes the original function only once
    // until the detection period expires
    return function debounced () {
        var obj = this, // reference to original context object
            args = arguments; // arguments at execution time
        // this is the detection function. it will be executed if/when the threshold expires
        function delayed () {
            // if we're executing at the end of the detection period
            if (!execAsap)
                func.apply(obj, args); // execute now
            // clear timeout handle
            timeout = null; 
        };
        // stop any current detection period
        if (timeout)
            clearTimeout(timeout);
        // otherwise, if we're not already waiting and we're executing at the beginning of the detection period
        else if (execAsap)
            func.apply(obj, args); // execute now
        // reset the detection period
        timeout = setTimeout(delayed, threshold || 100); 
    };
}
```

It works by issuing a setTimeout at the specified detection period. Each time the function is called, the setTimeout is canceled and issued again. This serves as our detection mechanism, but using reverse logic. If/when the setTimeout executes, we know that our function was not called within the detection period.

Wow. It looks rather large with all of those comments. Here is a version without the comments:

```js
Function.prototype.debounce = function (threshold, execAsap) {
 
    var func = this, timeout;
 
    return function debounced () {
        var obj = this, args = arguments;
        function delayed () {
            if (!execAsap)
                func.apply(obj, args);
            timeout = null; 
        };
 
        if (timeout)
            clearTimeout(timeout);
        else if (execAsap)
            func.apply(obj, args);
 
        timeout = setTimeout(delayed, threshold || 100); 
    };
 
}
```

If you prefer not to augment the native objects, here’s a stand-alone version:

```
var debounce = function (func, threshold, execAsap) {
 
    var timeout;
 
    return function debounced () {
        var obj = this, args = arguments;
        function delayed () {
            if (!execAsap)
                func.apply(obj, args);
            timeout = null; 
        };
 
        if (timeout)
            clearTimeout(timeout);
        else if (execAsap)
            func.apply(obj, args);
 
        timeout = setTimeout(delayed, threshold || 100); 
    };
 
}

```

Example uses:

```js
// using debounce in a constructor or initialization function to debounce 
// focus events for a widget (onFocus is the original handler):
    this.debouncedOnFocus = this.onFocus.debounce(500, false);
    this.inputNode.addEventListener('focus', this.debouncedOnFocus, false);
 
 
// to coordinate the debounce of a method for all objects of a certain class, do this:
MyClass.prototype.someMethod = function () {
    /* do something here, but only once */
}.debounce(100, true); // execute at start and use a 100 msec detection period
 
 
// the dojo way to coordinate the debounce of a method for all objects of a certain class
// (using the stand-alone version)
dojo.declare('MyClass', null, {
 
    // other members go here
 
    someMethod: debounce(function () {
        /* do something here, but only once */
    }, 100, true); // execute at start and use a 100 msec detection period
 
});
 
 
// wait until the user is done moving the mouse, then execute
// (using the stand-alone version)
document.onmousemove = debounce(function (e) {
    /* do something here, but only once after mouse cursor stops */
}, 250, false);
```

**Let me know if you find this useful in your projects!**

P.S. The mission-critical project was a success!