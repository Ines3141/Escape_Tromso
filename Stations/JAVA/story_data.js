/* Stories of Messages */
const STORIES = {
    dispatch_intro: {
        title: "Dispatcher Team",
        status: "Online",
        steps: [
            {
                type: "text",
                sender: "Dispatch",
                text: "Hi there. We have just received an SOS transmission from one of our research vessels operating in the Arctic:"
            },
            {
                type: "file",
                sender: "Dispatch",
                name: "SOS_Echo1.mp3",
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
                text: "We don't have the knowledge and resources to run a rescue operation."
            },
            {
                type: "text",
                sender: "Dispatch",
                text: "We need your help."
            },
            {
                type: "text",
                sender: "Dispatch",
                text: "The crew is running out of time. They urgently need information to survive."
            },
            {
                type: "text",
                sender: "Dispatch",
                text: "Before we send you in, we need to know who we're working with."
            },
            {
                type: "input",
                variable: "teamName",
                question: "Send us your team name.",
                placeholder: "Team name"
            },
            {
                type: "text",
                sender: "Dispatch",
                text: "Understood, Team {teamName}. You can start your mission once you're are at the Gateway to the Arctic."
            },
            {
                type: "text",
                sender: "Dispatch",
                text: "Use this photo to find the starting point."
            },
            {
                type: "file",
                name: "starting_point.jpg",
                image: "../../../../assets/images/Station_1_gate.jfif"
            },
            {
                type: "upload",
                question: "Send us a team picture once you're there, to confirm your location."
            },
            {
                type: "text",
                sender: "Dispatch",
                text: "Location confirmed."
            },
            {
                type: "text",
                sender: "Dispatch",
                text: "Tromsø has a rich history of Arctic exploration. We're sure some former explorers can help you out."
            },
            {
                type: "text",
                sender: "Dispatch",
                text: "These files should help you get in touch with one of Norway's best. Good luck, Team {teamName}!"
            },
            {
                type: "file",
                name: "starting_location.jpg",
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
                text: "Send us: OKAY, when you've reached the next location."
            },
            {
                type: "input",
                variable: "stationReady",
                question: "",
                placeholder: "Write OKAY",
                correctAnswer: "okay",
                wrongAnswer: "Are you there? Write OKAY when you have reached the next location."
            },
            {
                type: "link",
                sender: "Dispatch",
                text: "check_location.html",
                href: "../riddle/riddle_1_2_destination.html"
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
                text: "Yes. Nansen! Of course!"
            },
            {
                type: "text",
                sender: "Dispatch",
                text: "He will help."
            },
            {
                type: "input",
                question: "Do you have his phone number?",
                placeholder: "Write your answer...",
                variable: "nansen_phone_answer"
            },
            {
                type: "text",
                sender: "Dispatch",
                text: "No?"
            },
            {
                type: "text",
                sender: "Dispatch",
                text: "We found some old notes."
            },
            {
                type: "text",
                sender: "Dispatch",
                text: "See if you can figure it out."
            },
            {
                type: "link",
                sender: "Dispatch",
                text: "Files",
                href: "../riddle/riddle_2_1_phone.html"
            }
        ]
    },
    wanny_dispatch: {
        title: "Dispatcher Team",
        status: "Online",
        steps: [
            {
                type: "text",
                sender: "Dispatch",
                text: "There's another person who may be able to help you: Wanny Wolstad."
            },
            {
                type: "text",
                sender: "Dispatch",
                text: "She was reportedly the first female hunter on Svalbard, and knows the value of good communication in the Arctic."
            },
            {
                type: "text",
                sender: "Dispatch",
                text: "Svalbard Radio moved to Longyearbyen in 1930, just before Wanny began her first winter on Svalbard in 1932."
            },
            {
                type: "text",
                sender: "Dispatch",
                text: "Before we lost contact, she proudly shared this image with us. We believe it depicts an artwork of Wanny somewhere in Tromsø."
            },
            {
                type: "file",
                name: "undefined.png",
                sender: "Dispatch",
                image: "../../../../assets/images/Wanny_Painting_Blurred.png"
            },
            {
                type: "text",
                sender: "Dispatch",
                text: "Wanny was known to communicate through clues, so it may contain information to pick up on one of her old radio signals. Unfortunately, this image is too unclear for us to be of any use."
            },
            {
                type: "text",
                sender: "Dispatch",
                text: "You'll need to find the mural and examine it properly. We believe it contains information to get in touch with her."
            },
            {
                type: "text",
                sender: "Dispatch",
                text: "Use this link to stablish a radio connection."
            },
            {
                type: "link",
                sender: "Dispatch",
                text: "Wanny_Radio_Connection.hpf",
                href: "../riddle/riddle_3_1_frequency.html"
            }
        ]
    },
    signal_intercepted: {
        title: "Dispatcher Team",
        status: "Online",

        steps: [
            {
                type: "text",
                sender: "Dispatch",
                text: "We are receiving your signal..."
            },
            {
                type: "text",
                sender: "Dispatch",
                text: "Stand by...."
            },
            {
                type: "text",
                sender: "Dispatch",
                text: "Uploading coordinates..."
            },
            {
                type: "action",
                action: "signalInterceptAttack"
            },
            {
                type: "link",
                sender: "Dispatch",
                text: "Riddle_Hacker.png",
                href: "../riddle/riddle_4_2_fish.html"
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
                text: "His name is Henry Rudi. Watch this video first."
            },
            {
                type: "file",
                name: "henry_rudi_information.mp4",
                action: "dispatchHenryVideo",
                video: "../../../../assets/animation/HenriRudi.mp4"
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
                avatar: "../../../../assets/images/rudi.jpg",
                redirect: "../riddle/riddle_6_2_chat.html"
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
                text: "Hello?"
            },
            {
                type: "text",
                sender: "Henry Rudi",
                time: "10:17",
                text: "Oslo people wrote me that someone will contact me, because they need help."
            },
            {
                type: "input",
                time: "10:32",
                question: "Is this someone you?",
                placeholder: "Write your answer...",
                variable: "henry_answer"
            },
            {
                type: "text",
                sender: "Henry Rudi",
                time: "10:17",
                text: "Great!"
            },
            {
                type: "text",
                sender: "Henry Rudi",
                time: "10:17",
                text: "Then I am writing to the right people."
            },
            {
                type: "text",
                sender: "Henry Rudi",
                time: "10:17",
                text: "I think I can help."
            },
            {
                type: "text",
                sender: "Henry Rudi",
                time: "10:17",
                text: "We're looking for the departure date, right?."
            },
            {
                type: "text",
                sender: "Henry Rudi",
                time: "10:19",
                text: "Found these in my archive."
            },
            {
                type: "text",
                sender: "Henry Rudi",
                time: "10:19",
                text: "See if one looks familiar to my favourite place \"&#248lhallen\".."
            },
            {
                type: "file",
                name: "observatory_images.zip",
                action: "henryRudiGallery"
            },
            {
                type: "input",
                variable: "henryRudiPeople",
                question: "Which number  do you see?", /* CHANGE IT LATER BACK TO WHAT DO YOU SEE */
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
                text: "Take care."
            },
            {
                type: "link",
                sender: "Henry Rudi",
                time: "10:31",
                text: "Next_Station.html",
                href: "riddle_6_3_location.html"
            }

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
                time: "11:43",
                text: "Good bye!!"
            },
            {
                type: "link",
                sender: "Dispatch",
                time: "10:31",
                text: "Upload_Important_files.com",
                href: "final_page.html"
            }
        ]
    }
};