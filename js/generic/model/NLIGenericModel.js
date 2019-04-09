// Copyright 2019, University of Colorado Boulder

/**
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );

  // constants
  const POINT_CONTROLLER_BOX_WIDTH = 350;
  const POINT_CONTROLLER_BOX_HEIGHT = 70;
  const INSET = 30;

  /**
   * @constructor
   */
  class NLIGenericModel {

    constructor() {

      // @public (read-only) {Bounds2} - the bounds of the point controller box
      this.pointControllerBox = new Bounds2(
        NLIConstants.NLI_BOUNDS.centerX - POINT_CONTROLLER_BOX_WIDTH / 2,
        NLIConstants.NLI_BOUNDS.maxY - POINT_CONTROLLER_BOX_HEIGHT - INSET,
        NLIConstants.NLI_BOUNDS.centerX + POINT_CONTROLLER_BOX_WIDTH / 2,
        NLIConstants.NLI_BOUNDS.maxY - INSET
      );
    }

    // @public resets the model
    reset() {
      //TODO Reset things here.
    }

    // @public
    step( dt ) {
      //TODO Handle model animation here.
    }
  }

  return numberLineIntegers.register( 'NLIGenericModel', NLIGenericModel );
} );