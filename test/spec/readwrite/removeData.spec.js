(function () {

    describe(".removeData", function () {

        describe("remove element data", function () {

            // fails in node/jsdom -- dataset does not exist
            xit("pre-existing data from the DOM", function () {
                $('#data_daddy').removeData('howBad');
                expect($('#data_daddy').data()).toEqual({});
            });

            it("set by dollar", function () {
                $('#data_daddy').data('rides', ['harley','tbird']);
                $('#data_daddy').removeData('rides');
                expect($('#data_daddy').data('rides')).toBe(void 0);
            });

            it("all data at once", function () {
                $('#data_daddy span').data('face', 'scruff');
                $('#data_daddy span').data('voice', 'gruff');
                $('#data_daddy span').removeData();
                expect($('#data_daddy span').data()).toEqual({});
            });

            it("does not remove the wrong data", function () {
                $('#data_daddy').data('sick', 'shades');
                $('#data_daddy').removeData('yomomma');
                expect($('#data_daddy').data()).toEqual({
                    howBad: 'to the bone',
                    sick: 'shades'
                });
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance (when setting)", function () {
                expect($('#data_daddy').removeData('foo').isDollar).toBe(true);
            });
        });

    });

})();
