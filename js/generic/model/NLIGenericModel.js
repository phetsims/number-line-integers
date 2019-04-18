// Copyright 2019, University of Colorado Boulder

/**
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Color = require( 'SCENERY/util/Color' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const NumberLine = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLine' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineOrientation = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLineOrientation' );
  const NumberLinePoint = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLinePoint' );
  const PointController = require( 'NUMBER_LINE_INTEGERS/common/model/PointController' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const POINT_CREATION_DISTANCE = 60; // distance from number line in model/view coords where points get created
  const BOTTOM_BOX_WIDTH = 350;
  const BOTTOM_BOX_HEIGHT = 70;
  const SIDE_BOX_WIDTH = BOTTOM_BOX_HEIGHT;
  const SIDE_BOX_HEIGHT = BOTTOM_BOX_WIDTH;
  const INSET = 30;
  const BOTTOM_BOX_BOUNDS = new Bounds2(
    NLIConstants.NLI_LAYOUT_BOUNDS.centerX - BOTTOM_BOX_WIDTH / 2,
    NLIConstants.NLI_LAYOUT_BOUNDS.maxY - BOTTOM_BOX_HEIGHT - INSET,
    NLIConstants.NLI_LAYOUT_BOUNDS.centerX + BOTTOM_BOX_WIDTH / 2,
    NLIConstants.NLI_LAYOUT_BOUNDS.maxY - INSET
  );
  const SIDE_BOX_BOUNDS = new Bounds2(
    NLIConstants.NLI_LAYOUT_BOUNDS.minX + INSET,
    NLIConstants.NLI_LAYOUT_BOUNDS.centerY - SIDE_BOX_HEIGHT / 2,
    NLIConstants.NLI_LAYOUT_BOUNDS.minX + INSET + SIDE_BOX_WIDTH,
    NLIConstants.NLI_LAYOUT_BOUNDS.centerY + SIDE_BOX_HEIGHT / 2
  );

  /**
   * @constructor
   */
  class NLIGenericModel {

    constructor() {

      // calculate the bounds in model space where the number line range will be displayed
      const numberLineModelBounds = NLIConstants.NLI_LAYOUT_BOUNDS.dilatedXY( -100, -100 );

      // @public (read-only){NumberLine} - the number line with which the user will interact
      this.numberLine = new NumberLine( numberLineModelBounds.center, {
        modelProjectionBounds: numberLineModelBounds
      } );

      // @public (read-only) {Property<Bounds2>} - the bounds of the box where the point controllers reside when not
      // being used, changes its location when the orientation of the number line changes
      this.pointControllerBoxProperty = new Property( BOTTOM_BOX_BOUNDS );

      // @public (read-only) - an array of the point controllers available for manipulation by the user
      this.pointControllers = [
        new PointController(
          new Vector2( BOTTOM_BOX_BOUNDS.centerX - BOTTOM_BOX_BOUNDS.width / 3, BOTTOM_BOX_BOUNDS.centerY ),
          this.numberLine, {
            alternativeHome: new Vector2( SIDE_BOX_BOUNDS.centerX, SIDE_BOX_BOUNDS.centerY - SIDE_BOX_BOUNDS.height / 3 ),
            color: new Color( 'blue' )
          }
        ),
        new PointController(
          new Vector2( BOTTOM_BOX_BOUNDS.centerX, BOTTOM_BOX_BOUNDS.centerY ),
          this.numberLine, {
            alternativeHome: new Vector2( SIDE_BOX_BOUNDS.centerX, SIDE_BOX_BOUNDS.centerY ),
            color: new Color( 'magenta' )
          }
        ),
        new PointController(
          new Vector2( BOTTOM_BOX_BOUNDS.centerX + BOTTOM_BOX_BOUNDS.width / 3, BOTTOM_BOX_BOUNDS.centerY ),
          this.numberLine, {
            alternativeHome: new Vector2( SIDE_BOX_BOUNDS.centerX, SIDE_BOX_BOUNDS.centerY + SIDE_BOX_BOUNDS.height / 3 ),
            color: new Color( 'orange' )
          }
        )
      ];

      // set up the listeners for each point controller
      this.pointControllers.forEach( pointController => {

        // watch for the point controller be released over the point controller box and return it to the holding cell
        pointController.draggingProperty.lazyLink( dragging => {
          if ( !dragging ) {
            if ( this.numberLine.orientationProperty.value === NumberLineOrientation.HORIZONTAL &&
                 BOTTOM_BOX_BOUNDS.containsPoint( pointController.positionProperty.value ) ) {

              pointController.positionProperty.reset();
            }
            else if ( this.numberLine.orientationProperty.value === NumberLineOrientation.VERTICAL &&
                      SIDE_BOX_BOUNDS.containsPoint( pointController.positionProperty.value ) ) {

              pointController.goToAlternativeHome();
            }
          }
        } );

        // monitor each point controller for proximity to the number line and add/remove number line points accordingly
        pointController.positionProperty.link( position => {
          const numberLineValue = this.numberLine.modelPositionToValue( position );
          if ( this.numberLine.orientationProperty.value === NumberLineOrientation.HORIZONTAL ) {

            if ( pointController.numberLinePoint === null ) {

              // check if a point should be created and added
              if ( Math.abs( position.y - this.numberLine.centerPosition.y ) <= POINT_CREATION_DISTANCE &&
                   this.numberLine.displayedRangeProperty.value.contains( numberLineValue )
              ) {
                const numberLinePoint = new NumberLinePoint( numberLineValue, pointController.color, pointController );
                this.numberLine.addPoint( numberLinePoint );
                pointController.associateWithNumberLinePoint( numberLinePoint );
              }
            }
            else {

              // check if the point should be removed
              if ( Math.abs( position.y - this.numberLine.centerPosition.y ) > POINT_CREATION_DISTANCE ||
                   !this.numberLine.displayedRangeProperty.value.contains( numberLineValue ) ) {
                this.numberLine.removePoint( pointController.numberLinePoint );
                pointController.clearNumberLinePoint();
              }
            }
          }
          else {
            if ( pointController.numberLinePoint === null ) {

              // check if a point should be created and added
              if ( Math.abs( position.x - this.numberLine.centerPosition.x ) <= POINT_CREATION_DISTANCE &&
                   this.numberLine.displayedRangeProperty.value.contains( numberLineValue )
              ) {
                const numberLinePoint = new NumberLinePoint( numberLineValue, pointController.color, pointController );
                this.numberLine.addPoint( numberLinePoint );
                pointController.associateWithNumberLinePoint( numberLinePoint );
              }
            }
            else {

              // check if the point should be removed
              if ( Math.abs( position.x - this.numberLine.centerPosition.x ) > POINT_CREATION_DISTANCE ||
                   !this.numberLine.displayedRangeProperty.value.contains( numberLineValue ) ) {
                this.numberLine.removePoint( pointController.numberLinePoint );
                pointController.clearNumberLinePoint();
              }
            }
          }
        } );
      } );

      // reposition the box and any points therein when the number line orientation changes
      this.numberLine.orientationProperty.link( orientation => {
        if ( orientation === NumberLineOrientation.HORIZONTAL ) {
          this.pointControllerBoxProperty.set( BOTTOM_BOX_BOUNDS );
          this.pointControllers.forEach( pointController => {
            if ( SIDE_BOX_BOUNDS.containsPoint( pointController.positionProperty.value ) &&
                 !pointController.draggingProperty.value ) {

              pointController.positionProperty.reset();
            }
          } );
        }
        else {
          this.pointControllerBoxProperty.set( SIDE_BOX_BOUNDS );
          this.pointControllers.forEach( pointController => {
            if ( BOTTOM_BOX_BOUNDS.containsPoint( pointController.positionProperty.value ) &&
                 !pointController.draggingProperty.value ) {

              pointController.goToAlternativeHome();
            }
          } );
        }
      } );
    }

    // @public resets the model
    reset() {
      this.pointControllers.forEach( pointController => { pointController.reset(); } );
      this.numberLine.reset();
    }
  }

  return numberLineIntegers.register( 'NLIGenericModel', NLIGenericModel );
} );