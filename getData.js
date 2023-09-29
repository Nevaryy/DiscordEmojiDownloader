let emojis = document.getElementsByClassName("emoji");

emojis = Array.from(emojis).map((emoji) => { return { link: emoji.currentSrc.split('?')[0], name: emoji.alt.replaceAll(':', '') } });