
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
            }

        ]
    }
};