$(document).ready(function () {
    // Objets de stockage des états des différents éléments (Si les elements sont dans un état true ou false)
    var states = {
        yeux_endormi: false,
        yeux_neutre: false,
        yeux_joyeux_paumettes: false,
        yeux_detection_01: false,
        yeux_detection_02: false,
        yeux_detection_03: false,
        yeux_espiegle: false,
        yeux_bank: false,
        yeux_validation: false,
        yeux_code_mauvais: false,
        btn_clavier: false,
        clavier: false,
        clavier_code: false,
        code: false,
        num: false,
        textDisplay: false,
        menu_arrow: false
    };

    var idleTimeout;

    // Sounds
    const bank_sound = document.getElementById("bank-sound");
    const validation_sound = document.getElementById("validation-sound");
    const cross_sound = document.getElementById("cross-sound");

    // Autoplay on IOS
    bank_sound.autoplay = true;
    validation_sound.autoplay = true;
    cross_sound.autoplay = true

    // Précharger les sons
    var sounds = [bank_sound, validation_sound, cross_sound];
    sounds.forEach(function (sound) {
        sound.load();
    });

    var playCount = 0;

    // Ajouter un gestionnaire d'événement pour jouer le son bank_sound deux fois
    bank_sound.addEventListener('ended', function () {
        playCount++;
        if (playCount < 2) {
            bank_sound.play();
        }
    });

    //Code
    var correctCode = "2012";
    var enteredCode = "";

    //Delai entre les ecrans
    var timeoutBankSound;
    var timeoutValidationState;
    var timeoutShowEspiegleState;
    var timeoutShowBankState;

    //Animation clavier code pour carte inserée
    var clavierAnimationExecuted = false;

    function hideEyes() {
        // Fonction pour masquer tous les éléments (on recupere tout les elements d'au dessus et on les met en "false")
        for (let state in states) {
            states[state] = false;
        }
    }

    function updateEyes() {
        // Fonction pour mettre à jour l'affichage des éléments en fonction de leurs états (On verifie sils sont true ou false et on les display ou pas (toggle))
        $.each(states, function (key, value) {
            if (key.includes("yeux")) {
                if (value) {
                    $(`#${key}`).fadeIn();
                } else {
                    $(`#${key}`).fadeOut();
                }
            }
        });
        $("#code").css("display", states.code ? "flex" : "none");
        $("#numDiv").css("display", states.num ? "flex" : "none");
        $("#clavier_code").css("display", states.clavier_code ? "grid" : "none");
        $("#button_clavier").css("display", states.btn_clavier ? "block" : "none");
        $("#clavier").css("display", states.clavier ? "grid" : "none");

        //Reinitailise le idleTimeout
        clearTimeout(idleTimeout);
    }

    function showMenu() {
        // Fonction pour afficher le menu
        $("#menu-container").show();
        $("#menu_arrow").off("click").on("click", function () {
            $("#menu").slideDown();
            $("#menu_arrow").css("visibility", "hidden");
        });
        $("#menu-close").off("click").on("click", function () {
            $("#menu").slideUp();
            $("#menu_arrow").css("visibility", "visible");
        });
        $("#button-end-container").off("click").on("click", function () {
            setTimeout(end, 750);
            $("#menu").slideUp();
        });
    }

    function hideMenu() {
        $("#menu-container").hide();
        $("#menu").hide();
        $("#menu_arrow").css("visibility", "visible");
        $("#menu_arrow").show();
    }

    $("#menu_cancel").on("click", function () {
        end(); // Exécute la fonction end()
    });

    function veille() {
        // Fonction pour l'état de veille
        // On met en true les yeux endormi et la fleche du menu
        hideEyes();
        states.yeux_endormi = true;
        states.menu_arrow = true;
        updateEyes();
        showMenu();

        // Ajouter un gestionnaire de clic global pour passer à l'état neutre
        $(document).off("click").on("click", function () {
            $(document).off("click"); // Désactiver ce gestionnaire après un clic
            neutre();
        });
    }

    function neutre() {
        hideEyes();
        states.menu_arrow = true;
        showMenu();
        states.yeux_neutre = true;
        states.btn_clavier = true;
        updateEyes();
        $("#button_clavier").off("click").on("click", rentreePrix);

        // Réinitialiser le timeout à chaque appel de la fonction neutre
        idleTimeout = setTimeout(veille, 10000); // 10 secondes d'inactivité
    }

    function rentreePrix() {
        hideEyes();
        states.yeux_joyeux_paumettes = true;
        states.num = true;
        states.clavier = true;
        states.menu_arrow = true;
        updateEyes();
        showMenu();
        $(".numAndCode").css("justify-content", "end");
        setUpClavierEvents();
    }

    function setUpClavierEvents() {
        // Fonction pour configurer les événements des boutons du clavier (ex: si on clique sur clavier_one, on displayprix(1))
        $(".clavier_one").off("click").on("click", function () {
            displayPrix(1);
        });
        $(".clavier_two").off("click").on("click", function () {
            displayPrix(2);
        });
        $(".clavier_three").off("click").on("click", function () {
            displayPrix(3);
        });
        $(".clavier_four").off("click").on("click", function () {
            displayPrix(4);
        });
        $(".clavier_five").off("click").on("click", function () {
            displayPrix(5);
        });
        $(".clavier_six").off("click").on("click", function () {
            displayPrix(6);
        });
        $(".clavier_seven").off("click").on("click", function () {
            displayPrix(7);
        });
        $(".clavier_eight").off("click").on("click", function () {
            displayPrix(8);
        });
        $(".clavier_nine").off("click").on("click", function () {
            displayPrix(9);
        });
        $(".clavier_zero").off("click").on("click", function () {
            displayPrix(0);
        });
        $(".clavier_X").off("click").on("click", function () {
            $("#num").text('00.00');
            cross_sound.pause();
            cross_sound.currentTime = 0;
            cross_sound.play();
        });
        $(".clavier_check").off("click").on("click", myFunctionValidate);
    }

    function displayPrix(num) {
        // Ici on affiche le prix par rapport à au dessus
        var numInput = $("#num");
        var numeroRentre = num / 100;
        var numeroText = parseFloat(numInput.text()) * 10 + numeroRentre;
        numInput.text(numeroText.toFixed(2));
    }

    function myFunctionValidate() {
        // Fonction pour valider le prix et afficher les yeux de détection
        hideEyes();
        hideMenu();
        states.yeux_detection_01 = true;
        states.yeux_detection_02 = true;
        states.yeux_detection_03 = true;
        states.num = true;
        $("#menu_cancel").show();
        updateEyes();
        $(".numAndCode").css("justify-content", "center");
        $("#clavier").hide();
        setTimeout(showEspiegleState, 3500);
        setUpCodeEvents();
    }

    function showEspiegleState() {
        hideEyes();
        hideMenu();
        states.textDisplay = false;
        textDisplay.innerText = "";
        states.yeux_espiegle = true;
        states.clavier_code = true;
        states.code = true;
        states.num = true;
        $("#menu_cancel").show();
        updateEyes();
        $(".numAndCode").css("justify-content", "space-between");

        if (!clavierAnimationExecuted) { // Vérifie si l'animation n'a pas déjà été exécutée
            clavierAnimationExecuted = true; // Marque l'animation comme exécutée pour ne pas la répéter

            // Animation pour afficher le clavier_code de bas en haut
            $("#clavier_code").css({
                display: "grid", // Afficher l'élément initialement
                position: "relative",
                top: "100%" // Positionner en bas de l'écran
            }).animate({
                top: 0 // Animer la montée vers le haut
            }, {
                duration: 500, // Durée de l'animation en millisecondes
                step: function (now, fx) {
                    // Fonction de rappel à chaque étape de l'animation
                    // Masquer l'élément pendant la première moitié de l'animation
                    if (fx.pos < 0.8) {
                        $(this).css("opacity", 0);
                    } else {
                        // Afficher l'élément pendant la deuxième moitié de l'animation
                        $(this).css("opacity", 1);
                    }
                }
            });
        }
    }

    function setUpCodeEvents() {
        // Fonction pour configurer les événements des boutons du code (comme au dessus mais cette fois si c'est de *)
        $(".code_one").off("click").on("click", function () {
            updateCode(1)
        });
        $(".code_two").off("click").on("click", function () {
            updateCode(2)
        });
        $(".code_three").off("click").on("click", function () {
            updateCode(3)
        });
        $(".code_four").off("click").on("click", function () {
            updateCode(4)
        });
        $(".code_five").off("click").on("click", function () {
            updateCode(5)
        });
        $(".code_six").off("click").on("click", function () {
            updateCode(6)
        });
        $(".code_seven").off("click").on("click", function () {
            updateCode(7)
        });
        $(".code_eight").off("click").on("click", function () {
            updateCode(8)
        });
        $(".code_nine").off("click").on("click", function () {
            updateCode(9)
        });
        $(".code_zero").off("click").on("click", function () {
            updateCode(0)
        });
        $(".code_X").off("click").on("click", function () {
            $("#code").text('');
            enteredCode = "";
            cross_sound.pause();
            cross_sound.currentTime = 0;
            cross_sound.play();
        });
        $(".code_check").off("click").on("click", function () {
            if (enteredCode === correctCode && document.getElementById("code").innerText.length == 4) {
                myFunctionValidateCode();
            } else if (document.getElementById("code").innerText.length == 4) {
                console.log("error");
                wrongCode();
            }
        });
    }

    function updateCode(digit) {
        if (enteredCode.length < 4) { // Limiter à 4 caractères
            enteredCode += digit;
            $("#code").text(enteredCode.replace(/./g, "*")); // Affiche des étoiles pour chaque chiffre entré
        }
        console.log(enteredCode)
    }

    function myFunctionValidateCode() {
        hideEyes();
        hideMenu();
        states.textDisplay = true;
        textDisplay.innerText = "Le code est bon !";
        states.yeux_joyeux_paumettes = true;
        $("#menu_cancel").show();
        updateEyes();
        timeoutShowBankState = setTimeout(showBankState, 2000);
    }

    function wrongCode() {
        hideEyes();
        hideMenu();
        states.textDisplay = true;
        textDisplay.innerText = "Mauvais code !";
        states.yeux_code_mauvais = true;

        enteredCode = ""; // Réinitialiser le code saisi
        $("#code").text(''); // Effacer le contenu affiché du code

        updateEyes();
        setTimeout(showEspiegleState, 2000);

        //Réinitialiser le GIF Yeux_Espiegle
        $("#yeux_espiegle").attr("src", $("#yeux_espiegle").attr("src"));
    }

    function showBankState() {
        hideEyes();
        hideMenu();
        states.yeux_bank = true;
        states.textDisplay = true;
        textDisplay.innerText = "J'interroge la banque...";

        $("#menu_cancel").show();
        updateEyes();
        playCount = 0; // Réinitialiser le compteur de lecture
        bank_sound.play(); // Démarrer la lecture du son
        timeoutValidationState = setTimeout(showValidationState, 3000);
    }

    function showValidationState() {
        hideEyes();
        hideMenu();
        states.yeux_validation = true;
        states.textDisplay = true;
        textDisplay.innerText = "Paiement validé !";

        bank_sound.pause();
        bank_sound.currentTime = 0;

        $("#menu_cancel").hide();
        updateEyes();
        timeoutValidationState = setTimeout(() => {
            validation_sound.play()
        }, 800);
        timeoutShowEspiegleState = setTimeout(end, 4000);
    }

    // Fonction de fin pour réinitialiser les éléments et retourner à l'état neutre
    function end() {
        hideMenu();
        $("#num").text('00.00');
        $("#menu_cancel").hide();
        $("#code").text('');
        textDisplay.innerText = "";

        bank_sound.pause();
        bank_sound.currentTime = 0;

        validation_sound.pause();
        validation_sound.currentTime = 0;

        cross_sound.pause();
        cross_sound.currentTime = 0;

        enteredCode = ""; // Réinitialiser le code saisi
        $("#code").text(''); // Effacer le contenu affiché du code

        // Clear all timeouts
        clearTimeout(timeoutBankSound);
        clearTimeout(timeoutValidationState);
        clearTimeout(timeoutShowEspiegleState);
        clearTimeout(timeoutShowBankState);

        // Réinitialiser l'animation du clavier de code
        clavierAnimationExecuted = false;

        //Réinitialiser le GIF Yeux_Espiegle
        $("#yeux_espiegle").attr("src", $("#yeux_espiegle").attr("src"));
        $("#yeux_validation").attr("src", $("#yeux_validation").attr("src"));

        neutre();
    }

    // Initialisation de l'état de veille au chargement de la page (C'est la que tout commence)
    veille();
});