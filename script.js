document.addEventListener("DOMContentLoaded", () => {
    // Hide Loader
    const loader = document.getElementById("loader");
    setTimeout(() => {
        loader.classList.add("hidden");
    }, 800);

    // Initialize AOS Animation
    AOS.init({ duration: 1000, once: true });

    // Initialize 3D Glass Tilt on Card
    VanillaTilt.init(document.querySelector(".glassCard"), {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
    });

    // 1. PARTICLES BACKGROUND CONFIGURATION
    if (window.tsParticles) {
        tsParticles.load("particles-js", {
            particles: {
                number: { value: 40, density: { enable: true, value_area: 800 } },
                color: { value: ["#ffffff", "#ffde59", "#ff007f"] },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 4, random: true },
                move: { enable: true, speed: 1.5, direction: "top", out_mode: "out" }
            },
            interactivity: {
                events: { onhover: { enable: true, mode: "bubble" } },
                modes: { bubble: { distance: 200, size: 6, duration: 2, opacity: 0.8 } }
            }
        });
    }

    // 2. DYNAMIC FLOATING BALLOONS AND HEARTS
    function createFloatingDecorations() {
        const balloonContainer = document.getElementById("balloons-container");
        const heartContainer = document.getElementById("hearts-container");
        const icons = ["🎈", "💖", "✨", "💕", "⭐"];

        setInterval(() => {
            const el = document.createElement("div");
            el.classList.add("floating-element");
            el.innerText = icons[Math.floor(Math.random() * icons.length)];
            el.style.left = Math.random() * 100 + "vw";
            el.style.fontSize = (Math.random() * 20 + 20) + "px";
            el.style.animationDuration = (Math.random() * 4 + 6) + "s";

            if (Math.random() > 0.5) {
                balloonContainer.appendChild(el);
            } else {
                heartContainer.appendChild(el);
            }

            setTimeout(() => el.remove(), 10000);
        }, 1200);
    }
    createFloatingDecorations();

    // 3. BACKGROUND MUSIC CONTROLLER
    const bgMusic = document.getElementById("bgMusic");
    const musicBtn = document.getElementById("musicBtn");
    let isPlaying = false;

    musicBtn.addEventListener("click", () => {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.innerHTML = `<i class="fa-solid fa-play"></i> <span>Play Music</span>`;
        } else {
            bgMusic.play().then(() => {
                musicBtn.innerHTML = `<i class="fa-solid fa-pause"></i> <span>Pause Music</span>`;
            }).catch(() => {
                alert("Please interact with the page first to allow music play.");
            });
        }
        isPlaying = !isPlaying;
    });

    // 4. TYPEWRITER & CARD GENERATOR
    const generateBtn = document.getElementById("generateBtn");
    const usernameInput = document.getElementById("username");
    const cardSection = document.getElementById("cardSection");
    let typedInstance = null;

    generateBtn.addEventListener("click", generateGreeting);
    usernameInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") generateGreeting();
    });

    function generateGreeting() {
        const name = usernameInput.value.trim() || "Dear Friend";
        const cardMessage = document.getElementById("cardMessage");
        
        // Pick and apply random quote from data-quotes BEFORE displaying the section
        if (cardSection && cardMessage) {
            const rawQuotes = cardSection.getAttribute("data-quotes");
            if (rawQuotes) {
                const cardQuotes = JSON.parse(rawQuotes);
                const randomQuote = cardQuotes[Math.floor(Math.random() * cardQuotes.length)];
                cardMessage.innerText = randomQuote;
            }
        }

        // Show section and scroll
        cardSection.style.display = "block";
        cardSection.scrollIntoView({ behavior: "smooth" });

        // Fire Fireworks Confetti
        if (window.confetti) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }

        // Reset & Run Typewriter
        if (typedInstance) typedInstance.destroy();

        typedInstance = new Typed("#typewriterText", {
            strings: [`Dear ${name},`, `Happy Friendship Day, ${name}! ❤️`],
            typeSpeed: 50,
            backSpeed: 30,
            showCursor: true,
            cursorChar: '|',
            loop: false
        });

        updateShareLinks(name);
    }

    // 5. RANDOM QUOTES GENERATOR (Thought of the Day section)
    const quotes = [
        "Friends are the family we choose for ourselves.",
        "A real friend is one who walks in when the rest of the world walks out.",
        "Friendship is born at that moment when one person says to another: 'What! You too?'",
        "Good friends are like stars. You don't always see them, but you know they're always there.",
        "There is nothing on this earth more to be prized than true friendship."
    ];

    const quoteEl = document.getElementById("quote");
    const newQuoteBtn = document.getElementById("newQuoteBtn");

    newQuoteBtn.addEventListener("click", () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteEl.textContent = quotes[randomIndex];
    });

    // 6. DOWNLOAD CARD AS IMAGE
    const downloadBtn = document.getElementById("downloadBtn");
    downloadBtn.addEventListener("click", () => {
        const cardTarget = document.getElementById("captureCard");

        // Delay execution slightly so DOM text layout syncs before snapshotting
        setTimeout(() => {
            html2canvas(cardTarget, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
                logging: false
            }).then((canvas) => {
                const link = document.createElement("a");
                link.download = "Friendship_Day_Wish.png";
                link.href = canvas.toDataURL("image/png");
                link.click();
            });
        }, 100);
    });

    // 7. FULLSCREEN TOGGLE
    const fullscreenBtn = document.getElementById("fullscreenBtn");
    fullscreenBtn.addEventListener("click", () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            fullscreenBtn.innerHTML = `<i class="fa-solid fa-compress"></i> Exit Fullscreen`;
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                fullscreenBtn.innerHTML = `<i class="fa-solid fa-expand"></i> Fullscreen`;
            }
        }
    });

    // 8. SOCIAL SHARE BUILDER
    function updateShareLinks(name) {
        const currentUrl = encodeURIComponent(window.location.href);
        const shareText = encodeURIComponent(`Hey! ${name} sent you a special Friendship Day wish! Check it out here: `);

        document.getElementById("waShare").href = `https://api.whatsapp.com/send?text=${shareText}${currentUrl}`;
        document.getElementById("fbShare").href = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
        document.getElementById("twShare").href = `https://twitter.com/intent/tweet?text=${shareText}&url=${currentUrl}`;
    }

    const shareBtn = document.getElementById("shareBtn");
    shareBtn.addEventListener("click", async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Friendship Day Wishes",
                    text: "Check out this personalized Friendship Day greeting card!",
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Share canceled/failed.");
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    });
});
