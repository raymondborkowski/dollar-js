(function () {

    describe(".removeProp", function () {

        describe("removes one property", function () {

            it("removes the specified property", function () {
                $('#cbox').prop('flash', 'thunder').removeProp('flash');
                expect($('#cbox').prop('flash')).toBe(void 0);
            });

            it("does not affect other properties", function () {
                $('#cbox').removeProp('flash');
                expect($('#cbox').prop('value')).not.toBe(void 0);
            });

            it("handles when an property does not exist", function () {
                $('#cbox').prop('flash', 'thunder');
                expect($('#cbox').prop('nonsense')).toBe(void 0);
                expect($('#cbox').prop('flash')).toBe('thunder');
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function () {
                expect($('#cbox').removeProp('foo').isDollar).toBe(true);
            });
        });

    });

})();
