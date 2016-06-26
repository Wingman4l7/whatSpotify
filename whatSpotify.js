// ==UserScript==
// @name         whatSpotify
// @description  Embeds Spotify links & player widget into What.CD artist & album pages
// @version      0.6
// @match        https://what.cd/*
// @grant        none
// ==/UserScript==

var maxSizeCache = 1000; // split evenly across Artist and Album caches
var stringSimilarityThreshold = 0.6;
localStorage.whatSpotifyAlbums = localStorage.whatSpotifyAlbums || JSON.stringify([]);
localStorage.whatSpotifyArtists = localStorage.whatSpotifyArtists || JSON.stringify([]);


function createSpotifyLink(link, imageSource) {
    var a = document.createElement('a');

    var wantLinksToOpenInBrowser = false; // if "false" => links open in desktop application
    if (wantLinksToOpenInBrowser) {
        if (link.indexOf("album") > -1) {  // Link is an album
            link = "https://play.spotify.com/album/" + link.substring(14);
        }
        if (link.indexOf("artist") > -1) {  // Link is an artist
            link = "https://play.spotify.com/artist/" + link.substring(15);
        }
        a.target = "_blank";  // Open in new tab
    }

    a.href = link;
    a.title = 'Listen in Spotify';
    var img = document.createElement('img');
    img.style.border = 'none';
    img.style.marginLeft = '3px';
    img.style.marginRight = '3px';
    img.src = imageSource;
    img.width = 15;
    a.appendChild(img);
    return a;
}

function createSpotifyLinkGreen(link) {
    return createSpotifyLink(link, 'data:image/png;charset=utf-8;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAACYVBMVEUAAAAe12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae12Ae2GAe12Ae12Ae2GAe12AAAAAAAgEABAIBAwIBBQIBBgMBBwMBCAMBCAQCCwUCDAUCDAYCDQYCEAcCEQgCEwgDEQgDFAkDFwoEGQsEHA0EHQ0EHg0EIA4FIQ8FIhAFIxAFJREFJhEGJhEGJxIGKBIGKhMGKxQGLxUHLhQHLxUHMBUHMxcHNBcIORoIOhoJPBsJQR0JQx4KRyAKSiILSyILTCILTSILTSMLTiMLUSQMUSQMUiUMUyUMVicNXSoOZC0OZS0OZi4OZy4PaS8PazAQbzIQczMQdDMQdDQQdTQReDYReTYRezcSgDoTgjoThTwThjwTij4UjkAUj0AVlUMVmkUWmkUWnUYYpkoYqEsYqUwYrU0Yrk4ZsE8at1IauVMaulMau1QavVUbvlUbv1UbwFYbwlcbw1cbw1gcxVgcxlkcx1kcyFkcylodzFsdzlwd0F0d0V0d0l4d014e1F4e1F8e1V8e1l8e1mAe12Ae2GAe2GEe2WEe2mEe22If2mEf2mIf22If3GIf3GMf3WIf3WMf3mMf32Mf32Qf4GQf4WQf4WUf4mUg4mUg42Ug42Yg5GYg5WYg5mYg5mcg52cg6Gcg6Wgh6Ggh6Wgh62kh7Gkh7Goh7moh72sh8Gsi8Wsi8mwi9m7///8Zx0jwAAAALXRSTlMAAQIDDREUGx0kJihBQklLTU9SV1hdYW2LjI2wsbK3uLvBw8nz+Pn7+/z9/f7WBhWVAAACOElEQVR4AW2SA2PlQBRGp7ZtO7O2bdVdo2sXa9W2mb6vtm3jX+0kzzhxzvDeS2ToE2Lh4Obp7+/l6mgmfGpg4xMEGYG+lmrKgJj7QQ0/U6Kn9PYcOKjAIdhO2dcF6lb8dFb0hU5spdZc6Mk3NzbyLezexLfI+5uIO/ID1zMyMT03NyBpHZmfmZ4Y7m0Tvbe4I2br05Pu3Th5+NChw6cjE1OzKkemeR6ANdM+6K+6RdU48eRn33Q74MFiFYSxbPbrwMkzF65fOXf62F4qcPpLR1sYjIgD0I7Up9+zaybXVldXeivSv724SBmJM6GwJ25gjCzvbI5J6uvq+cGVzY2purQESqMXIuBOPAFIBmp+v38Yc+3S1ej7b3/lLc2NrqS/K+4U1u4PoL30FFVy6PbX5omJxQ4JECDqjgJKox69+pT88fXj6IOsxZHPklZA0F7i4Hk5jfNbGxub28t80Z+EPZQ+WJYGxhWCH1vfGKkuys0v71pfnZkrf77vzRwQzpbmCEZP2Yf4i8f379p9+GxsctHw8kxxO4AQ2BOzQICffknpwfM3o+5cPkopjfs7PiLocBgS4gugs/BHRmFtW29XQ0lmyjVKn/UyLQaVWIJja5udHO7t6ejoHZqcnvl3+W5nBxhWsoRCFX6ijWedw9m6BUyDoUFPt1huxtJytBM+NOAAaTGyJs5aPhxwIgpsoUmwnWqhm3gDYSHhHMCFh7Cu3sZEHWsPKPCwItoY2bt7BwR4u9uzWMlH/g9zlVm2O1rMSAAAAABJRU5ErkJggg==');
}

function createSpotifyLinkBlue(link) {
    return createSpotifyLink(link, 'data:image/png;charset=utf-8;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAACXlBMVEUAAAAKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IKe9IJe9IKe9IKe9IJetIKe9IKe9IAaMsAaswAa80AbM0Abc0Abs4Ab84AcM4Acc4Acc8Acs8Ac88AdM8AdNAAddAAdtABdtACd9EDd9EEd9EEeNEFeNEGedEHedEHetIIetIJetIJe9IKe9ILe9ILfNIMfNINfNINfNMNfdMOfdMPfdMPftMQftMRf9MSf9MSf9QUgNQWgtQXg9QZg9UbhNUchdUdhdYfh9Ygh9YiiNYjiNYkidclidclitcmitcmi9cnitcoi9gqjNgrjdgsjdgvj9k3k9o5lNs6lds+l9w/mNxAmNxDmt1Nn95PoN9Qod9WpOBdqOFdqOJjq+NnreNrr+RtsOVztOV0tOV2teZ2tuZ3tuZ6uOd7uOd8uOd8ueeAu+iFvemJv+qKwOqLweqNwuqVxuydyu2gze6ize6jzu6nz++n0O+o0O+p0O+p0fCq0vCv0/Cz1vG11/K12PK72vK93PO+3PPE3/TF4PTF4PXJ4fXJ4vXK4/XL4/bO5fbP5fbS5/bT5/fT6PfU6PfV6fjX6vjY6vjZ6/ja6/jc7Pnd7fne7fnf7vnj8Prl8frp8/vq8/vr9Pvs9fvs9fzt9fzx9/zx9/3x+Pzy+P3z+f32+v32+v74+/76/P77/f78/f79/v////9p+tIHAAAALXRSTlMAAQIDDREUGx0kJihBQklLTU9SV1hdYW2LjI2wsbK3uLvBw8nz+Pn7+/z9/f7WBhWVAAACN0lEQVR4AW2SA5tcMRRAs7Ztc8z3xsYdrGvbdre2bRuLulOb+VebvDHOx+QEVyhAMkI5JVW1zc11laVZ3DKagoY2CNDamBulUlB2E0TRlImSwr6YD3wIQxbtReG7FRBtuWV56C4kpNBvs+lNT29fv9ft6e3v6/UE72dwGTUB36JVswxjcjm1SoZV60x2ztdzGRE7tH7/lScfv3///s334Myu1TO1rIe+kU90A5hmPMJRvD+3zcSSF2pIrdpAs4ps/fzw9uXI2Gvf5z+Y4ttpdXRBGioBsMPus8OrpqqlUqnMPGv98KnnmHCG6YBiVAUATo1cINa4hiYP9ehlYjE7acM1jO8ou6Ea1RLtNkzbcuTi7afPRu9ePrZ1hUKpka07usBCY28m2jr3HQ7z4/6OXrVabnEBtHDashTjexdOHNx76MT5O78wxl8PeBwAVNfRx43LVw4oRWKxWCj3Ltx0/R/Gl+T+wlQCwaWRiHXTF61YNtsmkTLM7NO/jzMAPBJaKRAscw7fePHp9/+/397c2rdYJ2fn07J2ksSyWgE87ElSl1eP7z8c/4IxvrlZo6WaB6kINdLbi7avXTLFabIMzluzZxTjsyYbAFdUlAt8cBkY0ieL1WLWqVh24/hVixUIeYGGQiQetdNDLI/ETclsh2hcFouLjlu6fxyL4kaN2wgMYxIqj/M8gDIUohBiIYOcFPYZ9QBdnTw+eYbXSa7Wp6No8msgRE0eiietuLq+paW+upjUKvjyBIDB9cXhBwH0AAAAAElFTkSuQmCC');
}

function parseCache(type) {
    var listAlbums = null;
    var listArtists = null;
    // only parse the cache you need to get the value from!
    if(type == "album") { 
        listAlbums = JSON.parse(localStorage.whatSpotifyAlbums);
        return listAlbums; 
    }
    if(type == "artist") { 
        listArtists = JSON.parse(localStorage.whatSpotifyArtists);
        return listArtists; 
    }
}

function getCache(key, type) {
    var result = null;
    var list = parseCache(type);
    
    $(list).each(function(i, element) {
        if (element.key === key) {
            result = element.value;
            return false;
        }
    });        
    return result;
}

function setCache(element, type) {
    var list = parseCache(type);

    if (list.length >= maxSizeCache / 2) {
        list.shift();
    }
    list.push(element);
    if(type == "album") { localStorage.whatSpotifyAlbums = JSON.stringify(list); }
    if(type == "artist") { localStorage.whatSpotifyArtists = JSON.stringify(list); }
}

function getSpotifyArtistId(whatArtist, onSuccess) {

    var cachedArtistId = getCache(whatArtist, "artist");
    if (cachedArtistId !== null && cachedArtistId !== '') {
        onSuccess(cachedArtistId);
        return;
    }

    var encodedArtist = whatArtist.replace(" ", "+").replace("&", "");
    if (encodedArtist === '') {
        onSuccess('');
        return;
    }

    $.get('https://api.spotify.com/v1/search?q=' + encodedArtist + '&type=artist', function(data) {
        var artists = data.artists.items;
        if (artists !== null && artists.length > 0) {
            var bestArtistId = null;
            var rank = 0;
            $(artists).each(function(i, artist) {
                if (rank < sSimilarity(artist.name.toUpperCase(), whatArtist.toUpperCase())) {
                    rank = sSimilarity(artist.name.toUpperCase(), whatArtist.toUpperCase());
                    bestArtistId = artist.id;
                }
            });
            setCache({ key: whatArtist, value: bestArtistId }, "artist");
            onSuccess(bestArtistId);
        } else {
            onSuccess('');
        }
    });
}

function getSpotifyArtistAlbumId(artistId, whatAlbum, onSuccess) {

    var cachedAlbumId = getCache(whatAlbum, "album");
    if (cachedAlbumId !== null && cachedAlbumId !== '') {
        onSuccess(cachedAlbumId);
        return;
    }

    $.get('https://api.spotify.com/v1/artists/' + artistId + '/albums', function(data) {
        var albums = data.items;
        var albumId = "";
        if (albums !== null && albums.length > 0) {
            $(albums).each(function(j, album) {
                if (sSimilarity(album.name.toUpperCase(), whatAlbum.toUpperCase()) >= stringSimilarityThreshold) {
                    albumId = album.id;
                    return false;
                }
            });
            setCache({ key: whatAlbum, value: albumId }, "album");
            onSuccess(albumId);
        } else {
            onSuccess('');
        }
    });
}

function getSpotifyArtistAlbums(artistId, onSuccess) {

    $.get('https://api.spotify.com/v1/artists/' + artistId + '/albums?limit=50', function(data) {
        var albumItems = data.items;
        var albums = [];
        $(albumItems).each(function(i, albumItem) {
            albums.push({ name : albumItem.name, id : albumItem.id });
        });
        onSuccess(albums);
    });
}

function embedSpotifyPlaylist(Id) {
    var spotifyLink = document.createElement('a');
    var themecolor = "black"; // default; can also be white
    var height = "330"; // height must be at least 80px more than width (minimum: 250px) or the compact player is rendered
    // frameborder & allowtransparency values required to render correctly!
    spotifyLink.innerHTML = "<p><iframe src=\"https://embed.spotify.com/?uri=" + Id + "&theme=" + themecolor + 
            "\" width=\"250\" height=" + height + "\" frameborder=\"0\" allowtransparency=\"true\"></iframe>";
    spotifyLink.style.position = "relative";
    spotifyLink.style.left = '-10px'; // manual tweaking
    $('.head')[0].appendChild(spotifyLink); // place above album cover or artist's picture
}

/*************************************/
/************* Collages **************/
/*************************************/
/*  DEPRECATED FOR NOW;
    Codeblock for the Top 10 page may possibly be successfully applied to Subscribed Collages page.
    Could modify the initial conditional to include it:

    if (window.location.href.indexOf('top10.php') || 
        window.location.href.indexOf('userhistory.php?action=subscribed_collages')  > -1)
*/

/*************************************/
/************* Top 10 ****************/
/*************************************/
if (window.location.href.indexOf('top10.php') > -1) {
    var processTable = function (table) {
        var groups = $('div.group_info', table);
        $(groups).each(function(i, group) {
            var whatArtist = $(group).find('a[href*="artist.php"]')[0];
            var whatAlbum = $(group).find('a[href*="torrents.php?id"]')[0];
            whatAlbum = $(whatAlbum).text();
            whatArtist = $(whatArtist).text();

            getSpotifyArtistId(whatArtist, function(artistId) {
                if (artistId !== '' && artistId !== undefined) {
                    getSpotifyArtistAlbumId(artistId, whatAlbum, function(albumId) {
                        var a = null;
                        if (albumId !== '') {
                            a = createSpotifyLinkGreen('spotify:album:' + albumId);
                        } else {
                            a = createSpotifyLinkBlue('spotify:artist:' + artistId);
                        }
                        $(group).prepend(a);
                    });
                }
            });
        });
    };

    $('.torrent_table').each(function () { processTable(this); });

    new MutationObserver(function (mutes) {
        mutes.forEach(function (m) {
            $(m.addedNodes).each(function () {
                if (this.nodeName == 'TABLE') processTable(this);
            });
        });
    }).observe(document.querySelector('.thin'), { childList: true });
}

/*************************************/
/*********** Artist page *************/
/*************************************/
if (window.location.href.indexOf('artist.php') > -1) {
    var whatArtist = $('h2').text();
    getSpotifyArtistId(whatArtist, function(artistId) {
        if (artistId !== '' && artistId !== undefined) {
            var a = createSpotifyLinkBlue('spotify:artist:' + artistId);
            $('h2').append(a);
            embedSpotifyPlaylist('spotify:artist:' + artistId); 
            
            getSpotifyArtistAlbums(artistId, function(albums) {
                var groups = $('#torrents_album, #torrents_ep').find('div.group_info');
                $(groups).each(function(i, group) {
                    var whatAlbum = $(group).find('a[href*="torrents.php?id"]')[0];
                    whatAlbum = $(whatAlbum).text();
                    var album = $.grep(albums, function(album) {
                        return sSimilarity(album.name.toUpperCase(), whatAlbum.toUpperCase()) >= stringSimilarityThreshold;
                    });
                    var cachedAlbumId = null;
                    if (album.length > 0) {
                        cachedAlbumId = getCache(whatAlbum, "album");
                        if (cachedAlbumId == null || cachedAlbumId == '') {
                            setCache({ key: whatAlbum, value: album[0].id }, "album");
                        }
                        var a = createSpotifyLinkGreen('spotify:album:' + album[0].id);
                        $(group).prepend(a);
                    }
                });
            });
        }
    });
}

/*************************************/
/*********** Torrent page ************/
/*************************************/
if (window.location.href.indexOf('torrents.php?id') > -1) {
    var whatArtist = $('h2 > a').text();
    var whatAlbum = $('h2 > span').text();

    getSpotifyArtistId(whatArtist, function(artistId) {
        if (artistId !== '' && artistId !== undefined) {
            getSpotifyArtistAlbumId(artistId, whatAlbum, function(albumId) {
                var a = null;
                if (albumId !== '') {
                    a = createSpotifyLinkGreen('spotify:album:' + albumId);
                    embedSpotifyPlaylist('spotify:album:' + albumId);
                } else {
                    a = createSpotifyLinkBlue('spotify:artist:' + artistId);
                }
                $('h2').append(a);
            });
        }
    });
}

/*************************************/
/******* Bookmark artist page ********/
/*************************************/
if (window.location.href.indexOf('bookmarks.php?type=artists') > -1) {
    var tds = $('.artist_table').find('.rowa, .rowb').find('td');
    var artists = $('.artist_table').find('a[href*="artist.php?id"]');
    $(artists).each(function(i, artistElement) {
        artist = $(artistElement).text();
        getSpotifyArtistId(artist, function(artistId) {
            if (artistId !== '') {
                var a = createSpotifyLinkGreen('spotify:artist:' + artistId);
                var x = $('div.group_info')[i];
                $(tds[i]).prepend(a);
            } 
        });
    });
}

/*************************************/
/******* Bookmark torrent page *******/
/*************************************/
if (window.location.href.indexOf('bookmarks.php?type=torrents') > -1) {
    var groups = $('.group');
    $(groups).each(function(i, group) {
        var whatArtistElement = $(group).find('a[href*="artist.php"]')[0];
        var whatAlbumElement = $(group).find('a[href*="torrents.php?id"]')[0];
        whatAlbum = $(whatAlbumElement).text();
        whatArtist = $(whatArtistElement).text();

        getSpotifyArtistId(whatArtist, function(artistId) {
            if (artistId !== '' && artistId !== undefined) {
                getSpotifyArtistAlbumId(artistId, whatAlbum, function(albumId) {
                    var a = null;
                    if (albumId !== '') {
                        a = createSpotifyLinkGreen('spotify:album:' + albumId);
                    } else {
                        a = createSpotifyLinkBlue('spotify:artist:' + artistId);
                    }
                    $(whatArtistElement).before(a);
                });
            }
        });
    });
}

var sSimilarity = function(sa1, sa2){
    // Compare two strings to see how similar they are.
    // Answer is returned as a value from 0 - 1
    // 1 indicates a perfect similarity (100%) while 0 indicates no similarity (0%)
    // Algorithm is set up to closely mimic the mathematical formula from
    // the article describing the algorithm, for clarity. 
    // Algorithm source site: http://www.catalysoft.com/articles/StrikeAMatch.html
    // (Most specifically the slightly cryptic variable names were written as such
    // to mirror the mathematical implementation on the source site)
    //
    // 2014-04-03
    // Found out that the algorithm is an implementation of the Sørensen–Dice coefficient [1]
    // [1] http://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient
    //
    // The algorithm is an n-gram comparison of bigrams of characters in a string


    // for my purposes, comparison should not check case or whitespace
    var s1 = sa1.replace(/\s/g, "").toLowerCase();
    var s2 = sa2.replace(/\s/g, "").toLowerCase();

    function intersect(arr1, arr2) {
        // I didn't write this.  I'd like to come back sometime
        // and write my own intersection algorithm.  This one seems
        // clean and fast, though.  Going to try to find out where
        // I got it for attribution.  Not sure right now.
        var r = [], o = {}, l = arr2.length, i, v;
        for (i = 0; i < l; i++) {
            o[arr2[i]] = true;
        }
        l = arr1.length;
        for (i = 0; i < l; i++) {
            v = arr1[i];
            if (v in o) {
                r.push(v);
            }
        }
        return r;
    }

    var pairs = function(s){
        // Get an array of all pairs of adjacent letters in a string
        var pairs = [];
        for(var i = 0; i < s.length - 1; i++){
            pairs[i] = s.slice(i, i+2);
        }
        return pairs;
    };

    //console.log(intersect(pairs(s1), pairs(s2)))
    var similarity_num = 2 * intersect(pairs(s1), pairs(s2)).length;
    var similarity_den = pairs(s1).length + pairs(s2).length;
    var similarity = similarity_num / similarity_den;
    return similarity;
};