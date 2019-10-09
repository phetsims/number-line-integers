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
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const comparisonStatementString = require( 'string!NUMBER_LINE_INTEGERS/comparisonStatement' );

  // constants
  const COMPARISON_STATEMENT_BOX_WIDTH = 340; // empirically determined to look decent

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

    // Comparison Statement Box
    COMPARISON_STATEMENT_ACCORDION_BOX_OPTIONS: {
      fill: 'white',
      titleNode: new Text( comparisonStatementString, {
        font: new PhetFont( 16 ),
        maxWidth: COMPARISON_STATEMENT_BOX_WIDTH * 0.8
      } ),
      showTitleWhenExpanded: false,
      cornerRadius: 5,
      contentAlign: 'right',
      centerX: 512, // taken from default layoutBounds.centerX
      top: 10,
      minWidth: COMPARISON_STATEMENT_BOX_WIDTH,
      maxWidth: COMPARISON_STATEMENT_BOX_WIDTH,
      buttonXMargin: 8,
      buttonYMargin: 6,
      expandCollapseButtonOptions: {
        touchAreaXDilation: 15,
        touchAreaYDilation: 15,
        mouseAreaXDilation: 5,
        mouseAreaYDilation: 5
      }
    },

    EXPLORE_SCREEN_CONTROLS_LEFT_SIDE_INSET: 175
  };

  return numberLineIntegers.register( 'NLIConstants', NLIConstants );
} );
