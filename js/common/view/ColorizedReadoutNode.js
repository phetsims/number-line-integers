// Copyright 2020, University of Colorado Boulder

/**
 * ColorizedReadoutNode is a Scenery node that presents a number enclosed in a rounded rectangle "background",
 * where the color of the stroke and fill of the background changes based on the value of a provided property.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BackgroundNode = require( 'SCENERY_PHET/BackgroundNode' );
  const merge = require( 'PHET_CORE/merge' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const DEFAULT_FONT = new PhetFont( 18 );

  class ColorizedReadoutNode extends BackgroundNode {

    /**
     * @param {StringProperty} textProperty - a Property that encloses the value to display
     * @param {Property<Color>} baseColorProperty - a Property that encloses a color from which the fill and stroke are
     * derived
     * @param {Object} [options]
     * @public
     */
    constructor( textProperty, baseColorProperty, options ) {

      options = merge(
        {
          backgroundOptions: { lineWidth: 2 },
          textOptions: { font: DEFAULT_FONT },
          colorizeBackground: true,
          colorizeText: false
        },
        NLIConstants.LABEL_BACKGROUND_OPTIONS,
        options
      );

      // text that will be displayed on the background
      const textNode = new Text( textProperty.value, options.textOptions );

      // update the text node as the text string changes
      const updateText = text => { textNode.text = text; };
      textProperty.link( updateText );

      super( textNode, options );

      // update the stroke and background colors as the base color changes
      const updateColors = baseColor => {
        if ( options.colorizeBackground ) {
          this.background.stroke = baseColor;

          // use a lighter version of the base color as the fill
          this.background.fill = baseColor.colorUtilsBrighter( 0.75 );
        }

        if ( options.colorizeText ) {
          textNode.fill = baseColor;
        }
      };
      baseColorProperty.link( updateColors );

      // @private - dispose function
      this.disposeColorizedReadoutNode = () => {
        textProperty.unlink( updateText );
        baseColorProperty.unlink( updateColors );
      };
    }

    /**
     * @public
     */
    dispose() {
      this.disposeColorizedReadoutNode();
      super.dispose();
    }
  }

  return numberLineIntegers.register( 'ColorizedReadoutNode', ColorizedReadoutNode );
} );
