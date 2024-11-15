const textElement = document.getElementById('typewriter');
let currentText = '';
let phase = 0;

const style = document.createElement('style');
style.textContent = `
    .no-scroll {
        overflow: hidden !important;
        height: 100% !important;
        margin: 0 !important;
    }
`;

document.head.appendChild(style);

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

// Add this function to check for mobile devices
function isMobileDevice() {
    return (window.innerWidth <= 768) ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

document.addEventListener('DOMContentLoaded', function () {
    const mainContent = document.getElementById('main-content');

    function toggleParagraphVisibility() {
        if (isMobileDevice()) {
            mainContent.style.display = 'none';
        } else {
            mainContent.style.display = 'block';
        }
    }

    // Check on page load
    toggleParagraphVisibility();

    // Check when window is resized
    window.addEventListener('resize', toggleParagraphVisibility);
});


document.body.classList.add('no-scroll');

function updateArrowVisibility() {
    const arrow = document.querySelector('.arrow');
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Check if we're near the bottom of the page
    if (scrollTop + windowHeight >= documentHeight - 100) { // 100px threshold
        arrow.classList.remove('visible');
        arrow.classList.add('fade-out');
    } else {
        arrow.classList.remove('fade-out');
        arrow.classList.add('visible');
    }
}

function createArrow() {
    const arrowElement = document.createElement('div');
    arrowElement.className = 'arrow';
    document.body.appendChild(arrowElement);

    arrowElement.addEventListener('click', function () {
        const mainContent = document.getElementById('main-content');
        const verticalNav = document.querySelector('.vertical-nav');
        const currentScroll = window.scrollY;
        const windowHeight = window.innerHeight;

        // If we're at the top, scroll to main content
        if (currentScroll < windowHeight / 2) {
            mainContent.scrollIntoView({behavior: 'smooth'});
        }
        // If we're at main content, scroll to nav
        else if (currentScroll < windowHeight * 1.5) {
            verticalNav.scrollIntoView({behavior: 'smooth'});
        }
        // If we're at nav, do nothing or scroll to top
        else {
            document.querySelector('.container').scrollIntoView({behavior: 'smooth'});
        }
    });

    setTimeout(() => {
        arrowElement.classList.add('visible');
        showBackgroundVideo();
    }, 1000);
}


// Add scroll event listener to update arrow visibility
window.addEventListener('scroll', updateArrowVisibility);

document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault(); // Prevent default scroll behavior

        const sections = [
            document.querySelector('.container'),
            document.getElementById('main-content'),
            document.querySelector('.nav-container')
        ];

        const currentSection = sections.findIndex(section => {
            const rect = section.getBoundingClientRect();
            return rect.top >= -window.innerHeight / 2 && rect.top <= window.innerHeight / 2;
        });

        if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
            sections[currentSection + 1].scrollIntoView({behavior: 'smooth'});
        } else if (e.key === 'ArrowUp' && currentSection > 0) {
            sections[currentSection - 1].scrollIntoView({behavior: 'smooth'});
        }
    }
});


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

let isScrolling = false;
document.addEventListener('wheel', function (e) {
    if (!isScrolling) {
        isScrolling = true;

        const sections = [
            document.querySelector('.container'),
            document.getElementById('main-content'),
            document.querySelector('.nav-container')
        ];

        const currentSection = sections.findIndex(section => {
            const rect = section.getBoundingClientRect();
            return rect.top >= -window.innerHeight / 2 && rect.top <= window.innerHeight / 2;
        });

        if (e.deltaY > 0 && currentSection < sections.length - 1) {
            sections[currentSection + 1].scrollIntoView({behavior: 'smooth'});
        } else if (e.deltaY < 0 && currentSection > 0) {
            sections[currentSection - 1].scrollIntoView({behavior: 'smooth'});
        }

        setTimeout(() => {
            isScrolling = false;
        }, 1000); // Adjust this delay as needed
    }
}, {passive: false});


function typeWriter() {
    const isMobile = isMobileDevice();
    const phases = isMobile ? [
        {text: "> Hello, World!", action: "type"},
        {text: "> Hello,", action: "backspace"},
        {text: "> Hello, \nplease use\ndesktop view.", action: "type"}
    ] : [
        {text: "> Hello, World!", action: "type"},
        {text: "> Hello,", action: "backspace"},
        {text: "> Hello, I'm Jin.", action: "type"}
    ];

    if (phase === 0) {
        if (currentText.length < phases[0].text.length) {
            currentText += phases[0].text[currentText.length];
            textElement.innerHTML = currentText.replace(/\n/g, '<br>');
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
            textElement.innerHTML = currentText.replace(/\n/g, '<br>');
            setTimeout(typeWriter, 30);
        } else {
            phase = 2;
            setTimeout(typeWriter, 500);
        }
    } else if (phase === 2) {
        const targetText = phases[2].text;
        if (currentText.length < targetText.length) {
            currentText = targetText.slice(0, currentText.length + 1);
            textElement.innerHTML = currentText.replace(/\n/g, '<br>');
            setTimeout(typeWriter, 100);
        } else {
            // Unhide body after animation completes
            document.body.style.visibility = 'visible';

            // Re-enable scroll snapping after animation completes
            if (window.innerWidth > 1200) {
                document.documentElement.style.scrollSnapType = 'y mandatory';
            } else {
                document.documentElement.style.scrollSnapType = 'none';
            }

            // Optionally create an arrow or other elements after animation
            createArrow();
        }
    }
}


window.addEventListener('resize', function () {
    if (!isMobileDevice()) {
        document.body.classList.remove('no-scroll');
        // Only show arrow if we're in phase 2 (animation complete)
        if (phase === 2) {
            const arrow = document.querySelector('.arrow');
            if (!arrow) {
                createArrow();
            }
        }
    } else {
        document.body.classList.add('no-scroll');
        // Remove arrow if it exists
        const arrow = document.querySelector('.arrow');
        if (arrow) {
            arrow.remove();
        }
    }
});


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

window.addEventListener('scroll', function () {
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
document.addEventListener('DOMContentLoaded', function () {
    // Resume download functionality
    const resumeLink = document.querySelector('.resume-link');
    resumeLink.addEventListener('click', function () {
        const link = document.createElement('a');
        link.href = 'resume.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // GitHub redirect functionality
    const githubLink = document.querySelector('.github-link');
    githubLink.addEventListener('click', function () {
        window.open('https://github.com/JinRecords', '_blank');
    });

    const sourceLink = document.querySelector('.source-link');
    sourceLink.addEventListener('click', function () {
        window.open('https://github.com/JinRecords/JinWeb', '_blank');
    });

    const soundcloudLink = document.querySelector('.soundcloud-link');
    soundcloudLink.addEventListener('click', function () {
        window.open('https://soundcloud.com/jin_records', '_blank');
    });

    // Disable scroll snapping initially
    document.documentElement.style.scrollSnapType = 'none';

    // Disable scrolling on mobile
    if (isMobileDevice()) {
        document.body.classList.add('no-scroll');
    }

    // Handle window resize to check if it's mobile or desktop
    window.addEventListener('resize', function () {
        if (isMobileDevice()) {
            document.body.classList.add('no-scroll');
            // Disable scroll snapping for mobile
            document.documentElement.style.scrollSnapType = 'none';
        } else {
            document.body.classList.remove('no-scroll');
            // Re-enable scroll snapping after typewriter animation completes
            if (phase === 2) {
                if (window.innerWidth > 1200) {
                document.documentElement.style.scrollSnapType = 'y mandatory';
            } else {
                document.documentElement.style.scrollSnapType = 'none';
            }
                const arrow = document.querySelector('.arrow');
                if (!arrow) {
                    createArrow();
                }
            }
        }
    });

    // Connect button functionality
    const connectLink = document.querySelector('.vertical-nav li:nth-child(2)');
    const connectLinks = document.querySelector('.connect-links');
    let isConnectVisible = false;

    connectLink.addEventListener('click', function () {
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
    document.addEventListener('click', function (event) {
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

    linkedinLink.addEventListener('click', function () {
        window.open('https://www.linkedin.com/in/c-jingyang/', '_blank');
    });

    blueskyLink.addEventListener('click', function () {
        window.open('https://bsky.app/profile/jinrec.bsky.social', '_blank');
    });

    instagramLink.addEventListener('click', function () {
        window.open('https://www.instagram.com/jin_rec/', '_blank');
    });

    // Projects functionality
    const projectsLink = document.querySelector('.vertical-nav li:first-child span');
    const projectsSection = document.querySelector('.projects-section');
    let isProjectsVisible = false;

    projectsLink.addEventListener('click', function () {
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


    // Click outside to close projects with fade-out
    document.addEventListener('click', function (event) {
        if (isProjectsVisible &&
            !projectsSection.contains(event.target) &&
            !projectsLink.contains(event.target)) {
            projectsSection.classList.remove('fade-in');
            projectsSection.classList.add('fade-out');
            setTimeout(() => {
                projectsSection.style.display = 'none';
                projectsSection.classList.remove('fade-out'); // Reset for next appearance
            }, 500);
            isProjectsVisible = false;
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Split Keyboard Project
    const splitkeebTrigger = document.querySelector('.splitkeeb-trigger');
    const splitkeebDetails = splitkeebTrigger.nextElementSibling;
    const splitkeebMediaItems = splitkeebDetails.querySelectorAll('.media-item');

    // Haxophone Project
    const haxophoneTrigger = document.querySelector('.haxophone-trigger');
    const haxophoneDetails = haxophoneTrigger.nextElementSibling;
    const haxophoneMediaItems = haxophoneDetails.querySelectorAll('.media-item');

    // Monocon Project
    const monoconTrigger = document.querySelector('.monocon-trigger');
    const monoconDetails = monoconTrigger.nextElementSibling;
    const monoconMediaItems = monoconDetails.querySelectorAll('.media-item');

    // Pyramid Project
    const pyramidTrigger = document.querySelector('.pyramid-trigger');
    const pyramidDetails = pyramidTrigger.nextElementSibling;
    const pyramidMediaItems = pyramidDetails.querySelectorAll('.media-item');

    const bgVideo = document.getElementById('bg-video');
    const videoContainer = document.querySelector('.video-container');
    let originalVideoSrc = bgVideo.querySelector('source').src;


    // Media items hover handlers
    function setupMediaItemHandlers(mediaItems, withSound = false) {
        mediaItems.forEach(item => {
            item.addEventListener('mouseenter', function () {
                const mediaPath = this.dataset.media;
                const overlay = document.querySelector('.video-overlay');

                if (mediaPath.endsWith('.mp4')) {
                    if (item.classList.contains('vertical')) {
                        // Handle vertical video
                        videoContainer.style.backgroundColor = 'black';
                        bgVideo.className = 'vertical-video';
                    } else {
                        // Handle horizontal video
                        bgVideo.className = '';
                    }

                    bgVideo.src = mediaPath;
                    bgVideo.muted = !withSound;
                    bgVideo.play();
                    bgVideo.style.display = 'block';
                    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    videoContainer.classList.remove('video-blur', 'blur');
                } else {
                    // Create a new container for the centered image
                    let imageContainer = document.querySelector('.centered-image');
                    if (!imageContainer) {
                        imageContainer = document.createElement('div');
                        imageContainer.className = 'centered-image';
                        videoContainer.appendChild(imageContainer);
                    }

                    // Set the background (blurred) image
                    videoContainer.style.backgroundImage = `url(${mediaPath})`;
                    videoContainer.style.backgroundSize = 'cover';

                    // Set the centered (sharp) image
                    imageContainer.style.backgroundImage = `url(${mediaPath})`;
                    imageContainer.style.display = 'block';

                    bgVideo.style.display = 'none';
                    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    videoContainer.classList.remove('video-blur', 'blur');
                }
            });

            item.addEventListener('mouseleave', function () {
                const overlay = document.querySelector('.video-overlay');
                // Remove the centered image if it exists
                const imageContainer = document.querySelector('.centered-image');
                if (imageContainer) {
                    imageContainer.style.display = 'none';
                }

                videoContainer.style.backgroundImage = 'none';
                bgVideo.style.display = '';
                bgVideo.src = originalVideoSrc;
                bgVideo.muted = true;
                bgVideo.play();
                overlay.style.backgroundColor = '';
                videoContainer.classList.add('video-blur', 'blur');
            });
        });
    }


    // Setup media items for all projects
    setupMediaItemHandlers(splitkeebMediaItems, false);
    setupMediaItemHandlers(haxophoneMediaItems, true);
    setupMediaItemHandlers(monoconMediaItems, true); // true for audio enabled
    setupMediaItemHandlers(pyramidMediaItems, false);

    // Close details when clicking outside
    document.addEventListener('click', function (e) {
        if (splitkeebDetails.style.display !== 'none' &&
            !splitkeebDetails.contains(e.target) &&
            !splitkeebTrigger.contains(e.target)) {
            splitkeebDetails.classList.add('fade-out');
            setTimeout(() => {
                splitkeebDetails.style.display = 'none';
                splitkeebDetails.classList.remove('fade-out');
            }, 100);
        }

        if (haxophoneDetails.style.display !== 'none' &&
            !haxophoneDetails.contains(e.target) &&
            !haxophoneTrigger.contains(e.target)) {
            haxophoneDetails.classList.add('fade-out');
            setTimeout(() => {
                haxophoneDetails.style.display = 'none';
                haxophoneDetails.classList.remove('fade-out');
            }, 100);
        }

        if (monoconDetails.style.display !== 'none' &&
            !monoconDetails.contains(e.target) &&
            !monoconTrigger.contains(e.target)) {
            monoconDetails.classList.add('fade-out');
            setTimeout(() => {
                monoconDetails.style.display = 'none';
                monoconDetails.classList.remove('fade-out');
            }, 100);
        }
    });

    function hideProjectDetails(details, callback) {
        if (details && details.style.display !== 'none') {
            details.classList.add('fade-out');
            setTimeout(() => {
                details.style.display = 'none';
                details.classList.remove('fade-out');
                if (callback) callback();
            }, 1);
        } else if (callback) {
            callback();
        }
    }

    // Modified click handlers for each project
    splitkeebTrigger.addEventListener('click', function (e) {
        e.stopPropagation();
        const isVisible = splitkeebDetails.style.display !== 'none';

        if (!isVisible) {
            hideProjectDetails(haxophoneDetails, () => {
                hideProjectDetails(monoconDetails, () => {
                    hideProjectDetails(pyramidDetails, () => {
                        splitkeebDetails.style.display = 'block';
                        splitkeebDetails.classList.add('fade-in');
                    });
                });
            });
        } else {
            hideProjectDetails(splitkeebDetails);
        }
    });

    haxophoneTrigger.addEventListener('click', function (e) {
        e.stopPropagation();
        const isVisible = haxophoneDetails.style.display !== 'none';

        if (!isVisible) {
            hideProjectDetails(splitkeebDetails, () => {
                hideProjectDetails(monoconDetails, () => {
                    hideProjectDetails(pyramidDetails, () => {
                        haxophoneDetails.style.display = 'block';
                        haxophoneDetails.classList.add('fade-in');
                    });
                });
            });
        } else {
            hideProjectDetails(haxophoneDetails);
        }
    });

    monoconTrigger.addEventListener('click', function (e) {
        e.stopPropagation();
        const isVisible = monoconDetails.style.display !== 'none';

        if (!isVisible) {
            hideProjectDetails(splitkeebDetails, () => {
                hideProjectDetails(haxophoneDetails, () => {
                    hideProjectDetails(pyramidDetails, () => {
                        monoconDetails.style.display = 'block';
                        monoconDetails.classList.add('fade-in');
                    });
                });
            });
        } else {
            hideProjectDetails(monoconDetails);
        }
    });

    pyramidTrigger.addEventListener('click', function (e) {
        e.stopPropagation();
        const isVisible = pyramidDetails.style.display !== 'none';

        if (!isVisible) {
            hideProjectDetails(splitkeebDetails, () => {
                hideProjectDetails(haxophoneDetails, () => {
                    hideProjectDetails(monoconDetails, () => {
                        pyramidDetails.style.display = 'block';
                        pyramidDetails.classList.add('fade-in');
                    });
                });
            });
        } else {
            hideProjectDetails(pyramidDetails);
        }
    });

    const infoMessage = document.getElementById('info-message');
    const verticalNav = document.querySelector('.vertical-nav ul');
    const projectNav = document.querySelector('.projects-section');
    let messageShown = false;
    let messageRemoved = false;
    let lastScrollPosition = window.pageYOffset;

    // Show message when scrolling to navigation
    window.addEventListener('scroll', function () {
        if (messageRemoved) return; // Skip if message was already removed

        const currentScrollPosition = window.pageYOffset;
        const navPosition = verticalNav.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        const isPortrait = window.innerHeight > window.innerWidth;
        const scrollThreshold = isPortrait ? windowHeight * 0.5 : windowHeight * 0.75;

        // Check scroll direction
        const isScrollingUp = currentScrollPosition < lastScrollPosition;
        lastScrollPosition = currentScrollPosition;

        // Hide message when scrolling up
        if (isScrollingUp && messageShown) {
            infoMessage.style.opacity = '0';
            setTimeout(() => {
                infoMessage.style.display = 'none';
                messageShown = false; // Allow message to show again when scrolling down
            }, 500);
        }
        if (navPosition < scrollThreshold &&
            navPosition > 0 &&
            !messageShown &&
            !isScrollingUp &&
            verticalNav.offsetHeight > 0) { // Ensure nav is actually visible

            infoMessage.style.display = 'block';
            infoMessage.style.opacity = '0';
            setTimeout(() => {
                infoMessage.style.transition = 'opacity 0.5s ease';
                infoMessage.style.opacity = '1';
            }, 10);
            messageShown = true;
        }
    });

    // Remove message permanently when hovering over navigation
    verticalNav.addEventListener('mouseenter', function () {
        if (messageShown && !messageRemoved) {
            infoMessage.style.opacity = '0';
            setTimeout(() => {
                infoMessage.style.display = 'none';
                messageRemoved = true; // Prevent message from showing again
            }, 500);
        }
    });

    projectNav.addEventListener('mouseenter', function () {
        if (messageShown && !messageRemoved) {
            infoMessage.style.opacity = '0';
            setTimeout(() => {
                infoMessage.style.display = 'none';
                messageRemoved = true; // Prevent message from showing again
            }, 500);
        }
    });

    const projectsLink = document.querySelector('.vertical-nav li:first-child span');
    const projectsSection = document.querySelector('.projects-section');
    const connectLink = document.querySelector('.vertical-nav li:nth-child(2)'); // Assuming this is your connect link
    const connectLinks = document.querySelector('.connect-links');
    let isProjectsVisible = true; // Set to true by default
    let isConnectVisible = false; // Set to false by default

    // Function to show projects section
    function showProjectsSection() {
        projectsSection.style.display = 'block';
        projectsSection.classList.add('fade-in');
    }

    // Function to hide projects section
    function hideProjectsSection() {
        projectsSection.style.display = 'none';
        projectsSection.classList.remove('fade-in');
    }

    // Function to show connect links
    function showConnectLinks() {
        connectLinks.style.display = 'block';
        connectLinks.classList.add('fade-in');
        isConnectVisible = true;
    }

    // Function to hide connect links
    function hideConnectLinks() {
        connectLinks.classList.remove('fade-in');
        connectLinks.classList.add('fade-out');
        setTimeout(() => {
            connectLinks.style.display = 'none';
            connectLinks.classList.remove('fade-out');
        }, 500);
        isConnectVisible = false;
    }

    // Show projects section on page load
    showProjectsSection();

    // Click handler for the projects link
    projectsLink.addEventListener('click', function () {
        if (!isProjectsVisible) {
            // Hide connect links if visible
            if (isConnectVisible) {
                hideConnectLinks();
            }
            // Show projects
            showProjectsSection();
            isProjectsVisible = true;
        } else {
            // Hide projects
            hideProjectsSection();
            isProjectsVisible = false;
        }
    });

    // Click handler for the connect link
    connectLink.addEventListener('click', function () {
        if (!isConnectVisible) {
            // Hide project section if visible
            if (isProjectsVisible) {
                hideProjectsSection();
                isProjectsVisible = false;
            }
            // Show connect links
            showConnectLinks();
        } else {
            // Hide connect links
            hideConnectLinks();
        }
    });

    // Global click listener to close sections when clicking outside of them
    document.addEventListener('click', function (e) {
        const target = e.target;


        // Close connect links if clicking outside of them and they're visible
        if (isConnectVisible && !connectLinks.contains(target) && !connectLink.contains(target)) {
            hideConnectLinks();
        }
    });
});


// Start animation when page loads
window.onload = typeWriter; // Remove the parentheses