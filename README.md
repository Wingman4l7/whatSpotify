<h1 align="center">WhatSpotify</h1>

<p align="center"><b>Embeds Spotify links & player widget into What.CD artist & album pages.</b></p>

<p align="center">
  <img src="https://raw.github.com/Wingman4l7/whatSpotify/master/whatSpotify_screenshot.png" alt="Sorry, I had to."/>
</p>

## About ##
Original version written by What.CD user aphex80.  I added the Spotify player widget functionality, updated & shrank the base64 icons *(courtesy [AlliedEnvy][0])*, fixed a cache key-clash bug, and folded in some extra functionality added by other users (see below).

The script covers the following pages:

- Top 10 page *(plays nice with the "Group Top 10 by Album" userscript)*
- Artist page (Support for Albums and EPs)
- Torrent page
- Bookmark artists page
- Bookmark torrents page
- Collages ["Subscribed To" only] *(courtesy user earthtojames!)*

If you would like the script to generate links that open the Spotify web player in a new browser tab, instead of generating links that open the desktop application, simply uncomment the indicated code block in the `createSpotifyLink()` function. *(courtesy user PizzaWhistles!)*

Unfortunately, the widget does **not** support seeking within the track that's playing.  Its [intended behavior][1] is to launch the web player or desktop client to start the playback; the widget is effectively only a “remote control”.  The widget does not obscure the album covers nor artist images, but is simply inserted above them.

You can discuss the script [here][2].

  [0]: https://github.com/AlliedEnvy
  [1]: https://developer.spotify.com/technologies/widgets/spotify-play-button/
  [2]: https://what.cd/forums.php?action=viewthread&threadid=199881

## Testing / Installation ##
aphex80 tested it "on a Mac/10.10.3 in Chrome 42.0.2311.135 (64-bit) and Safari 8.0.6 (10600.6.3)."  You'll need Tampermonkey for either of those browsers.  I can confirm it works in Firefox 37.02.2 (using Greasemonkey) and Chrome 50.0.2661.102 (using Tampermonkey).

I've also tested this script using Chrome & the Layer Cake stylesheet.  If the player is offset in an ugly way, you probably will need to tweak the pixel count in the `style` value.

**NOTE:** If you're using a browser extension like Ghostery to block third party tracking, it may block the embedding of the widget, resulting in an empty space or no visual change at all.  Simply allow the widget (`SpotifyEmbed`) within the confines of the What.CD domain within the Ghostery settings to fix this.  You'll also need to allow `Google Tag Manager` or the widget will load & display, but not actually work.

## How It Works ##
To heavily quote aphex80's original post:

"The script uses the Spotify API to search artists and albums. It tries to match strings using string similarity to find names that don't match exactly between What.CD notations and Spotify notations. It displays two type of icons: a blue one that indicates that an artist was matched but not the album, and a green one that indicates an exact album match. It's not 100% accurate since if an artist or album is not found on Spotify, it will try to match the most similar string.

To avoid making the same requests to the Spotify API the matches are cached via the HTML5 localStorage object, keeping a maximum number of stored objects (default is 1000, change it if you want to)."

This script *does* use jQuery, but it is not listed as an `@require`, as What.CD already loads jQuery, and the version loaded by this script shadows that one. The site uses some methods that do not seem to be present in the version used by the script; loading jQuery in the script breaks some things on What.CD, so it has been left out.

## Existing Bugs ##
- Albums that share the same exact titles with previously visited albums may display erroneous links, if the previously visited album's URI still resides in the cache.
- Visiting an Artist page will result in the cache being ignored, and duplicate album key-value pairs being added to the cache list if any of the artist's albums have been visited previously.