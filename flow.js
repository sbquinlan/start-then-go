/////// FLOW STEP ////////
/**
 * Each function in a step takes two arguments:
 * - prev an object containing context from a previous step
 * - next a function to pass context for the next step
 *
 * @param funcs is an array of said functions
 */
function flow_step(funcs) {
  this._funcs = funcs;
  this._nextStep = { run: function() {} };
  
  this._nextContext = {};
  this._completed = 0;
}

flow_step.prototype._onCompletion = function (context) {
  this._buildNextContext(context);
  
  if (++this._completed >= this._funcs.length) {
    this._nextStep.run(this._nextContext);
    this._nextStep = { 
      run: function() { 
        throw new Error('Overcompletion: be sure each step only calls next() once.');
      }
    };
  }
}

flow_step.prototype._buildNextContext = function (context) {
  for(var prop in context) {
    this._nextContext[prop] = context[prop];
  }
}

/**
 * Sets the next step
 */
flow_step.prototype.setNextStep = function (next_step) {
  this._nextStep = next_step;
}

/**
 * Runs this step
 */
flow_step.prototype.run = function(prev) {
  for (var i = 0; i < this._funcs.length; i++) {
    this._funcs[i](prev, this._onCompletion.bind(this));
  }
}

/////// FLOW CONTROL ////////
/**
 * Contains a bunch of steps and connects them.
 */
function flow_control() {
  this._steps = [];
}

flow_control.prototype.then = function() {
  var step = new flow_step(Array.prototype.slice.call(arguments));
  
  if (this._steps.length)
    this._steps[this._steps.length-1].setNextStep(step);
    
  this._steps.push(step);
  return this;
}

flow_control.prototype.go = function() {
  this._steps[0].run({});
}

module.exports = {
  start : function() {
    var control = new flow_control();
    control.then.apply(control, arguments);
    return control;
  }
}