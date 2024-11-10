const textElement = document.getElementById('typewriter');
let currentText = '';
let phase = 0;

function createArrow() {
    const arrowElement = document.createElement('div');
    arrowElement.className = 'arrow';
    document.body.appendChild(arrowElement);

    arrowElement.addEventListener('click', function() {
        const mainContent = document.getElementById('main-content');
        const windowHeight = window.innerHeight;
        const contentHeight = mainContent.offsetHeight;
        const currentScroll = window.scrollY;
        const paragraphPosition = mainContent.offsetTop - (windowHeight - contentHeight) / 2;

        if (currentScroll >= paragraphPosition) {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo({
                top: paragraphPosition,
                behavior: 'smooth'
            });
        }
    });

    setTimeout(() => {
        arrowElement.classList.add('visible');
        showBackgroundVideo();
    }, 1000);
}

function showBackgroundVideo() {
    const videoContainer = document.querySelector('.video-container');
    const bgVideo = document.getElementById('bg-video');

    videoContainer.style.display = 'block';
    videoContainer.style.opacity = '0';

    setTimeout(() => {
        videoContainer.style.transition = 'opacity 2s';
        videoContainer.style.opacity = '1';
        bgVideo.play();
    }, 10);
}

function typeWriter() {
    const phases = [
        { text: "Hello, World!", action: "type" },
        { text: "Hello,", action: "backspace" },
        { text: "Hello, I'm Jin.", action: "type" }
    ];

    if (phase === 0) {
        if (currentText.length < phases[0].text.length) {
            currentText += phases[0].text[currentText.length];
            textElement.textContent = currentText;
            setTimeout(typeWriter, 50);
        } else {
            setTimeout(() => {
                phase = 1;
                typeWriter();
            }, 1000);
        }
    } else if (phase === 1) {
        if (currentText.length > phases[1].text.length) {
            currentText = currentText.slice(0, -1);
            textElement.textContent = currentText;
            setTimeout(typeWriter, 30);
        } else {
            phase = 2;
            setTimeout(typeWriter, 500);
        }
    } else if (phase === 2) {
        const targetText = phases[2].text;
        if (currentText.length < targetText.length) {
            currentText = targetText.slice(0, currentText.length + 1);
            textElement.textContent = currentText;
            setTimeout(typeWriter, 100);
        } else {
            createArrow();
        }
    }
}

// Handle scroll event for blurring effect
window.addEventListener('scroll', () => {
    const videoContainer = document.querySelector('.video-container');
    const container = document.querySelector('.container');
    const containerBottom = container.offsetTop + container.offsetHeight;

    if (window.scrollY > containerBottom - 500) {
        videoContainer.classList.add('blur');
    } else {
        videoContainer.classList.remove('blur');
    }
});

window.addEventListener('scroll', function() {
    const videoContainer = document.querySelector('.video-container');
    const videoOverlay = document.querySelector('.video-overlay');
    const container = document.querySelector('.container');
    const verticalNav = document.querySelector('.vertical-nav');
    const containerBottom = container.offsetTop + container.offsetHeight;
    const navPosition = verticalNav.getBoundingClientRect().top;

    // Handle blur effect
    if (window.scrollY > containerBottom - 500) {
        videoContainer.classList.add('blur');
    } else {
        videoContainer.classList.remove('blur');
    }

    // Handle dimming effect
    if (navPosition < window.innerHeight && navPosition > 0) {
        videoOverlay.classList.add('dimmer');
    } else {
        videoOverlay.classList.remove('dimmer');
    }
});


// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Resume download functionality
    const resumeLink = document.querySelector('.resume-link');
    resumeLink.addEventListener('click', function() {
        const link = document.createElement('a');
        link.href = 'media/resume.pdf';
        link.download = 'resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // GitHub redirect functionality
    const githubLink = document.querySelector('.github-link');
    githubLink.addEventListener('click', function() {
        window.open('https://github.com/JinRecords', '_blank');
    });

    // Connect button functionality
    const connectLink = document.querySelector('.vertical-nav li:nth-child(2)');
    const connectLinks = document.querySelector('.connect-links');
    let isConnectVisible = false;

    connectLink.addEventListener('click', function() {
        if (!isConnectVisible) {
            connectLinks.style.display = 'block';
            connectLinks.classList.remove('fade-out');
            connectLinks.classList.add('fade-in');
            isConnectVisible = true;
        } else {
            connectLinks.classList.remove('fade-in');
            connectLinks.classList.add('fade-out');
            setTimeout(() => {
                connectLinks.style.display = 'none';
            }, 500);
            isConnectVisible = false;
        }
    });

    // Click outside to close connect links
    document.addEventListener('click', function(event) {
        if (isConnectVisible &&
            !connectLinks.contains(event.target) &&
            !connectLink.contains(event.target)) {
            connectLinks.classList.remove('fade-in');
            connectLinks.classList.add('fade-out');
            setTimeout(() => {
                connectLinks.style.display = 'none';
            }, 500);
            isConnectVisible = false;
        }
    });

        // Social media links functionality
    const linkedinLink = document.querySelector('.linkedin-link');
    const blueskyLink = document.querySelector('.bluesky-link');
    const instagramLink = document.querySelector('.instagram-link');

    linkedinLink.addEventListener('click', function() {
        window.open('https://www.linkedin.com/in/c-jingyang/', '_blank');
    });

    blueskyLink.addEventListener('click', function() {
        window.open('https://bsky.app/profile/jinrec.bsky.social', '_blank');
    });

    instagramLink.addEventListener('click', function() {
        window.open('https://www.instagram.com/jin_rec/', '_blank');
    });

        // Projects functionality
    const projectsLink = document.querySelector('.vertical-nav li:first-child span');
    const projectsSection = document.querySelector('.projects-section');
    let isProjectsVisible = false;

    projectsLink.addEventListener('click', function() {
        if (!isProjectsVisible) {
            // Hide connect links if visible
            if (isConnectVisible) {
                connectLinks.classList.remove('fade-in');
                connectLinks.classList.add('fade-out');
                setTimeout(() => {
                    connectLinks.style.display = 'none';
                }, 500);
                isConnectVisible = false;
            }

            // Show projects
            projectsSection.style.display = 'block';
            isProjectsVisible = true;
        } else {
            // Hide projects
            projectsSection.style.display = 'none';
            isProjectsVisible = false;
        }
    });

    // Click outside to close projects
    document.addEventListener('click', function(event) {
        if (isProjectsVisible &&
            !projectsSection.contains(event.target) &&
            !projectsLink.contains(event.target)) {
            projectsSection.style.display = 'none';
            isProjectsVisible = false;
        }
        });
});

// Start animation when page loads
window.onload = typeWriter;  // Remove the parentheses
