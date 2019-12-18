// Copyright 2019, University of Colorado Boulder

/**
 * base class for all scenes in the "Explore" screen
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const merge = require( 'PHET_CORE/merge' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const SpatializedNumberLine = require( 'NUMBER_LINE_INTEGERS/common/model/SpatializedNumberLine' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Range = require( 'DOT/Range' );

  // constants
  const SCENE_BOUNDS = NLIConstants.NLI_LAYOUT_BOUNDS; // bounds for the scenes match the layout bounds

  class SceneModel {

    /**
     * @param [Object] options
     * @public
     */
    constructor( options ) {

      options = merge( {

        // {number} - the number of number lines to be created and managed in this model
        numberOfNumberLines: 1,

        // {Object|null} - number line options that are common to all number lines created in this constructor
        commonNumberLineOptions: {
          initialDisplayedRange: new Range( -100, 100 ),
          initialPointSpecs: []
        },

        // {Vector[]} - zero positions for each of the number lines, length must match number of number lines
        numberLineZeroPositions: [ SCENE_BOUNDS.center ],

        // {null|Object[]} - options that are unique to the individual number lines being created, null if not needed
        uniqueNumberLineOptionsList: null

      }, options );

      // options checking
      assert && assert( options.numberOfNumberLines === options.numberLineZeroPositions.length );
      assert && assert( !options.uniqueNumberLineOptionsList ||
                        options.uniqueNumberLineOptionsList.length === options.numberOfNumberLines );

      // @public - whether or not the number lines are visible
      this.showNumberLineProperty = new BooleanProperty( true );

      // @public (read-only) {NumberLine[]} - the number line(s) for this scene
      this.numberLines = [];
      _.times( options.numberOfNumberLines, count => {
        this.numberLines.push( new SpatializedNumberLine(
          options.numberLineZeroPositions[ count ],
          merge(
            {},
            options.commonNumberLineOptions,
            options.uniqueNumberLineOptionsList ? options.uniqueNumberLineOptionsList[ count ] : {}
          )
        ) );
      } );

      // @public - controls whether the labels on the number lines are visible
      this.numberLineLabelsVisibleProperty = new BooleanProperty( true );
      this.numberLineLabelsVisibleProperty.link( visible => {
        this.numberLines.forEach( nl => { nl.showLabelsProperty.set( visible ); } );
      } );

      // @public - controls whether the absolute value indicators on the number lines are visible
      this.numberLineAbsoluteValueIndicatorsVisibleProperty = new BooleanProperty( false );
      this.numberLineAbsoluteValueIndicatorsVisibleProperty.link( visible => {
        this.numberLines.forEach( nl => { nl.showAbsoluteValuesProperty.set( visible ); } );
      } );
    }

    /**
     * @public
     */
    reset() {
      this.resetScene();
      this.showNumberLineProperty.reset();
      this.numberLineLabelsVisibleProperty.reset();
      this.numberLineAbsoluteValueIndicatorsVisibleProperty.reset();
    }

    /**
     * do scene-specific reset
     * @protected
     */
    resetScene() {
      // override as needed in descendant classes
    }
  }

  return numberLineIntegers.register( 'SceneModel', SceneModel );
} );