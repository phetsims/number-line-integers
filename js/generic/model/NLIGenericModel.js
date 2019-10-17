// Copyright 2019, University of Colorado Boulder

/**
 * main model for the "generic" screen
 *
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
  const NL_Y_OFFSET = 30; // offset of the number line from the center of the bounds, empirically determined
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
  const INITIAL_POINT_COLOR = new Color( '#F7931E' );
  const NUMBER_LINE_RANGES = [
    new Range( -10, 10 ),
    new Range( -30, 30 ),
    new Range( -100, 100 )
  ];

  /**
   * @constructor
   */
  class NLIGenericModel {

    constructor() {

      // @public (read-only){NumberLine} - the number line with which the user will interact
      this.numberLine = new NumberLine( NLIConstants.NLI_LAYOUT_BOUNDS.center.plusXY( 0, NL_Y_OFFSET ), {
        initialDisplayedRange: NUMBER_LINE_RANGES[ 0 ],
        widthInModelSpace: NLIConstants.NLI_LAYOUT_BOUNDS.width - 100,
        heightInModelSpace: NLIConstants.NLI_LAYOUT_BOUNDS.height - 160,
        initialPointSpecs: [ { initialValue: 1, color: INITIAL_POINT_COLOR } ]
      } );

      // @public (read-only) {Property<Bounds2>} - the bounds of the box where the point controllers reside when not
      // being used, changes its location when the orientation of the number line changes
      this.pointControllerBoxProperty = new Property( BOTTOM_BOX_BOUNDS );

      // @public (read-only) - an array of the point controllers available for manipulation by the user
      this.pointControllers = [
        new PointController( { color: new Color( 'blue' ), numberLines: [ this.numberLine ] } ),
        new PointController( { color: new Color( 'magenta' ), numberLines: [ this.numberLine ] } ),
        new PointController( { color: INITIAL_POINT_COLOR, numberLines: [ this.numberLine ] } )
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
        pointController.isDraggingProperty.lazyLink( dragging => {

          // if the point controller is released and it's not controlling a point on the number line, put it away
          if ( !dragging && !pointController.controlsNumberLinePoint() ) {
            this.putPointControllerInBox( pointController, true );
          }
        } );
      } );

      // handle changes to the number line's orientation
      this.numberLine.orientationProperty.link( orientation => {
        const previousBoxBounds = orientation === NumberLineOrientation.HORIZONTAL ? SIDE_BOX_BOUNDS : BOTTOM_BOX_BOUNDS;
        const newBoxBounds = orientation === NumberLineOrientation.HORIZONTAL ? BOTTOM_BOX_BOUNDS : SIDE_BOX_BOUNDS;
        this.pointControllerBoxProperty.value = newBoxBounds;
        this.pointControllers.forEach( pointController => {

          // if the point controller is animating, stop it and put it in the box
          if ( pointController.inProgressAnimationProperty.value ) {
            pointController.stopAnimation();
            this.putPointControllerInBox( pointController );
          }

          // if the point controller was sitting in the previous box, move it to the new one
          else if ( previousBoxBounds.containsPoint( pointController.positionProperty.value ) &&
                    !pointController.isDraggingProperty.value ) {
            this.putPointControllerInBox( pointController );
          }

          // if the controller is controlling a point on the number line, relocate the point and the controller
          else if ( this.numberLine.residentPoints.indexOf( pointController.associatedNumberLinePoint ) >= 0 ) {
            pointController.setPositionRelativeToPoint( pointController.associatedNumberLinePoint );
          }
        } );
      } );

      // Add a listener to handle any cases where a change to the number line's display range causes a point that was
      // already on the number line to be outside of the displayed range.
      this.numberLine.displayedRangeProperty.link( displayedRange => {
        this.pointControllers.forEach( pointController => {
          if ( pointController.controlsNumberLinePoint() &&
               !displayedRange.contains( pointController.associatedNumberLinePoint.valueProperty.value ) ) {

            // the point controlled by this controller is not out of the displayed range, so get rid of it
            this.numberLine.removePoint( pointController.associatedNumberLinePoint );
            pointController.clearNumberLinePoints();

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
     * @param {boolean} [animate] - controls whether to animate the return to the box or do it instantly
     */
    putPointControllerInBox( pointController, animate = false ) {

      const index = this.pointControllers.indexOf( pointController );
      const numPositions = this.pointControllers.length;

      // error checking
      assert && assert( index >= 0, 'point controller not found on list' );
      assert && assert(
        !pointController.controlsNumberLinePoint(),
        'point controller should not be put away while controlling a point'
      );

      let destination;

      // decide which box and at which position the point controller should be placed
      if ( this.numberLine.orientationProperty.value === NumberLineOrientation.HORIZONTAL ) {

        // put point in box at bottom of screen
        const spacing = BOTTOM_BOX_BOUNDS.width / numPositions;
        destination = new Vector2( BOTTOM_BOX_BOUNDS.minX + spacing / 2 + spacing * index, BOTTOM_BOX_BOUNDS.centerY );
      }
      else {

        // put point in box at side of screen
        const spacing = SIDE_BOX_BOUNDS.height / numPositions;
        destination = new Vector2( SIDE_BOX_BOUNDS.centerX, SIDE_BOX_BOUNDS.minY + spacing / 2 + spacing * index );
      }

      pointController.goToPosition( destination, animate );
    }

    /**
     * restore model to initial state
     * @public
     */
    reset() {
      this.numberLine.reset();

      // clear any associations that the point controllers have with points on the number line
      this.pointControllers.forEach( pointController => {
        pointController.reset();
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
