(function () {

    describe(".clone", function () {

        describe("creates copies of elements", function () {

            it("clones each in collection", function () {
                $('#mutate').append($('.mutate').clone());
                expect(jQuery('.mutate').length).toBe(6);
            });

            it("does not alter the element being cloned", function () {
                var m = document.getElementsByClassName('mutate')[0];
                $('.mutate').clone().html('newStuff');
                expect(m.innerHTML).not.toBe('newStuff');
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function () {
                expect($('#mutate').clone().isDollar).toBe(true);
            });
        });

    });

})();
