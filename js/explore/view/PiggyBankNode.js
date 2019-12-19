// Copyright 2019, University of Colorado Boulder

/**
 * a node that represents a piggy bank
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Saurabh Totey
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PiggyBankDecoration = require( 'NUMBER_LINE_INTEGERS/explore/model/PiggyBankDecoration' );
  const piggyBankShapes = require( 'NUMBER_LINE_INTEGERS/explore/view/piggyBankShapes' );
  const Vector2 = require( 'DOT/Vector2' );

  // images
  const piggyBankWithFlowers = require( 'image!NUMBER_LINE_INTEGERS/piggy-bank-with-flowers.png' );
  const piggyBankWithLightning = require( 'image!NUMBER_LINE_INTEGERS/piggy-bank-with-lightning.png' );

  class PiggyBankNode extends Node {

    /**
     * @param {Object} [options]
     * @public
     */
    constructor( options ) {

      options = merge( {
        fill: 'rgba( 0, 0, 0, 0 )', // initially transparent so that it is invisible but has size
        lineWidth: 0,
        decorationType: PiggyBankDecoration.FLOWERS
      }, options );

      const piggyBankOutlineNode = new Path( piggyBankShapes.MEDIUM_PIGGY_BANK_SHAPE, {
        fill: options.fill,
        lineWidth: options.lineWidth,
        center: Vector2.ZERO
      } );
      const overlayImage = new Image(
        options.decorationType === PiggyBankDecoration.FLOWERS ? piggyBankWithFlowers : piggyBankWithLightning,
        { opacity: 0.8 }
      );
      overlayImage.setScaleMagnitude( piggyBankOutlineNode.width / overlayImage.width );
      overlayImage.center = Vector2.ZERO;
      options.children = [ piggyBankOutlineNode, overlayImage ];
      super( options );

      // @private
      this.outline = piggyBankOutlineNode;
    }

    /**
     * @returns {ColorDef} the color of this piggy bank's fill
     * @public
     */
    getFill() {
      return this.outline.fill;
    }

    get fill() { return this.getFill(); }

    /**
     * @param {ColorDef} fill
     * @public
     */
    setFill( fill ) {
      this.outline.fill = fill;
    }

    set fill( fill ) { this.setFill( fill ); }

  }

  return numberLineIntegers.register( 'PiggyBankNode', PiggyBankNode );

} );
