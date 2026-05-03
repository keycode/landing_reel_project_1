
let mainEmbla;
let nestedEmbla; 
var tweenanimchat1; 
var tweenanimchat2;    
var isInIframe = (parent !== window);
var animatingscroll = false

var isMobile = false;

document.addEventListener('DOMContentLoaded', () => {

    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        isMobile = true;
    }
    

    gsap.registerPlugin(TextPlugin,Observer);

    Observer.create({
        type: "wheel",
        wheelSpeed: -1,
        onDown: () =>  gotoslideup(),
        onUp: () => gotoslidedown(),
        tolerance: 10,
        preventDefault: true
      });

    window.addEventListener('message', function(event) {
     
        if (event.origin === window.location.origin) { 
            console.log(event.data);
            if(event.data=="slidedown") mainEmbla.scrollNext();
            if(event.data=="slideup") mainEmbla.scrollPrev();
        }
    });
    var anclas = parent.location.href.substring(parent.location.href.indexOf('#'));

    if (anclas.length > 0) {
        console.log("tengo ancla: " + anclas.substring(1, anclas.length));
        
    }
  
    const emblaNode = document.querySelector('.landingreel');
    const emblaDots = document.querySelector('.landingreel-dots');
    const slides = emblaNode.querySelectorAll('.landingreel__slide');


    const mainEmblaOptions = {
        axis: 'y', 
        loop: false, 
        dragFree: false, 
        align: 'center', 
        

        
    };

    mainEmbla = EmblaCarousel(emblaNode, mainEmblaOptions);

    // --- 2. Configurar los Dots de Navegación ---
    const setupDots = () => {
        const dots = emblaDots.querySelectorAll('.landingreel-dot');

        // Función para actualizar la clase 'is-selected' del dot activo
        const updateDots = () => {
            const selected = mainEmbla.selectedScrollSnap();
            dots.forEach((dot, index) => {
                if (index === selected) {
                    dot.classList.add('is-selected');
                } else {
                    dot.classList.remove('is-selected');
                }
            });
        };


        // Añadir listeners de click a los dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                mainEmbla.scrollTo(index);
            });
            dot.addEventListener('mouseover', (e) => {
                if (!isMobile) {
                    e.preventDefault();
                   dot.style.width='15vw';
                   dot.style.backgroundColor='#ffffff'; 
                }
               
               
            });
            dot.addEventListener('mouseout', (e) => {
                if (!isMobile) {
                    e.preventDefault();
                    dot.style.width = '1px';
                    dot.style.backgroundColor = '#444444';
                }
               
            });
        });

        // Actualizar los dots al seleccionar un slide y al inicializar
        mainEmbla.on('select', updateDots);
        mainEmbla.on('init', updateDots);
    };

    const setupLines = (mode) => {

       
        const dots = emblaDots.querySelectorAll('.landingreel-dot');

     
            dots.forEach((dot, index) => {
                if (mode == 'dark') {
                    console.log('add darkline')
                    dot.classList.add('darkline');
                } else {
                    dot.classList.remove('darkline');
                }
            });
        
        

    }

    setupDots(); // Llamar para configurar los dots
    $("#landindreel-headerfixed").hide();
    // --- 3. Definir Funciones de Entrada y Salida para Cada Slide ---

    // Slide 1: Entrada de texto con fade-in
    const handleSlide1Entry = () => {
        console.log('Entrando a Slide 1');
        slide1_anims();
        setupLines(); 
        
        $("#landindreel-headerfixed").hide();
    
       
    };
    const handleSlide1Exit = () => {
        $("#landindreel-headerfixed").hide();
        console.log('Saliendo de Slide 1');
       //   $("#supertextanim2").addClass("startanimtextos"); 
    };

    // Slide 2: Video al estilo TikTok/Reels
    const handleSlide2Entry = () => {
        console.log('Entrando a Slide 2');
        setupLines('');
        $("#landindreel-headerfixed").show();
        $(".landindreel-footer").removeClass('landindreel-footerdark');
        escrietext('chattextos_slide2', 0.01);
        

        setTimeout(() => {
            console.log('cambio');

            if (isMobile) {
                var imageUrl =   "images/mob_ecommerce2.png";
                $("#reel_slide3").css("background-image", "url(" + imageUrl + ")");
            } else {
                $("#fotocommerce1").hide()
                $("#fotocommerce2").fadeIn()
            }
           
        
            
        }, 3000);




      
    };
    const handleSlide2Exit = () => {
        console.log('Saliendo de Slide 2'); 
      
    };


    // Slide 3: Carrusel horizontal anidado
    const handleSlide3Entry = () => {
        console.log('Entrando a Slide 3');
        setupLines('');
        $("#landindreel-headerfixed").show();
        $(".landindreel-footer").addClass('landindreel-footer');
        escrietext('chattextos_slide3',0.01);
     
    };
    const handleSlide3Exit = () => {
        console.log('Saliendo de Slide 3');
      
      
    };

    // Slide 4: Texto de cierre
    const handleSlide4Entry = () => {
        console.log('Entrando a Slide 4');
        setupLines('');
        escrietext('chattextos_slide4',0.01);
        $("#landindreel-headerfixed").show();
        $(".landindreel-footer").removeClass('landindreel-footerdark');
    
    };
    const handleSlide4Exit = () => {
        console.log('Saliendo de Slide 4');

    };
    // Slide 4: Texto de cierre
    const handleSlide5Entry = () => {
        console.log('Entrando a Slide 5');
        escrietext('chattextos_slide5', 0.01);
        $("#landindreel-headerfixed").show();
        $(".landindreel-footer").addClass('landindreel-footerdark');
    };
    
    const handleSlide5Exit = () => {
        console.log('Saliendo de Slide 5');
       
        // No hay animación específica, solo un log
    };
    // Slide 4: Texto de cierre
    const handleSlide6Entry = () => {
        console.log('Entrando a Slide 6');
        $("#landindreel-headerfixed").show();
        
        $(".landindreel-footer").removeClass('landindreel-footerdark'); 
        escrietext('chattextos_slide6',0.01);
    };
    const handleSlide9Entry = () => {
        console.log('Entrando a Slide 9');
        $("#landindreel-headerfixed").show();
        $("#workflow_mobile").slick('slickSetOption', 'autoplay', true);
        $(".landindreel-footer").addClass('landindreel-footerdark');
        
       
    };
    
    const handleSlide6Exit = () => {
        console.log('Saliendo de Slide 6');
        // No hay animación específica, solo un log
    };
    const handleSlide7Entry = () => {
        console.log('Entrando a Slide 7');
        $("#landindreel-headerfixed").hide();

        $(".landindreel-footer").removeClass('landindreel-footerdark');
    };
    
    const handleSlide8Exit = () => {
        console.log('Saliendo de Slide 7');
        // No hay animación específica, solo un log
    };
    const handleSlide8Entry = () => {
        console.log('Entrando a Slide 8');
        $("#landindreel-headerfixed").show();
        $(".landindreel-footer").removeClass('landindreel-footerdark'); 
    };
    
    const handleSlide7Exit = () => {
        console.log('Saliendo de Slide 7');
        // No hay animación específica, solo un log
    };
    // Rellenar el array slidesData con las funciones
    const slidesData = [
        { id: 'slide1', entry: handleSlide1Entry, exit: handleSlide1Exit },
        { id: 'slide2', entry: handleSlide2Entry, exit: handleSlide2Exit },
        { id: 'slide3', entry: handleSlide3Entry, exit: handleSlide3Exit },
        { id: 'slide4', entry: handleSlide4Entry, exit: handleSlide4Exit },
        { id: 'slide5', entry: handleSlide5Entry, exit: handleSlide5Exit },
        { id: 'slide6', entry: handleSlide6Entry, exit: handleSlide6Exit },
        { id: 'slide9', entry: handleSlide9Entry, exit: handleSlide6Exit },
     
        { id: 'equipo', entry: handleSlide8Entry, exit: handleSlide8Exit },
        { id: 'slide7', entry: handleSlide7Entry, exit: handleSlide7Exit },

    ];

    // --- 4. Adjuntar Listeners de Eventos de Embla para Entrada/Salida ---

    // Función para manejar el cambio de slide y disparar eventos de entrada/salida
    const onSelect = () => {
        const previousIndex = mainEmbla.previousScrollSnap();
        const currentIndex = mainEmbla.selectedScrollSnap();

        // Disparar evento de salida para el slide anterior
        if (slidesData[previousIndex]) {
            slidesData[previousIndex].exit(); // Llama a la lógica de salida específica (ej: pausa de video)
            // Animación de salida: zoom out y fade out
            gsap.to(slides[previousIndex], {
                opacity: 0.9,
            
                duration: 0.1,
                ease: 'fade.in',
            });
        }

        // Disparar evento de entrada para el slide actual
        if (slidesData[currentIndex]) {
            console.log("entro en la slide " + slides[currentIndex]);
            slidesData[currentIndex].entry(); // Llama a la lógica de entrada específica (ej: reproducción de video)
            // Animación de entrada: zoom in y fade in
            gsap.fromTo(
                slides[currentIndex],
                { opacity: 0.9 }, // Comienza desde escalado y desvanecido
                { opacity: 1,  ease: 'fade.in' } // Anima a tamaño normal y opacidad completa
            );
        }

        // Asegurar que todas las slides no seleccionadas estén en el estado "salido"
        slides.forEach((slide, index) => {
            if (index !== currentIndex && index !== previousIndex) {
                gsap.set(slide, { opacity: 1});
            }
        });
    };

    // Manejar pausa/reproducción de video principal durante el arrastre
    mainEmbla.on('pointerDown', () => {
        const currentVideo =
            slides[mainEmbla.selectedScrollSnap()].querySelector('video');
        if (currentVideo) {
            currentVideo.pause();
        }
    });

    mainEmbla.on('settle', () => {
        // 'settle' se dispara cuando el carrusel deja de moverse
        const currentVideo =
            slides[mainEmbla.selectedScrollSnap()].querySelector('video');
        if (currentVideo) {
            currentVideo.play().catch((error) => {
                console.error(
                    'Error al reanudar reproducción después de arrastre:',
                    error
                );
            });
        }
    });

    mainEmbla.on('select', onSelect); // Escucha el evento de cambio de slide

    // Disparar el evento de entrada para el slide inicial al cargar la página
    mainEmbla.on('init', () => {
        onSelect(); // Esto configurará el estado inicial para la primera slide y las demás
        // Asegurar que todas las slides comiencen en un estado "oculto" excepto la primera
        slides.forEach((slide, index) => {
            if (index !== mainEmbla.selectedScrollSnap()) {
                gsap.set(slide, { opacity: 1 });
            }
        });
    });
}); //dom

function gotoslideup() {
    
    if (!animatingscroll) {
        animatingscroll = true;
        mainEmbla.scrollPrev();
        resetScroll = setTimeout(function() {
            animatingscroll = false
        }, 500);
    }
   
}
function gotoslidedown() {
    if (!animatingscroll) {
        animatingscroll = true;
        mainEmbla.scrollNext();
        resetScroll = setTimeout(function() {
            animatingscroll = false
        }, 500);
    }
  
   
}

function reelfadain(clase,dura,delays){
    gsap.from(''+clase, {
        opacity: 1,
        display:'block',
       
        duration: dura,
        ease: 'ease.in',
        transformOrigin: '50% 50%'
      },delays);
}


function reelzoomin (clase,dura,delays){
    gsap.from(''+clase, {
        scale: 0,
       
        duration: dura,
        ease: 'ease.in',
        transformOrigin: '50% 50%'
      },delays);
}

function animchat1() {
    $("#telepi_slide2 .cajita ").css(' bottom', ' -370px');
    tweenanimchat1 = gsap.timeline();                
    tweenanimchat1
        .to("#cajitatext1", { duration: 0.5, opacity: 1,   display: 'block',  ease: 'Sine.easeInOut' }, 0.5)
        .to("#cajitatext2", { duration: 0.5, opacity: 1,   display: 'block',ease: 'Sine.easeInOut' }, 2)
        .to("#cajitatext3", { duration: 0.5, opacity: 1,   display: 'block',ease: 'Sine.easeInOut' }, 4)
        .to("#cajitatext4", { duration: 0.5, opacity: 1,   display: 'block',ease: 'Sine.easeInOut' }, 6);
}
/*
function animchat1() {
    $("#telepi_slide2 .cajita ").css(' bottom', ' -80dvh');
    tweenanimchat1 = gsap.timeline();                
    tweenanimchat1
        .to("#telepi_slide2 .cajita", { duration: 5, opacity: 1, bottom: '2dvh', ease: 'ease.in' }, 0.5)
 
}
*/

 /* 
function animchat2() {
    $("#telepi_slide3 .cajita ").css(' bottom', ' -80dvh');
     tweenanimchat2 = gsap.timeline();                
    tweenanimchat2
        .to("#telepi_slide3 .cajita", { duration: 0.5, opacity: 1, bottom: '-310px', ease: 'ease.in' }, 0.5)
        .to("#telepi_slide3 .cajita", { duration: 0.5, opacity: 1, bottom: '-180px', ease: 'ease.in' }, 2)
        .to("#telepi_slide3 .cajita", { duration: 0.5, opacity: 1, bottom: '-100px', ease: 'ease.in' }, 4)
        .to("#telepi_slide3 .cajita", { duration: 0.5, opacity: 1, bottom: '-10px', ease: 'ease.in' }, 6);
}*/
function animchat2() {
    $("#telepi_slide3 .cajita ").css(' bottom', ' -80dvh');
     tweenanimchat2 = gsap.timeline();                
    tweenanimchat2
        .to("#telepi_slide3 .cajita", { duration: 5, opacity: 1, bottom: '2dvh', ease: 'ease.in' }, 0.5)

}


function timerslide(tiempo) {
    
}

function escrietext(cualdi, velocidad) {
    const textElement = document.getElementById(cualdi);
    
    cualtexto=textElement.getAttribute("data-text");
 
    const targetText = ""+cualtexto;
 
    textElement.innerHTML = " ";
    gsap.set(textElement, { opacity: 1 });

    textyimeline = gsap.timeline();

    textyimeline.to(textElement, {
        duration: targetText.length * velocidad, 
        text: {value: targetText,},
        ease: "none",
        from: 'end'
    });
}
  


  
