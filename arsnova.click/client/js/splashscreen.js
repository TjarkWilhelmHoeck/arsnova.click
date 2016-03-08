Template.splashscreen.rendered = function () {
    var splashscreen = $('.js-splashscreen');

    if (templateParams.lazyClose) {
        splashscreen.on('click', function () {
            closeSplashscreen();
        });
    } else {
        splashscreen.modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    if (templateParams.timerClose) {
        if (isNaN(templateParams.timerClose)) {
            templateParams.timerClose = 5000;
        }
        setTimeout(function () {
            if (splashscreen.css('display') === 'block') {
                closeSplashscreen();
            }
        }, templateParams.timerClose);
    }

    splashscreen.modal('show');
    /*var wpwSessionData = {
        questionText: "I'm a question text. This is for testing purpose. Do you understand?",
        timer: 1800000,
        isReadingConfirmationRequired: 0
    };
    var testingSessionData = {
        questionText: "Do you like this course?",
        timer: 8000000,
        isReadingConfirmationRequired: 0
    };
    localStorage.setItem("wpw", JSON.stringify(wpwSessionData));
    localStorage.setItem("testing", JSON.stringify(testingSessionData));*/
};

Template.splashscreen.helpers({
    loadingTemplate: function () {
        templateParams = this;
        return {template: Template[this.templateName]};
    }
});

closeSplashscreen = function () {
    $('.js-splashscreen').modal("hide");
};

closeAndRedirectTo = function(url) {
    $('.js-splashscreen').on('hidden.bs.modal', function() {
        Router.go(url);
    }).modal('hide');
}