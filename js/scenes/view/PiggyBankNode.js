// Copyright 2019, University of Colorado Boulder

/**
 * A node that just represents a piggy bank
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Saurabh Totey
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Path = require( 'SCENERY/nodes/Path' );
  const piggyBankShapes = require( 'NUMBER_LINE_INTEGERS/scenes/view/piggyBankShapes' );
  const Vector2 = require( 'DOT/Vector2' );

  class PiggyBankNode extends Node {

    /**
     * @param {Image} imageSource
     */
    constructor( imageSource ) {
      const piggyBankOutlineNode = new Path( piggyBankShapes.MEDIUM_PIGGY_BANK_SHAPE, {
        fill: 'rgba( 0, 0, 0, 0 )', // transparent to start so it has size
        lineWidth: 0,
        center: Vector2.ZERO
      } );
      const overlayImage = new Image( imageSource, { opacity: 0.8 } );
      overlayImage.setScaleMagnitude( piggyBankOutlineNode.width / overlayImage.width );
      overlayImage.center = Vector2.ZERO;
      super( { children: [ piggyBankOutlineNode, overlayImage ] } );
      this.outline = piggyBankOutlineNode;
    }

    /**
     * @param {ColorDef} fill
     */
    setFill( fill ) {
      this.outline.fill = fill;
    }
    set fill( fill ) { this.setFill( fill ); }

  }

  return numberLineIntegers.register( 'PiggyBankNode', PiggyBankNode );

} );