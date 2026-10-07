(function() {
    console.log("🚀 Bio Script Initialized...");

    // Starfield
    const starfield = document.getElementById('starfield');
    if (starfield) {
        for (let i = 0; i < 150; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 2 + 1;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            const duration = Math.random() * 3 + 2;
            star.style.setProperty('--duration', duration + 's');
            star.style.animationDelay = Math.random() * 5 + 's';
            starfield.appendChild(star);
        }
    }

    async function updateSpotify() {
        const userId = '792225954524823573';
        const statusDiv = document.getElementById('spotify-status');
        if (!statusDiv) return;

        try {
            const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();

            if (data.success && data.data && data.data.spotify && data.data.spotify.track) {
                const spotify = data.data.spotify;
                const track = spotify.track;
                const albumArt = track.album?.image_url;

                statusDiv.innerHTML = `
                    <div class="flex items-center gap-4 text-left italic-none">
                        <img src="${albumArt || 'https://ui-avatars.com/api/?name=Music&background=random'}" class="w-16 h-16 rounded-lg shadow-lg" onerror="this.src='https://ui-avatars.com/api/?name=Music&background=random'">
                        <div class="text-left">
                            <div class="text-white font-semibold text-lg">${track.name || 'Unknown Track'}</div>
                            <div class="text-green-400 text-sm">${track.artists?.map(a => a.name).join(', ') || 'Unknown Artist'}</div>
                        </div>
                    </div>
                `;
                statusDiv.classList.remove('text-center', 'text-gray-500', 'italic');
            } else {
                statusDiv.innerText = 'Not listening to anything on Spotify right now';
                statusDiv.classList.add('text-center', 'text-gray-500', 'italic');
            }
        } catch (e) {
            console.error("Spotify Error:", e);
            statusDiv.innerText = 'Spotify status currently unavailable';
        }
    }

    async function updateFriends() {
        // We now include the manual image link here!
        const friends = [
            { id: '1447292903654428733', name: 'Terrified', img: 'https://cdn.discordapp.com/avatars/1447292903654428733/1778256e5fcc11f28a3e4b2e4c76cf69.webp?size=1024' },
            { id: '689557846991306802', name: 'Luna', img: 'https://cdn.discordapp.com/avatars/689557846991306802/ff93e823617c772a04078ee0b9aa1b9e.webp?size=1024' }
        ];
        const friendsList = document.getElementById('friends-list');
        if (!friendsList) return;

        let finalHtml = '';
        for (const friend of friends) {
            let statusColor = 'bg-gray-500';

            try {
                const response = await fetch(`https://api.lanyard.rest/v1/users/${friend.id}`);

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data) {
                        const status = data.data.discord_status;
                        if (status === 'online') statusColor = 'bg-green-500';
                        else if (status === 'idle') statusColor = 'bg-yellow-500';
                        else if (status === 'dnd') statusColor = 'bg-red-500';
                        else statusColor = 'bg-gray-500';
                    }
                }
            } catch (e) {
                console.error(`Connection error for ${friend.name}:`, e);
            }

            // Use the manual image link provided in the friends array
            const finalAvatar = friend.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.name)}&background=random`;

            finalHtml += `
                <a href="#" class="group relative">
                    <div class="relative">
                        <img src="${finalAvatar}" alt="${friend.name}" class="w-16 h-16 rounded-full grayscale group-hover:grayscale-0 transition-all border-2 border-transparent group-hover:border-green-500" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(friend.name)}&background=random'">
                        <div class="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-black ${statusColor}" title="${friend.name}"></div>
                    </div>
                </a>
            `;
        }
        friendsList.innerHTML = finalHtml;
    }

    // Age Glitch Effect
    const glitchAge = document.getElementById('glitch-age');
    if (glitchAge) {
        const chars = '*&^%$#@!'.split('');
        const originalText = glitchAge.innerText;

        setInterval(() => {
            const randomChar = chars[Math.floor(Math.random() * chars.length)];
            // Replace "16" with a random character
            glitchAge.innerText = originalText.replace('16', randomChar);
        }, 100);
    }

    // Initialize
    updateSpotify();
    updateFriends();
    setInterval(() => {
        updateSpotify();
        updateFriends();
    }, 30000);
})();
