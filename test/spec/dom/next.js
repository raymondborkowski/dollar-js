(function () {
    describe('next', function () {
        describe('when passed params', function () {
            // jQuery doesn't support nodes & instances, but we should since most other jQuery functions do
            sharedExpectations.compareCollectionForFn('next', ['', 'string' /* , 'node', 'dollar' */]);
        });
    });
})();