(function () {

    describe(".width", function () {

        describe("returns the computed width of the first matched element", function () {

            it("returns the correct numerical width without units", function (expect) {
                jQuery('.mutate').css({ width: '333px' });
                expect($('.mutate').width()).toBe(333);
            });

        });

    });

})();
