
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
                text: "Hello! We recieved a SOS signal and we need your help!!!"
            },

            {
                type: "text",
                sender: "Dispatch",
                time: "10:15",
                text: "A research ship is stuck in the arctic and you need to send essential for survival infomration."
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "10:15",
                text: "Before you can start: We are your Arctic Dispatch Team, but we need to know who you are!."
            },

            {
                type: "input",
                variable: "teamName",
                question: "Please sned us your team name.",
                placeholder: "Team name"
            },

            {
                type: "text",
                sender: "Dispatch",
                time: "10:20",
                text: "Fantastic Team {teamName}! Are you at the right location? We will send you a photo, where you have to start."
            },
            {
                type: "image",
                sender: "Dispatch",
                time: "10:18",
                name: "Gateway photo",
                src: "../../../../assets/images/Station_1_gate.jfif" /*Starts at the location of index.html*/
            },
            {
                type: "upload",
                question: "Please send us a picture with you and the Gateway to the Arctic to confirm your location."
            },

            {
                type: "text",
                sender: "Dispatch",
                time: "10:22",
                text: "Perfect! We verified your location. YOu have to follow 4 historic explorer to help the lost crew."
            },
            {
                type: "text",
                sender: "Dispatch",
                time: "10:24",
                text: "We recieved the letters for your first location. Good luck {teamName}"
            },

            {
                type: "file",
                name: "blinking_signal.jpg",
                open: "letter1"
            },

            {
                type: "file",
                name: "handwritten_note.pdf",
                open: "letter2"
            }

        ]
    }
};