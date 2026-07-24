/* Stories of Messages */
const STORIES = {
    dispatch_intro: {
        title: "Dispatcher Team",
        status: "Online",
        steps: [
            {
                type: "file",
                sender: "Unknown",
                time: "10:14",
                name: "signal.jpg",
                action: "sosSignal"
            },            
            /*{
                type: "file",
                sender: "Unknown",
                time: "10:14",
                name: "mayday_echo1.mp3",
                action: "dispatchSosAudio",
                audio: "../../../../assets/audio/sos.mp3"
            },*/
            {
                type: "text",
                sender: "Dispatch",
                time: "10:15",
                text: "Hello! We received an SOS signal and need your help!"
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "10:15",
                text: "A research ship is stuck in the Arctic. The crew needs essential survival information."
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "10:15",
                text: "Before we begin, we need to know who we are speaking with."
            },
            {
                type: "input",
                variable: "teamName",
                question: "Please send us your team name.",
                placeholder: "Team name"
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "10:20",
                text: "Fantastic, Team {teamName}! Now we need to confirm your location. We will send you a photo of where to start."
            },
            {
                type: "upload",
                question: "Please send us a picture of you at the Gateway to the Arctic to confirm your location."
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "10:22",
                text: "Perfect! We verified your location. You must now follow the trail of four historic explorers to help the lost crew."
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "10:24",
                text: "We received the first letters for your mission. Good luck, Team {teamName}!"
            },
            {
                type: "file",
                name: "treasure_map.jpg",
                image: "../../../../assets/images/station_1_test.jpg"
            },
            {
                type: "file",
                name: "handwritten_note.pdf",
                action: "station1SignalLetter"
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "10:26",
                text: "Write us OKAY, when you reached the next station."
            },
            {
                type: "input",
                variable: "stationReady",
                question: "",
                placeholder: "Write OKAY",
                correctAnswer: "okay",
                wrongAnswer: "Are you there? Please write OKAY when you have reached the next station."
            }
        ]
    },
    nansen_dispatch: {
        title: "Dispatcher Team",
        status: "Online",
        steps: [
            {
                type: "text",
                sender: "Dispatch",
                time: "10:30",
                text: "Yes. NANSEN of course! He will help."
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "10:30",
                text: "Do you know his phone number?"
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "10:31",
                text: "We have some old files with his number, but we don't understand them."
            },

        ]
    },

    wanny_dispatch: {
        title: "Dispatcher Team",
        status: "Online",
        steps: [
            {
                type: "text",
                sender: "Dispatch",
                time: "10:40",
                text: "You need to get in contact with Wanny Wolstadt."
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "10:40",
                text: "She was one of the first female hunters on Svalbard, and she is from Tromsø!"
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "10:41",
                text: "We can't reach her! This is the last known location"
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "10:41",
                text: "IMAGE HERE. REPLACE THIS"
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "10:42",
                text: "This image is too blurry, we can't identify this. Can you figure out where this is and establish a connection with Wanny?"
            },

        ]
    },

    dispatch_final: {
        title: "Dispatcher Team",
        status: "Online",
        steps: [
            {
                type: "text",
                sender: "Dispatch",
                time: "11:40",
                text: "Nice job! We would love to meet you! "
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "11:40",
                text: "You have all the information ready for the crew now. Send them this information using the following link."
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "11:42",
                text: "LINK REPLACE THIS"
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "11:43",
                text: "Good bye!!"
            }
        ]
    },



    henry_rudi: {
        title: "Henry Rudi",
        status: "Online",
        steps: [
            {
                type: "text",
                sender: "Henry Rudi",
                time: "10:17",
                text: "I got some movement from different houses."
            },
            {
                type: "text",
                sender: "Henry Rudi",
                time: "10:18",
                text: "But I can't identify my favourite place \"�lhallen\"."
            },
            {
                type: "text",
                sender: "Henry Rudi",
                time: "10:19",
                text: "Can you help me? I will send you the different photos."
            },
            {
                type: "file",
                name: "observatory_images.zip",
                action: "henryRudiGallery"
            },
            {
                type: "input",
                variable: "henryRudiPeople",
                question: "What do you see?",
                placeholder: "Type your answer...",
                acceptedAnswers: ["2", "two", "two.", "2.", "two people", "2 people"],
                wrongAnswer: "Look carefully at the movement in the window."
            },
            {
                type: "text",
                sender: "Henry Rudi",
                time: "10:22",
                text: "YES, I remember. That is correct!"
            },
            {
                type: "text",
                sender: "Henry Rudi",
                time: "10:23",
                text: "I don't remember the month. Check my profile. It should be around the time when I shot the polar bear."
            },
            {
                type: "text",
                sender: "Henry Rudi",
                time: "10:24",
                text: "Write the month here in the chat."
            },
            {
                type: "input",
                variable: "henryRudiMonth",
                question: "In which month was it?",
                placeholder: "Write the month...",
                acceptedAnswers: [
                    "june",
                    "june.",
                    "jun",
                    "jun.",
                    "6",
                    "06"
                ],
                wrongAnswer: "Ahh, I don't think that is correct. Check my profile again."
            },
            {
                type: "text",
                sender: "Henry Rudi",
                time: "10:26",
                text: "Yes, June! Now I remember. That was the month."
            },
            {
                type: "text",
                sender: "Henry Rudi",
                time: "10:26",
                text: "Good luck explorers!"
            }

        ]
    },
    dispatch_henry_intro: {
        title: "Dispatcher Team",
        status: "Online",
        steps: [
            {
                type: "text",
                sender: "Dispatch",
                time: "10:30",
                text: "Good work, Team {teamName}. You reached the next station."
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "10:31",
                text: "For the next part of the rescue mission, you need help from someone who knows the Arctic very well."
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "10:32",
                text: "His name is Henry Rudi. We found some old information about him. Watch this first."
            },
            {
                type: "file",
                name: "henry_rudi_information.mp4",
                action: "dispatchHenryVideo",
                video: "../../../../assets/animation/Henry_Rudi.mp4"
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "10:35",
                text: "We also found his contact. Send him a friend request so he can help you."
            },
            {
                type: "file",
                name: "Henry Rudi Contact",
                action: "henryRudiContactRequest",
                redirect: "../riddle/riddle_6_2_chat.html"
            }
        ]
    }
};