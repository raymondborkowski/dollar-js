(function () {

    describe(".removeAttr", function () {

        describe("removes one attribute", function () {

            it("removes the specified attribute", function () {
                $('#image').removeAttr('alt');
                expect($('#image').attr('alt')).toBe(void 0);
            });

            it("does not affect other attributes", function () {
                $('#image').removeAttr('alt');
                expect($('#image').attr('title')).not.toBe(void 0);
            });

            it("handles when an attribute does not exist", function () {
                expect($('#image').attr('nonsense')).toBe(void 0);
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function () {
                expect($('#image').removeAttr('foo').isDollar).toBe(true);
            });
        });

    });

})();
