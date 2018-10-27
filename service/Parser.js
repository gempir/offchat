/**
 * @author https://github.com/caffeinery
 * @license MIT
 */
export default function parse(line) {
    let tags = {}
    let userinfo = {}
    let command = ''
    let params = ''
    let trailing = ''
    let pos = 0
    let parse_error = new Error('This message is not a valid IRC Message.')

    /**
     * IRCv3 MESSAGE TAGS
     */
    if (line.charCodeAt(pos) === 64) { // The line begins with an @, parse message-tags
        let message_tags

        if (line.indexOf(' ', pos) === -1) {
            throw parse_error
        }

        pos++

        message_tags = line.slice(pos, line.indexOf(' ', pos)).split(';') // Remove the @ before the tags, split the tags.

        for (let tag of message_tags) {
            let pair = tag.split('=')
            tags[pair[0]] = (pair[1] || true) // Either the tag exists or has a value.
        }

        pos = line.indexOf(' ', pos) + 1
    }

    /**
     * REMOVE TRAILING WHITESPACE
     */
    while (line.charCodeAt(pos) === 32) pos++ // While space, ignore & move on

    /**
     * GET USER INFORMATION
     */
    if (line.charCodeAt(pos) === 58) { // :
        let prefix = line.slice(pos, line.indexOf(' ', pos))
        let ppos = 0

        if (prefix.indexOf('!', ppos) !== -1) {
            // :nick!user@host
            userinfo.nick = prefix.slice(ppos + 1, prefix.indexOf('!', ppos)) // Extract nickname
            ppos = prefix.indexOf('!', ppos) + 1

            userinfo.ident = prefix.slice(ppos, prefix.indexOf('@', ppos)) // Extract ident
            ppos = prefix.indexOf('@', ppos) + 1

            userinfo.hostname = prefix.slice(ppos) // Extract hostname

            userinfo.is_user = true
        } else {
            // :sendak.freenode.net
            userinfo.is_user = false

            userinfo.sender = prefix.slice(ppos + 1)
        }

        pos = pos + prefix.length + 1
    } else {
        throw parse_error
    }

    /**
     * REMOVE TRAILING WHITESPACE
     */
    while (line.charCodeAt(pos) === 32) pos++

    /**
     * GET COMMAND (PRIVMSG | NOTICE)
     */
    if (line.indexOf(' ', pos) === -1) {
        if (line.length > pos) {
            command = line.slice(pos)
            return {
                tags: tags,
                userinfo: userinfo,
                command: command
            }
        }
        throw parse_error
    } else {
        command = line.slice(pos, line.indexOf(' ', pos))
    }

    pos = line.indexOf(' ', pos)

    /**
     * REMOVE TRAILING WHITESPACE
     */
    while (line.charCodeAt(pos) === 32) pos++

    /**
     * GET MESSAGE PARAMETERS AND TRAILING
     */
    while (pos < line.length) {
        let space = line.indexOf(' ', pos)

        if (line.charCodeAt(pos) === 58) {
            trailing = line.slice(pos + 1) // Anything after the colon is "trailing"
            break
        }

        // Loop parameters
        if (space > -1) {
            params += ' ' + line.slice(pos, space)
            pos = space + 1

            while (line.charCodeAt(pos) === 32) pos++
            continue
        }

        // We hit the end, it was a fun ride while it lasted. :(
        if (space === -1) {
            params += line.slice(pos)
            break
        }
    }

    params = params.trim()

    // Return the message back to the user.
    return {
        tags: tags,
        userinfo: userinfo,
        command: command,
        parameters: params.split(' '),
        trailing: trailing
    }
}