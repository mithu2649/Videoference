const socket = io('/');
const videoGrid = document.querySelector('#video-grid');

const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
});

const myVideo = document.createElement('video');
myVideo.setAttribute('id', 'myVideo');
myVideo.muted = true;
const peers = {};
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream);



    myPeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        video.setAttribute('id', 'userVideo');
        removeLoadingAnimations();
        showEndCallButton()
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        });
    });


    socket.on('user-connected', userId => {
        hideUserDisconnectedError();
        removeLoadingAnimations();
        showEndCallButton();
        const fc = () => connectToNewUser(userId, stream)
        timerid = setTimeout(fc, 1000)
    });

    socket.on('user-disconnected', userId => {
        console.log(userId);
        showUserDisconnectedError();

        if (peers[userId]) {
            peers[userId].close()
        };
    })

});

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    video.setAttribute('id', 'userVideo');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
        video.remove();
    });

    peers[userId] = call;
}
function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });

    videoGrid.append(video);

    userVideos = document.querySelectorAll("[id='userVideo']");
    if(userVideos.length > 1) {
        userVideos[0].remove();
    }

}


function showUserDisconnectedError() {
    document.querySelector('#user-disconnected-msg').style.display = 'block';
}
function hideUserDisconnectedError() {
    document.querySelector('#user-disconnected-msg').style.display = 'none';
}

function removeLoadingAnimations() {

    checkElement('#loading-components').then((selector) => {
        selector.remove();
    });
    document.querySelector('#video-grid').style.opacity = 1;
}
function showEndCallButton() {
    document.querySelector('#end-call').style.display = "block";
}

