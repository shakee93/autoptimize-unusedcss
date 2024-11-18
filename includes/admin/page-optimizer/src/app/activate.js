// js file for activating the demo hero

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', () => {
        const demoHero = document.querySelector('.demo-hero');
        const scrollPosition = window.scrollY;
        if (scrollPosition > 80) {
            demoHero.classList.remove('demo-inactive');
            demoHero.classList.add('demo-active');
        } else {
            demoHero.classList.remove('demo-active');
            demoHero.classList.add('demo-inactive');
        }
    });
});