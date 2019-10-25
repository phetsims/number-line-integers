// Copyright 2019, University of Colorado Boulder

/**
 * shared constants for the "Number Line: Integers" simulation
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const ScreenView = require( 'JOIST/ScreenView' );

  const NLIConstants = {

    // layout bounds used for all screens
    NLI_LAYOUT_BOUNDS: ScreenView.DEFAULT_LAYOUT_BOUNDS,

    // The amount, in model and view coordinates, of space between the end of the number lines display range and the end
    // of the number line itself.
    GENERIC_SCREEN_DISPLAYED_RANGE_INSET: 25,

    // options used for most if not all label backgrounds
    LABEL_BACKGROUND_OPTIONS: {
      backgroundOptions: {
        opacity: 0.85,
        cornerRadius: 3
      },
      xMargin: 3,
      yMargin: 3
    },

    // corner radius of the background for most if not all labels
    LABEL_BACKGROUND_CORNER_RADIUS: 3,

    // various shared fonts and layout parameters
    CHECKBOX_FONT: new PhetFont( 16 ),
    EXPLORE_SCREEN_CONTROLS_LEFT_SIDE_INSET: 175,
    RESET_BUTTON_INSET_FROM_EDGE: 20
  };

  return numberLineIntegers.register( 'NLIConstants', NLIConstants );
} );
