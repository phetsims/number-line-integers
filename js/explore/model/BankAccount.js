// Copyright 2019, University of Colorado Boulder

/**
 * model of a bank account
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Emitter = require( 'AXON/Emitter' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const NumberProperty = require( 'AXON/NumberProperty' );

  class BankAccount {

    /**
     * @param {number} [initialBalance]
     * @public
     */
    constructor( initialBalance = 0 ) {

      // @public
      this.balanceProperty = new NumberProperty( initialBalance );

      // @public - An emitter that should be triggered to signal that the balance was changed due to interaction with
      // the add/remove buttons rather than by dragging, reset, or other means.  The value should be +1 for an increase
      // and -1 for a decrease.
      this.balanceChangedByButtonEmitter = new Emitter( {
        parameters: [ { phetioType: NumberIO, name: 'balanceChange' } ]
      } );

      // @public (read-only) {Number|null} - previous balance, null if there is none
      this.previousBalance = null;

      this.balanceProperty.lazyLink( ( newBalance, oldBalance ) => {
        this.previousBalance = oldBalance;
      } );
    }

    /**
     * restore initial state
     * @public
     */
    reset() {
      this.balanceProperty.reset();
    }
  }

  return numberLineIntegers.register( 'BankAccount', BankAccount );
} );
