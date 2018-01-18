'use strict';

class AudioPlayer {
    constructor() {
        this.audio = null
    }

    initAudio(element) {
        let song = element.attr('data-song');
        let title = element.text();
        let cover = element.attr('data-cover');
        let artist = element.attr('data-artist');
        let src = element.attr('data-src');

        //create audio object
        this.audio = new Audio(src);

        this.audio.addEventListener('ended', this.onended.bind(this));

        if (!this.audio.currentTime) {
            $('#duration').html('0:00');
        }

        $('#audioPlayer .title').text(title);
        $('#audioPlayer .artist').text(artist);

        //insert cover
        $('img.cover').attr('src', cover);

        $('#playlist li').removeClass('active');
        element.addClass('active');
    }

    onended() {
        let next = $('#playlist li.active').next();

        if (next.length == 0) {
            next = $('#playlist li:first-child');
        }

        this.initAudio(next);
        this.audio.play();
        this.showDuration();
    }

    playByListClick() {
        this.audio.play();
        $('#duration').fadeIn(400);

        this.showDuration();
    }

    play(e) {
        this.audio.play();
        $(e.currentTarget).hide();
        $('#pause').show();
        $('#duration').fadeIn(400);

        this.showDuration();
    }

    pause(e) {
        this.audio.pause();
        $(e.currentTarget).hide();
        $('#play').show();
    }

    stop(e) {
        this.audio.pause();
        this.audio.currentTime = 0;
        $('#pause').hide();
        $('#play').show();
        $('#duration').fadeOut(200);
    }

    next(e) {
        this.audio.pause();
        let next = $('#playlist li.active').next();

        if (next.length == 0) {
            next = $('#playlist li:first-child');
        }

        this.initAudio(next);
        this.audio.play();
        this.showDuration();
    }

    prev(e) {
        this.audio.pause();
        var prev = $('#playlist li.active').prev();

        if (prev.length == 0) {
            prev = $('#playlist li:last-child');
        }

        this.initAudio(prev);
        this.audio.play();
        this.showDuration();
    }

    volume(e) {
        let volume = e.currentTarget.value / 10;
        this.audio.volume = volume;
    }

    clickOnProgressBar(e) {
        let audio =  this.audio;
        let coordinate = e.currentTarget.getBoundingClientRect();
        let eWidth = coordinate.width;
        let xStart = coordinate.left;
        let xCurrent = e.pageX;
        let diff = xCurrent - xStart;
        let percentChanging = diff / (eWidth / 100);
        let treckTime = audio.duration;
        let newduration = parseInt((treckTime / 100) * percentChanging);

        if (audio.currentTime > 0) {
            audio.currentTime = newduration;
        }
    }

    showDuration() {
        let audio = this.audio;

        $(audio).bind('timeupdate', function () {
            //get hours & minutes
            let s = parseInt(audio.currentTime % 60);
            let m = parseInt((audio.currentTime) / 60) % 60;
            //add 0 if less then 10
            if (s < 10) {
                s = `0${s}`;
            }

            $('#duration').html(`${m}:${s}`);

            let value = 0;

            if (audio.currentTime > 0) {
                value = Math.floor((100 / audio.duration) * audio.currentTime);
            }

            $('#progress').css('width', `${value}%`)
        })
    }
}

$('#pause').hide();
let audioPlayer = new AudioPlayer();
audioPlayer.initAudio($('#playlist li:first-child'));


$('#play').click(audioPlayer.play.bind(audioPlayer));

//pause button
$('#pause').click(audioPlayer.pause.bind(audioPlayer));

//stop button
$('#stop').click(audioPlayer.stop.bind(audioPlayer));

//next button
$('#next').click(audioPlayer.next.bind(audioPlayer));

//prev button
$('#prev').click(audioPlayer.prev.bind(audioPlayer));

//valume control
$('#volume').change(audioPlayer.volume.bind(audioPlayer));

//on progress click
$('#progressbar').click(audioPlayer.clickOnProgressBar.bind(audioPlayer));

let playlist = $('#playlist li');

for (let el of playlist) {
    el.addEventListener('click', function (e) {
        let className = $(this).attr('class');
        if (className != 'active') {
            audioPlayer.stop();
            audioPlayer.initAudio($(this));
            audioPlayer.playByListClick();
        }
    });
}

