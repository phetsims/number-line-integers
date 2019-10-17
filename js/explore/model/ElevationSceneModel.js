// Copyright 2019, University of Colorado Boulder

/**
 * ElevationSceneModel is the model for the "Elevation" scene
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Color = require( 'SCENERY/util/Color' );
  const ElevationPointController = require( 'NUMBER_LINE_INTEGERS/explore/model/ElevationPointController' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineOrientation = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLineOrientation' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const PointController = require( 'NUMBER_LINE_INTEGERS/common/model/PointController' );
  const Range = require( 'DOT/Range' );
  const SceneModel = require( 'NUMBER_LINE_INTEGERS/explore/model/SceneModel' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const SCENE_BOUNDS = NLIConstants.NLI_LAYOUT_BOUNDS; // bounds for the scenes match the layout bounds

  class ElevationSceneModel extends SceneModel {

    constructor() {

      const seaLevel = SCENE_BOUNDS.centerY + 10; // sea level in model coordinates
      const numberLineRange = new Range( -80, 100 );

      // Define the bounds of the area where the interactive elevation area will be shown, values empirically determined
      // to match the design spec.
      const elevationAreaWidth = 600;
      const elevationAreaHeight = 430;
      const elevationAreaCenter = new Vector2(
        SCENE_BOUNDS.centerX,
        seaLevel - numberLineRange.getCenter() * elevationAreaHeight / numberLineRange.getLength()
      );
      const elevationAreaBounds = new Bounds2(
        elevationAreaCenter.x - elevationAreaWidth / 2,
        elevationAreaCenter.y - elevationAreaHeight / 2,
        elevationAreaCenter.x + elevationAreaWidth / 2,
        elevationAreaCenter.y + elevationAreaHeight / 2
      );

      super( {
        numberLineZeroPosition: new Vector2( elevationAreaBounds.minX / 2, seaLevel ),
        numberLineOptions: {
          initialOrientation: NumberLineOrientation.VERTICAL,
          initialDisplayedRange: numberLineRange,
          labelsInitiallyVisible: true,
          heightInModelSpace: elevationAreaHeight
        }
      } );

      // @public (read-only) {Bounds2} - bounds of the interactive elevation area
      this.elevationAreaBounds = elevationAreaBounds;

      // @public (read-only) {number} - sea level in model coordinates
      this.seaLevel = seaLevel;

      // specify the position of the box that will hold the elevatable items
      const boxWidth = elevationAreaWidth * 0.6;
      const boxHeight = ( SCENE_BOUNDS.maxY - elevationAreaBounds.maxY ) * 0.7;
      const boxCenter = new Vector2( elevationAreaCenter.x, ( SCENE_BOUNDS.maxY + elevationAreaBounds.maxY ) / 2 );

      // @public (read-only) {Bounds2} - holding area for the items that the user can elevate
      this.elevatableItemsBoxBounds = new Bounds2(
        boxCenter.x - boxWidth / 2,
        boxCenter.y - boxHeight / 2,
        boxCenter.x + boxWidth / 2,
        boxCenter.y + boxHeight / 2
      );

      // @public (read-only) - the point controllers that can be moved into the elevation scene
      this.permanentPointControllers = [
        new ElevationPointController( this.numberLine, elevationAreaBounds, { color: new Color( '#EE3937' ) } ),
        new ElevationPointController( this.numberLine, elevationAreaBounds, { color: new Color( 'black' ) } ),
        new ElevationPointController( this.numberLine, elevationAreaBounds, { color: new Color( ' #446ab7' ) } )
      ];

      // put the permanent point controllers in their starting positions
      this.permanentPointControllers.forEach( pointController => {
        this.putPointControllerInBox( pointController );
      } );

      // if the point controllers are released outside of the elevation areas, send them home.
      this.permanentPointControllers.forEach( pointController => {
        pointController.isDraggingProperty.lazyLink( isDragging => {

          // TODO: Once these elevation controllers never control points the test for whether a point is being controlled can be removed.
          if ( !isDragging &&
               !pointController.overElevationAreaProperty.value &&
               !pointController.controlsNumberLinePoint() ) {
            this.putPointControllerInBox( pointController, true );
          }
        } );
      } );

      // @publc (read-only) - the point controllers that are attached to the number line when a corresponding elevatable
      // controller is over the scene
      this.numberLineAttachedPointControllers = new ObservableArray();

      // watch for points coming and going on the number line and add the additional point controllers for them
      this.numberLine.residentPoints.addItemAddedListener( addedPoint => {

        //TODO: this below should be handled by NumberLine
        addedPoint.numberLine = this.numberLine;

        // add a point controller that will remain attached to the number line that will control this point
        const pointController = new PointController( {
          color: addedPoint.colorProperty.value,
          lockToNumberLine: 'always',
          associatedNumberLinePoints: [ addedPoint ],
          numberLines: [ this.numberLine ]
        } );
        this.numberLineAttachedPointControllers.push( pointController );

        // handle removal of this point from the number line
        const handlePointRemoved = removedPoint => {
          if ( addedPoint === removedPoint ) {
            pointController.clearNumberLinePoints();
            pointController.dispose();
            this.numberLine.residentPoints.removeItemRemovedListener( handlePointRemoved );
            this.numberLineAttachedPointControllers.remove( pointController );
          }
        };
        this.numberLine.residentPoints.addItemRemovedListener( handlePointRemoved );
      } );
    }

    /**
     * place the provided point controller into the holding box, generally done on init, reset, and when the user "puts
     * it away"
     * @param {ElevationPointController} pointController
     * @param {boolean} [animate] - controls whether to animate the return to the box or do it instantly
     */
    putPointControllerInBox( pointController, animate = false ) {

      const index = this.permanentPointControllers.indexOf( pointController );
      const numPositions = this.permanentPointControllers.length;

      // error checking
      assert && assert( index >= 0, 'point controller not found on list' );
      assert && assert(
        !pointController.controlsNumberLinePoint(),
        'point controller should not be put away while controlling a point'
      );

      const spacing = this.elevatableItemsBoxBounds.width / numPositions;
      const destination = new Vector2(
        this.elevatableItemsBoxBounds.minX + spacing / 2 + spacing * index,
        this.elevatableItemsBoxBounds.centerY
      );
      pointController.goToPosition( destination, animate );
    }

    /**
     * restore initial state to the scene
     * @override
     * @public
     */
    resetScene() {

      // put the point controllers back into their starting positions
      this.permanentPointControllers.forEach( pointController => {
        this.numberLine.removePoint( pointController.associatedNumberLinePoint );
        pointController.reset();
        this.putPointControllerInBox( pointController );
      } );
    }
  }

  return numberLineIntegers.register( 'ElevationSceneModel', ElevationSceneModel );
} );