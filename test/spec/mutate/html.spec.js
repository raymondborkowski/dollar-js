(function () {

    describe(".html", function () {

        describe("handles all types of contents", function () {

            it("gets current contents when no arguments", function () {
                var cur = document.getElementById('mutate').innerHTML;
                expect($('#mutate').html()).toBe(cur);
            });

            it("clears current contents when passed empty string", function () {
                $('#mutate').html('');
                expect(document.getElementById('mutate').innerHTML).toBe('');
            });

            it("handles function as contents", function () {
                $('.mutate').html(function () {
                    return '<div class="newAppend"></div>';
                });
                expect(jQuery('.newAppend').length).toBe(3);
            });

        });

        describe("inserts new html content", function () {

            it("replaces existing content with new", function () {
                $('.mutate').html('<span class="newAppend">');
                expect(jQuery('.newAppend').length).toBe(3);
                expect(jQuery('span', '#mutate').length).toBe(3);
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function () {
                expect($('.wonka').html('foo').isDollar).toBe(true);
            });
        });

    });

})();
