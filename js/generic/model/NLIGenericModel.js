// Copyright 2019, University of Colorado Boulder

/**
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const NumberLine = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLine' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineOrientation = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLineOrientation' );
  const PointController = require( 'NUMBER_LINE_INTEGERS/common/model/PointController' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const BOTTOM_BOX_WIDTH = 350;
  const BOTTOM_BOX_HEIGHT = 70;
  const SIDE_BOX_WIDTH = BOTTOM_BOX_HEIGHT;
  const SIDE_BOX_HEIGHT = BOTTOM_BOX_WIDTH;
  const INSET = 30;
  const BOTTOM_BOX_BOUNDS = new Bounds2(
    NLIConstants.NLI_BOUNDS.centerX - BOTTOM_BOX_WIDTH / 2,
    NLIConstants.NLI_BOUNDS.maxY - BOTTOM_BOX_HEIGHT - INSET,
    NLIConstants.NLI_BOUNDS.centerX + BOTTOM_BOX_WIDTH / 2,
    NLIConstants.NLI_BOUNDS.maxY - INSET
  );
  const SIDE_BOX_BOUNDS = new Bounds2(
    NLIConstants.NLI_BOUNDS.minX + INSET,
    NLIConstants.NLI_BOUNDS.centerY - SIDE_BOX_HEIGHT / 2,
    NLIConstants.NLI_BOUNDS.minX + INSET + SIDE_BOX_WIDTH,
    NLIConstants.NLI_BOUNDS.centerY + SIDE_BOX_HEIGHT / 2
  );

  /**
   * @constructor
   */
  class NLIGenericModel {

    constructor() {

      // TODO: The model itself shouldn't be changed, but it has a lot of settable properties.  Is (read-only) correct?  Or what?
      // @public {NumberLine} - the number line with which the user will interact
      this.numberLine = new NumberLine( NLIConstants.NLI_BOUNDS.center );

      // @public (read-only) {Bounds2} - the bounds of the box where the point controllers reside when not being used
      this.pointControllerBoxProperty = new Property( BOTTOM_BOX_BOUNDS );
      this.numberLine.orientationProperty.link( orientation => {
        this.pointControllerBoxProperty.value = orientation === NumberLineOrientation.HORIZONTAL ?
                                                BOTTOM_BOX_BOUNDS : SIDE_BOX_BOUNDS;
      } );

      // @public (read-only) - an array of the point controllers available for manipulation by the user
      this.pointControllers = [
        new PointController( new Vector2(
          this.pointControllerBoxProperty.value.centerX - this.pointControllerBoxProperty.value.width / 3,
          this.pointControllerBoxProperty.value.centerY
        ) ),
        new PointController( new Vector2(
          this.pointControllerBoxProperty.value.centerX,
          this.pointControllerBoxProperty.value.centerY
        ) ),
        new PointController( new Vector2(
          this.pointControllerBoxProperty.value.centerX + this.pointControllerBoxProperty.value.width / 3,
          this.pointControllerBoxProperty.value.centerY
        ) )
      ];

      // for each point controller, watch for it to be released over the point controller box and return to origin
      this.pointControllers.forEach( pointController => {
        pointController.draggingProperty.lazyLink( dragging => {
          if ( !dragging && this.pointControllerBoxProperty.value.containsPoint( pointController.positionProperty.value ) ) {
            pointController.positionProperty.reset();
          }
        } );
      } );
    }

    // @public resets the model
    reset() {
      this.pointControllers.forEach( pointController => { pointController.reset(); } );
      this.numberLine.reset();
    }

    // @public
    step( dt ) {
      //TODO Handle model animation here.
    }
  }

  return numberLineIntegers.register( 'NLIGenericModel', NLIGenericModel );
} );