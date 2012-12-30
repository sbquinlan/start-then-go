var stg = require('start-then-go'),
    should = require('should'),
    mocha = require('mocha');

describe('stg', function() {
  describe('steps', function() {
    it('runs a single step', function (done) {
      stg.start(
        function (_, next) {
          next.should.not.throw();
          done();
        }
      ).go();
    });
    
    it('runs parallel steps', function (done) {
      stg.start(
        function (_, next) {
          setTimeout(function() { next({prop2 : 1234}); }, 1000);
        },
        function (_, next) {
          next({ prop1 : 123 });
        }
      ).then(
        function (prev, _) {
          prev.should.be.a('object')
            .and.have.property('prop1', 123);
          prev.should.have.property('prop2', 1234);
          done();
        }
      ).go();
    });
    
    it('throws overcompletion errors', function (done) {
      stg.start(
        function (_, next) {
          next({});
          next.should.throw('Overcompletion: be sure each step only calls next() once.');
          done();
        }
      ).go();
    });
  });
  
  describe('context', function() {
    it('saves a single property', function (done) {
      stg.start(
        function (_, next) {
          next({ prop : 123});
        }
      ).then(
        function (prev, _) {
          prev.should.be.a('object')
            .and.have.property('prop', 123);
          done();
        }
      ).go();
    });

    it('saves two properties', function (done) {
      stg.start(
        function (_, next) {
          next({prop1 : 123});
        },
        function (_, next) {
          next({prop2 : 1234});
        }
      ).then(
        function (prev, _) {
          prev.should.be.a('object')
            .and.have.property('prop1', 123);
          prev.should.have.property('prop2', 1234);
          done();
        }
      ).go();
    });

    it('overwrites duplicate properties', function (done) {
      stg.start(
        function (_, next) {
          next({ prop : 123 });
        },
        function (_, next) {
          next({ prop : 1234 });
        }
      ).then(
        function (prev, _) {
          prev.should.be.a('object')
            .and.have.property('prop', 1234);
          done();
        }
      ).go();
    });
  });
});