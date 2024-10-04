// Constants
const API_BASE_URL = "https://api.videosdk.live";
const AUTH_TOKEN = "dcd2b9d2-bb9a-44f5-bd4e-9fc8c4bba752";

// DOM Elements
const joinButton = document.getElementById("joinButton");
const leaveButton = document.getElementById("leaveButton");
const micButton = document.getElementById("micButton");
const cameraButton = document.getElementById("cameraButton");
const meetingIdInput = document.getElementById("meetingIdInput");
const videoContainer = document.getElementById("videoContainer");

let meeting;

// Initialize the SDK
window.VideoSDK.config(AUTH_TOKEN);

// Join Meeting
async function joinMeeting() {
    const meetingId = meetingIdInput.value;
    if (!meetingId) {
        alert("Please enter a meeting ID");
        return;
    }

    meeting = window.VideoSDK.initMeeting({
        meetingId: meetingId,
        name: "Participant", // You can replace this with a name input
        micEnabled: true,
        webcamEnabled: true,
    });

    meeting.join();

    // Set up event listeners
    meeting.on("meeting-joined", handleMeetingJoined);
    meeting.on("participant-joined", handleParticipantJoined);
    meeting.on("participant-left", handleParticipantLeft);

    joinButton.style.display = "none";
    leaveButton.style.display = "inline-block";
}

// Leave Meeting
function leaveMeeting() {
    if (meeting) {
        meeting.leave();
        videoContainer.innerHTML = "";
        joinButton.style.display = "inline-block";
        leaveButton.style.display = "none";
    }
}

// Toggle Microphone
function toggleMic() {
    if (meeting) {
        if (meeting.isMicEnabled) {
            meeting.muteMic();
        } else {
            meeting.unmuteMic();
        }
        updateMicButton();
    }
}

// Toggle Camera
function toggleCamera() {
    if (meeting) {
        if (meeting.isWebcamEnabled) {
            meeting.disableWebcam();
        } else {
            meeting.enableWebcam();
        }
        updateCameraButton();
    }
}

// Handle Meeting Joined
function handleMeetingJoined() {
    console.log("Meeting joined");
    createVideoElement(meeting.localParticipant);
}

// Handle Participant Joined
function handleParticipantJoined(participant) {
    console.log("Participant joined:", participant.id);
    createVideoElement(participant);
}

// Handle Participant Left
function handleParticipantLeft(participant) {
    console.log("Participant left:", participant.id);
    removeVideoElement(participant.id);
}

// Create Video Element
function createVideoElement(participant) {
    const videoElement = document.createElement("video");
    videoElement.setAttribute("id", `video-${participant.id}`);
    videoElement.setAttribute("autoplay", true);
    videoElement.setAttribute("playsinline", true);
    videoContainer.appendChild(videoElement);

    participant.on("stream-enabled", (stream) => {
        if (stream.kind === "video") {
            videoElement.srcObject = new MediaStream([stream.track]);
        }
    });
}

// Remove Video Element
function removeVideoElement(participantId) {
    const videoElement = document.getElementById(`video-${participantId}`);
    if (videoElement) {
        videoContainer.removeChild(videoElement);
    }
}

// Update Mic Button
function updateMicButton() {
    micButton.textContent = meeting.isMicEnabled ? "Mute" : "Unmute";
}

// Update Camera Button
function updateCameraButton() {
    cameraButton.textContent = meeting.isWebcamEnabled ? "Stop Video" : "Start Video";
}

// Event Listeners
joinButton.addEventListener("click", joinMeeting);
leaveButton.addEventListener("click", leaveMeeting);
micButton.addEventListener("click", toggleMic);
cameraButton.addEventListener("click", toggleCamera);