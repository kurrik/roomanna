This is the post snippet.

<!--BREAK-->

{{ $i01 := imagemeta "images/2017-01-01.jpg" }}
{{ $t01 := imagemeta "thumbs/2017-01-01.jpg" }}
{{ $entry01 := map "Image" $i01 "Thumb" $t01 "Description" "An image!" }}

{{template "gallery" (slice $entry01)}}`

{{include "../../partials/lightbox.html"}}
