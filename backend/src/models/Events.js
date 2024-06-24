class Event {
    constructor(eventId, eventDate, delieveryMode, details, flProgramName){
        this.eventId = eventId
        this.eventDate = eventDate
        this.delieveryMode = delieveryMode
        this.details =details
        this.flProgramName = flProgramName
    }
}

module.exports = Event