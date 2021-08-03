let endCallBtn = document.querySelector('#end-call');

document.querySelector('#myRoomId')
    .innerHTML = window.location.pathname.slice(1);

const shareData = {
    title: 'Videoference',
    text: 'Hey, join me on Videoference!',
    url: window.location.href + '?action=join',
}
const btn = document.querySelector('#invite-btn');
const resultPara = document.querySelector('.tiny-bold');

// Must be triggered by some kind of "user activation"
btn.addEventListener('click', async () => {
    try {
        await navigator.share(shareData)
        resultPara.textContent = 'Invited!';
        document.querySelector('.tiny').remove();
    } catch (err) {
        resultPara.textContent = 'Function not supported on this device!';
        resultPara.style.fontSize = '10px'
        document.querySelector('.tiny').textContent = 'Share your invite code instead!'
    }
});


let elem = document.documentElement;
let isFullScreenOn = false;

function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }

    isFullScreenOn = true;
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }

    isFullScreenOn = false;
    window.scrollTo(0, 0);
}

document.querySelector('#overlay')
    .addEventListener('click', () => {

        isFullScreenOn ? exitFullscreen() : openFullscreen();


        if (isFullScreenOn) {
            endCallBtn.style.opacity = 0;
        } else {
            endCallBtn.style.opacity = 9;
        }
    });



endCallBtn.addEventListener('click', () => {
    window.location.href = "/"
});




const checkElement = async selector => {
    while (document.querySelector(selector) === null) {
        await new Promise(resolve => requestAnimationFrame(resolve))
    }
    return document.querySelector(selector);
};

checkElement('#myVideo').then((selector) => {
    //dragging myVideo
    var offset = [0, 0];
    var divOverlay = selector;
    var isDown = false;
    divOverlay.addEventListener('mousedown', function (e) {
        isDown = true;
        offset = [
            divOverlay.offsetLeft - e.clientX,
            divOverlay.offsetTop - e.clientY
        ];
    }, true);
    document.addEventListener('mouseup', function () {
        isDown = false;
    }, true);

    document.addEventListener('mousemove', function (e) {
        event.preventDefault();
        if (isDown) {
            divOverlay.style.left = (e.clientX + offset[0]) + 'px';
            divOverlay.style.top = (e.clientY + offset[1]) + 'px';
        }
    }, true);

    //for android/mobile support
    divOverlay.addEventListener('touchstart', function (e) {
        e.preventDefault();
        isDown = true;
        offset = [
            divOverlay.offsetLeft - e.touches[0].clientX,
            divOverlay.offsetTop  - e.touches[0].clientY
        ];
    }, {passive: false});
    document.addEventListener('touchend', function () {
        isDown = false;
    });

    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
        if (isDown) {
            divOverlay.style.left = (e.touches[0].clientX + offset[0]) + 'px';
            divOverlay.style.top  = (e.touches[0].clientY + offset[1]) + 'px';
        }
    }, {passive: false});

});