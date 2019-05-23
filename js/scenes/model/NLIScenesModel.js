// Copyright 2019, University of Colorado Boulder

/**
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const NLIScene = require( 'NUMBER_LINE_INTEGERS/scenes/model/NLIScene' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Property = require( 'AXON/Property' );

  /**
   * @constructor
   */
  class NLIScenesModel {

    constructor() {

      // @public {Property<NLIScene>} - currently selected scene
      this.selectedSceneProperty = new Property( NLIScene.ELEVATION );
    }

    // @public resets the model
    reset() {
      this.selectedSceneProperty.reset();
    }

    // @public
    step( dt ) {
      //TODO Handle model animation here.
    }
  }

  return numberLineIntegers.register( 'NLIScenesModel', NLIScenesModel );
} );