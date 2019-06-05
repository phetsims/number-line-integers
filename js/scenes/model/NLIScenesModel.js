// Copyright 2019, University of Colorado Boulder

/**
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const NLIScene = require( 'NUMBER_LINE_INTEGERS/scenes/model/NLIScene' );
  const NumberLine = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLine' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );

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

      options = _.extend( options, {
        numberLineCenter: NLIConstants.NLI_LAYOUT_BOUNDS.center,
        numberLineProjectionBounds: NLIConstants.NLI_LAYOUT_BOUNDS,
        numberLineInitialDisplayedRange: new Range( -100, 100 ),
        initialPointSpecs: []
      } );

      // @public {BooleanProperty}
      this.showNumberLineProperty = new BooleanProperty( true );

      // @public {BooleanProperty}
      this.showAbsoluteValuesProperty = new BooleanProperty( false );

      // @public (read-only){NumberLine} - the number line for this scene
      this.numberLine = new NumberLine( options.numberLineCenter, {
          modelProjectionBounds: options.numberLineProjectionBounds,
          initialDisplayedRange: new Range( -100, 100 ),
          initialPointSpecs: []
        }
      );
    }
  }

  /**
   * model for the "Elevation" scene
   */
  class ElevationSceneModel extends SceneModel {
    constructor() {
      super();
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