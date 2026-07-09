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
                open: "station-1-signal"
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
            },
            {
                type: "waitForFlag",
                flag: "nansen_phonenumber",
                value: "true"
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "10:35",
                text: "Welcome back, Team {teamName}. We have received your update from the next station."
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "10:36",
                text: "The information you found is important. We are sending the next part of the mission now."
            },
            {
                type: "file",
                name: "new_dispatch_message.pdf",
                open: "station-1-return"
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "10:37",
                text: "Continue carefully. The Arctic conditions are getting worse."
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
                text: "But I can't identify my favourite place \"Ølhallen\"."
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
                text: "YES, I remember that is correct! Now you only need the month."
            },
            {
                type: "text",
                sender: "Henry Rudi",
                time: "10:23",
                text: `
                Go to the Wooden Cathedral:
                <br>
                <a href="https://www.google.com/maps/search/Wooden+Cathedral+Tromsø"
                   target="_blank"
                   style="color:#7ee7ff; font-weight:bold;">
                   Open location
                </a>
            `
            },
            {
                type: "input",
                variable: "henryRudiLocation",
                question: "Write okay when you are there.",
                placeholder: "Write okay...",
                acceptedAnswers: ["okay", "ok", "oki", "oke", "yes", "done", "there"],
                wrongAnswer: "Tell me okay when you are there.",
                redirect: "../final_page.html"
            }
        ]
    }
};