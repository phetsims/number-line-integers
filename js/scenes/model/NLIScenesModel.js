// Copyright 2019, University of Colorado Boulder

/**
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Color = require( 'SCENERY/util/Color' );
  const ElevationPointController = require( 'NUMBER_LINE_INTEGERS/scenes/model/ElevationPointController' );
  const PointController = require( 'NUMBER_LINE_INTEGERS/common/model/PointController' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const NLIScene = require( 'NUMBER_LINE_INTEGERS/scenes/model/NLIScene' );
  const NumberLine = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLine' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineOrientation = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLineOrientation' );
  const NumberLinePoint = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLinePoint' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const SCENE_BOUNDS = NLIConstants.NLI_LAYOUT_BOUNDS; // bounds for the scenes match the layout bounds
  const COMPARISON_ACCOUNT_POINT_COLOR = Color.orange;
  const INITIAL_PRIMARY_ACCOUNT_BALANCE = 10;
  const INITIAL_COMPARISON_ACCOUNT_BALANCE = 40;

  /**
   * @constructor
   */
  class NLIScenesModel {

    constructor() {

      // @public {Property<NLIScene>} - currently selected scene
      this.selectedSceneProperty = new Property( NLIScene.ELEVATION );

      // @public (read-only) {ElevationSceneModel} - model instance for the "Elevation" scene
      this.elevationSceneModel = new ElevationSceneModel();

      // @public (read-only) {BankSceneModel} - model instance for the "Bank" scene
      this.bankSceneModel = new BankSceneModel();

      // @public (read-only) {TemperatureSceneModel} - model instance for the "Temperature" scene
      this.temperatureSceneModel = new TemperatureSceneModel();

      // @private {SceneModel[]} - all of the scene models in an array for convenience
      this.sceneModels = [
        this.elevationSceneModel,
        this.bankSceneModel,
        this.temperatureSceneModel
      ];
    }

    // @public resets the model
    reset() {
      this.selectedSceneProperty.reset();
      this.sceneModels.forEach( sceneModel => {
        sceneModel.reset();
      } );
    }

    // @public
    step( dt ) {
      //TODO Handle model animation here.
    }
  }

  /**
   * base class for individual scenes
   */
  class SceneModel {
    constructor( options ) {

      options = _.extend( {
        numberLineZeroPosition: SCENE_BOUNDS.center,
        numberLineOptions: null // {Object|null} - options propagated to the NumberDisplay subcomponent
      }, options );

      // default options to be passed in to NumberLine
      options.numberLineOptions = _.extend( {
        initialDisplayedRange: new Range( -100, 100 ),
        initialPointSpecs: []
      }, options.numberLineOptions );

      // @public {BooleanProperty}
      this.showNumberLineProperty = new BooleanProperty( true );

      // @public (read-only){NumberLine} - the number line for this scene
      this.numberLine = new NumberLine( options.numberLineZeroPosition, options.numberLineOptions );
    }

    reset() {
      this.numberLine.reset();
      this.showNumberLineProperty.reset();
    }
  }

  /**
   * model for the "Elevation" scene
   */
  class ElevationSceneModel extends SceneModel {
    constructor() {

      const seaLevel = SCENE_BOUNDS.centerY + 10; // sea level in model coordinates
      const numberLineRange = new Range( -80, 100 );

      // Define the bounds of the area where the interactive elevation area will be shown, values empirically determined
      // to match the design spec.
      const elevationAreaWidth = 620;
      const elevationAreaHeight = 450;
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
        new ElevationPointController( this.numberLine, elevationAreaBounds, { color: new Color( 'orange' ) } ),
        new ElevationPointController( this.numberLine, elevationAreaBounds, { color: new Color( 'red' ) } ),
        new ElevationPointController( this.numberLine, elevationAreaBounds, { color: new Color( 'blue' ) } )
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
               !elevationAreaBounds.containsPoint( pointController.positionProperty.value ) &&
               !pointController.numberLinePoint ) {
            this.putPointControllerInBox( pointController, true );
          }
        } );
      } );

      // @publc (read-only) - the point controllers that are attached to the number line when a corresponding elevatable
      // controller is over the scene
      this.numberLineAttachedPointControllers = new ObservableArray();

      // watch for points coming and going on the number line and add the additional point controllers for them
      this.numberLine.residentPoints.addItemAddedListener( addedPoint => {

        // add a point controller that will remain attached to the number line that will control this point
        const pointController = new PointController( this.numberLine, {
          color: addedPoint.colorProperty.value,
          lockToNumberLine: 'always',
          numberLinePoint: addedPoint
        } );
        this.numberLineAttachedPointControllers.push( pointController );

        // handle removal of this point from the number line
        const handlePointRemoved = ( removedPoint ) => {
          if ( addedPoint === removedPoint ) {
            pointController.clearNumberLinePoint();
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
        pointController.numberLinePoint === null,
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
     * restore initial state
     * @public
     */
    reset() {

      super.reset();

      // put the point controllers back into their starting positions
      this.permanentPointControllers.forEach( pointController => {
        pointController.reset();
        this.putPointControllerInBox( pointController );
      } );
    }
  }

  /**
   * model for the "Bank" scene
   */
  class BankSceneModel extends SceneModel {

    constructor() {

      // Position the number line on the left portion of the screen and roughly centered vertically.  The details of
      // these values were empirically determined by comparing with the mockups in the design doc.
      const numberLineZeroPosition = new Vector2( SCENE_BOUNDS.width * 0.4, SCENE_BOUNDS.centerY );

      super( {
        numberLineZeroPosition: numberLineZeroPosition,
        numberLineOptions: {
          initialOrientation: NumberLineOrientation.HORIZONTAL,
          initialDisplayedRange: new Range( -100, 100 ),
          labelsInitiallyVisible: true,
          widthInModelSpace: SCENE_BOUNDS.width * 0.4,
          initialPointSpecs: [ { initialValue: INITIAL_PRIMARY_ACCOUNT_BALANCE, color: new Color( 39, 16, 225 ) } ]
        }
      } );

      // @public {NumberProperty} - balance of the bank account that is always depicted in the view
      this.primaryAccountBalanceProperty = new NumberProperty( INITIAL_PRIMARY_ACCOUNT_BALANCE );

      // hook the primary account balance up to the first number line point
      this.primaryAccountBalanceProperty.link( balance => {
        this.numberLine.residentPoints.get( 0 ).valueProperty.set( balance );
      } );

      // @public {NumberProperty} - balance of the bank account that is shown when the user wants to compare two accounts
      this.comparisonAccountBalanceProperty = new NumberProperty( INITIAL_COMPARISON_ACCOUNT_BALANCE );

      // hook the comparison account balance up to the second number line point
      this.comparisonAccountBalanceProperty.link( balance => {
        if ( this.numberLine.residentPoints.length > 1 ) {
          this.numberLine.residentPoints.get( 1 ).valueProperty.set( balance );
        }
      } );

      // @public {BooleanProperty} - controls whether the comparison account should be visible to the user
      this.showComparisonAccountProperty = new BooleanProperty( false );

      // @public {PointController} - the point controller for the primary account
      this.primaryAccountPointController = new PointController( this.numberLine, {
        color: this.numberLine.residentPoints.get( 0 ).colorProperty.value,
        lockToNumberLine: 'always',
        numberLinePoint: this.numberLine.residentPoints.get( 0 ),
        offsetFromHorizontalNumberLine: 120
      } );

      // the number line point that represents the comparison account value, only exists when enabled
      let comparisonAccountNumberLinePoint = null;

      // @public {Property.<PointController|null>} - the point controller for the comparison account, only exists when
      // enabled, and is thus wrapped in a property so that the view can see it come and go
      this.comparisonAccountPointControllerProperty = new Property( null );

      // add/remove the point and point controller for the comparison account when enabled
      this.showComparisonAccountProperty.lazyLink( showComparisonAccount => {
        if ( showComparisonAccount ) {

          // state checking
          assert && assert(
            comparisonAccountNumberLinePoint === null,
            'shouldn\'t have number line point for comparison account yet'
          );
          assert && assert(
            this.comparisonAccountPointControllerProperty.value === null,
            'shouldn\'t have number point controller for comparison account yet'
          );

          // create the point and add it to the number line
          comparisonAccountNumberLinePoint = new NumberLinePoint(
            this.comparisonAccountBalanceProperty.value,
            COMPARISON_ACCOUNT_POINT_COLOR,
            this.numberLine
          );
          this.numberLine.addPoint( comparisonAccountNumberLinePoint );

          // create the controller fo this point
          this.comparisonAccountPointControllerProperty.set( new PointController( this.numberLine, {
            lockToNumberLine: 'always',
            numberLinePoint: comparisonAccountNumberLinePoint,
            offsetFromHorizontalNumberLine: -120
          } ) );
        }
        else {

          // state checking
          assert && assert(
            comparisonAccountNumberLinePoint !== null,
            'should have number line point for comparison account'
          );
          assert && assert(
            this.comparisonAccountPointControllerProperty.value !== null,
            'should have point controller for comparison account'
          );

          // remove the point controller from the model
          this.comparisonAccountPointControllerProperty.value.clearNumberLinePoint();
          this.comparisonAccountPointControllerProperty.value.dispose();
          this.comparisonAccountPointControllerProperty.reset();

          // remove the point from the number line
          this.numberLine.removePoint( comparisonAccountNumberLinePoint );
          comparisonAccountNumberLinePoint = null;
        }
      } );
    }

    /**
     * restore initial state
     * @public
     */
    reset() {

      // release the point that was being controlled
      this.primaryAccountPointController.clearNumberLinePoint();
      this.showComparisonAccountProperty.reset();
      this.primaryAccountBalanceProperty.reset();
      this.comparisonAccountBalanceProperty.reset();
      super.reset();

      // the reset will add back the initial point, so associate the permanent point controller with it
      this.primaryAccountPointController.associateWithNumberLinePoint( this.numberLine.residentPoints.get( 0 ) );
    }
  }

  /**
   * model for the "Temperature" scene
   */
  class TemperatureSceneModel extends SceneModel {

    constructor() {

      // Position the number line vertically on the left side of the screen.  The zero point is well below the vertical
      // center and tne number line is not symmetric around zero.  The details of these values were empirically
      // determined by comparing with the mockups in the design doc.
      const numberLineZeroPosition = new Vector2( SCENE_BOUNDS.width * 0.1, SCENE_BOUNDS.height * 0.75 );

      super( {
        numberLineZeroPosition: numberLineZeroPosition,
        numberLineOptions: {
          initialOrientation: NumberLineOrientation.VERTICAL,
          initialDisplayedRange: new Range( -20, 100 ),
          heightInModelSpace: SCENE_BOUNDS.height * 0.75
        }
      } );
    }
  }

  return numberLineIntegers.register( 'NLIScenesModel', NLIScenesModel );
} );