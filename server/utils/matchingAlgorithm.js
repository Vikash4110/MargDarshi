// utils/matchingAlgorithm.js
const Mentor = require("../models/mentor-model");

const findMatchingMentors = async (mentee) => {
    const { careerInterests } = mentee;
    const mentors = await Mentor.find({});

    const matchingMentors = mentors.filter((mentor) => {
        return mentor.mentorshipTopics.some((topic) =>
            careerInterests.includes(topic)
        );
    });

    return matchingMentors;
};

module.exports = { findMatchingMentors };