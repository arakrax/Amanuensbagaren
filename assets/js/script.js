function navMenuEventListener() {
    // Find the DOM handles
    const menuIcon = document.getElementById('menu-icon');
    const navMenu = document.getElementById('nav-menu');

    // add a listener to the button
    menuIcon.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });
}

function subMenuEventListener() {
    const navBtn1 = document.getElementById('nav-btn1')
    const navBtn2 = document.getElementById('nav-btn2')
    const navBtn3 = document.getElementById('nav-btn3')

    const mediaQuery = window.matchMedia('(max-width: 767px)');

    if (mediaQuery.matches) {
        navBtn1.addEventListener('click', () => {
            navBtn1.children[1].classList.toggle('show');
        });

        navBtn2.addEventListener('click', () => {
            navBtn2.children[1].classList.toggle('show');
        });

        navBtn3.addEventListener('click', () => {
            navBtn3.children[1].classList.toggle('show');
        });
    }
}


function toTopEventListener() {
    const toTopButton = document.getElementById("toTop");
    window.addEventListener("scroll", function() {
        if (window.scrollY > 400) {
            toTopButton.classList.add("show")
        } else {
            toTopButton.classList.remove("show")
        }
    });
}


function main() {
    navMenuEventListener();
    subMenuEventListener();
    toTopEventListener();
}


main()
