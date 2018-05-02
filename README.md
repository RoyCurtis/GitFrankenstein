This is a fork of [AlphaMapper][1]'s frontend, with fixes that are necessary after the
deprecation of v2 of Google's Maps API. AlphaMapper is a project by ImaBot that maps the
internet's oldest and largest virtual world: [AlphaWorld][2].

A demo of this frontend can be found on [my website][5]. The official AlphaMapper can be
[found here][1]. 

# Changes

* Uses [Leaflet.js][3] instead of Google Maps API
  * The original frontend was broken by Google deprecating an older version of the Maps
  API. Leaflet.js has a subjectively friendlier API, and Google Maps is non-free.
  * The map now has two extra zoom levels; Leaflet.js creates these by scaling up images
  from previous zoom levels.
* Different UI
  * The coordinate box now spans across the top, and doubles as the display for the
  currently centered coordinates. Input is also validated.
  * This frontend has been optimized and tested for mobile use.
* Dynamic URL
  * Panning and zooming the map now automatically updates the URL, so it can be copied or
  bookmarked for future reference.

# Notes

* The frontend code was originally by ImaBot and Byte, as found on [ImaBot.com][4]
* I am very grateful to Ima Genius for giving me permission to upload this fork to GitHub,
and allowing me to do so under the MIT license.

[1]: http://www.imabot.com/alphamapper/
[2]: https://en.wikipedia.org/wiki/Active_Worlds
[3]: http://leafletjs.com/
[4]: http://www.imabot.com/alphamapper/aw/
[5]: http://roycurtis.com/awmapper/