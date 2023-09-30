let emojis = document.getElementsByClassName("sharedFilePreviewImage");

emojis = Array.from(emojis).map((emoji) => { return { link: emoji.currentSrc.split('?')[0], name: new Date().getTime().toString() } });