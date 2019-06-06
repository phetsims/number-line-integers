// Copyright 2019, University of Colorado Boulder

/**
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const NLIScene = require( 'NUMBER_LINE_INTEGERS/scenes/model/NLIScene' );
  const NumberLine = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLine' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineOrientation = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLineOrientation' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const SCENE_BOUNDS = NLIConstants.NLI_LAYOUT_BOUNDS; // bounds for the scenes match the layout bounds

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

  /**
   * base class for individual scenes
   */
  class SceneModel {
    constructor( options ) {

      options = _.extend( {
        numberLineCenter: SCENE_BOUNDS.center,
        numberLineOptions: null // {Object|null} - options propagated to the NumberDisplay subcomponent
      }, options );

      // default options to be passed in to NumberLine
      options.numberLineOptions = _.extend( {
        modelProjectionBounds: SCENE_BOUNDS,
        initialDisplayedRange: new Range( -100, 100 ),
        initialPointSpecs: []
      }, options.numberLineOptions );

      // @public {BooleanProperty}
      this.showNumberLineProperty = new BooleanProperty( true );

      // @public {BooleanProperty}
      this.showAbsoluteValuesProperty = new BooleanProperty( false );

      // @public (read-only){NumberLine} - the number line for this scene
      this.numberLine = new NumberLine( options.numberLineCenter, options.numberLineOptions );
    }
  }

  /**
   * model for the "Elevation" scene
   */
  class ElevationSceneModel extends SceneModel {
    constructor() {

      const seaLevel = SCENE_BOUNDS.centerY + 10; // sea level in model coordinates
      const numberLineRange = new Range( -80, 100 );

      // define the bounds of the area where the interactive elevation area will be shown
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

      // define where the number line will be shown and the span that it covers
      const numberLineWidth = SCENE_BOUNDS.width * 0.1; // doesn't matter much because number line is always vertical
      const numberLineCenter = new Vector2( elevationAreaBounds.minX / 2, seaLevel );
      const numberLineProjectionBounds = new Bounds2(
        numberLineCenter.x - numberLineWidth / 2,
        elevationAreaBounds.minY,
        numberLineCenter.x + numberLineWidth / 2,
        elevationAreaBounds.maxY
      );

      super( {
        numberLineCenter: numberLineCenter,
        numberLineOptions: {
          initialOrientation: NumberLineOrientation.VERTICAL,
          initialDisplayedRange: numberLineRange,
          labelsInitiallyVisible: true,
          modelProjectionBounds: numberLineProjectionBounds
        }
      } );

      // @public (read-only) {Bounds2} - bounds of the interactive elevation area
      this.elevationAreaBounds = elevationAreaBounds;
    }
  }

  /**
   * model for the "Bank" scene
   */
  class BankSceneModel extends SceneModel {
    constructor() {
      super();
    }
  }

  /**
   * model for the "Temperature" scene
   */
  class TemperatureSceneModel extends SceneModel {
    constructor() {
      super();
    }
  }

  return numberLineIntegers.register( 'NLIScenesModel', NLIScenesModel );
} );