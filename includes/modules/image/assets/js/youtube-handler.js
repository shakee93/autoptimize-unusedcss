document.addEventListener("DOMContentLoaded", function() {
    var playButtons = document.querySelectorAll(".rapidload-yt-play-button-");
    playButtons.forEach(function(playButton) {
        var videoContainer = playButton.closest('.rapidload-yt-video-container');
        var videoId = videoContainer.querySelector('img').getAttribute('data-video-id');
        function loadPosterImage() {
            var posterImageUrl = "https://i.ytimg.com/vi/" + videoId + "/";
            var posterImage = videoContainer.querySelector(".rapidload-yt-poster-image-");
            posterImage.src = posterImageUrl + "hqdefault.jpg";
            posterImage.onerror = function() {
                posterImage.src = posterImageUrl + "mqdefault.jpg";
            };
        }
        loadPosterImage();
        playButton.addEventListener("click", function() {
            var parentElement = this.parentElement;
            this.style.display = "none";
            var posterImage = parentElement.querySelector(".rapidload-yt-poster-image");
            if (posterImage) {
                posterImage.style.display = "none";
            }
            var noscriptTag = parentElement.querySelector("noscript");
            if (noscriptTag) {
                noscriptTag.outerHTML = noscriptTag.innerHTML;
            }
        });
    });
});
