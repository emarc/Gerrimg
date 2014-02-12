# Gerrit image comparison helper

This is a quick and dirty helper for comparing images in Gerrit. 

Note that you should enable image side-by-side comparison in Gerrit first, via the [mimetype.*.safe configuration](https://gerrit-review.googlesource.com/Documentation/config-gerrit.html#_a_id_mimetype_a_section_mimetype).

Can be used as a bookmarklet or included in the HTML.

For bookmarklet use, drag this to your bookmarks: <a href="(javascript:(function(){var jsCode=document.createElement('script');jsCode.setAttribute('src','https://raw.github.com/emarc/Gerrimg/master/gerrimg.js');document.body.appendChild(jsCode);})();">Gerrimg</a>

Very much a prototype at the moment, to figure out what would be useful.

