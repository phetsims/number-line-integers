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
  const PointController = require( 'NUMBER_LINE_INTEGERS/common/model/PointController' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const POINT_CONTROLLER_BOX_WIDTH = 350;
  const POINT_CONTROLLER_BOX_HEIGHT = 70;
  const INSET = 30;

  /**
   * @constructor
   */
  class NLIGenericModel {

    constructor() {

      // @public (read-only) {Bounds2} - the bounds of the box where the point controllers reside when not being used
      this.pointControllerBox = new Bounds2(
        NLIConstants.NLI_BOUNDS.centerX - POINT_CONTROLLER_BOX_WIDTH / 2,
        NLIConstants.NLI_BOUNDS.maxY - POINT_CONTROLLER_BOX_HEIGHT - INSET,
        NLIConstants.NLI_BOUNDS.centerX + POINT_CONTROLLER_BOX_WIDTH / 2,
        NLIConstants.NLI_BOUNDS.maxY - INSET
      );

      // @public (read-only) - an array of the point controllers available for manipulation by the user
      this.pointControllers = [
        new PointController( new Vector2(
          this.pointControllerBox.centerX - this.pointControllerBox.width / 3,
          this.pointControllerBox.centerY
        ) ),
        new PointController( new Vector2(
          this.pointControllerBox.centerX,
          this.pointControllerBox.centerY
        ) ),
        new PointController( new Vector2(
          this.pointControllerBox.centerX + this.pointControllerBox.width / 3,
          this.pointControllerBox.centerY
        ) )
      ];
    }

    // @public resets the model
    reset() {
      this.pointControllers.forEach( pointController => { pointController.reset(); } );
    }

    // @public
    step( dt ) {
      //TODO Handle model animation here.
    }
  }

  return numberLineIntegers.register( 'NLIGenericModel', NLIGenericModel );
} );