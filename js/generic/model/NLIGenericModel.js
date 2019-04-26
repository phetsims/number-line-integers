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
  const PointController = require( 'NUMBER_LINE_INTEGERS/common/model/PointController' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const BOTTOM_BOX_WIDTH = 320;
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
  const INITIAL_POINT_COLOR = new Color( 'orange' );
  const NUMBER_LINE_RANGES = [
    new Range( -10, 10 ),
    new Range( -20, 20 ),
    new Range( -30, 30 ),
    new Range( -100, 100 )
  ];

  /**
   * @constructor
   */
  class NLIGenericModel {

    constructor() {

      // calculate the bounds in model space where the number line range will be displayed
      const numberLineModelBounds = NLIConstants.NLI_LAYOUT_BOUNDS.dilatedXY( -100, -100 );

      // @public (read-only){NumberLine} - the number line with which the user will interact
      this.numberLine = new NumberLine( numberLineModelBounds.center, {
        modelProjectionBounds: numberLineModelBounds,
        initialDisplayedRange: NUMBER_LINE_RANGES[ 0 ],
        initialPointSpecs: [ { initialValue: 1, color: INITIAL_POINT_COLOR } ]
      } );

      // @public (read-only) {Property<Bounds2>} - the bounds of the box where the point controllers reside when not
      // being used, changes its location when the orientation of the number line changes
      this.pointControllerBoxProperty = new Property( BOTTOM_BOX_BOUNDS );

      // @public (read-only) - an array of the point controllers available for manipulation by the user
      this.pointControllers = [
        new PointController( this.numberLine, { color: new Color( 'blue' ) } ),
        new PointController( this.numberLine, { color: new Color( 'magenta' ) } ),
        new PointController( this.numberLine, { color: INITIAL_POINT_COLOR } )
      ];

      // put the first two point controllers into the box at the bottom of the screen
      this.putPointControllerInBox( this.pointControllers[ 0 ] );
      this.putPointControllerInBox( this.pointControllers[ 1 ] );

      // the third point controller should be associated with the point already on the number line
      assert && assert( this.numberLine.residentPoints.length === 1, 'expected one and only one point on the number line' );
      this.pointControllers[ 2 ].associateWithNumberLinePoint( this.numberLine.residentPoints.get( 0 ) );

      // Set up the listeners that will place the point controllers back in their default positions when released over
      // the active point controller box.
      this.pointControllers.forEach( pointController => {
        pointController.draggingProperty.lazyLink( dragging => {
          if ( !dragging &&
               ( this.numberLine.isHorizontal() &&
                 BOTTOM_BOX_BOUNDS.containsPoint( pointController.positionProperty.value ) ) ||
               ( this.numberLine.isVertical() &&
                 SIDE_BOX_BOUNDS.containsPoint( pointController.positionProperty.value ) ) ) {
            this.putPointControllerInBox( pointController );
          }
        } );
      } );

      // add a listener to reposition the box and any points therein when the number line orientation changes
      this.numberLine.orientationProperty.link( orientation => {
        if ( orientation === NumberLineOrientation.HORIZONTAL ) {
          this.pointControllerBoxProperty.set( BOTTOM_BOX_BOUNDS );
          this.pointControllers.forEach( pointController => {
            if ( SIDE_BOX_BOUNDS.containsPoint( pointController.positionProperty.value ) &&
                 !pointController.draggingProperty.value ) {

              this.putPointControllerInBox( pointController );
            }
            else if ( this.numberLine.residentPoints.indexOf( pointController.numberLinePoint ) >= 0 ) {
              const pointPosition = this.numberLine.valueToModelPosition(
                pointController.numberLinePoint.valueProperty.value
              );
              pointController.setPositionRelativeToPoint( pointPosition );
            }
          } );
        }
        else {
          this.pointControllerBoxProperty.set( SIDE_BOX_BOUNDS );
          this.pointControllers.forEach( pointController => {
            if ( BOTTOM_BOX_BOUNDS.containsPoint( pointController.positionProperty.value ) &&
                 !pointController.draggingProperty.value ) {

              this.putPointControllerInBox( pointController );
            }
            else if ( this.numberLine.residentPoints.indexOf( pointController.numberLinePoint ) >= 0 ) {
              const pointPosition = this.numberLine.valueToModelPosition(
                pointController.numberLinePoint.valueProperty.value
              );
              pointController.setPositionRelativeToPoint( pointPosition );
            }
          } );
        }
      } );

      // Add a listener to handle any cases where a change to the number line's display range causes a point that was
      // already on the number line to be outside of the range.
      this.numberLine.displayedRangeProperty.link( displayedRange => {
        this.pointControllers.forEach( pointController => {
          if ( pointController.numberLinePoint &&
               !displayedRange.contains( pointController.numberLinePoint.valueProperty.value ) ) {

            // the point controlled by this controller is not out of the displayed range, so get rid of it
            this.numberLine.removePoint( pointController.numberLinePoint );
            pointController.clearNumberLinePoint();

            // put the controller away
            this.putPointControllerInBox( pointController );
          }
        } );
      } );
    }

    /**
     * place the provided point controller into the currently active box, generally done on init, reset, and when the
     * user "puts it away"
     * @param {PointController} pointController
     */
    putPointControllerInBox( pointController ) {

      const index = this.pointControllers.indexOf( pointController );
      const numPositions = this.pointControllers.length;

      // error checking
      assert && assert( index >= 0, 'point controller not found on list' );
      assert && assert(
        pointController.numberLinePoint === null,
        'point controller should not be put away while controlling a point'
      );

      // decide which box and at which position the point controller should be placed
      if ( this.numberLine.orientationProperty.value === NumberLineOrientation.HORIZONTAL ) {

        // put point in box at bottom of screen
        const spacing = BOTTOM_BOX_BOUNDS.width / numPositions;
        pointController.positionProperty.set( new Vector2(
          BOTTOM_BOX_BOUNDS.minX + spacing / 2 + spacing * index,
          BOTTOM_BOX_BOUNDS.centerY
        ) );
      }
      else {

        // put point in box at side of screen
        const spacing = SIDE_BOX_BOUNDS.height / numPositions;
        pointController.positionProperty.set( new Vector2(
          SIDE_BOX_BOUNDS.centerX,
          SIDE_BOX_BOUNDS.minY + spacing / 2 + spacing * index
        ) );
      }
    }

    // @public resets the model
    reset() {
      this.numberLine.reset();

      // clear any associations that the point controllers have with points on the number line
      this.pointControllers.forEach( function( pointController ) {
        pointController.clearNumberLinePoint();
      } );

      // put the first two point controllers in the box at the bottom of the screen
      this.putPointControllerInBox( this.pointControllers[ 0 ] );
      this.putPointControllerInBox( this.pointControllers[ 1 ] );

      // associate the third point controller with the point on the number line
      assert && assert( this.numberLine.residentPoints.length === 1, 'expected one and only one point on the number line' );
      this.pointControllers[ 2 ].associateWithNumberLinePoint( this.numberLine.residentPoints.get( 0 ) );
    }
  }

  // static properties
  NLIGenericModel.NUMBER_LINE_RANGES = NUMBER_LINE_RANGES;

  return numberLineIntegers.register( 'NLIGenericModel', NLIGenericModel );
} );