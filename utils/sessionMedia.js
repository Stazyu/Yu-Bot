let temp = [];

/**
 * 
 * @param {{}} media 
 */
const addMediaSession = (media = {}) => {
    temp.push(media)
}

const getMediaSession = (user_id) => {
    let media = null
    temp.forEach((v, i) => {
        if (v.user_id === user_id) {
            media = v
        }
    })

    if (media !== null) {
        return media
    }
}

const resetMediaSession = (user_id, type = '') => {
    temp.forEach((v, i) => {
        if (typeof user_id === 'undefined') return;
        if (v.user_id === user_id || v.user_id === user_id && v.type === type) {
            temp.splice(i, 1);
        }
    })
}

module.exports = { addMediaSession, getMediaSession, resetMediaSession }