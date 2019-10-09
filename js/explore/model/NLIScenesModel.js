// Copyright 2019, University of Colorado Boulder

/**
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BankSceneModel = require( 'NUMBER_LINE_INTEGERS/explore/model/BankSceneModel' );
  const ElevationSceneModel = require( 'NUMBER_LINE_INTEGERS/explore/model/ElevationSceneModel' );
  const NLIScene = require( 'NUMBER_LINE_INTEGERS/explore/model/NLIScene' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Property = require( 'AXON/Property' );
  const TemperatureSceneModel = require( 'NUMBER_LINE_INTEGERS/explore/model/TemperatureSceneModel' );

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
  }

  return numberLineIntegers.register( 'NLIScenesModel', NLIScenesModel );
} );