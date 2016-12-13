# Comp 20 Portfolio
## Fall 2016

###Purpose
This repository contains various lab assignments and projects from Comp
20 - Web Programming, all bundled together for easy perusal.

###Favorite Assignment
I enjoyed working on the MBTA tracker the most. The specifcation was
very general, which left a lot of room to be creative with the
implementation, like adding custom icons and styling. More importantly,
it was an opportunity to work with APIs, especially the Google Maps API;
the research process involved in this is something I associate with
"real" development.

###Growth
Before this class, I hadn't done much with APIs, and anthing server-side
was really intimidating. Now, I'd feel comfortable trying to tackle
projects in these areas. I think Comp 20 gave me a solid foundation to
build from for Web development in the future. I already knew a lot of HTML,
CSS, and JavaScript, but learning tools is different from learning how to
use them appropriately and effectively.

###Most Important Concept Learned
Never trust user input!

Specifically, never trust anything sent from the client (end-user). Examples:
1. Client-side validation can be disabled or bypassed using browser addons
   and/or the JavaScript console, so this should always be done on the
   server. Example: a user can easily get around a length restriction on a
   form field.
2. A user can inject code into a web page if their input isn't sanitized.
   Example: If a user enters their name into a game's high score chart and it
   has an html tag in it, that is rendered on everyone's client who views the
   leaderboard unless the special characters are replaced or thrown out.

###Future Exploration
I'd really like to try to make some more small web games. Learning a real
client-side framework would help with this, so I'll do that.
