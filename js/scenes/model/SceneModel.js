// Copyright 2019, University of Colorado Boulder

/**
 * base class for all scenes in the "Scenes" screen
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const NumberLine = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLine' );
  const Range = require( 'DOT/Range' );

  // constants
  const SCENE_BOUNDS = NLIConstants.NLI_LAYOUT_BOUNDS; // bounds for the scenes match the layout bounds

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

    /**
     * @public
     */
    reset() {
      this.resetScene();
      this.numberLine.showAbsoluteValuesProperty.reset();
      this.showNumberLineProperty.reset();
    }

    /**
     * @protected
     * do scene-specific reset
     */
    resetScene() {
      // override as needed in descendant classes
    }
  }

  return numberLineIntegers.register( 'SceneModel', SceneModel );
} );