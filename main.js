'use strict';

async function setTag(messageId, tag) {
    try {
        const message = await messenger.messages.get(messageId)
        console.log(message)

        const key = tag.toLowerCase()
        if (message.tags.find(t => t.toLowerCase() == key)) {
            console.log(`Message was already tagged with ${tag}`)
            return // Already tagged
        }

        // Make tag if doesn't exit
        const tags = await messenger.messages.listTags()
        if (!tags.find(t => t.key.toLowerCase() == key)) {
            console.log(`Tag ${tag} did not exist -- creating!`)
            messenger.tagservice.AddTag({
                color: 'black',
                key: key,       // Unique tag key
                tag: tag,       // Display tag name
                ordinal: ''     // Custom sort string (usually empty)
            })
        }

        console.log(`Adding tag ${tag} to message ${messageId}`)
        await messenger.messages.update(messageId, {
            tags: message.tags.concat(key)
        })
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function load() {
    const tab = (await messenger.tabs.query({
      active: true,
      currentWindow: true,
    }))[0] // : )

    document.querySelector('#frm').addEventListener('submit', async (e) => {
        const msg = await messenger.messageDisplay.getDisplayedMessage(tab.id)
        const tag = document.querySelector('#inpt').value

        await setTag(msg.id, tag)
    })
}

document.addEventListener("DOMContentLoaded", load);

