
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
                text: "Hello! We are the Arctic Dispatch Team."
            },

            {
                type: "text",
                sender: "Dispatch",
                time: "10:15",
                text: "We are very happy that you are here."
            },

            {
                type: "input",
                variable: "teamName",
                question: "Before we begin, what is your team name?",
                placeholder: "Team name"
            },

            {
                type: "text",
                sender: "Dispatch",
                text: "Welcome Team {teamName}!"
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
                question: "Please send us a picture with the Gateway to the Arctic."
            },

            {
                type: "text",
                text: "Perfect! We verified your location."
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